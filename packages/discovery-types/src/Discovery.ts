import { z } from 'zod'
import type { EthereumAddress } from './EthereumAddress'
import type { Hash256 } from './Hash256'

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

export interface DiscoveryOutput {
  name: string
  chain: string
  blockNumber: number
  contracts: ContractParameters[]
  eoas: EoaParameters[]
  abis: Record<string, string[]>
  configHash: Hash256
  sharedModules?: string[]
  usedTemplates: Record<string, Hash256>
}

export interface DiscoveryCustomType {
  typeCaster?: string
  arg?: Record<string, string | number>
}

export interface FieldMeta {
  description?: string
  severity?: ContractFieldSeverity
  type?: ContractValueType[] | ContractValueType
}

export type PermissionType =
  | 'guard'
  | 'challenge'
  | 'propose'
  | 'sequence'
  | 'validate'
  | 'operateLinea'
  | 'fastconfirm'
  | 'interact'
  | 'upgrade'
  | 'act'
  | 'validateZkStack'
  | 'validateBridge'
  | 'validateBridge2'
  | 'relay'
  | 'aggregatePolygon'

export interface ResolvedPermissionPath {
  address: EthereumAddress
  delay?: number
  condition?: string
}

export interface ResolvedPermissionDetails {
  permission: PermissionType
  delay?: number
  description?: string
  condition?: string
  via?: ResolvedPermissionPath[]
}

export type IssuedPermission = ResolvedPermissionDetails & {
  to: EthereumAddress
}
export type ReceivedPermission = ResolvedPermissionDetails & {
  from: EthereumAddress
}

export type ExternalReference = {
  text: string
  href: string
}

export interface Meta {
  issuedPermissions?: IssuedPermission[]
  receivedPermissions?: ReceivedPermission[]
  directlyReceivedPermissions?: ReceivedPermission[]
  categories?: StackCategory[]
  types?: ContractValueType[]
  description?: string
  severity?: ContractFieldSeverity
  references?: ExternalReference[]
}

export type EoaParameters = {
  name?: string
  address: EthereumAddress
} & Meta

export type ContractParameters = {
  name: string
  displayName?: string
  description?: string
  derivedName?: string
  template?: string
  sourceHashes?: string[]
  unverified?: true
  sinceTimestamp?: number
  address: EthereumAddress
  proxyType?: string
  values?: Record<string, ContractValue | undefined>
  errors?: Record<string, string>
  ignoreInWatchMode?: string[]
  usedTypes?: DiscoveryCustomType[]
  fieldMeta?: Record<string, FieldMeta>
} & Meta

export type ContractValue =
  | string
  | number
  | boolean
  | ContractValue[]
  | { [key: string]: ContractValue | undefined }
