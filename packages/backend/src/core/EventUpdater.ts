import {
  EthereumAddress,
  Logger,
  ProjectId,
  TaskQueue,
  UnixTime,
} from '@l2beat/common'

import { ProjectInfo } from '../model/ProjectInfo'
import { BlockNumberRepository } from '../peripherals/database/BlockNumberRepository'
import {
  EventRecord,
  EventRepository,
} from '../peripherals/database/EventRepository'
import { EthereumClient } from '../peripherals/ethereum/EthereumClient'
import { Clock } from './Clock'

interface EventDetail {
  emitter: EthereumAddress
  topic: string
  name: string
  projectId: ProjectId
}
//TODO
// add status to avoid additional work on the data
export class EventUpdater {
  private events: EventDetail[] = []
  private taskQueue = new TaskQueue(this.update.bind(this), this.logger)

  constructor(
    private ethereum: EthereumClient,
    private blockNumberRepository: BlockNumberRepository,
    private eventRepository: EventRepository,
    private clock: Clock,
    private projects: ProjectInfo[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)

    this.events = this.projects
      .map((project) =>
        project.events.map((event) => ({
          emitter: event.emitter,
          abi: event.abi,
          name: event.name,
          projectId: project.projectId,
        })),
      )
      .flat()
  }

  start() {
    //rethink
    return this.clock.onEveryHour((timestamp) => {
      this.taskQueue.addToFront(timestamp)
    })
  }

  async update(timestamp: UnixTime) {
    //? maybe getBlockNumbers only once
    //cycle through all events
    //save to DB
  }

  async fetchRecords(
    timestamp: UnixTime,
    event: EventDetail,
  ): Promise<EventRecord[]> {
    const from = await this.blockNumberRepository.findByTimestamp(
      timestamp.add(-1, 'hours'),
    )
    const to = await this.blockNumberRepository.findByTimestamp(timestamp)

    const count = await this.ethereum.getLogsCount(
      event.emitter,
      [event.topic],
      Number(from),
      Number(to),
    )

    const records: EventRecord[] = [
      {
        timestamp,
        name: event.name,
        projectId: event.projectId,
        count,
        timeSpan: 'hourly',
      },
    ]

    const DAY = 24 * 60 * 60
    const SIX_HOURS = 6 * 60 * 60

    if (timestamp.toNumber() % SIX_HOURS === 0) {
      const aggregatedCount = await this.eventRepository.getAggregatedCount(
        event.projectId,
        event.name,
        timestamp.add(-6, 'hours'),
        timestamp.add(-1, 'hours'),
      )
      records.push({
        timestamp,
        name: event.name,
        projectId: event.projectId,
        count: aggregatedCount + count,
        timeSpan: 'sixHourly',
      })
    }

    if (timestamp.toNumber() % DAY === 0) {
      const aggregatedCount = await this.eventRepository.getAggregatedCount(
        event.projectId,
        event.name,
        timestamp.add(-1, 'days'),
        timestamp.add(-1, 'hours'),
      )

      records.push({
        timestamp,
        name: event.name,
        projectId: event.projectId,
        count: aggregatedCount + count,
        timeSpan: 'daily',
      })
    }

    return records
  }
}
