import { ProjectId } from '@l2beat/common'

import { EventRepository } from '../../peripherals/database/EventRepository'

export class EventsController {
  constructor(private eventsRepository: EventRepository) {}

  async getByProjectByEvent(projectId: ProjectId, eventName: string) {
    const events = await this.eventsRepository.getByProjectAndName(
      projectId,
      eventName,
      'hourly',
    )

    return events
  }
}
