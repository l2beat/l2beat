import { ApiEvents, EventChart, EventChartPoint, UnixTime } from '@l2beat/types'

import { Clock } from '../../../core/Clock'
import { Project } from '../../../model'
import {
  EventRecord,
  EventRepository,
} from '../../../peripherals/database/EventRepository'
import {
  getHourlyMinTimestamp,
} from '../report/charts'
import { renderShowcasePage } from './ShowcasePage'

export class EventController {
  constructor(
    private eventRepository: EventRepository,
    private clock: Clock,
    private projects: Project[],
  ) {}

  async getEvents(): Promise<ApiEvents> {
    const main: ApiEvents = {
      projects: {},
    }

    const timestamp = this.clock.getLastHour()

    await Promise.all(
      this.projects.map(async ({ projectId, events }) => {
        const eventNames = events.map((e) => e.name)

        const hourlyTimestamp = getHourlyMinTimestamp(timestamp)
        const records = await this.eventRepository.getHourlyByProject(
          projectId,
          hourlyTimestamp,
        )
        const eventChart = getEventChart(records, eventNames)

        main.projects[projectId.toString()] = {
          hourly: eventChart,
          sixHourly: getEventChart([], []),
          daily: getEventChart([], []),
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

function getEventChart(
  records: EventRecord[],
  eventNames: string[],
): EventChart {
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
