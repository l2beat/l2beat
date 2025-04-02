import type { EthereumAddress } from '@l2beat/shared-pure'
import { merge } from 'lodash'
import { ColorContract, type DiscoveryCategory } from './ColorConfig'
import {
  DiscoveryContract,
  type DiscoveryCustomType,
} from './RawDiscoveryConfig'

export type ContractOverrides = DiscoveryContract & {
  name?: string // TODO(radomski): This is required?
  address: EthereumAddress
}

export type ContractConfig = ContractOverrides & {
  pushValues: (arg: DiscoveryContract) => void
}

export type ContractOverridesColor = ColorContract & {
  name?: string
}

export type ContractConfigColor = ContractOverridesColor & {
  pushValues: (arg: ColorContract) => void
}

export function createContractConfig(
  overrides: ContractOverrides,
  configTypes: Record<string, DiscoveryCustomType>,
): ContractConfig {
  const config = {
    ...overrides,
    types: merge(configTypes, overrides.types),
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

export function createContractConfigColor(
  overrides: ContractOverridesColor,
  categories: Record<string, DiscoveryCategory>,
): ContractConfigColor {
  const config = {
    ...overrides,
    categories: merge(categories, overrides.categories),
    pushValues: function (values: ColorContract) {
      Object.assign(this, ColorContract.parse(merge({}, values, this)))
    },
  }

  return config
}
