import { Logger } from '@l2beat/common'
import {
  ApiEvents,
  EventChart,
  EventChartPoint,
  ProjectId,
  UnixTime,
} from '@l2beat/types'

import { ProjectInfo } from '../../model'
import {
  EventRecord,
  EventRepository,
} from '../../peripherals/database/EventRepository'

interface ProjectEntry {
  hourly: Record<number, Record<string, number>>
  sixHourly: Record<number, Record<string, number>>
  daily: Record<number, Record<string, number>>
}

export class EventsController {
  constructor(
    private eventsRepository: EventRepository,
    private projects: ProjectInfo[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async getMain(): Promise<ApiEvents> {
    const main: ApiEvents = {
      projects: {},
    }

    for (const { projectId, events } of this.projects) {
      const eventNames = events.map((e) => e.name)

      main.projects[projectId.toString()] = {
        hourly: await this.dbToData(
          projectId,
          'hourly',
          getHourlyMinTimestamp(),
          eventNames,
        ),
        sixHourly: await this.dbToData(
          projectId,
          'sixHourly',
          getSixHourlyMinTimestamp(),
          eventNames,
        ),
        daily: await this.dbToData(projectId, 'daily', undefined, eventNames),
      }
    }
    return main
  }

  async dbToData(
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

    const entries = dbToEntries(db)

    return entriesToData(entries, eventNames)
  }
}

function dbToEntries(records: EventRecord[]) {
  const entries: Record<number, Record<string, number>> = {}

  for (const { timestamp, name, count } of records) {
    if (entries[timestamp.toNumber()] === undefined) {
      entries[timestamp.toNumber()] = {}
    }
    entries[timestamp.toNumber()][name] = count
  }

  return entries
}

function entriesToData(
  entries: Record<number, Record<string, number>>,
  eventNames: string[],
): EventChart {
  const data: EventChartPoint[] = []

  for (const key in entries) {
    data.push([
      new UnixTime(Number(key)),
      eventNames.map((e) => entries[key][e]),
    ])
  }

  return {
    types: ['timestamp', eventNames],
    data,
  }
}

export function getHourlyMinTimestamp(now?: UnixTime) {
  return (now ?? UnixTime.now()).add(-7, 'days')
}

export function getSixHourlyMinTimestamp(now?: UnixTime) {
  return (now ?? UnixTime.now()).add(-90, 'days')
}
