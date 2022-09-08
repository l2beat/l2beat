import { ApiEvents, UnixTime } from '@l2beat/types'

import { EventUpdater } from '../../../core/events/EventUpdater'
import { ProjectInfo } from '../../../model'
import {
  EventGranularity,
  EventRepository,
} from '../../../peripherals/database/EventRepository'
import {
  getHourlyMinTimestamp,
  getSixHourlyMinTimestamp,
} from '../report/charts'
import { getEventChart } from './getEventChart'
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
      granularity: EventGranularity
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
          config.map(async (c) => {
            const records = await this.eventsRepository.getByProject(
              projectId,
              c.granularity,
              c.timestamp,
            )
            return getEventChart(records, eventNames)
          }),
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

  async getShowcase() {
    const events = await this.getEvents()

    return renderShowcasePage({ events })
  }
}
