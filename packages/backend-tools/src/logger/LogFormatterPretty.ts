import chalk from 'chalk'
import { inspect } from 'util'

import { toJSON } from '../helpers/toJSON'
import { LogEntry, LogFormatter } from './interfaces'
import { LogLevel } from './LogLevel'

const STYLES = {
  bigint: 'white',
  boolean: 'white',
  date: 'white',
  module: 'white',
  name: 'blue',
  null: 'white',
  number: 'white',
  regexp: 'white',
  special: 'white',
  string: 'white',
  symbol: 'white',
  undefined: 'white',
}

const INDENT_SIZE = 4
const INDENT = ' '.repeat(INDENT_SIZE)

export class LogFormatterPretty implements LogFormatter {
  constructor(
    private readonly colors: boolean,
    private readonly utc: boolean,
  ) {}

  public format(entry: LogEntry): string {
    const timeOut = this.formatTimePretty(entry.time, this.utc, this.colors)
    const levelOut = this.formatLevelPretty(entry.level, this.colors)
    const serviceOut = this.formatServicePretty(entry.service, this.colors)
    const messageOut = entry.message ? ` ${entry.message}` : ''
    const paramsOut = this.formatParametersPretty(
      this.sanitize(
        entry.resolvedError
          ? { ...entry.resolvedError, ...entry.parameters }
          : entry.parameters ?? {},
      ),
      this.colors,
    )

    return `${timeOut} ${levelOut}${serviceOut}${messageOut}${paramsOut}`
  }

  private formatLevelPretty(level: LogLevel, colors: boolean): string {
    if (colors) {
      switch (level) {
        case 'CRITICAL':
        case 'ERROR':
          return chalk.red(chalk.bold(level.toUpperCase()))
        case 'WARN':
          return chalk.yellow(chalk.bold(level.toUpperCase()))
        case 'INFO':
          return chalk.green(chalk.bold(level.toUpperCase()))
        case 'DEBUG':
          return chalk.magenta(chalk.bold(level.toUpperCase()))
        case 'TRACE':
          return chalk.gray(chalk.bold(level.toUpperCase()))
      }
    }
    return level.toUpperCase()
  }

  private formatTimePretty(now: Date, utc: boolean, colors: boolean): string {
    const h = (utc ? now.getUTCHours() : now.getHours())
      .toString()
      .padStart(2, '0')
    const m = (utc ? now.getUTCMinutes() : now.getMinutes())
      .toString()
      .padStart(2, '0')
    const s = (utc ? now.getUTCSeconds() : now.getSeconds())
      .toString()
      .padStart(2, '0')
    const ms = (utc ? now.getUTCMilliseconds() : now.getMilliseconds())
      .toString()
      .padStart(3, '0')

    let result = `${h}:${m}:${s}.${ms}`
    if (utc) {
      result += 'Z'
    }

    return colors ? chalk.gray(result) : result
  }

  private formatParametersPretty(parameters: object, colors: boolean): string {
    const oldStyles = inspect.styles
    inspect.styles = STYLES

    const inspected = inspect(parameters, {
      colors,
      breakLength: 80 - INDENT_SIZE,
      depth: 5,
    })

    inspect.styles = oldStyles

    if (inspected === '{}') {
      return ''
    }

    const indented = inspected
      .split('\n')
      .map((x) => INDENT + x)
      .join('\n')

    if (colors) {
      return '\n' + chalk.gray(indented)
    }
    return '\n' + indented
  }

  private formatServicePretty(
    service: string | undefined,
    colors: boolean,
  ): string {
    if (!service) {
      return ''
    }
    return colors
      ? ` ${chalk.gray('[')} ${chalk.yellow(service)} ${chalk.gray(']')}`
      : ` [ ${service} ]`
  }

  private sanitize(parameters: object): object {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(toJSON(parameters))
  }
}
