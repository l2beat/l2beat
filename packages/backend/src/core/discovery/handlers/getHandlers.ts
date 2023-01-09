import { DiscoveryContract } from '../DiscoveryConfig'
import { getSystemHandlers } from './getSystemHandlers'
import { LogHandler } from './LogHandler'
import { ErrorHandler } from './system/ErrorHandler'
import { getUserHandler } from './user'

export function getHandlers(
  abi: string[],
  overrides: DiscoveryContract | undefined,
  showLogs = false,
) {
  const logHandler = new LogHandler({ enabled: showLogs })
  const systemHandlers = getSystemHandlers(abi, overrides, logHandler)
  const userHandlers = Object.entries(overrides?.fields ?? {}).map(
    ([field, definition]) => {
      try {
        return getUserHandler(field, definition, abi, logHandler)
      } catch (error) {
        return new ErrorHandler(field, error)
      }
    },
  )

  const handlers = userHandlers
    .concat(systemHandlers)
    .filter(
      // only keep first occurrences of a field name
      (handler, i, handlers) =>
        handlers.findIndex((h) => h.field === handler.field) === i,
    )
    .sort((a, b) => a.field.localeCompare(b.field))

  return handlers
}
