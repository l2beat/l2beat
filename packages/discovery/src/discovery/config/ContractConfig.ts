import type { EthereumAddress } from '@l2beat/shared-pure'
import { merge } from 'lodash'
import { type ColorConfig, ColorContract } from './ColorConfig'
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

export type ContractOverridesColor = ColorContract & {
  name?: string
}

export function evaluateConfigForEntry(
  config: ColorConfig,
  address: EthereumAddress,
  template: ColorContract,
): ContractOverridesColor {
  const name = (config.names ?? {})[address.toString()]
  const override =
    config.overrides?.[address.toString()] ?? ColorContract.parse({})

  const result = merge(
    {
      address,
      name,
      ...override,
      categories: merge(config.categories ?? {}, override.categories),
    },
    template,
  )

  return result
}
