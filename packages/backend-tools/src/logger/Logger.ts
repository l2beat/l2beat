import { assertUnreachable } from '@l2beat/shared-pure'
import { join } from 'path'
import { LogFormatterJson } from './LogFormatterJson'
import { LogFormatterPretty } from './LogFormatterPretty'
import { LEVEL, type LogLevel } from './LogLevel'
import { parseLogArguments } from './parseLogArguments'
import { resolveError } from './resolveError'
import { tagService } from './tagService'
import type { LogEntry, LoggerOptions } from './types'

/**
 * [Read full documentation](https://github.com/l2beat/tools/blob/master/packages/backend-tools/src/logger/docs.md)
 */
export class Logger {
  private readonly options: LoggerOptions
  private readonly logLevel: number
  private readonly cwd: string

  get metricsEnabled(): boolean {
    return this.options.metricsEnabled ?? false
  }

  constructor(options: Partial<LoggerOptions>) {
    this.options = {
      ...options,
      logLevel: options.logLevel ?? 'INFO',
      utc: options.utc ?? false,
      cwd: options.cwd ?? process.cwd(),
      getTime: options.getTime ?? (() => new Date()),
      reportError: options.reportError ?? (() => {}),
      transports: options.transports ?? [
        {
          transport: console,
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
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })

  static ERROR = new Logger({
    logLevel: 'ERROR',
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })

  static WARN = new Logger({
    logLevel: 'WARN',
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })

  static INFO = new Logger({
    logLevel: 'INFO',
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })

  static DEBUG = new Logger({
    logLevel: 'DEBUG',
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })

  static TRACE = new Logger({
    logLevel: 'TRACE',
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })

  configure(options: Partial<LoggerOptions>): Logger {
    const logger = new Logger({ ...this.options, ...options })
    return logger
  }

  // biome-ignore lint/complexity/noBannedTypes: generic type
  for(object: {} | string): Logger {
    const name = typeof object === 'string' ? object : object.constructor.name
    return this.configure({
      service: this.options.service ? `${this.options.service}.${name}` : name,
    })
  }

  tag(
    tags: Pick<
      LoggerOptions,
      'tag' | 'module' | 'feature' | 'chain' | 'project' | 'source'
    >,
  ): Logger {
    return this.configure(tags)
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

  metric(...args: unknown[]): void {
    if (this.options.metricsEnabled) {
      this.print(this.parseEntry('METRIC', args))
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
      feature: this.options.feature,
      module: this.options.module,
      chain: parsed.chain ?? this.options.chain,
      project: parsed.project ?? this.options.project,
      source: this.options.source,
    }
  }

  private print(entry: LogEntry): void {
    this.options.transports.forEach((transportOptions) => {
      const output = transportOptions.formatter.format(entry)
      switch (entry.level) {
        case 'CRITICAL':
        case 'ERROR':
          transportOptions.transport.error(output)
          break
        case 'WARN':
          transportOptions.transport.warn(output)
          break
        case 'INFO':
        case 'METRIC':
          transportOptions.transport.log(output)
          break
        case 'DEBUG':
        case 'TRACE':
          transportOptions.transport.debug(output)
          break
        case 'NONE':
          break
        default:
          assertUnreachable(entry.level)
      }
    })
  }
}
