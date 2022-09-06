import {
  ApiEvents,
  EventChart,
  EventChartPoint,
  ProjectId,
  UnixTime,
} from '@l2beat/types'

import { EventUpdater } from '../../../core/events/EventUpdater'
import { ProjectInfo } from '../../../model'
import { EventRepository } from '../../../peripherals/database/EventRepository'
import {
  getHourlyMinTimestamp,
  getSixHourlyMinTimestamp,
} from '../report/charts'
import { renderShowcasePage } from './ShowcasePage'

export class EventsController {
  constructor(
    private eventsRepository: EventRepository,
    private eventUpdater: EventUpdater,
    private projects: ProjectInfo[],
  ) {}

  async getEvents(): Promise<ApiEvents> {
    const main: ApiEvents = {
      projects: {},
    }

    const timestamp = this.eventUpdater.getLastProcessed()

    const config: {
      granularity: 'hourly' | 'sixHourly' | 'daily'
      timestamp: UnixTime | undefined
    }[] = [
      { granularity: 'hourly', timestamp: getHourlyMinTimestamp(timestamp) },
      {
        granularity: 'sixHourly',
        timestamp: getSixHourlyMinTimestamp(timestamp),
      },
      { granularity: 'daily', timestamp: undefined },
    ]

    await Promise.all(
      this.projects.map(async ({ projectId, events }) => {
        const eventNames = events.map((e) => e.name)

        const eventCharts = await Promise.all(
          config.map((c) =>
            this.getEventChart(
              projectId,
              c.granularity,
              c.timestamp,
              eventNames,
            ),
          ),
        )

        main.projects[projectId.toString()] = {
          hourly: eventCharts[0],
          sixHourly: eventCharts[1],
          daily: eventCharts[2],
        }
      }),
    )
    return main
  }

  async getEventChart(
    projectId: ProjectId,
    granularity: 'hourly' | 'sixHourly' | 'daily',
    minTimestamp: UnixTime | undefined,
    eventNames: string[],
  ): Promise<EventChart> {
    const records = await this.eventsRepository.getByProject(
      projectId,
      granularity,
      minTimestamp,
    )

    //Record<timestamp, Record<eventName, count>>
    const entries: Record<number, Record<string, number> | undefined> = {}

    for (const { timestamp, name, count } of records) {
      const entry = entries[timestamp.toNumber()] ?? {}
      entry[name] = count
      entries[timestamp.toNumber()] = entry
    }

    const data: EventChartPoint[] = []

    for (const key in entries) {
      data.push([
        new UnixTime(Number(key)),
        ...eventNames.map((e) => entries[key]?.[e] ?? 0),
      ])
    }

    return {
      types: ['timestamp', ...eventNames],
      data,
    }
  }

  async getShowcase() {
    const events = await this.getEvents()

    return renderShowcasePage({ events })
  }
}
