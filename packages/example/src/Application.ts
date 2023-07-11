import { Config } from './Config'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    this.start = async (): Promise<void> => {
      await Promise.resolve()
      console.log(`Application started: ${config.name}`)
    }
  }
}
