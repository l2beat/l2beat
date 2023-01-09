import chalk from 'chalk'

export interface LoggerOptions {
  enabled: boolean
}

export class LogHandler {
  constructor(private readonly options: LoggerOptions) {}

  static SILENT = new LogHandler({ enabled: false })

  log(field: string, values: string[]) {
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
