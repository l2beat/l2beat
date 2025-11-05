import { ConsoleTransport, Logger, type LogLevel } from '@l2beat/backend-tools'

export function getPlainLogger(level: LogLevel = 'INFO'): Logger {
  return Logger.INFO.configure({
    level,
    transports: [new ConsoleTransport((entry) => entry.message)],
  })
}
