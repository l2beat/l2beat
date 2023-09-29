/* eslint-disable @typescript-eslint/ban-types */
import { join } from 'path'

import { assertUnreachable } from '../utils/assertUnreachable'
import { formatLevelPretty } from './formatLevelPretty'
import { formatParametersPretty } from './formatParametersPretty'
import { formatServicePretty } from './formatServicePretty'
import { formatTimePretty } from './formatTimePretty'
import { LEVEL, LogLevel } from './LogLevel'
import { LogThrottle, LogThrottleOptions } from './LogThrottle'
import { resolveLog } from './resolveLog'
import { tagService } from './tagService'

export interface LoggerBackend {
  debug(message: string): void
  log(message: string): void
  warn(message: string): void
  error(message: string): void
}

export interface ReportedError {
  message?: string
  parameters?: unknown
  error?: Error
}

export interface LoggerOptions {
  logLevel: LogLevel
  service?: string
  tag?: string
  format: 'pretty' | 'json'
  utc: boolean
  colors: boolean
  cwd: string
  getTime: () => Date
  reportError: (error: ReportedError) => void
  reportCriticalError: (error: ReportedError) => void
  backend: LoggerBackend
}

export class Logger {
  private readonly options: LoggerOptions
  private readonly logLevel: number
  private readonly cwd: string
  private throttle?: LogThrottle

  constructor(options: Partial<LoggerOptions>) {
    this.options = {
      logLevel: options.logLevel ?? 'INFO',
      service: options.service,
      tag: options.tag,
      format: options.format ?? 'json',
      utc: options.utc ?? false,
      colors: options.colors ?? false,
      cwd: options.cwd ?? process.cwd(),
      getTime: options.getTime ?? (() => new Date()),
      reportError: options.reportError ?? (() => {}),
      reportCriticalError:
        options.reportCriticalError ?? options.reportError ?? (() => {}),
      backend: options.backend ?? console,
    }
    this.cwd = join(this.options.cwd, '/')
    this.logLevel = LEVEL[this.options.logLevel]
  }

  static SILENT = new Logger({ logLevel: 'NONE', format: 'pretty' })
  static CRITICAL = new Logger({
    logLevel: 'CRITICAL',
    format: 'pretty',
    colors: true,
  })
  static ERROR = new Logger({
    logLevel: 'ERROR',
    format: 'pretty',
    colors: true,
  })
  static WARN = new Logger({ logLevel: 'WARN', format: 'pretty', colors: true })
  static INFO = new Logger({ logLevel: 'INFO', format: 'pretty', colors: true })
  static DEBUG = new Logger({
    logLevel: 'DEBUG',
    format: 'pretty',
    colors: true,
  })
  static TRACE = new Logger({
    logLevel: 'TRACE',
    format: 'pretty',
    colors: true,
  })

  configure(options: Partial<LoggerOptions>): Logger {
    const logger = new Logger({ ...this.options, ...options })
    logger.throttle = this.throttle
    return logger
  }

  for(object: {} | string): Logger {
    const name = typeof object === 'string' ? object : object.constructor.name
    return this.configure({
      service: this.options.service ? `${this.options.service}.${name}` : name,
    })
  }

  tag(tag: string | undefined): Logger {
    return this.configure({ tag })
  }

  withThrottling(options: LogThrottleOptions): Logger {
    const logger = new Logger(this.options)
    logger.throttle = new LogThrottle(
      { print: (...args) => logger.printExactly(...args) },
      options,
    )
    return logger
  }

  critical(message: string, parameters?: unknown): void
  critical(parameters: unknown): void
  critical(message: unknown, parameters?: unknown): void {
    if (this.logLevel < LEVEL.CRITICAL) {
      return
    }
    this.print('CRITICAL', resolveLog(message, parameters, this.cwd))
    this.options.reportCriticalError(toReportedError(message, parameters))
  }

  error(message: string, parameters?: unknown): void
  error(parameters: unknown): void
  error(message: unknown, parameters?: unknown): void {
    if (this.logLevel < LEVEL.ERROR) {
      return
    }
    this.print('ERROR', resolveLog(message, parameters, this.cwd))
    this.options.reportError(toReportedError(message, parameters))
  }

  warn(message: string, parameters?: unknown): void
  warn(parameters: unknown): void
  warn(message: unknown, parameters?: unknown): void {
    if (this.logLevel < LEVEL.WARN) {
      return
    }
    this.print('WARN', resolveLog(message, parameters, this.cwd))
  }

  info(message: string, parameters?: unknown): void
  info(parameters: unknown): void
  info(message: unknown, parameters?: unknown): void {
    if (this.logLevel < LEVEL.INFO) {
      return
    }
    this.print('INFO', resolveLog(message, parameters, this.cwd))
  }

  debug(message: string, parameters?: unknown): void
  debug(parameters: unknown): void
  debug(message: unknown, parameters?: unknown): void {
    if (this.logLevel < LEVEL.DEBUG) {
      return
    }
    this.print('DEBUG', resolveLog(message, parameters, this.cwd))
  }

  trace(message: string, parameters?: unknown): void
  trace(parameters: unknown): void
  trace(message: unknown, parameters?: unknown): void {
    if (this.logLevel < LEVEL.TRACE) {
      return
    }
    this.print('TRACE', resolveLog(message, parameters, this.cwd))
  }

  private print(level: LogLevel, parameters: {}): void {
    const service = tagService(this.options.service, this.options.tag)
    let message: string | undefined
    if ('message' in parameters && typeof parameters.message === 'string') {
      message = parameters.message
      delete parameters.message
    }

    if (this.throttle?.throttle(level, service, message)) {
      return
    }

    this.printExactly(level, service, message, parameters)
  }

  private printExactly(
    level: LogLevel,
    service: string | undefined,
    message: string | undefined,
    parameters: {},
  ): void {
    const output =
      this.options.format === 'json'
        ? this.formatJson(level, service, message, parameters)
        : this.formatPretty(level, service, message, parameters)

    switch (level) {
      case 'CRITICAL':
      case 'ERROR':
        this.options.backend.error(output)
        break
      case 'WARN':
        this.options.backend.warn(output)
        break
      case 'INFO':
        this.options.backend.log(output)
        break
      case 'DEBUG':
      case 'TRACE':
        this.options.backend.debug(output)
        break
      case 'NONE':
        break
      default:
        assertUnreachable(level)
    }
  }

  private formatJson(
    level: LogLevel,
    service: string | undefined,
    message: string | undefined,
    parameters: {},
  ): string {
    const core = {
      time: this.options.getTime().toISOString(),
      level,
      service,
      message,
    }
    try {
      return toJSON({ ...core, ...parameters })
    } catch (e) {
      this.error('Unable to log', e)
      return JSON.stringify(core)
    }
  }

  private formatPretty(
    level: LogLevel,
    service: string | undefined,
    message: string | undefined,
    parameters: {},
  ): string {
    const timeOut = formatTimePretty(
      this.options.getTime(),
      this.options.utc,
      this.options.colors,
    )
    const levelOut = formatLevelPretty(level, this.options.colors)
    const serviceOut = formatServicePretty(service, this.options.colors)
    const messageOut = message ? ` ${message}` : ''
    const paramsOut = formatParametersPretty(
      sanitize(parameters),
      this.options.colors,
    )

    return `${timeOut} ${levelOut}${serviceOut}${messageOut}${paramsOut}\n`
  }
}

function toJSON(parameters: {}): string {
  return JSON.stringify(parameters, (k, v: unknown) =>
    typeof v === 'bigint' ? v.toString() : v,
  )
}

function sanitize(parameters: {}): {} {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(toJSON(parameters))
}

function toReportedError(arg1: unknown, arg2: unknown): ReportedError {
  let message: string | undefined
  let parameters: unknown
  let error: Error | undefined

  if (typeof arg1 === 'string') {
    message = arg1
    if (arg2 instanceof Error) {
      error = arg2
    } else if (arg2 !== undefined) {
      parameters = arg2
    }
  } else {
    if (arg1 instanceof Error) {
      message = arg1.message
      error = arg1
    } else if (arg1 !== undefined) {
      parameters = arg1
      if (typeof arg1 === 'object' && arg1 !== null) {
        const messageLike: unknown = Reflect.get(arg1, 'message')
        if (typeof messageLike === 'string') {
          message = messageLike
        }
      }
    }
  }

  return { message, parameters, error }
}
