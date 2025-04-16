import type { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import type { ContractValueType } from '../config/ColorConfig'
import type {
  ContractFieldSeverity,
  Permission,
} from '../config/StructureConfig'
import type { ParsedTransitivePermissionFact } from '../modelling/modelPermissions'

export type ContractValue =
  | string
  | number
  | boolean
  | ContractValue[]
  | { [key: string]: ContractValue | undefined }

export interface StructureOutput {
  name: string
  chain: string
  blockNumber: number
  entries: StructureEntry[]
  abis: Record<string, string[]>
  configHash: Hash256
  sharedModules?: string[]
  usedTemplates: Record<string, Hash256>
}

export interface DiscoveryOutput {
  name: string
  chain: string
  blockNumber: number
  entries: EntryParameters[]
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

export type ReceivedPermission = ResolvedPermissionDetails & {
  from: EthereumAddress
}

export type ExternalReference = {
  text: string
  href: string
}

export interface ContractCategory {
  name: string
  priority: number
}

export type StructureEntry = {
  type: 'Contract' | 'EOA'
  address: EthereumAddress
  derivedName?: string
  template?: string
  sourceHashes?: string[]
  unverified?: true
  sinceTimestamp?: number
  sinceBlock?: number
  proxyType?: string
  values?: Record<string, ContractValue | undefined>
  errors?: Record<string, string>
  ignoreInWatchMode?: string[]
  usedTypes?: DiscoveryCustomType[]
}

export type ColorEntry = {
  name?: string
  displayName?: string
  description?: string
  fieldMeta?: Record<string, FieldMeta>
  receivedPermissions?: ReceivedPermission[]
  permissions?: ParsedTransitivePermissionFact[]
  directlyReceivedPermissions?: ReceivedPermission[]
  references?: ExternalReference[]
  category?: ContractCategory
}

export type EntryParameters = StructureEntry & ColorEntry

export interface ColorOutput {
  entries: ColorEntry[]
}
