import { ContractParameters, ProjectParameters } from '@l2beat/shared'

import { DiscoveryConfig } from '../../../../../../core/discovery/DiscoveryConfig'
import { DashboardContractField, getValues } from '../utils/getValues'

export function getIgnoreInWatchMode(
  contract: ContractParameters,
  discovery: ProjectParameters,
  config: DiscoveryConfig,
) {
  let ignoreInWatchMode: DashboardContractField[] | undefined = undefined
  if (config.overrides?.[contract.address.toString()]) {
    const override = config.overrides[contract.address.toString()]
    if (override.ignoreInWatchMode) {
      ignoreInWatchMode = override.ignoreInWatchMode.map((field) => {
        return {
          name: field,
          values: getValues(discovery, contract, field),
        }
      })
    }
  }
  return ignoreInWatchMode
}
