import { EventApiResponse } from '@l2beat/types'

import { Clock } from '../../../core/Clock'
import { Project } from '../../../model'
import { EventRepository } from '../../../peripherals/database/EventRepository'
import { getHourlyMinTimestamp } from '../utils/getHourlyMinTimestamp'
import { getEventChart } from './getEventChart'
import { renderShowcasePage } from './ShowcasePage'

export class EventController {
  constructor(
    private eventRepository: EventRepository,
    private clock: Clock,
    private projects: Project[],
  ) {}

  async getEventApiResponse(): Promise<EventApiResponse> {
    const response: EventApiResponse = {
      projects: {},
    }

    const timestamp = this.clock.getLastHour()
    const minHourlyTimestamp = getHourlyMinTimestamp(timestamp)

    await Promise.all(
      this.projects.map(async ({ projectId, events }) => {
        const eventNames = events.map((e) => e.name)

        const hourlyRecords =
          await this.eventRepository.getAggregatedByProjectAndGranularity(
            projectId,
            'hour',
            minHourlyTimestamp,
          )
        const hourly = getEventChart(hourlyRecords, eventNames)

        const dailyRecords =
          await this.eventRepository.getAggregatedByProjectAndGranularity(
            projectId,
            'day',
          )
        const daily = getEventChart(dailyRecords, eventNames)

        response.projects[projectId.toString()] = {
          hourly,
          daily,
        }
      }),
    )
    return response
  }

  async getShowcase() {
    const events = await this.getEventApiResponse()

    return renderShowcasePage({ events })
  }
}
