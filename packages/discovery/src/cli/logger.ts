import {
  ConsoleTransport,
  type Logger,
  type LogLevel,
} from '@l2beat/backend-tools'

export function configureLogger(logger: Logger): Logger {
  return logger.configure({
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
