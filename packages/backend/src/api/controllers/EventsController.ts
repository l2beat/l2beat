import { Logger } from '@l2beat/common'
import { ApiEvents, UnixTime } from '@l2beat/types'

import { ProjectInfo } from '../../model'
import { EventRepository } from '../../peripherals/database/EventRepository'

interface ProjectEntry {
  hourly: Record<number, Record<string,number>>
  sixHourly: Record<number, number[]>
  daily: Record<number, number[]>
}

export class EventsController {
  constructor(
    private eventsRepository: EventRepository,
    private projects: ProjectInfo[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  //todo
  //ensure data in config is sorted
  //make a cleaner type for project entry and only at the end transpile it to EventCharts
  //add 'from' to getter from repository
  //reason about minimalFrom for  the hourly sixhourly and daily
  async getMain(): Promise<ApiEvents> {
    const main: ApiEvents = {
      projects: {},
    }

    for (const project of this.projects) {
      const eventNames = project.events.map((e) => e.name)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const projectEntry: ProjectEntry = {
        hourly: {},
        sixHourly: {},
        daily: {},
      }

      const hourly = await this.eventsRepository.getByProject(
        project.projectId,
        'hourly',
      )

      for (const { timestamp, name, count } of hourly) {
        if(projectEntry.hourly[timestamp.toNumber()] === undefined) {
          projectEntry.hourly[timestamp.toNumber()] = {}
        }
        projectEntry.hourly[timestamp.toNumber()][name] = count
      }

      const data: [UnixTime, number[]][] = []

      for (const key in projectEntry.hourly) {
        data.push([new UnixTime(Number(key)), eventNames.map(e => projectEntry.hourly[key][e])])
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      main.projects[project.projectId.toString()] = {
        hourly: { types: ['timestamp', eventNames], data: data },
        sixHourly: { types: ['timestamp', eventNames], data: [] },
        daily: { types: ['timestamp', eventNames], data: [] },
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return main
  }
}
