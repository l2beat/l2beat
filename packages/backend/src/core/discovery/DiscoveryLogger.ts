import chalk from 'chalk'

interface LoggerOptions {
  enabled: boolean
}

export class DiscoveryLogger {
  constructor(private readonly options: LoggerOptions) {}

  static SILENT = new DiscoveryLogger({ enabled: false })

  log(message: string) {
    if (!this.options.enabled) {
      return
    }

    console.log(message)
  }

  red(message: string) {
    this.log(chalk.red(message))
  }

  bold(message: string) {
    this.log(chalk.bold(message))
  }

  blue(message: string) {
    this.log(chalk.blue(message))
  }

  redBackground(message: string) {
    this.log(chalk.bgRed.whiteBright(message))
  }

  logExecution(field: string, values: string[]) {
    if (!this.options.enabled) {
      return
    }

    const dots = '.'.repeat(Math.max(1, 25 - field.length))
    const content = values
      .map((v, i) => (i % 2 === 0 ? v : chalk.blue(v)))
      .join('')

    console.log(`  ${chalk.yellow(field)} ${chalk.gray(dots)} ${content}`)
  }
}
