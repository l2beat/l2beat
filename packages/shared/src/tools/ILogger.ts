import { json } from '../types'

export enum LogLevel {
  NONE = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
}

export interface LoggerOptions {
  logLevel: LogLevel
  service?: string
  format: 'pretty' | 'json'
  reportError?: (...args: unknown[]) => void
}

export type LoggerParameters = Record<string, json>

export interface ILogger {
  getLogLevel(): LogLevel
  configure(options: Partial<LoggerOptions>): ILogger
  for(service: object | string): ILogger
  error(error: unknown): void
  error(parameters: LoggerParameters, error: unknown): void
  error(...args: [unknown] | [LoggerParameters, unknown]): void
  warn(message: string | LoggerParameters, parameters?: LoggerParameters): void
  warn(parameters: LoggerParameters): void
  info(message: string | LoggerParameters, parameters?: LoggerParameters): void
  info(parameters: LoggerParameters): void
  debug(message: string | LoggerParameters, parameters?: LoggerParameters): void
  debug(parameters: LoggerParameters): void
}
