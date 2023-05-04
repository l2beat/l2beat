import { ContractParameters, DiscoveryOutput } from '@l2beat/shared'
import { ethers } from 'ethers'

import { DiscoveryConfig } from '../../../../../../core/discovery/config/DiscoveryConfig'
import { DashboardContractField, getValues } from '../utils/getValues'
import { getDescription } from './getDescription'
import { getFieldName } from './getFieldName'

export function getWatched(
  discovery: DiscoveryOutput,
  config: DiscoveryConfig,
  contract: ContractParameters,
  viewABI: ethers.utils.Interface,
) {
  const values =
    discovery.contracts.find((c) => c.address === contract.address)?.values ??
    undefined

  const ignoreInWatchMode = getIgnoreInWatchMode(config, contract)

  let watched: DashboardContractField[] | undefined = undefined
  if (values) {
    watched = Object.keys(values)
      .filter((key) => !ignoreInWatchMode.includes(key))
      .map((field) => {
        return {
          name: getFieldName(viewABI, field),
          values: getValues(discovery, contract, field),
          description: getDescription(config, contract.address, field),
        }
      })
  }
  return watched
}

function getIgnoreInWatchMode(
  config: DiscoveryConfig,
  contract: ContractParameters,
) {
  return config.overrides.get(contract.address).ignoreInWatchMode ?? []
}
