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
    private blockNumberUpdater: BlockNumberUpdater,
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

    this.taskQueue.addToFront()
    this.logger.info('EventUpdater started!')
    return this.clock.onNewHour(() => {
      this.taskQueue.addToFront()
    })
  }

  async update() {
    const events: EventRecord[] = []

    const firstHour = this.getFirstHour()
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

    await this.eventRepository.addMany(events)
    this.lastProcessed = lastHour
  }

  private getFirstHour() {
    if (this.lastProcessed) {
      return this.lastProcessed.add(1, 'hours')
    }
    //it is needed for sixHourly and daily
    //we want to avoid situation whe we ask for blockNumbers and there are no records
    //it can happen because how logic works, it asks for multiple earlier records when needed
    //e.g. you are at 00:00 so to calculate daily you need blockNumbers of 23 previous hourly
    const firstHour = this.clock.getFirstHour().add(1, 'days')
    return firstHour.isFull('day') ? firstHour : firstHour.toNext('day')
  }

  async fetchRecords(
    from: UnixTime,
    to: UnixTime,
    event: EventDetails,
  ): Promise<EventRecord[]> {
    // it is needed for sixHourly and daily
    // generateEventRecords needs data in certain order
    const fromAdjusted = getAdjustedFrom(from)

    const eventOccurrences = await this.getEventOccurrences(
      fromAdjusted,
      to,
      event,
    )

    const timestamps = await this.blockNumberUpdater.getBlockRangeWhenReady(
      fromAdjusted,
      to,
    )

    const records = generateEventRecords(event, eventOccurrences, timestamps)

    return records.filter((r) => r.timestamp.gte(from))
  }

  async getEventOccurrences(
    from: UnixTime,
    to: UnixTime,
    event: EventDetails,
  ): Promise<bigint[]> {
    const fromBlock = await this.blockNumberUpdater.getBlockNumberWhenReady(
      from.add(-1, 'hours'),
    )
    const toBlock = await this.blockNumberUpdater.getBlockNumberWhenReady(to)

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
    // TODO: check that there are blocks in both ranges e.g not [1, 1], [1, 1]
    if (fromBlock === toBlock) {
      return await this.ethereum.getLogs(address, [topic], fromBlock, toBlock)
    }
    
    try {
      return await this.ethereum.getLogs(address, [topic], fromBlock, toBlock)
    } catch (e) {
      if (
        e instanceof Error &&
        e.message.includes('Log response size exceeded')
      ) {
        this.logger.debug('BISECTION', {
          address: address.toString(),
          topic,
          fromBlock,
          toBlock,
        })

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

export function getAdjustedFrom(from: UnixTime) {
  return from.isDaily()
    ? from.add(-1, 'days').toStartOf('day').add(1, 'hours')
    : from.toStartOf('day').add(1, 'hours')
}
