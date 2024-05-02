import { DiscoveryLogger } from '../DiscoveryLogger'
import { ContractOverrides } from '../config/DiscoveryOverrides'
import { Handler } from './Handler'
import { getSystemHandlers } from './getSystemHandlers'
import { ErrorHandler } from './system/ErrorHandler'
import { getUserHandler } from './user'

export function getHandlers(
  abi: string[],
  overrides: ContractOverrides | undefined,
  logger: DiscoveryLogger,
): (Handler | ErrorHandler)[] {
  const systemHandlers = getSystemHandlers(abi, overrides, logger)
  const userHandlers: (Handler | ErrorHandler)[] = []
  for (const [field, definition] of Object.entries(overrides?.fields ?? {})) {
    if (definition.handler !== undefined) {
      try {
        userHandlers.push(
          getUserHandler(field, definition.handler ?? {}, abi, logger),
        )
      } catch (error) {
        userHandlers.push(new ErrorHandler(field, error))
      }
    }
  }

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
