
import { DiscoveryContract } from '../DiscoveryConfig'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { getSystemHandlers } from './getSystemHandlers'
import { ErrorHandler } from './system/ErrorHandler'
import { getUserHandler } from './user'

export function getHandlers(
  abi: string[],
  overrides: DiscoveryContract | undefined,
  discoveryLogger: DiscoveryLogger,
) {
  const systemHandlers = getSystemHandlers(abi, overrides, discoveryLogger)
  const userHandlers = Object.entries(overrides?.fields ?? {}).map(
    ([field, definition]) => {
      try {
        return getUserHandler(field, definition, abi, discoveryLogger)
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
