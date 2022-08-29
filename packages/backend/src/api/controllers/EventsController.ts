import { Logger } from '@l2beat/common'
import { ApiEvents } from '@l2beat/types'

import { ProjectInfo } from '../../model'
import { EventRepository } from '../../peripherals/database/EventRepository'

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

    for (const project of this.projects) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (main.projects[project.projectId.toString()] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        main.projects[project.projectId.toString()] = {
          hourly: { types: ['timestamp', []], data: [] },
          sixHourly: { types: ['timestamp', []], data: [] },
          daily: { types: ['timestamp', []], data: [] },
        }
      }
      for (const event of project.events) {
        const hourly = await this.eventsRepository.getByProjectAndName(
          project.projectId,
          event.name,
          'hourly',
        )

        for (const hour of hourly) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          main.projects[project.projectId.toString()]?.hourly.data.push([
            hour.timestamp,
            [hour.count],
          ])
        }
      }

    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return main
  }
}
