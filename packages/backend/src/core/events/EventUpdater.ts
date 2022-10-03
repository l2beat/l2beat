import { Logger, TaskQueue } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { utils } from 'ethers'

import { Project } from '../../model'
import {
  EventRecord,
  EventRepository,
} from '../../peripherals/database/EventRepository'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { BlockNumberUpdater } from '../BlockNumberUpdater'
import { Clock } from '../Clock'
import { findCorrespondingBlocks } from './findCorrespondingBlocks'
import { getUpdateRanges } from './getUpdateRanges'
import { EventDetails } from './types/EventDetails'

export class EventUpdater {
  private readonly eventsToWatch: EventDetails[] = []
  private readonly taskQueue = new TaskQueue<void>(
    () => this.update(),
    this.logger,
  )

  constructor(
    private readonly ethereumClient: EthereumClient,
    private readonly blockNumberUpdater: BlockNumberUpdater,
    private readonly eventRepository: EventRepository,
    private readonly clock: Clock,
    private readonly projects: Project[],
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)

    this.eventsToWatch = this.projects
      .map((project) =>
        project.events.map((event) => {
          return {
            emitter: event.emitter,
            topic: new utils.Interface([event.abi]).getEventTopic(event.name),
            name: event.name,
            projectId: project.projectId,
            sinceTimestamp: event.sinceTimestamp,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            untilTimestamp: event.untilTimestamp,
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

    const firstHour = this.clock.getFirstHour()
    const lastHour = this.clock.getLastHour()
    const boundaries = await this.eventRepository.getDataBoundary()

    for (const event of this.eventsToWatch) {
      const synced = boundaries.get(
        `${event.projectId.toString()}-${event.name}`,
      )
      const ranges: { from: UnixTime; to: UnixTime }[] = getUpdateRanges(
        firstHour,
        lastHour,
        synced,
        event.sinceTimestamp,
        event.untilTimestamp,
      )

      for (const { from, to } of ranges) {
        const records = await this.fetchRecords(from, to, event)
        events.push(...records)
      }
    }

    await this.eventRepository.addMany(events)
    this.logger.info('Update completed', { timestamp: lastHour.toString() })
  }

  async fetchRecords(
    from: UnixTime,
    to: UnixTime,
    event: EventDetails,
  ): Promise<EventRecord[]> {
    this.logger.debug('Fetching records', {
      projectId: event.projectId.toString(),
      eventName: event.name,
      to: to.toString(),
      from: from.toString(),
    })

    const fromBlock = await this.blockNumberUpdater.getBlockNumberWhenReady(
      from,
    )
    const toBlock = await this.blockNumberUpdater.getBlockNumberWhenReady(to)
    const logs = await this.ethereumClient.getAllLogs(
      event.emitter,
      event.topic,
      Number(fromBlock),
      Number(toBlock),
    )

    const blocks = await this.blockNumberUpdater.getBlockRangeWhenReady(
      from,
      to,
    )
    const logsWithCorrespondingBlocks = findCorrespondingBlocks(blocks, logs)

    const records: EventRecord[] = logsWithCorrespondingBlocks.map((l) => ({
      name: event.name,
      projectId: event.projectId,
      timestamp: l.block.timestamp,
    }))

    return records
  }
}
