import { EthereumAddress, Logger, TaskQueue, UnixTime } from '@l2beat/common'
import { providers, utils } from 'ethers'

import { ProjectInfo } from '../../model/ProjectInfo'
import {
  EventRecord,
  EventRepository,
} from '../../peripherals/database/EventRepository'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { BlockNumberUpdater } from '../BlockNumberUpdater'
import { Clock } from '../Clock'
import { generateEventRecords } from './generateEventRecords'
import { getUpdateRanges } from './getUpdateRanges'
import { EventDetails } from './types/EventDetails'

export class EventUpdater {
  private events: EventDetails[] = []
  private taskQueue = new TaskQueue<void>(() => this.update(), this.logger)
  private lastProcessed: UnixTime | undefined

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
            dbStatus: boundary,
          }
        }),
      )
      .flat()

    this.lastProcessed = this.getFirstHour()

    this.taskQueue.addToFront()
    this.logger.info('EventUpdater started!')
    return this.clock.onNewHour(() => {
      this.taskQueue.addToFront()
    })
  }

  private getFirstHour() {
    //it is needed for sixHourly and daily
    const firstHour = this.clock.getFirstHour().add(1, 'days')
    return firstHour.isFull('day') ? firstHour : firstHour.toNext('day')
  }

  async update() {
    const events: EventRecord[] = []

    if (this.lastProcessed === undefined) {
      throw new Error('Programmer error')
    }

    const firstHour = this.lastProcessed.add(1, 'hours')
    const lastHour = this.clock.getLastHour()

    for (const event of this.events) {
      const ranges: { from: UnixTime; to: UnixTime }[] = getUpdateRanges(
        firstHour,
        lastHour,
        event.dbStatus,
        event.sinceTimestamp,
      )

      for (const { from, to } of ranges) {
        const records = await this.fetchRecords(from, to, event)
        events.push(...records)
      }
    }

    if (events.length === 0) {
      return
    }

    await this.eventRepository.addMany(events)
    this.lastProcessed = lastHour
  }

  async fetchRecords(
    from: UnixTime,
    to: UnixTime,
    event: EventDetails,
  ): Promise<EventRecord[]> {
    // it is needed for sixHourly and daily
    const fromAdjusted = getAdjustedFrom(from)

    const eventOccurrences = await this.getEventOccurrences(
      fromAdjusted,
      to,
      event,
    )

    const timestamps = await this.blockNumberRepository.getBlockRangeWhenReady(
      fromAdjusted,
      to,
    )

    const records = generateEventRecords(event, eventOccurrences, timestamps)

    return records.filter((r) => r.timestamp.gte(from))
  }

  private async getEventOccurrences(
    from: UnixTime,
    to: UnixTime,
    event: EventDetails,
  ): Promise<bigint[]> {
    const fromBlock = await this.blockNumberRepository.getBlockNumberWhenReady(
      from.add(-1, 'hours'),
    )
    const toBlock = await this.blockNumberRepository.getBlockNumberWhenReady(to)

    const logs = await this.getAllLogs(
      event.emitter,
      event.topic,
      Number(fromBlock),
      Number(toBlock),
    )
    return logs.map((l) => BigInt(l.blockNumber))
  }

  async getAllLogs(
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
        this.logger.debug('BISECTION', { fromBlock, toBlock })
        // TODO: check that there are blocks in both ranges e.g not [1, 1], [1, 1]
        const midPoint = fromBlock + Math.floor((toBlock - fromBlock) / 2)
        const [a, b] = await Promise.all([
          this.getAllLogs(address, topic, fromBlock, midPoint),
          this.getAllLogs(address, topic, midPoint + 1, toBlock),
        ])
        return a.concat(b)
      } else {
        throw e
      }
    }
  }
}

function getAdjustedFrom(from: UnixTime) {
  return from.isDaily()
    ? from.add(-1, 'days').toStartOf('day').add(1, 'hours')
    : from.toStartOf('day').add(1, 'hours')
}
