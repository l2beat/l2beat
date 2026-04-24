// This file is duplicated in protocolbeat and l2b!

import type { ChainSpecificAddress } from '@l2beat/shared-pure'

// ============================================================================
// Upgrade Function Detection
// ============================================================================

/**
 * Function names that grant arbitrary control over a contract's logic.
 * An upgrade replaces the entire implementation, so the caller can:
 * 1. Drain all direct funds in the contract
 * 2. Call any external function reachable from any function in the contract
 * 3. Make any permissioned calls the contract has authority to make
 */
const UPGRADE_FUNCTION_NAMES = new Set([
  'upgradeTo',
  'upgradeToAndCall',
  'proxy__upgradeTo',
  'proxy__upgradeToAndCall',
  'upgradeBeacon',
])

export function isUpgradeFunction(functionName: string): boolean {
  return UPGRADE_FUNCTION_NAMES.has(functionName)
}

// Scoring type aliases
export type Impact = 'critical' | 'no-impact'

// Mitigation types for permissioned functions
export type MitigationType = 'delay' | 'valueRange' | 'relativeValue' | 'other'

// Scaler denominator used when an impactCap's unit.kind === 'scaler'.
// Applied to raw on-chain values that already express USD under a fixed scaling
// (e.g. price feeds returning 1e8-scaled USD).
export type ImpactCapScaler = '1e6' | '1e8' | '1e18' | 'bps' | 'percent'

// Unified impactCap value — where the amount comes from.
export type ImpactCapValue =
  | { mode: 'hardcoded'; amount: number }
  | { mode: 'fieldRef'; contractAddress: string; fieldName: string }

// Unified impactCap unit — how to interpret the amount to yield USD.
//   - 'usd':    amount is already USD
//   - 'scaler': amount is a raw USD-scaled number, divide by `factor`
//   - 'token':  amount is a token quantity. Price & decimals come from funds-data.json.
//               For 'hardcoded' values: amount is whole tokens (researcher-friendly).
//               For 'fieldRef' values:  amount is raw on-chain units (divided by 10^decimals).
export type ImpactCapUnit =
  | { kind: 'usd' }
  | { kind: 'scaler'; factor: ImpactCapScaler }
  | { kind: 'token'; tokenAddress: string }

export interface ImpactCap {
  value: ImpactCapValue
  unit: ImpactCapUnit
  multiplier?: number // applied to final USD; default 1
}

// Legacy persisted shape (pre-unification). Kept for backward-compat reads.
// Three historical modes were inferred from populated keys:
//   A) { hardcodedUsd }
//   B) { contractAddress, fieldName, unit: 'raw'|'1e6'|'1e8'|'1e18'|'bps'|'percent' }
//   C) { tokenAddress, fieldName, multiplier, fieldContractAddress? }
export interface LegacyImpactCap {
  hardcodedUsd?: number
  contractAddress?: string
  fieldName?: string
  unit?: 'raw' | '1e6' | '1e8' | '1e18' | 'bps' | 'percent'
  tokenAddress?: string
  fieldContractAddress?: string
  multiplier?: number
}

function isNewShape(raw: unknown): raw is ImpactCap {
  if (!raw || typeof raw !== 'object') return false
  const r = raw as Record<string, unknown>
  const v = r.value as Record<string, unknown> | undefined
  const u = r.unit as Record<string, unknown> | undefined
  return (
    !!v &&
    typeof v === 'object' &&
    (v.mode === 'hardcoded' || v.mode === 'fieldRef') &&
    !!u &&
    typeof u === 'object' &&
    (u.kind === 'usd' || u.kind === 'scaler' || u.kind === 'token')
  )
}

/**
 * Normalize a persisted impactCap (new or legacy shape) to the unified ImpactCap.
 * Returns undefined for invalid / empty entries. Callers should always pipe raw
 * file values through this before resolving.
 */
export function normalizeImpactCap(
  raw: ImpactCap | LegacyImpactCap | null | undefined,
): ImpactCap | undefined {
  if (!raw) return undefined
  if (isNewShape(raw)) return raw

  const legacy = raw as LegacyImpactCap

  // Legacy Mode A: hardcoded USD
  if (legacy.hardcodedUsd !== undefined) {
    return {
      value: { mode: 'hardcoded', amount: legacy.hardcodedUsd },
      unit: { kind: 'usd' },
    }
  }

  // Legacy Mode C: token-denominated (tokenAddress present)
  if (legacy.tokenAddress !== undefined) {
    if (!legacy.fieldName || legacy.multiplier === undefined) return undefined
    return {
      value: {
        mode: 'fieldRef',
        contractAddress: legacy.fieldContractAddress ?? legacy.tokenAddress,
        fieldName: legacy.fieldName,
      },
      unit: { kind: 'token', tokenAddress: legacy.tokenAddress },
      multiplier: legacy.multiplier,
    }
  }

  // Legacy Mode B: scaler field-ref
  if (legacy.contractAddress && legacy.fieldName && legacy.unit) {
    if (legacy.unit === 'raw') {
      return {
        value: {
          mode: 'fieldRef',
          contractAddress: legacy.contractAddress,
          fieldName: legacy.fieldName,
        },
        unit: { kind: 'usd' },
      }
    }
    return {
      value: {
        mode: 'fieldRef',
        contractAddress: legacy.contractAddress,
        fieldName: legacy.fieldName,
      },
      unit: { kind: 'scaler', factor: legacy.unit },
    }
  }

  return undefined
}

// A mitigation value can be either a hardcoded literal or a reference to a contract field
export interface MitigationValue {
  mode: 'hardcoded' | 'fieldRef'
  // For 'hardcoded': the literal string value
  value?: string
  // For 'fieldRef': path expression using same format as owner definitions
  // e.g., "$self.maxBorrowRate", "@configurator.supplyCapLimit"
  fieldPath?: string
}

// Backward compat: old mitigations stored min/max/% as plain strings
export function normalizeMitigationValue(
  val: string | MitigationValue | undefined,
): MitigationValue | undefined {
  if (val === undefined) return undefined
  if (typeof val === 'string') return { mode: 'hardcoded', value: val }
  return val
}

export interface Mitigation {
  type: MitigationType
  description: string
  // For 'other': short 1-2 word label shown in badges (falls back to truncated description if absent)
  label?: string
  // For 'delay': reference to a contract field (reuses existing delay pattern)
  delayRef?: { contractAddress: string; fieldName: string }
  // For 'delay': resolved value in seconds (populated by v2-score API)
  delaySeconds?: number
  // For 'valueRange': MIN/MAX bounds (MitigationValue supports hardcoded or field ref)
  valueRange?: { min?: MitigationValue; max?: MitigationValue; unit?: string }
  // For 'relativeValue': percentage of change limit
  relativeValue?: { maxChangePercent?: MitigationValue }
  // Which contract field this mitigation constrains (triggers auto HIGH severity)
  mitigatedField?: { contractAddress: string; fieldName: string }
  // Scopes this mitigation to a specific admin or dependency.
  // When absent, mitigation is global (applies to all callers).
  scopedTo?: { address: string; type: 'admin' | 'dependency' }
  // Optional: the maximum fund impact this constraint produces.
  // Bounds (directFundsUsd + totalReachableFundsUsd) in capital analysis.
  // Unified shape (see ImpactCap): a value (hardcoded or fieldRef), a unit
  // (usd | scaler | token), and an optional multiplier. Legacy shapes are
  // accepted via normalizeImpactCap() at read time.
  impactCap?: ImpactCap | LegacyImpactCap
  // Resolved USD value of impactCap (set during analysis for display)
  impactCapUsd?: number
}

// Function detail for scoring breakdown
export interface FunctionDetail {
  contractAddress: string
  contractName: string
  functionName: string
  impact: Impact
  mitigations?: Mitigation[]
}

// Dependency detail for dependency scoring breakdown
export interface DependencyDetail {
  dependencyAddress: string
  dependencyName: string
  entity?: string
  functions: {
    contractAddress: string
    contractName: string
    functionName: string
    impact: Impact
  }[]
}

// Admin detail for admin scoring breakdown
export interface AdminDetail {
  adminAddress: string
  adminName: string
  adminType: ApiAddressType
  functions: {
    contractAddress: string
    contractName: string
    functionName: string
    impact: Impact
    mitigations?: Mitigation[]
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
  // Token market cap if contract IS a token (from tokenInfo.tokenValue)
  tokenValueUsd: number
  // Whether funds are counted (true if at least one called function has impact != unscored)
  fundsAtRisk: boolean
  // The effective USD cap applied to this contract's fund contribution (undefined = uncapped).
  // Set when an impactCap mitigation on an intermediary function bounds the reachable amount.
  effectiveCapUsd?: number
}

// Capital analysis for a single permissioned function
export interface FunctionCapitalAnalysis {
  contractAddress: string
  contractName: string
  functionName: string
  impact: Impact
  mitigations?: Mitigation[]
  // True if this is an upgrade function (grants arbitrary control over the contract)
  isUpgrade?: boolean
  // Direct funds in the contract containing this function
  directFundsUsd: number
  // Token market cap if the function's contract IS a token
  directTokenValueUsd: number
  // Contracts reachable via call graph from this function
  reachableContracts: ReachableContract[]
  // Total funds in reachable contracts
  totalReachableFundsUsd: number
  // Total token market cap in reachable contracts
  totalReachableTokenValueUsd: number
  // Number of external calls that couldn't be resolved
  unresolvedCallsCount: number
  // Set when an impactCap mitigation caps this function's grand total (direct + reachable).
  impactCapUsd?: number
}

// Extended admin detail with capital analysis
export interface AdminDetailWithCapital extends AdminDetail {
  // Per-function capital analysis (only for functions with call graph data)
  functionsWithCapital: FunctionCapitalAnalysis[]
  // Sum of funds in contracts where this admin has direct permissions
  totalDirectCapital: number
  // Sum of funds in all reachable contracts (deduplicated across functions)
  totalReachableCapital: number
  // Sum of token market caps in direct contracts
  totalDirectTokenValue: number
  // Sum of token market caps in all reachable contracts (deduplicated)
  totalReachableTokenValue: number
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
      // Effective USD cap for this contract's contribution (undefined = uncapped)
      effectiveCapUsd?: number
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
  | 'Immutable'
  | 'Upgradeable'
  | 'Revoked'

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

export interface FunctionAttribution {
  author: string // GitHub handle
  date: string // ISO 8601
}

export interface FunctionComment {
  author: string
  date: string
  text: string
}

export interface FunctionEntry {
  functionName: string
  isPermissioned: boolean
  checked?: boolean
  score?: 'unscored' | 'critical' | 'no-impact'
  reason?: string
  description?: string
  timestamp: string
  // Multiple owner definitions using L2BEAT's existing handlers
  ownerDefinitions?: OwnerDefinition[]
  // Delay field reference
  delay?: {
    contractAddress: string
    fieldName: string
  }
  // External contract dependencies.
  // Two forms:
  //   - { contractAddress } — literal external contract address
  //   - { path } — path expression resolved against the current contract at
  //     analysis time (same syntax as ownerDefinitions.path). Use this for
  //     dependencies whose identity is derived from on-chain data that may
  //     change (e.g. oracle lookups via a registry mapping).
  dependencies?: FunctionDependencyRef[]
  // Mitigations (valueRange, relativeValue, other — delay is stored separately in `delay` field)
  mitigations?: Mitigation[]
  // Attribution tracking
  lastChangedBy?: FunctionAttribution
  completedBy?: FunctionAttribution
  // Audit trail comments
  comments?: FunctionComment[]
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
  path: string // Unified path expression
}

// Dependency reference. Literal form pins an external contract directly;
// path form resolves against discovered data (same syntax as OwnerDefinition)
// and is re-resolved each analysis — use it for links that follow mutable
// on-chain state (e.g. registry mappings).
export type FunctionDependencyRef =
  | { contractAddress: string }
  | { path: string }

export interface ApiFunctionsUpdateRequest {
  contractAddress: string
  functionName: string
  isPermissioned?: boolean
  checked?: boolean
  score?: 'unscored' | 'critical' | 'no-impact'
  reason?: string
  description?: string
  ownerDefinitions?: OwnerDefinition[]
  delay?: {
    contractAddress: string
    fieldName: string
  } | null
  dependencies?: FunctionDependencyRef[]
  // Mitigations (valueRange, relativeValue, other — delay mitigations derived from `delay` field)
  mitigations?: Mitigation[] | null
  // Frontend sends only the text; backend stamps author + date
  newComment?: { text: string }
}

export interface ApiResearcherInfoResponse {
  githubHandle: string | null
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
  isGovernance?: boolean
  entity?: string
  fetchBalances?: boolean
  fetchPositions?: boolean
  isToken?: boolean
  fetchAggregate?: boolean
  aggregateHandler?: string
  aggregateLabel?: string
  timestamp: string
}

export interface ApiContractTagsUpdateRequest {
  contractAddress: string
  isExternal?: boolean
  isGovernance?: boolean
  entity?: string | null
  fetchBalances?: boolean
  fetchPositions?: boolean
  isToken?: boolean
  fetchAggregate?: boolean
  aggregateHandler?: string | null
  aggregateLabel?: string | null
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
  aggregate?: {
    totalUsdValue: number
    contractCount: number
    handlerName: string
    breakdown?: Array<{ address: string; name?: string; usdValue: number }>
    timestamp: string
    source: string
  }
  lastFetched: string
  error?: string
  /** When set, this entry inherits funds from the given proxy address (implementation contract). */
  proxyAddress?: string
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
  callerFunction: string // "_sendBoldtoDepositor"
  callerIsView?: boolean // true if caller function is view/pure (infers external calls are also view)
  storageVariable: string // "boldToken"
  interfaceType: string // "IBoldToken"
  calledFunction: string // "returnFromPool"
  resolvedAddress?: string // "eth:0x6440f..." from discovered.json
  resolvedContractName?: string
  isViewCall?: boolean // true if view/pure, false if state-changing, undefined if unknown
  // Optimistic resolution fields
  resolutionType?: ResolutionType // 'deterministic' (direct lookup) or 'optimistic' (heuristic-based)
  resolutionHeuristic?: string // Which heuristic matched (e.g., 'variable-chain', 'interface-name')
  resolutionConfidence?: number // 0-100, dynamic based on match count
  resolutionCandidates?: ResolutionCandidate[] // All matches when multiple found
}

// ============================================================================
// Review Config Types (Review Builder panel)
// ============================================================================

export type ReviewProjectType =
  | 'stablecoin'
  | 'lending'
  | 'dex'
  | 'bridge'
  | 'derivatives'
  | 'yield'
  | 'liquid-staking'
  | 'cdp'
  | 'other'

export type ReviewMetricFormat = 'usd' | 'percent' | 'number' | 'string'

export interface ReviewTextBlock {
  type: 'text'
  content: string
}

export interface ReviewTableColorScale {
  columns: number[]
  referenceMetric: string
  valueMetrics: string[][]
}

export interface ReviewTableBadgeColumn {
  column: number
  colorMap: Record<string, string>
}

export interface ReviewTableBlock {
  type: 'table'
  headers: string[]
  rows: string[][]
  colorScale?: ReviewTableColorScale
  badgeColumns?: ReviewTableBadgeColumn[]
}

export interface ReviewExpandableTableRow {
  cells: string[]
  expandedContent?: {
    functions?: {
      name: string
      callers: string[]
    }[]
  }
}

export interface ReviewExpandableTableBlock {
  type: 'expandableTable'
  headers: string[]
  rows: ReviewExpandableTableRow[]
  badgeColumns?: ReviewTableBadgeColumn[]
  externalCallers?: string[]
}

export interface ReviewDropdownBlock {
  type: 'dropdown'
  label: string
  content: ReviewContentBlock[]
}

export interface ReviewLinkBlock {
  type: 'link'
  text: string
  href: string
  external: boolean
}

export interface ReviewMetricBlock {
  type: 'metric'
  label: string
  dataKey: string
  format: ReviewMetricFormat
}

// Data-bound block types (dynamically rendered from live API data)
export type DataColumnFormat =
  | 'text'
  | 'address'
  | 'usd'
  | 'number'
  | 'percent'
  | 'badge'

export interface DataTableColumn {
  field: string
  header: string
  format?: DataColumnFormat
}

export interface ReviewDataTableBlock {
  type: 'dataTable'
  dataSource: string
  columns: DataTableColumn[]
  filters?: Record<string, boolean>
}

export interface ReviewDataMetricBlock {
  type: 'dataMetric'
  dataSource: string
  field: string
  label: string
  format: DataColumnFormat
}

export type ReviewContentBlock =
  | ReviewTextBlock
  | ReviewTableBlock
  | ReviewExpandableTableBlock
  | ReviewDropdownBlock
  | ReviewLinkBlock
  | ReviewMetricBlock
  | ReviewDataTableBlock
  | ReviewDataMetricBlock

export interface ReviewSubSection {
  title: string
  content: ReviewContentBlock[]
}

export interface ReviewSection {
  title: string
  description?: string
  subsections: ReviewSubSection[]
}

export interface EntityDescription {
  name?: string
  description: string
}

export type ResourceType =
  | 'frontend'
  | 'website'
  | 'docs'
  | 'source-code'
  | 'github'
  | 'x'
  | 'license'
  | 'defiscan-v1'
  | 'other'
export type FrontendSubtype = 'official' | 'third-party' | 'self-hosted'

export interface ResourceEntry {
  url: string
  type: ResourceType
  label?: string
  frontendSubtype?: FrontendSubtype
  licenseScope?: string
}

export interface AuditEntry {
  url: string
  author: string
  date: string
  scope?: string
  bounty?: number
}

export type GovernanceVoteExecution = 'onchain' | 'offchain'

export type GovernanceDurationUnit =
  | 'seconds'
  | 'blocks'
  | 'minutes'
  | 'hours'
  | 'days'

export interface GovernanceFieldRef {
  contractAddress: string
  fieldName: string
  // Unit of the raw on-chain value. Default: 'seconds'.
  // 'blocks' assumes a 12s Ethereum block time.
  unit?: GovernanceDurationUnit
}

export type GovernanceDuration =
  | { kind: 'fieldRef'; ref: GovernanceFieldRef }
  | { kind: 'fixed'; value: string }
  | { kind: 'none' }

export interface GovernanceConfig {
  framework: string
  voteExecution: GovernanceVoteExecution
  votingUnit: string
  proposalRequirements: string
  votingProcess: string
  proposalPeriod: GovernanceDuration
  executionDelay: GovernanceDuration
}

export interface ReviewConfig {
  version: string
  lastModified: string
  /** First time the review-config was created. Preserved across regenerations. */
  publishedAt?: string
  protocolSlug: string
  protocolName: string
  tokenName: string
  chain: string
  projectType: ReviewProjectType
  description: string
  admins: Record<string, EntityDescription>
  dependencies: Record<string, EntityDescription>
  funds: Record<string, EntityDescription>
  sections: {
    codeAndAudits: ReviewSection
  }
  dataKeys: Record<string, string>
}

export interface ApiReviewConfigResponse {
  config: ReviewConfig | null
  availableTemplates: ReviewProjectType[]
}

export interface ApiUpdateEntityDescriptionRequest {
  section: 'admins' | 'dependencies' | 'funds'
  address: string
  name?: string
  description: string
}

// ============================================================================
// Ultimate Owners Types (Reverse ownership chain resolution)
// ============================================================================

/** A single step in the ownership chain */
export interface OwnershipChainStep {
  /** The contract address at this step */
  contractAddress: string
  /** Name of the contract */
  contractName: string
  /** The function on this contract in the chain (if known) */
  functionName?: string
  /** Type of the contract (EOA, Multisig, Timelock, Contract, etc.) */
  contractType: ApiAddressType
  /** How this step connects to the next: 'permission' or 'callgraph' */
  edgeType: 'permission' | 'callgraph'
}

/** A terminal entity found by enhanced graph traversal */
export interface TraversalTerminal {
  /** The terminal address (EOA or Multisig) */
  address: string
  /** Display name */
  name: string
  /** Type of the terminal entity */
  type: ApiAddressType
  /** Full chain from this terminal back to the target function */
  chain: OwnershipChainStep[]
  /** True if any step in the chain involves a public (non-permissioned) function */
  hasPublicFunction: boolean
  /** True if resolution stopped due to incomplete data (not a real terminal) */
  isUnresolved?: boolean
}

/** Auto-detected timelock delay from ownership chain analysis */
export interface DetectedTimelockDelay {
  contractAddress: string
  contractName: string
  fieldName: string
  seconds: number
}

/** Enhanced traversal result for a single function */
export interface FunctionTraversalResult {
  contractAddress: string
  functionName: string
  /** The resolved terminal entities */
  terminals: TraversalTerminal[]
  /** Errors encountered during resolution */
  errors: string[]
  /** True if resolution hit the depth limit */
  depthLimitReached: boolean
  /** Auto-detected timelock delay (present when no manual delay is set and a timelock is in the chain) */
  suggestedDelay?: DetectedTimelockDelay
}

/** API response for the enhanced traversal endpoint */
export interface ApiEnhancedTraversalResponse {
  version: string
  lastModified: string
  /** Map of contractAddress -> functionName -> FunctionTraversalResult */
  contracts: Record<string, Record<string, FunctionTraversalResult>>
  /** True if functions.json was modified after call-graph-data.json */
  callGraphStale: boolean
}

// ============================================================================
// Function Analysis Types (Per-function impact & dependencies)
// ============================================================================

/** A single step in a call path showing how one contract reaches another */
export interface CallPathStep {
  contractAddress: string
  contractName: string
  functionName: string
  isViewCall: boolean
}

/** A contract reachable from a function that holds funds */
export interface FunctionImpactEntry {
  contractAddress: string
  contractName: string
  /** True if ALL paths to this contract are view-only */
  viewOnlyPath: boolean
  /** Functions called on the target contract */
  calledFunctions: string[]
  /** Subset of calledFunctions that are permissioned */
  permissionedFunctions: string[]
  /** Funds in this contract (balances + positions) */
  fundsUsd: number
  /** Token market cap if contract is a token */
  tokenValueUsd: number
  /** Shortest call path from the starting function to this contract */
  callPath: CallPathStep[]
}

/** An external dependency of a function */
export interface FunctionDependencyEntry {
  contractAddress: string
  contractName: string
  /** True if auto-detected from call graph, false if manually specified */
  isAutoDetected: boolean
  /** True if ALL calls to this dependency are view-only */
  viewOnlyPath: boolean
  /** Functions called on this dependency (empty for manual) */
  calledFunctions: string[]
  /** Entity name from contract-tags */
  entity?: string
  /** Mitigations attribute from contract-tags */
  mitigations?: string
  /** Shortest call path from the starting function to this dependency */
  callPath: CallPathStep[]
  /** How this dependency was detected: 'callgraph' (code calls), 'write' (permission-owner) */
  dependencyType?: 'callgraph' | 'write'
}

/** Per-function analysis combining impact and dependencies */
export interface FunctionAnalysis {
  /** Reachable contracts with funds — only for permissioned functions, null otherwise */
  impact: {
    reachableContracts: FunctionImpactEntry[]
    totalFundsAtRisk: number
    totalTokenValueAtRisk: number
    unresolvedCallsCount: number
  } | null
  /** External dependencies — for all functions */
  dependencies: {
    entries: FunctionDependencyEntry[]
  }
}

/** API response for the function analysis endpoint */
export interface ApiFunctionAnalysisResponse {
  version: string
  lastModified: string
  /** Map of contractAddress -> functionName -> FunctionAnalysis */
  contracts: Record<string, Record<string, FunctionAnalysis>>
}
