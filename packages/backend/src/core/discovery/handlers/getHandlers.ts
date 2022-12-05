import { DiscoveryContract } from '../DiscoveryConfig'
import { getSystemHandlers } from './getSystemHandlers'
import { getUserHandler } from './getUserHandler'

export function getHandlers(
  abi: string[],
  overrides: DiscoveryContract | undefined,
) {
  const systemHandlers = getSystemHandlers(abi, overrides)
  const userHandlers = Object.entries(overrides?.fields ?? {}).map(
    ([field, definition]) => getUserHandler(field, definition),
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
