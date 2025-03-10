import type { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import type {
  ContractFieldSeverity,
  ContractValueType,
  Permission,
} from '../config/RawDiscoveryConfig'

export type ContractValue =
  | string
  | number
  | boolean
  | ContractValue[]
  | { [key: string]: ContractValue | undefined }

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

export interface ResolvedPermissionPath {
  address: EthereumAddress
  delay?: number
  condition?: string
}

export interface ResolvedPermissionDetails {
  permission: Permission
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
  types?: ContractValueType[]
  description?: string
  severity?: ContractFieldSeverity
  references?: ExternalReference[]
  category?: ContractCategory
}

export type EoaParameters = {
  name?: string
  address: EthereumAddress
} & Meta

export interface ContractCategory {
  name: string
  priority: number
}

export type ContractParameters = {
  name: string
  displayName?: string
  description?: string
  derivedName?: string
  template?: string
  sourceHashes?: string[]
  unverified?: true
  sinceTimestamp?: number
  sinceBlock?: number
  address: EthereumAddress
  proxyType?: string
  values?: Record<string, ContractValue | undefined>
  errors?: Record<string, string>
  ignoreInWatchMode?: string[]
  usedTypes?: DiscoveryCustomType[]
  fieldMeta?: Record<string, FieldMeta>
} & Meta
