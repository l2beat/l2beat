import { ContractParameters } from '@l2beat/shared'

import { DiscoveryConfig } from '../../../../../../core/discovery/DiscoveryConfig'

export function getOverrides(
  config: DiscoveryConfig,
  contract: ContractParameters,
) {
  let overrides = undefined
  if (config.overrides?.[contract.address.toString()]) {
    if (config.overrides[contract.address.toString()].fields !== undefined) {
      const overridesObject =
        config.overrides[contract.address.toString()].fields
      //@ts-expect-error fix this type issue
      overrides = Object.keys(overridesObject)
    }
  }
  return overrides
}
