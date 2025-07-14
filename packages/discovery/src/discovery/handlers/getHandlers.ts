import type { StructureContractConfig } from '../config/structureUtils'
import { getSystemHandlers } from './getSystemHandlers'
import type { Handler } from './Handler'
import { ErrorHandler } from './system/ErrorHandler'
import { getUserHandler } from './user'

export function getHandlers(
  abi: string[],
  config: StructureContractConfig,
): (Handler | ErrorHandler)[] {
  const systemHandlers = getSystemHandlers(abi, config)
  const userHandlers: (Handler | ErrorHandler)[] = []
  for (const [field, definition] of Object.entries(config.fields)) {
    if (definition.handler !== undefined) {
      try {
        userHandlers.push(getUserHandler(field, definition.handler ?? {}, abi))
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
