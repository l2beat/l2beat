import { EthereumAddress } from './EthereumAddress'
import { Hash256 } from './Hash256'

export interface DiscoveryOutput {
  name: string
  chain: string
  blockNumber: number
  contracts: ContractParameters[]
  eoas: EoaParameters[]
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

export interface EoaParameters {
  address: EthereumAddress
  roles?: string[]
}

export interface ContractParameters {
  name: string
  displayName?: string
  descriptions?: string[]
  derivedName?: string
  template?: string
  unverified?: true
  sinceTimestamp?: number
  address: EthereumAddress
  proxyType?: string
  values?: Record<string, ContractValue | undefined>
  errors?: Record<string, string>
  ignoreInWatchMode?: string[]
  usedTypes?: DiscoveryCustomType[]
  roles?: string[]
  categories?: string[]
  types?: string[]
  severity?: 'HIGH' | 'MEDIUM' | 'LOW'
  assignedPermissions?: Record<string, EthereumAddress[]>
}

export type ContractValue =
  | string
  | EthereumAddress
  | number
  | boolean
  | ContractValue[]
  | { [key: string]: ContractValue | undefined }
