import { z } from 'zod'
import { EthereumAddress } from './EthereumAddress'
import { Hash256 } from './Hash256'

export type StackRole = z.infer<typeof StackRole>
export const StackRole = z.enum([
  'Sequencer',
  'Proposer',
  'Challenger',
  'Guardian',
  'Validator',
])

export type Permission = z.infer<typeof Permission>
export const Permission = z.enum(['admin', 'owner'])
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

export interface Meta {
  descriptions?: string[]
  roles?: StackRole[]
  assignedPermissions?: Record<string, EthereumAddress[]>
}

export type EoaParameters = {
  address: EthereumAddress
} & Meta

export type ContractParameters = {
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
} & Meta

export type ContractValue =
  | string
  | EthereumAddress
  | number
  | boolean
  | ContractValue[]
  | { [key: string]: ContractValue | undefined }
