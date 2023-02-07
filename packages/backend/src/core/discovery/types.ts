import { EthereumAddress, Hash256 } from '@l2beat/shared'

import { UpgradeabilityParameters } from './proxies/types'

export interface ProjectParameters {
  name: string
  blockNumber: number
  configHash: Hash256
  contracts: ContractParameters[]
  eoas: EthereumAddress[]
  abis: Record<string, string[]>
}

export interface ContractParameters {
  name: string
  unverified?: true
  address: EthereumAddress
  code?: string
  upgradeability: UpgradeabilityParameters
  values?: Record<string, ContractValue>
  errors?: Record<string, string>
}

export type ContractValue =
  | string
  | number
  | boolean
  | ContractValue[]
  | { [key: string]: ContractValue }
