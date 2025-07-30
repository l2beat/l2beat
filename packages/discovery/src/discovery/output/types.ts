import type { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import type { ContractValueType } from '../config/ColorConfig'
import type { Permission } from '../config/PermissionConfig'
import type { ContractFieldSeverity } from '../config/StructureConfig'
import type { DiscoveryTimestamps } from '../modelling/modelPermissions'

export type ContractValue =
  | string
  | number
  | boolean
  | ContractValue[]
  | { [key: string]: ContractValue | undefined }

export interface StructureOutput {
  name: string
  chain: string
  blockNumber?: number
  timestamp: number
  entries: StructureEntry[]
  abis: Record<string, string[]>
  configHash: Hash256
  sharedModules?: string[]
  usedTemplates: Record<string, Hash256>
  usedBlockNumbers: Record<string, number>
}

export interface DiscoveryOutput {
  name: string
  chain: string
  blockNumber?: number
  timestamp: number
  entries: EntryParameters[]
  abis: Record<string, string[]>
  configHash: Hash256
  sharedModules?: string[]
  usedTemplates: Record<string, Hash256>
  usedBlockNumbers: Record<string, number>
  permissionsConfigHash?: Hash256
  dependentDiscoveries?: DiscoveryTimestamps
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
  address: ChainSpecificAddress
  delay?: number
  condition?: string
}

export interface ResolvedPermissionDetails {
  permission: Permission
  delay?: number
  description?: string
  role?: string
  condition?: string
  via?: ResolvedPermissionPath[]
}

export type ReceivedPermission = ResolvedPermissionDetails & {
  from: ChainSpecificAddress
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
  address: ChainSpecificAddress
  name?: string
  implementationNames?: Record<ChainSpecificAddress, string>
  template?: string
  sourceHashes?: (string | undefined)[]
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
  description?: string
  fieldMeta?: Record<string, FieldMeta>
  references?: ExternalReference[]
  category?: ContractCategory
}

export type PermissionEntry = {
  receivedPermissions?: ReceivedPermission[]
  directlyReceivedPermissions?: ReceivedPermission[]
  controlsMajorityOfUpgradePermissions?: boolean
}

export type EntryParameters = StructureEntry & ColorEntry & PermissionEntry

export interface ColorOutput {
  entries: ColorEntry[]
}

export type PermissionsOutput = {
  eoasWithMajorityUpgradePermissions?: ChainSpecificAddress[]
  permissionsConfigHash: Hash256
  permissions: {
    receiver: ChainSpecificAddress
    permission: Permission
    from: ChainSpecificAddress
    delay?: number
    description?: string
    condition?: string
    via?: {
      address: ChainSpecificAddress
      delay?: number
      condition?: string
    }[]
    isFinal: boolean
    role?: string
  }[]
  dependentTimestamps: DiscoveryTimestamps
}
