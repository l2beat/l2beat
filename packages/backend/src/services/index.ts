import { Config } from '../config'
import { HelloService } from './HelloService'

export type Services = ReturnType<typeof createServices>

export function createServices(config: Config) {
  const helloService = new HelloService(config.name)
  return {
    helloService,
  }
}
