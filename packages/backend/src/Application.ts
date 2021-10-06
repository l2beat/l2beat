import { Config } from './config'
import { createServices, Services } from './services'
import { Logger } from './tools/Logger'

export class Application {
  private services: Services
  private logger: Logger

  constructor(private config: Config) {
    this.services = createServices(this.config)
    this.logger = this.services.logger.for(this)
  }

  async start() {
    this.logger.info('Starting')

    await this.services.databaseService.migrateToLatest()
    await this.services.reportRangeService.initialize()

    this.services.apiServer.listen()
    this.services.reportCreator.startBackgroundWork()
  }
}
