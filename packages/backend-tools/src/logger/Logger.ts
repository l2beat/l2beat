/* eslint-disable @typescript-eslint/ban-types */
import { join } from 'path'

import { assertUnreachable } from '../utils/assertUnreachable'
import { formatLevelPretty } from './formatLevelPretty'
import { formatParametersPretty } from './formatParametersPretty'
import { formatServicePretty } from './formatServicePretty'
import { formatTimePretty } from './formatTimePretty'
import { LEVEL, LogLevel } from './LogLevel'
import { LogThrottle, LogThrottleOptions } from './LogThrottle'
import { parseLogArguments } from './parseLogArguments'
import { ResolvedError, resolveError } from './resolveError'
import { tagService } from './tagService'

export interface LoggerBackend {
  debug(message: string): void
  log(message: string): void
  warn(message: string): void
  error(message: string): void
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
  reportError: (entry: LogEntry) => void
  backend: LoggerBackend
}

export interface LogEntry {
  level: LogLevel
  time: Date
  service?: string
  message?: string
  error?: Error
  resolvedError?: ResolvedError
  parameters?: object
}

/**
 * [Read full documentation](https://github.com/l2beat/tools/blob/master/packages/backend-tools/src/logger/docs.md)
 */
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
      {
        print: (level, service, message, parameters) =>
          logger.print({
            time: logger.options.getTime(),
            level,
            service,
            message,
            parameters,
          }),
      },
      options,
    )
    return logger
  }

  critical(...args: unknown[]): void {
    if (this.logLevel >= LEVEL.CRITICAL) {
      const parsed = this.parseEntry('CRITICAL', args)
      this.print(parsed)
      this.options.reportError(parsed)
    }
  }

  error(...args: unknown[]): void {
    if (this.logLevel >= LEVEL.ERROR) {
      const entry = this.parseEntry('ERROR', args)
      this.print(entry)
      this.options.reportError(entry)
    }
  }

  warn(...args: unknown[]): void {
    if (this.logLevel >= LEVEL.WARN) {
      this.print(this.parseEntry('WARN', args))
    }
  }

  info(...args: unknown[]): void {
    if (this.logLevel >= LEVEL.INFO) {
      this.print(this.parseEntry('INFO', args))
    }
  }

  debug(...args: unknown[]): void {
    if (this.logLevel >= LEVEL.DEBUG) {
      this.print(this.parseEntry('DEBUG', args))
    }
  }

  trace(...args: unknown[]): void {
    if (this.logLevel >= LEVEL.TRACE) {
      this.print(this.parseEntry('TRACE', args))
    }
  }

  private parseEntry(level: LogLevel, args: unknown[]): LogEntry {
    const parsed = parseLogArguments(args)
    return {
      ...parsed,
      resolvedError: parsed.error
        ? resolveError(parsed.error, this.cwd)
        : undefined,
      level,
      time: this.options.getTime(),
      service: tagService(this.options.service, this.options.tag),
    }
  }

  private print(entry: LogEntry): void {
    if (this.throttle?.throttle(entry.level, entry.service, entry.message)) {
      return
    }

    this.printExactly(entry)
  }

  private printExactly(entry: LogEntry): void {
    const output =
      this.options.format === 'json'
        ? this.formatJson(entry)
        : this.formatPretty(entry)

    switch (entry.level) {
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
        assertUnreachable(entry.level)
    }
  }

  private formatJson(entry: LogEntry): string {
    const core = {
      time: entry.time.toISOString(),
      level: entry.level,
      service: entry.service,
      message: entry.message,
      error: entry.resolvedError,
    }
    try {
      return toJSON({ ...core, parameters: entry.parameters })
    } catch (e) {
      this.error('Unable to log', e)
      return JSON.stringify(core)
    }
  }

  private formatPretty(entry: LogEntry): string {
    const timeOut = formatTimePretty(
      entry.time,
      this.options.utc,
      this.options.colors,
    )
    const levelOut = formatLevelPretty(entry.level, this.options.colors)
    const serviceOut = formatServicePretty(entry.service, this.options.colors)
    const messageOut = entry.message ? ` ${entry.message}` : ''
    const paramsOut = formatParametersPretty(
      sanitize(
        entry.resolvedError
          ? { ...entry.resolvedError, ...entry.parameters }
          : entry.parameters ?? {},
      ),
      this.options.colors,
    )

    return `${timeOut} ${levelOut}${serviceOut}${messageOut}${paramsOut}`
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
