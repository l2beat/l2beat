import type { DiscoveryCustomType } from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/shared-pure'
import { merge } from 'lodash'
import { DiscoveryContract } from './RawDiscoveryConfig'

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
): ContractConfig {
  const config = {
    ...overrides,
    types: merge(configTypes, overrides.types),
    pushValues: function (values: DiscoveryContract) {
      const newState = {
        name: this.name,
        address: this.address,
        ...DiscoveryContract.parse(merge({}, values, this)),
      }
      Object.assign(this, newState)
    },
  }
  return config
}
