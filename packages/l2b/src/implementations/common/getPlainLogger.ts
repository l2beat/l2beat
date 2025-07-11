import { LogFormatterPlain, Logger, type LogLevel } from '@l2beat/backend-tools'

export function getPlainLogger(level: LogLevel = 'INFO'): Logger {
  return Logger.INFO.configure({
    logLevel: level,
    transports: [{ transport: console, formatter: new LogFormatterPlain() }],
  })
}
