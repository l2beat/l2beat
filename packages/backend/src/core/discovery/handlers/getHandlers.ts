import { DiscoveryContract } from '../DiscoveryConfig'
import { getSystemHandlers } from './getSystemHandlers'
import { ErrorHandler } from './system/ErrorHandler'
import { getUserHandler } from './user'

export function getHandlers(
  abi: string[],
  overrides: DiscoveryContract | undefined,
) {
  const systemHandlers = getSystemHandlers(abi, overrides)
  const userHandlers = Object.entries(overrides?.fields ?? {}).map(
    ([field, definition]) => {
      try {
        return getUserHandler(field, definition, abi)
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
