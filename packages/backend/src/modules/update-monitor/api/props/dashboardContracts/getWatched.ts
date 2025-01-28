import type { DiscoveryConfig } from '@l2beat/discovery'
import type {
  ContractParameters,
  DiscoveryOutput,
} from '@l2beat/discovery-types'
import type { ethers } from 'ethers'

import { type DashboardContractField, getValues } from '../utils/getValues'
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

  const ignoreInWatchMode = contract.ignoreInWatchMode ?? []

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
