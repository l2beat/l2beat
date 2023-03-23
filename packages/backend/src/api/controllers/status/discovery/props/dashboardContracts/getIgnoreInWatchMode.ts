import { ContractParameters, ProjectParameters } from '@l2beat/shared'
import { ethers } from 'ethers'

import { DiscoveryConfig } from '../../../../../../core/discovery/DiscoveryConfig'
import { DashboardContractField, getValues } from '../utils/getValues'
import { getFieldName } from './getFieldName'

export function getIgnoreInWatchMode(
  contract: ContractParameters,
  discovery: ProjectParameters,
  config: DiscoveryConfig,
  viewABI: ethers.utils.Interface,
) {
  let ignoreInWatchMode: DashboardContractField[] | undefined = undefined
  if (config.overrides?.[contract.address.toString()]) {
    const override = config.overrides[contract.address.toString()]
    if (override.ignoreInWatchMode) {
      ignoreInWatchMode = override.ignoreInWatchMode.map((field) => {
        return {
          name: getFieldName(field, viewABI),
          values: getValues(discovery, contract, field),
        }
      })
    }
  }
  return ignoreInWatchMode
}
