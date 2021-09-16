import { Config } from '../config'
import { HelloService } from './HelloService'
import { Logger } from './Logger'

export type Services = ReturnType<typeof createServices>

export function createServices(config: Config) {
  const logger = new Logger(config.logLevel)
  const helloService = new HelloService(config.name)

  return {
    logger,
    helloService,
  }
}
