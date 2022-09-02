import { Logger, TaskQueue } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { utils } from 'ethers'

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
    private ethereumClient: EthereumClient,
    private blockNumberUpdater: BlockNumberUpdater,
    private eventRepository: EventRepository,
    private clock: Clock,
    private projects: ProjectInfo[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)

    this.events = this.projects
      .map((project) =>
        project.events.map((event) => {
          return {
            emitter: event.emitter,
            topic: new utils.Interface([event.abi]).getEventTopic(event.name),
            name: event.name,
            projectId: project.projectId,
            sinceTimestamp: event.sinceTimestamp,
          }
        }),
      )
      .flat()
  }

  start() {
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

    const boundaries = await this.eventRepository.getDataBoundary()

    for (const event of this.events) {
      const boundary = boundaries.get(
        `${event.projectId.toString()}-${event.name}`,
      )
      const ranges: { from: UnixTime; to: UnixTime }[] = getUpdateRanges(
        firstHour,
        lastHour,
        boundary,
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
    // it is needed for sixHourly and daily
    // we want to avoid situation whe we ask for blockNumbers and there are no records
    // it can happen because how logic works, it asks for multiple earlier records when needed
    // e.g. you are at 00:00 so to calculate daily you need blockNumbers of 23 previous hourly
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

    const eventBlockNumbers = await this.eventBlockNumbers(
      fromAdjusted,
      to,
      event,
    )

    const timestamps = await this.blockNumberUpdater.getBlockRangeWhenReady(
      fromAdjusted,
      to,
    )

    const records = generateEventRecords(event, eventBlockNumbers, timestamps)

    return records.filter((r) => r.timestamp.gte(from))
  }

  async eventBlockNumbers(
    from: UnixTime,
    to: UnixTime,
    event: EventDetails,
  ): Promise<bigint[]> {
    const fromBlock = await this.blockNumberUpdater.getBlockNumberWhenReady(
      from.add(-1, 'hours'),
    )
    const toBlock = await this.blockNumberUpdater.getBlockNumberWhenReady(to)

    const logs = await this.ethereumClient.getLogsUsingBisection(
      event.emitter,
      event.topic,
      Number(fromBlock),
      Number(toBlock),
    )
    return logs.map((l) => BigInt(l.blockNumber))
  }
}

export function getAdjustedFrom(from: UnixTime) {
  return from.isFull('day')
    ? from.add(-1, 'days').toStartOf('day').add(1, 'hours')
    : from.toStartOf('day').add(1, 'hours')
}
