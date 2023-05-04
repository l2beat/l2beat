import { ContractParameters, DiscoveryOutput } from '@l2beat/shared'
import { ethers } from 'ethers'

import { DiscoveryConfig } from '../../../../../../core/discovery/config/DiscoveryConfig'
import { DashboardContractField, getValues } from '../utils/getValues'
import { getDescription } from './getDescription'
import { getFieldName } from './getFieldName'

export function getIgnoreInWatchMode(
  discovery: DiscoveryOutput,
  config: DiscoveryConfig,
  contract: ContractParameters,
  viewABI: ethers.utils.Interface,
) {
  let ignoreInWatchMode: DashboardContractField[] | undefined = undefined
  const override = config.overrides.get(contract.address)
  if (override.ignoreInWatchMode) {
    ignoreInWatchMode = override.ignoreInWatchMode.map((field) => {
      return {
        name: getFieldName(viewABI, field),
        values: getValues(discovery, contract, field),
        description: getDescription(config, contract.address, field),
      }
    })
  }
  return ignoreInWatchMode
}
