// Compiled Review types — mirrors ReviewCompiler.ts from backend

export interface CompiledReview {
  version: '1.0'
  /** First time review-config.json was created. Preserved across regenerations. */
  publishedAt: string
  /** Last time a researcher edited review-config, resources, audits, or governance. */
  updatedAt: string
  /**
   * Live on-chain data freshness — sourced from discovered.json.timestamp,
   * NOT wall-clock compile time. Only bumps when the monitor runs a fresh
   * discovery cycle; researcher-triggered recompiles keep it unchanged.
   */
  compiledAt: string
  project: string

  metadata: {
    protocolName: string
    protocolSlug: string
    chain: string
    projectType: string
    tokenName: string
    description: string
  }

  totals: {
    contractCount: number
    permissionedFunctionCount: number
    scoredFunctionCount: number
    adminCount: number
    dependencyCount: number
    totalCapitalAtRisk: number
    totalTokenValueAtRisk: number
    totalTokenValue: number
    linesOfCode?: number
  }

  admins: CompiledAdmin[]
  adminTotals?: {
    totalFundsAtRisk: number
    totalTokenValueAtRisk: number
  }
  dependencies: CompiledDependency[]
  dependencyEntityGroups?: {
    entity: string | null
    totalFundsAtRisk: number
    totalTokenValueAtRisk: number
  }[]
  dependencyTotals?: {
    totalFundsAtRisk: number
    totalTokenValueAtRisk: number
  }
  funds: CompiledFundHolder[]
  functions: CompiledFunction[]
  contracts: CompiledContract[]

  resources?: CompiledResourceEntry[]
  audits?: AuditEntry[]
  activity?: ActivityEvent[]
  governance?: CompiledGovernance
  sections: Record<string, unknown>
}

export type GovernanceVoteExecution = 'onchain' | 'offchain'

export interface CompiledGovernanceDuration {
  kind: 'fieldRef' | 'fixed' | 'none'
  // fieldRef-resolved:
  seconds?: number
  resolved?: boolean
  error?: string
  contractAddress?: string
  contractName?: string
  fieldName?: string
  // fixed:
  value?: string
}

export interface CompiledGovernance {
  framework: string
  voteExecution: GovernanceVoteExecution
  votingUnit: string
  proposalRequirements: string
  votingProcess: string
  proposalPeriod: CompiledGovernanceDuration
  executionDelay: CompiledGovernanceDuration
}

export type CompiledResourceType =
  | 'frontend'
  | 'website'
  | 'docs'
  | 'source-code'
  | 'github'
  | 'x'
  | 'license'
  | 'defiscan-v1'
  | 'other'
export type CompiledFrontendSubtype = 'official' | 'third-party' | 'self-hosted'

export interface CompiledResourceEntry {
  url: string
  type: CompiledResourceType
  label?: string
  frontendSubtype?: CompiledFrontendSubtype
  licenseScope?: string
}

export interface AuditEntry {
  url: string
  author: string
  date: string
  scope?: string
  bounty?: number
}

export interface CompiledAdmin {
  address: string
  name: string
  description: string
  adminType: string
  isGovernance: boolean
  functions: CompiledAdminFunction[]
  totalDirectCapital: number
  totalDirectTokenValue: number
  totalReachableCapital: number
  totalReachableTokenValue: number
}

// Mitigation types for permissioned functions
export type MitigationType = 'delay' | 'valueRange' | 'relativeValue' | 'other'


export interface MitigationValue {
  mode: 'hardcoded' | 'fieldRef'
  value?: string
  fieldPath?: string
}

/** Format a MitigationValue (or legacy string) for display */
export function displayMitigationValue(
  val: MitigationValue | string | undefined,
): string {
  if (val === undefined) return ''
  if (typeof val === 'string') return val
  if (val.mode === 'fieldRef') return val.fieldPath ?? ''
  return val.value ?? ''
}

export interface Mitigation {
  type: MitigationType
  description: string
  // For 'other': short 1-2 word label shown in badges (falls back to truncated description if absent)
  label?: string
  delayRef?: { contractAddress: string; fieldName: string }
  delaySeconds?: number
  valueRange?: { min?: MitigationValue; max?: MitigationValue; unit?: string }
  relativeValue?: { maxChangePercent?: MitigationValue }
  mitigatedField?: { contractAddress: string; fieldName: string }
  scopedTo?: { address: string; type: 'admin' | 'dependency' }
  // Resolved USD cap on fund impact (computed by review compiler from on-chain field)
  impactCapUsd?: number
}

export type Impact = 'critical' | 'no-impact'

export interface CompiledAdminFunction {
  contractAddress: string
  contractName: string
  functionName: string
  impact: Impact
  isUpgrade?: boolean
  directFundsUsd: number
  directTokenValueUsd: number
  reachableContracts: CompiledReachableContract[]
  mitigations?: Mitigation[]
}

export interface CompiledReachableContract {
  address: string
  name: string
  viewOnlyPath: boolean
  calledFunctions: string[]
  fundsUsd: number
  tokenValueUsd: number
  fundsAtRisk: boolean
  effectiveCapUsd?: number
}

export interface CompiledDependencyFunction {
  contractAddress: string
  contractName: string
  functionName: string
  viewOnlyPath: boolean
  directFundsUsd: number
  directTokenValueUsd: number
  reachableContracts: CompiledReachableContract[]
  mitigations?: Mitigation[]
}

export interface CompiledDependency {
  address: string
  name: string
  description: string
  entity: string | null
  isAutoDetected: boolean
  viewOnlyPath: boolean
  calledFunctions: string[]
  functions: CompiledDependencyFunction[]
  totalFundsAtRisk: number
  totalTokenValueAtRisk: number
  /** How this dependency was detected: 'callgraph' (code calls), 'write' (permission-owner) */
  dependencyType?: 'callgraph' | 'write'
}

export interface CompiledFundHolder {
  address: string
  name: string
  description: string
  balances: { totalUsdValue: number } | null
  positions: { totalUsdValue: number } | null
  tokenInfo: {
    symbol: string
    price: number
    totalSupply: string
    tokenValue: number
  } | null
  aggregate?: {
    totalUsdValue: number
    contractCount: number
    handlerName: string
    label?: string
  } | null
}

export interface CompiledFunction {
  contractAddress: string
  contractName: string
  functionName: string
  impact: Impact
  mitigations?: Mitigation[]
}

export interface CompiledContract {
  address: string
  name: string
  isExternal: boolean
  isGovernance: boolean
  entity: string | null
  proxyType: string | null
}

// Activity Feed types

export interface UpgradeEvent {
  type: 'upgrade'
  timestamp: string
  contractAddress: string
  contractName: string
  txHash: string
  implementations: string[]
  isDependency?: boolean
  entity?: string | null
}

interface BaseActivityFileEvent {
  id: string
  timestamp: string
  updateNotifierId: number
  address: string
  contractName?: string
  isDependency?: boolean
  entity?: string | null
}

/** A single field diff inside a grouped activity event. */
export interface FieldChange {
  /** Original diff key, e.g. "values.totalSupply" or "accessControl.ADMIN.members". */
  field: string
  before: unknown
  after: unknown
}

export interface DataChangeEvent extends BaseActivityFileEvent {
  type: 'data-change'
  /** All non-role fields that changed on this contract during one monitor cycle. Length >= 1. */
  changes: FieldChange[]
}

export interface RoleUpdateEvent extends BaseActivityFileEvent {
  type: 'role-update'
  /** Single role per event — multi-role updates produce multiple events. */
  roleName: string
  /** All sub-fields of this role that changed. Length >= 1. */
  changes: FieldChange[]
}

export interface ContractAddedEvent extends BaseActivityFileEvent {
  type: 'contract-added'
}

export interface ContractRemovedEvent extends BaseActivityFileEvent {
  type: 'contract-removed'
}

export type ActivityEvent =
  | UpgradeEvent
  | DataChangeEvent
  | RoleUpdateEvent
  | ContractAddedEvent
  | ContractRemovedEvent

// Index types — produced by compile-data.ts

export interface IndexData {
  totalDefiTvl: number
  protocols: ProtocolSummary[]
  globalTotals: {
    totalCapitalAtRisk: number
    totalTokenValueAtRisk: number
    totalTokenValue: number
    protocolsReviewed: number
    totalContractCount: number
    recentUpdateCount: number
  }
  dependencies: AggregatedDependency[]
}

export interface ProtocolSummary {
  slug: string
  name: string
  chain: string
  projectType: string
  tokenName: string
  totals: CompiledReview['totals']
}

export interface AggregatedDependency {
  address: string
  name: string
  entity: string | null
  totalFundsAtRisk: number
  protocols: { slug: string; name: string }[]
}
