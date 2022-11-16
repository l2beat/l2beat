import { EthereumAddress } from '@l2beat/types'

import { UpgradeabilityParameters } from './proxies/types'

export interface ProjectParameters {
  name: string
  blockNumber: number
  contracts: ContractParameters[]
}

export interface ContractParameters {
  name: string
  address: EthereumAddress
  upgradeability: UpgradeabilityParameters
  values?: Record<string, ContractValue>
}

export type ContractValue = string | number | boolean | ContractValue[]
