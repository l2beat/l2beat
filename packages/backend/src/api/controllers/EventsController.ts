import {
  ApiEvents,
  EventChart,
  EventChartPoint,
  ProjectId,
  UnixTime,
} from '@l2beat/types'

import { ProjectInfo } from '../../model'
import { EventRepository } from '../../peripherals/database/EventRepository'
import { getHourlyMinTimestamp, getSixHourlyMinTimestamp } from './report/charts'

export class EventsController {
  constructor(
    private eventsRepository: EventRepository,
    private projects: ProjectInfo[],
  ) {}

  async getMain(): Promise<ApiEvents> {
    const main: ApiEvents = {
      projects: {},
    }
//promise.all
    for (const { projectId, events } of this.projects) {
      const eventNames = events.map((e) => e.name)
//promise.all
      main.projects[projectId.toString()] = {
        hourly: await this.getEventChart(
          projectId,
          'hourly',
          getHourlyMinTimestamp(),
          eventNames,
        ),
        sixHourly: await this.getEventChart(
          projectId,
          'sixHourly',
          getSixHourlyMinTimestamp(),
          eventNames,
        ),
        daily: await this.getEventChart(projectId, 'daily', undefined, eventNames),
      }
    }
    return main
  }

  async getEventChart(
    projectId: ProjectId,
    granularity: 'hourly' | 'sixHourly' | 'daily',
    minTimestamp: UnixTime | undefined,
    eventNames: string[],
  ): Promise<EventChart> {
    const db = await this.eventsRepository.getByProject(
      projectId,
      granularity,
      minTimestamp,
    )

    //Record<timestamp, Record<eventName, count>>
    const entries: Record<number, Record<string, number> | undefined> = {}

    for (const { timestamp, name, count } of db) {
      const entry = entries[timestamp.toNumber()] ?? {}
      entry[name] = count
      entries[timestamp.toNumber()] = entry
    }

    const data: EventChartPoint[] = []

    for (const key in entries) {
      data.push([
        new UnixTime(Number(key)),
        eventNames.map((e) => entries[key]?.[e] ?? 0),
      ])
    }

    return {
      types: ['timestamp', eventNames],
      data,
    }
  }
}


