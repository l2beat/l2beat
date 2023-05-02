import { ContractOverrides } from '../config/DiscoveryOverrides'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { getSystemHandlers } from './getSystemHandlers'
import { ErrorHandler } from './system/ErrorHandler'
import { getUserHandler } from './user'

export function getHandlers(
  abi: string[],
  overrides: ContractOverrides | undefined,
  logger: DiscoveryLogger,
) {
  const systemHandlers = getSystemHandlers(abi, overrides, logger)
  const userHandlers = Object.entries(overrides?.fields ?? {}).map(
    ([field, definition]) => {
      try {
        return getUserHandler(field, definition, abi, logger)
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
