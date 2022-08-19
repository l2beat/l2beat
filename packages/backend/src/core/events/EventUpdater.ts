import {
  EthereumAddress,
  Logger,
  ProjectId,
  TaskQueue,
  UnixTime,
} from '@l2beat/common'
import { utils } from 'ethers'

import { ProjectInfo } from '../../model/ProjectInfo'
import {
  EventRecord,
  EventRepository,
} from '../../peripherals/database/EventRepository'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { BlockNumberUpdater } from '../BlockNumberUpdater'
import { Clock } from '../Clock'
import { getQueryRanges } from './getQueryRanges'

export interface EventDetail {
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

  private getFirstHour() {
    const firstHour = this.clock.getFirstHour().add(1, 'days')
    return firstHour.isFull('day') ? firstHour : firstHour.toNext('day')
  }

  async update() {
    const events: EventRecord[] = []

    const firstHour = this.lastProcessed
      ? this.lastProcessed.add(1, 'hours')
      : this.getFirstHour()

    const lastHour = this.clock.getLastHour()

    if (firstHour.equals(lastHour)) {
      return
    }

    for (const event of this.events) {
      const dbStatus =
        event.earliest && event.latest
          ? {
              earliest: event.earliest,
              latest: event.latest,
            }
          : undefined

      const ranges: { from: UnixTime; to: UnixTime }[] = getQueryRanges(
        firstHour,
        lastHour,
        dbStatus,
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
    event: EventDetail,
  ): Promise<EventRecord[]> {
    // it is needed for sixHourly and daily
    const fromAdjusted = from.add(-1, 'days').toStartOf('day').add(1, 'hours')

    const eventBlockNumbers = await this.getEventsBlockNumbers(
      fromAdjusted,
      to,
      event,
    )

    const timestamps = await this.blockNumberRepository.getBlockRangeWhenReady(
      fromAdjusted,
      to,
    )

    const records = generateRecords(event, eventBlockNumbers, timestamps)

    return records.filter((r) => r.timestamp.gte(from))
  }

  private async getEventsBlockNumbers(
    from: UnixTime,
    to: UnixTime,
    event: EventDetail,
  ) {
    const fromBlock = await this.blockNumberRepository.getBlockNumberWhenReady(
      from.add(-1, 'hours'),
    )
    const toBlock = await this.blockNumberRepository.getBlockNumberWhenReady(to)

    const logs = await this.getEventBlockNumbers(
      event.emitter,
      event.topic,
      Number(fromBlock),
      Number(toBlock),
    )
    return logs
  }

  async getEventBlockNumbers(
    address: EthereumAddress,
    topic: string,
    fromBlock: number,
    toBlock: number,
  ): Promise<bigint[]> {
    try {
      return await this.ethereum.getLogBlockNumbers(
        address,
        [topic],
        fromBlock,
        toBlock,
      )
    } catch (e) {
      if (
        e instanceof Error &&
        e.message.includes('Log response size exceeded')
      ) {
        this.logger.debug('BISECTION', { fromBlock, toBlock })
        // TODO: check that there are blocks in both ranges e.g not [1, 1], [1, 1]
        const midPoint = fromBlock + Math.floor((toBlock - fromBlock) / 2)
        const [a, b] = await Promise.all([
          this.getEventBlockNumbers(address, topic, fromBlock, midPoint),
          this.getEventBlockNumbers(address, topic, midPoint + 1, toBlock),
        ])
        return a.concat(b)
      } else {
        throw e
      }
    }
  }
}

export function generateRecords(
  { name, projectId }: EventDetail,
  logs: bigint[],
  timestamps: { timestamp: UnixTime; blockNumber: bigint }[],
): EventRecord[] {
  if (timestamps[0]?.timestamp.toNumber() % 86_400 !== 3_600) {
    throw new Error('Algorithm works only if first timestamp is 01:00')
  }

  const sortedLogs = logs.sort((a, b) => Number(a - b))

  let i = 0
  const hourly: EventRecord[] = []
  const sixHourly: EventRecord[] = []
  const daily: EventRecord[] = []

  for (const { timestamp, blockNumber } of timestamps) {
    let count = 0
    while (true) {
      if (sortedLogs[i] < blockNumber) {
        count++
        i++
      } else {
        break
      }
    }
    hourly.push({
      timestamp: timestamp,
      name,
      projectId,
      count,
      timeSpan: 'hourly',
    })
    if (timestamp.isSixHourly()) {
      let sum = 0
      hourly.slice(hourly.length - 6).forEach((r) => (sum += r.count))
      sixHourly.push({
        timestamp: timestamp,
        name,
        projectId,
        count: sum,
        timeSpan: 'sixHourly',
      })
    }
    if (timestamp.isDaily()) {
      let sum = 0
      hourly.slice(hourly.length - 24).forEach((r) => (sum += r.count))
      daily.push({
        timestamp: timestamp,
        name,
        projectId,
        count: sum,
        timeSpan: 'daily',
      })
    }
  }

  return hourly.concat(sixHourly).concat(daily)
}
