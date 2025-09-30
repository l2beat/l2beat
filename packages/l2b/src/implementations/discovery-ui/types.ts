// This file is duplicated in protocolbeat and l2b!

import type { ChainSpecificAddress } from '@l2beat/shared-pure'

export type ApiProjectsResponse = ApiProjectEntry[]

export interface ApiProjectEntry {
  name: string
  addresses: string[]
  contractNames: string[]
}

export interface ApiProjectResponse {
  entries: ApiProjectChain[]
}

export interface ApiPreviewResponse {
  permissionsPerChain: { chain: string; permissions: ApiPreviewPermissions }[]
  contractsPerChain: { chain: string; contracts: ApiPreviewContract[] }[]
}

export interface ApiPreviewPermissions {
  roles: ApiPreviewPermission[]
  actors: ApiPreviewPermission[]
}

export interface ApiPreviewPermission {
  addresses: AddressFieldValue[]
  name: string
  description: string
  multisigParticipants: AddressFieldValue[] | undefined
}

export interface ApiPreviewContract {
  addresses: AddressFieldValue[]
  name: string
  description: string
  upgradableBy: UpgradeabilityActor[] | undefined
}

export interface ApiProjectChain {
  project: string
  initialContracts: ApiProjectContract[]
  discoveredContracts: ApiProjectContract[]
  eoas: ApiAddressEntry[]
  blockNumbers: Record<string, number>
}

export type ApiAddressType =
  | 'EOA'
  | 'EOAPermissioned'
  | 'Unverified'
  | 'Token'
  | 'Multisig'
  | 'Diamond'
  | 'Timelock'
  | 'Contract'
  | 'Unknown'

export interface ApiAddressEntry {
  name?: string
  description?: string
  roles: string[]
  type: ApiAddressType
  referencedBy: ApiAddressReference[]
  address: ChainSpecificAddress
  chain: string
}

export interface ApiAddressReference extends AddressFieldValue {
  fieldNames: string[]
}

export interface Field {
  name: string
  value: FieldValue
  ignoreInWatchMode?: boolean
  ignoreRelatives?: boolean
  handler?: { type: string } & Record<string, unknown>
  description?: string
  severity?: 'HIGH' | 'LOW'
}

export type FieldValue =
  | AddressFieldValue
  | HexFieldValue
  | StringFieldValue
  | NumberFieldValue
  | BooleanFieldValue
  | ArrayFieldValue
  | ObjectFieldValue
  | UnknownFieldValue
  | ErrorFieldValue

export interface AddressFieldValue {
  type: 'address'
  name?: string
  addressType: ApiAddressType
  address: string
}

export interface HexFieldValue {
  type: 'hex'
  value: string
}

export interface StringFieldValue {
  type: 'string'
  value: string
}

export interface NumberFieldValue {
  type: 'number'
  value: string
}

export interface BooleanFieldValue {
  type: 'boolean'
  value: boolean
}

export interface ArrayFieldValue {
  type: 'array'
  values: FieldValue[]
}

export interface ObjectFieldValue {
  type: 'object'
  values: [FieldValue, FieldValue][]
}

export interface UnknownFieldValue {
  type: 'unknown'
  value: string
}

export interface ErrorFieldValue {
  type: 'error'
  error: string
}

export interface ApiProjectContract extends ApiAddressEntry {
  template?: {
    id: string
    shape?: {
      name: string
      hasCriteria: boolean
    }
  }
  proxyType?: string
  fields: Field[]
  abis: ApiAbi[]
  implementationNames?: Record<string, string>
}

export interface ApiAbi {
  address: string
  entries: ApiAbiEntry[]
}

export interface ApiAbiEntry {
  value: string
  signature?: string
  topic?: string
}

export interface ApiCodeResponse {
  entryName: string | undefined
  sources: { name: string; code: string }[]
}

export interface ApiCodeSearchResponse {
  matches: {
    name: string | undefined
    address: string
    codeLocation: {
      line: string
      fileName: string
      index: number
      offset: number
    }[]
  }[]
}

export interface UpgradeabilityActor {
  name: string
  delay: string
}

// Permission overrides types
export interface ApiPermissionOverridesResponse {
  version: string
  lastModified: string
  overrides: PermissionOverride[]
}

export interface PermissionOverride {
  contractAddress: string
  functionName: string
  userClassification: 'permissioned' | 'non-permissioned'
  checked?: boolean
  score?: 'unscored' | 'low-risk' | 'medium-risk' | 'high-risk'
  reason?: string
  description?: string
  timestamp: string
  // NEW: Multiple owner definitions using L2BEAT's existing handlers
  ownerDefinitions?: OwnerDefinition[]
  // Delay field reference
  delay?: {
    contractAddress: string
    fieldName: string
  }
}

// Owner definition types leveraging L2BEAT's CallHandler and AccessControlHandler
export interface OwnerDefinition {
  type: 'field' | 'role'

  // For 'field' type - uses L2BEAT's CallHandler pattern
  field?: {
    contractAddress: string
    method: string           // e.g., "owner", "admin", "governance"
    args?: any[]            // Optional arguments for function call
  }

  // For 'role' type - uses L2BEAT's AccessControlHandler pattern
  role?: {
    accessControlContract: string
    roleName: string        // e.g., "DEFAULT_ADMIN_ROLE", "PAUSER_ROLE"
    roleHash?: string       // Optional: explicit role hash
  }
}

export interface ApiPermissionOverridesUpdateRequest {
  contractAddress: string
  functionName: string
  userClassification?: 'permissioned' | 'non-permissioned'
  checked?: boolean
  score?: 'unscored' | 'low-risk' | 'medium-risk' | 'high-risk'
  reason?: string
  description?: string
  ownerDefinitions?: OwnerDefinition[]
  delay?: {
    contractAddress: string
    fieldName: string
  }
}

// Contract tags types
export interface ApiContractTagsResponse {
  version: string
  lastModified: string
  tags: ContractTag[]
}

export interface ContractTag {
  contractAddress: string
  isExternal: boolean
  timestamp: string
}

export interface ApiContractTagsUpdateRequest {
  contractAddress: string
  isExternal?: boolean
}
