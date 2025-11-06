import { ConsoleTransport, type Logger } from '@l2beat/backend-tools'

export function configureLogger(logger: Logger): Logger {
  return logger.configure({
    transports: [new ConsoleTransport((entry) => entry.message)],
  })
}
