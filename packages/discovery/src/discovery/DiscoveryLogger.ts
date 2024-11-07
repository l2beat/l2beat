import chalk from 'chalk'

interface LoggerOptions {
  enabled: boolean
}

export class DiscoveryLogger {
  constructor(private readonly options: LoggerOptions) {}

  static SILENT = new DiscoveryLogger({ enabled: false })
  static CLI = new DiscoveryLogger({ enabled: true })

  log(message: string): void {
    if (!this.options.enabled) {
      return
    }
    console.log(message)
  }

  logError(error: string): void {
    this.log(`${chalk.red(error)}`)
  }
}
