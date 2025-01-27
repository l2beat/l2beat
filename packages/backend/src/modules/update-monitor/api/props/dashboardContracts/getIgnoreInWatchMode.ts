import type { DiscoveryConfig } from '@l2beat/discovery'
import type {
  ContractParameters,
  DiscoveryOutput,
} from '@l2beat/discovery-types'
import type { ethers } from 'ethers'

import { type DashboardContractField, getValues } from '../utils/getValues'
import { getDescription } from './getDescription'
import { getFieldName } from './getFieldName'

export function getIgnoreInWatchMode(
  discovery: DiscoveryOutput,
  config: DiscoveryConfig,
  contract: ContractParameters,
  viewABI: ethers.utils.Interface,
) {
  let ignoreInWatchMode: DashboardContractField[] | undefined = undefined
  if (contract.ignoreInWatchMode) {
    ignoreInWatchMode = contract.ignoreInWatchMode.map((field) => {
      return {
        name: getFieldName(viewABI, field),
        values: getValues(discovery, contract, field),
        description: getDescription(config, contract.address, field),
      }
    })
  }
  return ignoreInWatchMode
}
