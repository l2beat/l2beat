import { ConsoleTransport, Logger, type LogLevel } from '@l2beat/backend-tools'

export function getPlainLogger(level: LogLevel = 'INFO'): Logger {
  return Logger.INFO.configure({
    level,
    transports: [
      new ConsoleTransport(
        (
          _time: Date,
          _level: LogLevel,
          message: string,
          _parameters: Record<string, unknown>,
        ) => {
          return message
        },
      ),
    ],
  })
}
