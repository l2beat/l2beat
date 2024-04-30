import { LogLevel } from './LogLevel'
import { ResolvedError } from './resolveError'

export interface LoggerTransport {
  debug(message: string): void
  log(message: string): void
  warn(message: string): void
  error(message: string): void
}

export interface LogFormatter {
  format(entry: LogEntry): string
}

export interface LoggerTransportOptions {
  transport: LoggerTransport
  formatter: LogFormatter
}

export interface LoggerOptions {
  logLevel: LogLevel
  service?: string
  tag?: string
  utc: boolean
  cwd: string
  getTime: () => Date
  reportError: (entry: LogEntry) => void
  transports: LoggerTransportOptions[]
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
