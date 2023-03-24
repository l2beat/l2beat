import { ContractParameters, ProjectParameters } from '@l2beat/shared'
import { ethers } from 'ethers'

import { DiscoveryConfig } from '../../../../../../core/discovery/DiscoveryConfig'
import { DashboardContractField, getValues } from '../utils/getValues'
import { getFieldName } from './getFieldName'

export function getWatched(
  contract: ContractParameters,
  discovery: ProjectParameters,
  config: DiscoveryConfig,
  viewABI: ethers.utils.Interface,
) {
  const values =
    discovery.contracts.find((c) => c.address === contract.address)?.values ??
    undefined

  const ignoreInWatchMode = getIgnoreInWatchMode(contract, config)

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
          name: getFieldName(field, viewABI),
          values: getValues(discovery, contract, field),
        }
      })
  }
  return watched
}

function getIgnoreInWatchMode(
  contract: ContractParameters,
  config: DiscoveryConfig,
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
