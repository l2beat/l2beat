import { EthereumAddress } from './EthereumAddress'
import { Hash256 } from './Hash256'
import { UpgradeabilityParameters } from './proxyDetails'

export interface DiscoveryOutput {
  name: string
  chain: string
  blockNumber: number
  contracts: ContractParameters[]
  eoas: { address: EthereumAddress }[]
  abis: Record<string, string[]>
  configHash: Hash256
  version: number
}

export interface DiscoveryCustomType {
  typeCaster?: string | null
  arg?: Record<string, string | number> | null
  description?: string | null
  severity?: string | null
}

export interface ContractParameters {
  name: string
  derivedName?: string
  template?: string
  unverified?: true
  sinceTimestamp?: number
  address: EthereumAddress
  upgradeability: UpgradeabilityParameters
  implementations?: EthereumAddress[]
  values?: Record<string, ContractValue>
  errors?: Record<string, string>
  ignoreInWatchMode?: string[]
  usedTypes?: DiscoveryCustomType[]
}

export type ContractValue =
  | string
  | number
  | boolean
  | ContractValue[]
  | { [key: string]: ContractValue | undefined }
