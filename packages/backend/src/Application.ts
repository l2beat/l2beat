import { Config } from './config'
import { createServices, Services } from './services'
import { Logger } from './services/Logger'

export class Application {
  private services: Services
  private logger: Logger

  constructor(private config: Config) {
    this.services = createServices(this.config)
    this.logger = this.services.logger.for(this)
  }

  start() {
    this.logger.info('Starting')
    this.services.apiServer.listen()
  }
}
