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
    grade?: LetterGrade // Only present if both impact and likelihood exist
  }[]
}

// ============================================================================
// Capital Analysis Types (Cross-analysis: Admin → Call Graph → Funds)
// ============================================================================

// A contract reachable via call graph traversal
export interface ReachableContract {
  contractAddress: string
  contractName: string
  // True if this contract is ONLY reachable via view/pure calls
  viewOnlyPath: boolean
  // Functions that are called on this contract
  calledFunctions: string[]
  // Funds in this contract (from funds-data.json)
  fundsUsd: number
  // Whether funds are counted (true if at least one called function has impact != unscored)
  fundsAtRisk: boolean
}

// Capital analysis for a single permissioned function
export interface FunctionCapitalAnalysis {
  contractAddress: string
  contractName: string
  functionName: string
  impact: Impact
  // Direct funds in the contract containing this function
  directFundsUsd: number
  // Contracts reachable via call graph from this function
  reachableContracts: ReachableContract[]
  // Total funds in reachable contracts
  totalReachableFundsUsd: number
  // Number of external calls that couldn't be resolved
  unresolvedCallsCount: number
}

// Extended admin detail with capital analysis
export interface AdminDetailWithCapital extends AdminDetail {
  // Per-function capital analysis (only for functions with call graph data)
  functionsWithCapital: FunctionCapitalAnalysis[]
  // Sum of funds in contracts where this admin has direct permissions
  totalDirectCapital: number
  // Sum of funds in all reachable contracts (deduplicated across functions)
  totalReachableCapital: number
  // Number of unique contracts this admin can affect
  uniqueContractsAffected: number
}

// Result of call graph traversal from a starting function
export interface CallGraphTraversalResult {
  // Contracts reachable from the starting function
  reachableContracts: Map<
    string,
    {
      contractName?: string
      // True if ALL paths to this contract are view-only
      viewOnlyPath: boolean
      // Functions that are called on this contract (from the call graph)
      calledFunctions: Set<string>
    }
  >
  // External calls that couldn't be resolved (no resolvedAddress)
  unresolvedCalls: {
    storageVariable: string
    interfaceType: string
    calledFunction: string
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

export type ApiListTemplatesResponse = string[]

export interface ApiTemplateFileResponse {
  template: string
  shapes?: string
  criteria?: string
}

export interface ApiConfigFileResponse {
  config: string
}

type RefreshReason =
  | {
      type: 'TEMPLATE_NO_LONGER_MATCHES'
      contract: string
      template: string
    }
  | {
      type: 'TEMPLATE_MATCH_CHANGED'
      contract: string
      oldTemplate: string
      newTemplates: string[]
    }
  | {
      type: 'NEW_TEMPLATE_MATCH'
      contract: string
      newTemplates: string[]
    }
  | {
      type: 'CONFIG_CHANGED'
    }
  | {
      type: 'TEMPLATE_CONFIG_CHANGED'
      templates: string[]
    }

export interface ApiConfigSyncStatusResponse {
  reasons: RefreshReason[]
}

export interface ApiGlobalConfigSyncStatusResponse {
  reasons: {
    project: string
    reasons: RefreshReason[]
  }[]
}

export type ApiCreateShapeResponse =
  | {
      success: true
    }
  | {
      success: false
      error: string
    }

export type ApiCreateConfigFileResponse =
  | {
      success: true
    }
  | {
      success: false
      error: string
    }

export type ApiAddressType =
  | 'EOA'
  | 'EOAPermissioned'
  | 'Unverified'
  | 'Token'
  | 'Multisig'
  | 'Diamond'
  | 'Timelock'
  | 'Untemplatized'
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
  isReachable: boolean
}

export interface ApiAddressReference extends AddressFieldValue {
  fieldNames: string[]
}

export interface Field {
  name: string
  value: FieldValue
  handler?: { type: string } & Record<string, unknown>
  description?: string
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
  | EmptyFieldValue

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

export interface EmptyFieldValue {
  type: 'empty'
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
  isToken?: boolean
  timestamp: string
}

export interface ApiContractTagsUpdateRequest {
  contractAddress: string
  isExternal?: boolean
  centralization?: 'high' | 'medium' | 'low' | 'immutable'
  likelihood?: Likelihood
  fetchBalances?: boolean
  fetchPositions?: boolean
  isToken?: boolean
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
  breakdown?: AdminDetail[] | AdminDetailWithCapital[]
  totalCapitalAtRisk?: number
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
  tokenInfo?: {
    symbol: string
    name: string
    decimals: number
    price: number
    totalSupply: string
    tokenValue: number
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

// Token info types
export interface ApiTokenInfoResponse {
  id: string
  chain: string
  name: string
  symbol: string
  decimals: number
  price: number
}

// Call graph types
export interface ApiCallGraphResponse {
  version: string
  lastModified: string
  contracts: Record<string, ContractCallGraph>
}

export interface ContractCallGraph {
  address: string
  name: string
  externalCalls: ExternalCall[]
  generatedAt: string
  skipped?: boolean
  skipReason?: string
  error?: string
}

// Resolution type to distinguish deterministic vs optimistic
export type ResolutionType = 'deterministic' | 'optimistic'

// Candidate match for optimistic resolution (when multiple contracts match)
export interface ResolutionCandidate {
  address: string
  contractName?: string
}

export interface ExternalCall {
  callerFunction: string      // "_sendBoldtoDepositor"
  callerIsView?: boolean      // true if caller function is view/pure (infers external calls are also view)
  storageVariable: string     // "boldToken"
  interfaceType: string       // "IBoldToken"
  calledFunction: string      // "returnFromPool"
  resolvedAddress?: string    // "eth:0x6440f..." from discovered.json
  resolvedContractName?: string
  isViewCall?: boolean        // true if view/pure, false if state-changing, undefined if unknown
  // Optimistic resolution fields
  resolutionType?: ResolutionType // 'deterministic' (direct lookup) or 'optimistic' (heuristic-based)
  resolutionHeuristic?: string    // Which heuristic matched (e.g., 'variable-chain', 'interface-name')
  resolutionConfidence?: number   // 0-100, dynamic based on match count
  resolutionCandidates?: ResolutionCandidate[] // All matches when multiple found
}

export interface ApiAIModelsResponse {
  key: string
  config: {
    provider: 'openai' | 'claude'
    displayName: string
    modelId: string
  }
}
