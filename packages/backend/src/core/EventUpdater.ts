import {
  EthereumAddress,
  Logger,
  ProjectId,
  TaskQueue,
  UnixTime,
} from '@l2beat/common'
import { providers, utils } from 'ethers'

import { ProjectInfo } from '../model/ProjectInfo'
import {
  EventRecord,
  EventRepository,
} from '../peripherals/database/EventRepository'
import { EthereumClient } from '../peripherals/ethereum/EthereumClient'
import { BlockNumberUpdater } from './BlockNumberUpdater'
import { Clock } from './Clock'

interface EventDetail {
  emitter: EthereumAddress
  topic: string
  name: string
  projectId: ProjectId
  sinceTimestamp: UnixTime
  earliest: UnixTime | undefined
  latest: UnixTime | undefined
}

export class EventUpdater {
  private events: EventDetail[] = []
  private taskQueue = new TaskQueue<void>(() => this.update(), this.logger)

  constructor(
    private ethereum: EthereumClient,
    private blockNumberRepository: BlockNumberUpdater,
    private eventRepository: EventRepository,
    private clock: Clock,
    private projects: ProjectInfo[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async start() {
    const boundaries = await this.eventRepository.getDataBoundary()

    this.events = this.projects
      .map((project) =>
        project.events.map((event) => {
          const boundary = boundaries.get(
            `${project.projectId.toString()}-${event.name}`,
          )

          return {
            emitter: event.emitter,
            topic: new utils.Interface([event.abi]).getEventTopic(event.name),
            name: event.name,
            projectId: project.projectId,
            sinceTimestamp: event.sinceTimestamp,
            earliest: boundary?.earliest,
            latest: boundary?.latest,
          }
        }),
      )
      .flat()

    this.taskQueue.addToFront()
    this.logger.info('EventUpdater started!')
    return this.clock.onNewHour(() => {
      this.taskQueue.addToFront()
    })
  }

  async update() {
    //? maybe getBlockNumbers from-to only once
    const records: EventRecord[] = []

    const from = this.clock.getFirstHour()
    const to = this.clock.getLastHour()

    for (const event of this.events) {
      if (event.earliest === undefined && event.latest === undefined) {
        const records = await this.fetchRecords(event.sinceTimestamp, to, event)
        records.push(...records)
      } else {
        if (event.earliest?.gt(from)) {
          const fromWrapped = event.sinceTimestamp.lt(from)
            ? event.sinceTimestamp
            : from

          const records = await this.fetchRecords(
            event.sinceTimestamp,
            fromWrapped,
            event,
          )
          records.push(...records)
        }

        if (event.latest?.lt(to)) {
          const records = await this.fetchRecords(event.latest, to, event)
          records.push(...records)
        }
      }
    }

    if (records.length === 0) {
      return
    }

    await this.eventRepository.addMany(records)
  }

  async fetchRecords(
    from: UnixTime,
    to: UnixTime,
    event: EventDetail,
  ): Promise<EventRecord[]> {
    //todo handle first timestamp
    const fromBlock = await this.blockNumberRepository.getBlockNumberWhenReady(
      from,
    )
    const toBlock = await this.blockNumberRepository.getBlockNumberWhenReady(to)

    const logs = this.getLogs(
      event.emitter,
      event.topic,
      Number(fromBlock),
      Number(toBlock),
    )

    const timestamps = this.blockNumberRepository.getBlockRangeWhenReady(
      from,
      to,
    )

    const records = generateRecords(logs, timestamps)

    return records
  }

  async getLogs(
    address: EthereumAddress,
    topic: string,
    fromBlock: number,
    toBlock: number,
  ): Promise<providers.Log[]> {
    try {
      return await this.ethereum.getLogs(address, [topic], fromBlock, toBlock)
    } catch (e) {
      if (
        e instanceof Error &&
        e.message.includes('Log response size exceeded')
      ) {
        console.log('BISECTION', fromBlock, toBlock)
        // TODO: check that there are blocks in both ranges e.g not [1, 1], [1, 1]
        const midPoint = fromBlock + Math.floor((toBlock - fromBlock) / 2)
        const [a, b] = await Promise.all([
          this.getLogs(address, topic, fromBlock, midPoint),
          this.getLogs(address, topic, midPoint + 1, toBlock),
        ])
        return a.concat(b)
      } else {
        throw e
      }
    }
  }
}

export function generateRecords(
  event: {name: string, project: ProjectId},
  logs: bigint[],
  timestamps: { timestamp: UnixTime; blockNumber: bigint }[],
): Promise<EventRecord[]> {
  throw new Error('Function not implemented.')
}
