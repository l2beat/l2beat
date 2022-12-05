import { EthereumAddress } from '@l2beat/types'

import { DiscoveryConfig } from '../DiscoveryConfig'
import { ContractMetadata } from '../getMetadata'
import { getSystemHandlers } from './getSystemHandlers'
import { getUserHandler } from './getUserHandler'

export function getHandlers(
  metadata: ContractMetadata,
  address: EthereumAddress,
  config: DiscoveryConfig,
) {
  const systemHandlers = getSystemHandlers(metadata.abi, address, config)
  const fields = config.overrides?.[address.toString()].fields
  const userHandlers = Object.entries(fields ?? {}).map(([field, definition]) =>
    getUserHandler(field, definition),
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
