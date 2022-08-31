import { Logger, TaskQueue } from '@l2beat/common'
import { UptimeAction } from '@l2beat/config'

import { ProjectInfo } from '../model'
import { UptimeHandlers } from '../peripherals/uptime/handler'

const FIVE_MINUTES = 1000 * 60 * 5

export class UptimeUpdater {
  private taskQueue = new TaskQueue<void>(() => this.update(), this.logger)

  constructor(
    private handlers: UptimeHandlers,
    private projects: ProjectInfo[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  start() {
    this.logger.info('Started')
    const interval = setInterval(() => {
      this.taskQueue.addIfEmpty()
    }, FIVE_MINUTES)
    return () => clearInterval(interval)
  }

  async update() {
    this.logger.info('Update started')

    await Promise.allSettled(
      this.projects
        .flatMap(({ uptimeActions }) =>
          uptimeActions?.map((action) => this.checkUptime(action)),
        )
        .filter((x) => x),
    )

    this.logger.info('Update completed')
  }

  async checkUptime(action: UptimeAction) {
    try {
      for (const handler of this.handlers) {
        if (handler.canHandle(action)) {
          return await handler.handle(action)
        }
      }
    } catch {
      // TODO: save errors
      return { active: false }
    }
  }
}
