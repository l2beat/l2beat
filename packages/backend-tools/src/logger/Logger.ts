/* eslint-disable @typescript-eslint/ban-types */
import { join } from 'path'

import { assertUnreachable } from '../utils/assertUnreachable'
import { LogEntry, LoggerOptions } from './interfaces'
import { LogFormatterJson } from './LogFormatterJson'
import { LogFormatterPretty } from './LogFormatterPretty'
import { LEVEL, LogLevel } from './LogLevel'
import { LogThrottle, LogThrottleOptions } from './LogThrottle'
import { parseLogArguments } from './parseLogArguments'
import { resolveError } from './resolveError'
import { tagService } from './tagService'

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
      utc: options.utc ?? false,
      cwd: options.cwd ?? process.cwd(),
      getTime: options.getTime ?? (() => new Date()),
      reportError: options.reportError ?? (() => {}),
      backends: options.backends ?? [
        {
          backend: console,
          formatter: new LogFormatterJson(),
        },
      ],
    }
    this.cwd = join(this.options.cwd, '/')
    this.logLevel = LEVEL[this.options.logLevel]
  }

  static SILENT = new Logger({ logLevel: 'NONE' })

  static CRITICAL = new Logger({
    logLevel: 'CRITICAL',
    backends: [
      {
        backend: console,
        formatter: new LogFormatterPretty(true, false),
      },
    ],
  })

  static ERROR = new Logger({
    logLevel: 'ERROR',
    backends: [
      {
        backend: console,
        formatter: new LogFormatterPretty(true, false),
      },
    ],
  })

  static WARN = new Logger({
    logLevel: 'WARN',
    backends: [
      {
        backend: console,
        formatter: new LogFormatterPretty(true, false),
      },
    ],
  })

  static INFO = new Logger({
    logLevel: 'INFO',
    backends: [
      {
        backend: console,
        formatter: new LogFormatterPretty(true, false),
      },
    ],
  })

  static DEBUG = new Logger({
    logLevel: 'DEBUG',
    backends: [
      {
        backend: console,
        formatter: new LogFormatterPretty(true, false),
      },
    ],
  })

  static TRACE = new Logger({
    logLevel: 'TRACE',
    backends: [
      {
        backend: console,
        formatter: new LogFormatterPretty(true, false),
      },
    ],
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
    this.options.backends.forEach((backendOptions) => {
      const output = backendOptions.formatter.format(entry)
      switch (entry.level) {
        case 'CRITICAL':
        case 'ERROR':
          backendOptions.backend.error(output)
          break
        case 'WARN':
          backendOptions.backend.warn(output)
          break
        case 'INFO':
          backendOptions.backend.log(output)
          break
        case 'DEBUG':
        case 'TRACE':
          backendOptions.backend.debug(output)
          break
        case 'NONE':
          break
        default:
          assertUnreachable(entry.level)
      }
    })
  }
}
