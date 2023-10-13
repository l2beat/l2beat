import { EthereumAddress } from './EthereumAddress'
import { Hash256 } from './Hash256'
import { UpgradeabilityParameters } from './proxyDetails'

export interface DiscoveryOutput {
  name: string
  chain: string
  blockNumber: number
  contracts: ContractParameters[]
  eoas: EthereumAddress[]
  abis: Record<string, string[]>
  configHash: Hash256
  version: number
}

export interface ContractParameters {
  name: string
  derivedName?: string
  unverified?: true
  sinceTimestamp?: number
  address: EthereumAddress
  upgradeability: UpgradeabilityParameters
  implementations?: EthereumAddress[]
  values?: Record<string, ContractValue>
  errors?: Record<string, string>
}

export type ContractValue =
  | string
  | number
  | boolean
  | ContractValue[]
  | { [key: string]: ContractValue | undefined }
