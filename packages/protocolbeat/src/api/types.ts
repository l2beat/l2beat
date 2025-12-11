// This file is duplicated in protocolbeat and l2b!

import type { ChainSpecificAddress } from '@l2beat/shared-pure'

// Severity scoring type aliases
export type Impact = 'low' | 'medium' | 'high' | 'critical'
export type Likelihood = 'mitigated' | 'low' | 'medium' | 'high'
export type Severity = 'informational' | 'low' | 'medium' | 'high' | 'critical'

// Function detail for severity scoring breakdown
export interface FunctionDetail {
  contractAddress: string
  contractName: string
  functionName: string
  impact: Impact
  likelihood: Likelihood
  severity: Severity
  grade: LetterGrade
}

// Dependency detail for dependency scoring breakdown
export interface DependencyDetail {
  dependencyAddress: string
  dependencyName: string
  likelihood: Likelihood
  functions: {
    contractAddress: string
    contractName: string
    functionName: string
    impact: Impact
    grade: LetterGrade
  }[]
}

// Admin detail for admin scoring breakdown
export interface AdminDetail {
  adminAddress: string
  adminName: string
  adminType: ApiAddressType
  likelihood?: Likelihood
  functions: {
    contractAddress: string
    contractName: string
    functionName: string
    impact: Impact
    grade?: LetterGrade  // Only present if both impact and likelihood exist
  }[]
}

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

// Functions types
export interface ApiFunctionsResponse {
  version: string
  lastModified: string
  contracts: Record<string, ContractFunctions>
}

export interface ContractFunctions {
  functions: FunctionEntry[]
}

export interface FunctionEntry {
  functionName: string
  isPermissioned: boolean
  checked?: boolean
  score?: 'unscored' | 'low-risk' | 'medium-risk' | 'high-risk' | 'critical'
  likelihood?: Likelihood
  reason?: string
  description?: string
  constraints?: string
  timestamp: string
  // Multiple owner definitions using L2BEAT's existing handlers
  ownerDefinitions?: OwnerDefinition[]
  // Delay field reference
  delay?: {
    contractAddress: string
    fieldName: string
  }
  // External contract dependencies
  dependencies?: {
    contractAddress: string
  }[]
}

// Owner definition types - unified path expression approach
// Path format: <contractRef>.<valuePath>
// - <contractRef>: $self (current contract), @fieldName (follow address field), or eth:0xAddress (absolute address)
// - <valuePath>: JSONPath-like navigation in contract.values (e.g., owner, signers[0], accessControl.ADMIN.members)
// Examples:
//   "$self.owner" - owner field in current contract
//   "@governor.accessControl.PAUSER_ROLE.members" - follow governor field, get role members
//   "eth:0x123...acl.permissions[eth:0x456][ROLE].entities" - absolute address for complex structures
//   "$self" - current contract itself is the owner (shorthand for no value path)
export interface OwnerDefinition {
  path: string              // Unified path expression
}

export interface ApiFunctionsUpdateRequest {
  contractAddress: string
  functionName: string
  isPermissioned?: boolean
  checked?: boolean
  score?: 'unscored' | 'low-risk' | 'medium-risk' | 'high-risk' | 'critical'
  likelihood?: Likelihood
  reason?: string
  description?: string
  constraints?: string
  ownerDefinitions?: OwnerDefinition[]
  delay?: {
    contractAddress: string
    fieldName: string
  }
  dependencies?: {
    contractAddress: string
  }[]
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
  centralization?: 'high' | 'medium' | 'low' | 'immutable'
  likelihood?: Likelihood
  fetchBalances?: boolean
  fetchPositions?: boolean
  timestamp: string
}

export interface ApiContractTagsUpdateRequest {
  contractAddress: string
  isExternal?: boolean
  centralization?: 'high' | 'medium' | 'low' | 'immutable'
  likelihood?: Likelihood
  fetchBalances?: boolean
  fetchPositions?: boolean
}

// V2 Scoring types
export type LetterGrade = 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'CC' | 'C' | 'D' | 'Unscored'

export interface ModuleScore {
  grade: LetterGrade
  inventory: number
}

export interface FunctionModuleScore extends ModuleScore {
  breakdown?: Record<LetterGrade, FunctionDetail[]>
  unscoredCount?: number
}

export interface DependencyModuleScore extends ModuleScore {
  breakdown?: DependencyDetail[]
}

export interface AdminModuleScore extends ModuleScore {
  breakdown?: AdminDetail[]
}

export interface ApiV2ScoreResponse {
  inventory: {
    contracts: ModuleScore
    functions: FunctionModuleScore
    dependencies: DependencyModuleScore
    admins: AdminModuleScore
  }
  finalScore: LetterGrade
}

// Funds data types
export interface ApiFundsDataResponse {
  version: string
  lastModified: string
  contracts: Record<string, ContractFundsData>
}

export interface ContractFundsData {
  balances?: {
    tokens: FundsTokenBalance[]
    totalUsdValue: number
    timestamp: string
    source: string
  }
  positions?: {
    protocols: FundsPositionProtocol[]
    totalUsdValue: number
    timestamp: string
    source: string
  }
  lastFetched: string
  error?: string
}

export interface FundsTokenBalance {
  assetAddress: string
  symbol: string
  name: string
  balance: string
  decimals: number
  usdValue: number
}

export interface FundsPositionProtocol {
  id: string
  name: string
  chain: string
  logoUrl?: string
  items: FundsPositionItem[]
  totalUsdValue: number
}

export interface FundsPositionItem {
  name?: string
  stats: {
    assetUsdValue: number
    debtUsdValue: number
    netUsdValue: number
  }
  tokens: FundsPositionToken[]
}

export interface FundsPositionToken {
  symbol: string
  name: string
  amount: number
  price: number
}
