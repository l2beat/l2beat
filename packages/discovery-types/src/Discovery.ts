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

export type StackCategory = z.infer<typeof StackCategory>
export const StackCategory = z.enum([
  'Core',
  'Gateways&Escrows',
  'Upgrades&Governance',
])

export type ContractValueType = z.infer<typeof ContractValueType>
export const ContractValueType = z.enum([
  'CODE_CHANGE',
  'L2',
  'EXTERNAL',
  'RISK_PARAMETER',
  'PERMISSION',
])

export type ContractFieldSeverity = z.infer<typeof ContractFieldSeverity>
export const ContractFieldSeverity = z.enum(['HIGH', 'MEDIUM', 'LOW'])

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
  usedTemplates?: Record<string, Hash256>
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
  categories?: StackCategory[]
  types?: ContractValueType[]
  severity?: ContractFieldSeverity
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
