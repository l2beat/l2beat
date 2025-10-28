import { ConsoleTransport } from './ConsoleTransport'
import type { LoggerTransport, LogLevel } from './types'
import { resolveError } from './utils'

const RANK = {
  CRITICAL: 1,
  ERROR: 2,
  WARN: 3,
  INFO: 4,
  DEBUG: 5,
  TRACE: 6,
  NONE: 100,
}

export interface LoggerOptions {
  level: LogLevel | 'NONE'
  transports: LoggerTransport[]
  getTime: () => Date
  cwd: string
}

/**
 * [Read full documentation](https://github.com/l2beat/tools/blob/master/packages/backend-tools/src/logger/docs.md)
 */
export class Logger {
  readonly options: LoggerOptions
  readonly tags: Record<string, unknown>

  static SILENT = new Logger({ level: 'NONE' })
  static CRITICAL = new Logger({ level: 'CRITICAL' })
  static ERROR = new Logger({ level: 'ERROR' })
  static WARN = new Logger({ level: 'WARN' })
  static INFO = new Logger({ level: 'INFO' })
  static DEBUG = new Logger({ level: 'DEBUG' })
  static TRACE = new Logger({ level: 'TRACE' })

  critical = this.log.bind(this, 'CRITICAL')
  error = this.log.bind(this, 'ERROR')
  warn = this.log.bind(this, 'WARN')
  info = this.log.bind(this, 'INFO')
  debug = this.log.bind(this, 'DEBUG')
  trace = this.log.bind(this, 'TRACE')

  constructor(options: Partial<LoggerOptions>, tags?: Record<string, unknown>) {
    this.options = {
      level: options.level ?? 'INFO',
      transports: options.transports ?? [ConsoleTransport.PRETTY],
      getTime: () => new Date(),
      cwd: options.cwd ?? process.cwd(),
    }
    this.tags = tags ?? {}
  }

  configure(options: Partial<LoggerOptions>) {
    return new Logger({ ...this.options, ...options }, this.tags)
  }

  tag(tags: Record<string, unknown>) {
    return new Logger(this.options, { ...this.tags, ...tags })
  }

  // biome-ignore lint/complexity/noBannedTypes: generic type
  for(object: {} | string): Logger {
    const name = typeof object === 'string' ? object : object.constructor.name
    return this.tag({
      service: this.tags.service ? `${this.tags.service}.${name}` : name,
    })
  }

  log(level: LogLevel, ...args: unknown[]) {
    if (RANK[this.options.level] < RANK[level]) return
    const time = this.options.getTime()
    const { message, parameters } = resolveArgs(args, this.options.cwd)
    const combinedParameters = { ...this.tags, ...parameters }
    for (const transport of this.options.transports) {
      try {
        transport.log(time, level, message, combinedParameters)
      } catch {}
    }
  }

  flush() {
    for (const transport of this.options.transports) {
      try {
        transport.flush()
      } catch {}
    }
  }
}

function resolveArgs(
  args: unknown[],
  cwd: string,
): {
  message: string
  parameters: Record<string, unknown>
} {
  let message: string | undefined
  const values: unknown[] = []
  let parameters: Record<string, unknown> = {}

  for (const arg of args) {
    if (typeof arg === 'string') {
      if (message === undefined) {
        message = arg
      } else {
        values.push(arg)
      }
    } else if (arg instanceof Error) {
      if (!parameters.error) {
        parameters.error = arg
      } else {
        values.push(arg)
      }
    } else if (typeof arg !== 'object' || arg === null || Array.isArray(arg)) {
      values.push(arg)
    } else {
      parameters = { ...parameters, ...arg }
    }
  }

  // place values in parameters
  if (values.length === 1) {
    parameters = { value: values[0], ...parameters }
  } else if (values.length > 1) {
    parameters = { values, ...parameters }
  }

  // optionally extract message from parameters
  if (message === undefined && typeof parameters.message === 'string') {
    message = parameters.message
    // biome-ignore lint/performance/noDelete: desired behaviour
    delete parameters.message
  }

  // transform error
  if (parameters.error instanceof Error) {
    parameters.error = resolveError(parameters.error, cwd)
  }

  return { message: message ?? '', parameters }
}
