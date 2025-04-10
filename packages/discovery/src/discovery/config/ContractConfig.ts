import type { EthereumAddress } from '@l2beat/shared-pure'
import { merge } from 'lodash'
import { type DiscoveryCustomType, StructureContract } from './StructureConfig'

export type ContractOverrides = StructureContract & {
  name?: string // TODO(radomski): This is required?
  address: EthereumAddress
}

export type ContractConfig = ContractOverrides & {
  pushValues: (arg: StructureContract) => void
}

export function createContractConfig(
  overrides: ContractOverrides,
  configTypes: Record<string, DiscoveryCustomType>,
): ContractConfig {
  const config = {
    ...overrides,
    types: merge(configTypes, overrides.types),
    pushValues: function (values: StructureContract) {
      const newState = {
        // root names > display names
        name: this.name ?? values.displayName ?? this.displayName,
        address: this.address,
        ...StructureContract.parse(merge({}, values, this)),
      }
      Object.assign(this, newState)
    },
  }
  return config
}
