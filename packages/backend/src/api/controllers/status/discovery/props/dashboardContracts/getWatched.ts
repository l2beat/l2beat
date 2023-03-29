import { ContractParameters, ProjectParameters } from '@l2beat/shared'
import { ethers } from 'ethers'

import { DiscoveryConfig } from '../../../../../../core/discovery/DiscoveryConfig'
import { DashboardContractField, getValues } from '../utils/getValues'
import { getDescription } from './getDescription'
import { getFieldName } from './getFieldName'

export function getWatched(
  discovery: ProjectParameters,
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
      .filter((key) => {
        if (ignoreInWatchMode === undefined) {
          return true
        }
        return !ignoreInWatchMode.includes(key)
      })
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
  if (
    !config.overrides ||
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    !config.overrides[contract.address.toString()] ||
    !config.overrides[contract.address.toString()].ignoreInWatchMode
  ) {
    return []
  }

  return config.overrides[contract.address.toString()].ignoreInWatchMode
}
