import { Config } from './config'
import { HttpEndpoint } from './http'
import { createServices, Services } from './services'

export class Application {
  private services: Services
  private httpEndpoint: HttpEndpoint

  constructor(private config: Config) {
    this.services = createServices(this.config)
    this.httpEndpoint = new HttpEndpoint(this.config, this.services)
  }

  start() {
    this.services.logger.for(this).info('Starting')
    this.httpEndpoint.listen()
  }
}
