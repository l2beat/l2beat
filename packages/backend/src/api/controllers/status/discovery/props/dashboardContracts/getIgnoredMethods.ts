import { ContractParameters } from '@l2beat/shared'

import { DiscoveryConfig } from '../../../../../../core/discovery/DiscoveryConfig'
import { DashboardContractField } from '../utils/getValues'

export function getIgnoredMethods(
  contract: ContractParameters,
  config: DiscoveryConfig,
) {
  let ignoreMethods: DashboardContractField[] | undefined = undefined
  if (config.overrides?.[contract.address.toString()]) {
    const override = config.overrides[contract.address.toString()]
    if (override.ignoreMethods) {
      ignoreMethods = override.ignoreMethods.map((field) => {
        return {
          name: field,
        }
      })
    }
  }
  return ignoreMethods
}
