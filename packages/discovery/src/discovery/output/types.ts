import type { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import type { Analysis } from '../analysis/AddressAnalyzer'
import type { ContractValueType } from '../config/ColorConfig'
import type { ImpactCategory, Permission } from '../config/PermissionConfig'
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
  /**
   * Project-scoped permission results for actors owned by a referenced
   * discovery. They are overlaid on the referenced entries when the project is
   * consumed, without mutating the dependency's own discovered.json.
   */
  externalPermissions?: Record<ChainSpecificAddress, PermissionEntry>
  permissionGroups?: ResolvedPermissionGroup[]
  externalPermissionGroups?: ResolvedPermissionGroup[]
  impactScenarios?: ResolvedImpactScenario[]
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
  permission?: Permission
  delay?: number
  description?: string
  role?: string
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

export interface ResolvedPermissionGroup {
  id: string
  name: string
  memberName: string
  threshold: number
  members: ChainSpecificAddress[]
  admin?: ChainSpecificAddress
  permission: ReceivedPermission
  isProjectScoped?: boolean
}

export type ResolvedImpactPrincipal =
  | {
      type: 'address'
      address: ChainSpecificAddress
    }
  | {
      type: 'group'
      key: string
      from: ChainSpecificAddress
      id: string
      name: string
    }

export interface ResolvedImpactSource {
  id: string
  capabilityId: string
  principal: string
  contract: ChainSpecificAddress
  effect: string
  dependencyName?: string
  capability?: string
  description?: string
  limitation?: string
}

export interface ResolvedImpactStep {
  ruleId: string
  /** Stable semantic origin shared by instances of the same template rule. */
  ruleDefinition: {
    template?: string
    id: string
  }
  contract: ChainSpecificAddress
  inputs: { address: ChainSpecificAddress; effect: string }[]
  output: string
  description?: string
  impact?: string
  categories?: ImpactCategory[]
  limitation?: string
  protection?: string
}

/**
 * A normalized proof tree. Human-readable source and rule metadata stays in
 * the scenario's `sources` and `steps` arrays and is referenced by id here.
 */
export type ResolvedImpactTrace =
  | {
      type: 'source'
      sourceId: string
    }
  | {
      type: 'rule'
      ruleId: string
      inputs: ResolvedImpactTrace[]
    }

export interface ResolvedImpactPath {
  terminal: { address: ChainSpecificAddress; effect: string }
  trace: ResolvedImpactTrace
}

export interface ResolvedImpactScenario {
  id: string
  principals: ResolvedImpactPrincipal[]
  sources: ResolvedImpactSource[]
  steps: ResolvedImpactStep[]
  terminals: { address: ChainSpecificAddress; effect: string }[]
  /** Exact derivation for every terminal, including conjunctive branches. */
  paths: ResolvedImpactPath[]
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
  type: Analysis['type']
  address: ChainSpecificAddress
  name?: string
  implementationNames?: Record<ChainSpecificAddress, string>
  template?: string
  sourceHashes?: (string | undefined)[]
  unverified?: true
  deployerAddress?: ChainSpecificAddress
  sinceTimestamp?: number
  sinceBlock?: number
  proxyType?: string
  values?: Record<string, ContractValue | undefined>
  errors?: Record<string, string>
  ignoreInWatchMode?: string[]
  ignoreInCoverage?: string[]
  usedTypes?: DiscoveryCustomType[]
  targetType?: Analysis['type']
  targetProject?: string
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
  eoaWithUpgradePermissions?: boolean
}

export type EntryParameters = StructureEntry & ColorEntry & PermissionEntry

export interface ColorOutput {
  entries: ColorEntry[]
}

export type PermissionsOutput = {
  eoasWithUpgradePermissions?: ChainSpecificAddress[]
  permissionsConfigHash: Hash256
  permissions: {
    receiver: ChainSpecificAddress
    permission: Permission
    from: ChainSpecificAddress
    delay?: number
    description?: string
    condition?: string
    via?: ResolvedPermissionPath[]
    isFinal: boolean
    role?: string
  }[]
  dependentTimestamps: DiscoveryTimestamps
  permissionGroups?: ResolvedPermissionGroup[]
  impactScenarios?: ResolvedImpactScenario[]
}
