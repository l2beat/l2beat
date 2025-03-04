import type { EthereumAddress } from '@l2beat/shared-pure'
import { merge } from 'lodash'
import {
  type DiscoveryCategory,
  DiscoveryContract,
  type DiscoveryCustomType,
} from './RawDiscoveryConfig'

export type ContractOverrides = DiscoveryContract & {
  name?: string
  address: EthereumAddress
}

export type ContractConfig = ContractOverrides & {
  pushValues: (arg: DiscoveryContract) => void
}

export function createContractConfig(
  overrides: ContractOverrides,
  configTypes: Record<string, DiscoveryCustomType>,
  categories: Record<string, DiscoveryCategory>,
): ContractConfig {
  const config = {
    ...overrides,
    types: merge(configTypes, overrides.types),
    categories: merge(categories, overrides.categories),
    pushValues: function (values: DiscoveryContract) {
      const newState = {
        // root names > display names
        name: this.name ?? values.displayName ?? this.displayName,
        address: this.address,
        ...DiscoveryContract.parse(merge({}, values, this)),
      }
      Object.assign(this, newState)
    },
  }
  return config
}
