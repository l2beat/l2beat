import { ContractParameters, ProjectParameters } from '@l2beat/shared'
import { ethers } from 'ethers'

import { getContractOverrides } from '../../../../../../core/discovery/discover'
import { DiscoveryConfig } from '../../../../../../core/discovery/DiscoveryConfig'
import { DashboardContractField, getValues } from '../utils/getValues'
import { getDescription } from './getDescription'
import { getFieldName } from './getFieldName'

export function getIgnoreInWatchMode(
  discovery: ProjectParameters,
  config: DiscoveryConfig,
  contract: ContractParameters,
  viewABI: ethers.utils.Interface,
) {
  let ignoreInWatchMode: DashboardContractField[] | undefined = undefined
  const override = getContractOverrides(contract.address, config)
  if (override) {
    if (override.ignoreInWatchMode) {
      ignoreInWatchMode = override.ignoreInWatchMode.map((field) => {
        return {
          name: getFieldName(viewABI, field),
          values: getValues(discovery, contract, field),
          description: getDescription(config, contract.address, field),
        }
      })
    }
  }
  return ignoreInWatchMode
}
