import { LogFormatterPlain, Logger } from '@l2beat/backend-tools'

export function getPlainLogger(): Logger {
  return Logger.INFO.configure({
    transports: [{ transport: console, formatter: new LogFormatterPlain() }],
  })
}
