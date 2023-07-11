/* eslint-disable @typescript-eslint/ban-types */
import chalk from 'chalk'
import { inspect } from 'util'

export enum LogLevel {
  NONE = 0,
  ERROR = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LoggerOptions {
  logLevel: LogLevel
  service?: string
  format: 'pretty' | 'json'
  reportError?: (error: unknown) => void
}

export class Logger {
  constructor(private readonly options: LoggerOptions) {}

  static SILENT = new Logger({ logLevel: LogLevel.NONE, format: 'pretty' })
  static DEBUG = new Logger({ logLevel: LogLevel.DEBUG, format: 'pretty' })

  configure(options: Partial<LoggerOptions>): Logger {
    return new Logger({ ...this.options, ...options })
  }

  for(object: {}): Logger {
    return this.configure({
      service: this.options.service
        ? `${this.options.service}.${object.constructor.name}`
        : object.constructor.name,
    })
  }

  error(error: unknown): void
  error(annotation: string, error: unknown): void
  error(...args: [unknown] | [string, unknown]): void {
    if (this.options.logLevel >= LogLevel.ERROR) {
      const [annotation, error] = args.length === 1 ? ['', args[0]] : args

      const message = [annotation, getErrorMessage(error)]
        .filter(Boolean)
        .join(' ')

      this.print('error', { message })
      this.options.reportError?.(error)
    }
  }

  info(message: string, parameters?: {}): void
  info(parameters: {}): void
  info(message: string | {}, parameters?: {}): void {
    if (this.options.logLevel >= LogLevel.INFO) {
      this.print('info', combine(message, parameters))
    }
  }

  debug(message: string, parameters?: {}): void
  debug(parameters: {}): void
  debug(message: string | {}, parameters?: {}): void {
    if (this.options.logLevel >= LogLevel.DEBUG) {
      this.print('debug', combine(message, parameters))
    }
  }

  private print(level: string, parameters: {}): void {
    switch (this.options.format) {
      case 'json':
        return this.printJson(level, parameters)
      case 'pretty':
        return this.printPretty(level, parameters)
    }
  }

  private printJson(level: string, parameters: {}): void {
    const time = new Date().toISOString()
    const data = {
      time,
      level,
      service: this.options.service,
      ...parameters,
    }
    // TODO: bigint
    const str = JSON.stringify(data)
    if (data.level === 'error') {
      console.error(str)
    } else {
      console.log(str)
    }
  }

  private printPretty(level: string, parameters: {}): void {
    const time = getPrettyTime()
    const levelOut = getPrettyLevel(level)
    const service = getPrettyService(this.options.service)
    let messageOut = ''
    if ('message' in parameters && typeof parameters.message === 'string') {
      messageOut = ` ${parameters.message}`
      delete parameters.message
    }
    const params = getPrettyParameters(parameters)
    const str = `${time} ${levelOut}${service}${messageOut}${params}`
    if ('level' in parameters && parameters.level === 'error') {
      console.error(str)
    } else {
      console.log(str)
    }
  }
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  } else if (error instanceof Error) {
    return error.message
  } else {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${error}`
  }
}

function combine(message: string | {}, parameters?: {}): {} {
  if (typeof message === 'string') {
    return { message, ...parameters }
  } else {
    return { ...message, ...parameters }
  }
}

function getPrettyTime(): string {
  const now = new Date()
  const h = now.getHours().toString().padStart(2, '0')
  const m = now.getMinutes().toString().padStart(2, '0')
  const s = now.getSeconds().toString().padStart(2, '0')
  const ms = now.getMilliseconds().toString().padStart(3, '0')
  return chalk.gray(`${h}:${m}:${s}.${ms}`)
}

function getPrettyLevel(level: string): string {
  switch (level) {
    case 'error':
      return chalk.red(level.toUpperCase())
    case 'info':
      return chalk.blue(level.toUpperCase())
    case 'debug':
      return chalk.yellow(level.toUpperCase())
  }
  return level.toUpperCase()
}

function getPrettyService(service: string | undefined): string {
  if (service === undefined) {
    return ''
  }
  return ` [${chalk.magenta(service)}]`
}

function getPrettyParameters(parameters: {} | undefined): string {
  if (parameters === undefined) {
    return ''
  }
  const previous = inspect.styles
  const newStyles = { ...previous }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  ;(newStyles as any).name = 'magenta'
  newStyles.string = ''
  newStyles.number = ''
  newStyles.boolean = ''
  inspect.styles = newStyles
  const str = ` ${inspect(parameters, { colors: true, breakLength: Infinity })}`
  inspect.styles = previous
  if (str === ' {}') {
    return ''
  }
  return str
}
