// View models served to the audits pages. They are derived from the engine's
// data contract (`@l2beat/audit-diff`) on the server so that page components
// never depend on the engine directly.

export type AuditUnitStatus = 'identical' | 'library' | 'differs' | 'unaudited'
export type AuditUnitKind =
  | 'contract'
  | 'abstract'
  | 'interface'
  | 'library'
  | 'file-level'
  /** A whole non-Solidity source file, e.g. a zk circuit. */
  | 'program'

/** How the evidence collection relates to the project. */
export type AuditMatchOrigin =
  | 'own'
  | 'upstream'
  | 'stack'
  | 'library'
  | 'other'

export type AuditStatusCounts = Record<AuditUnitStatus, number>

export interface AuditCoverageNumbers {
  units: AuditStatusCounts
  lines: { total: number; covered: number; uncovered: number }
}

/** One of the project's own audit reports, dated. */
export interface AuditsOwnReport {
  id: string
  title: string
  auditor: string
  timestamp: number
  url?: string
  /** The report matched at least one deployed unit. */
  matched: boolean
}

/** A dated report of another collection that matched deployed code. */
export interface AuditsSharedReport {
  id: string
  title: string
  auditor: string
  timestamp: number
  url?: string
  origin: AuditMatchOrigin
  collectionName: string
}

/**
 * The project's whole life with its own audits on it, see
 * AuditsTimelineSparkline. Same scale as AuditsProjectTimeline.
 */
export interface AuditsSummaryTimeline {
  /** Launch, first audit or first critical change, whichever came first. */
  from: number
  to: number
  /** When the project launched; null when unknown. */
  launch: number | null
  /** Own report dates, ascending. */
  audits: number[]
  latestAudit: number | null
  /** Critical changes after the latest audit; null without ossification. */
  criticalChangesSinceLatestAudit: number | null
}

export interface AuditsSummaryEntry {
  id: string
  slug: string
  name: string
  shortName?: string
  icon: string
  href: string
  contracts: number
  contractsWithoutSource: number
  /** Contracts whose every unit is identical to audited code. */
  fullyCoveredContracts: number
  coverage: AuditCoverageNumbers
  uniqueUnits: AuditStatusCounts
  /** Reports from the project's own collection that matched a unit. */
  ownReportsCount: number
  /** Reports from every other collection (upstream, stack, libraries, ...). */
  sharedReportsCount: number
  discoveryTimestamp: number
  timeline: AuditsSummaryTimeline
}

export interface AuditsReportEntry {
  id: string
  title: string
  auditor: string
  reportDate: string | null
  /** Report file (pdf when available) in the dataset repository. */
  url?: string
  origin: AuditMatchOrigin
  collection: string
  collectionName: string
}

export interface AuditsUnitMatchEntry {
  origin: AuditMatchOrigin
  collection: string
  collectionName: string
  /** Human readable relation, e.g. "fork of ethereum-optimism/optimism". */
  relation: string
  auditedName: string
  renamed: boolean
  matchedBy: 'identity' | 'name' | 'alias' | 'similarity'
  similarity: number
  reportId: string
  reportTitle: string
  auditor: string
  /** Report file (pdf when available) in the dataset repository. */
  reportUrl?: string
  repository: string
  path: string
  commit: string
  commitTimestamp: string | null
  url: string
  auditStatus: string
  reviewPhase: string
  coverage: string
  majorFindings: number
  /** Identifiers of those findings as printed in the report, for navigation. */
  findingIds?: string[]
  laterAuditedVersionExists: boolean
  totalVersions: number
}

export interface AuditsUnitEntry {
  /** Unique within a project page. */
  id: string
  unitHash: string
  contextKey: string
  name: string
  kind: AuditUnitKind
  startLine: number
  endLine: number
  lines: number
  status: AuditUnitStatus
  coveredLines: number
  warnings: ('low-similarity' | 'kind-mismatch')[]
  match?: AuditsUnitMatchEntry
  /** Significant and ignored (comments, require messages) changed lines. */
  diffStats?: {
    added: number
    removed: number
    ignoredAdded: number
    ignoredRemoved: number
    ignoredOnly: boolean
  }
}

export interface AuditsFileEntry {
  path: string
  role: 'implementation' | 'proxy'
  lines: number
  units: AuditsUnitEntry[]
}

export interface AuditsContractEntry {
  name: string
  address: string
  chain: string
  template?: string
  noSource: boolean
  coverage: AuditCoverageNumbers
  files: AuditsFileEntry[]
}

export interface AuditsContextEntry {
  collection: string
  collectionName: string
  origin: AuditMatchOrigin
  relation: string
}

/** Markers and stats of the audits and upgrades timeline section. */
export interface AuditsProjectTimeline {
  /** Dated own reports, ascending. */
  audits: AuditsOwnReport[]
  /** Dated reports of other collections that matched deployed code, ascending. */
  sharedAudits: AuditsSharedReport[]
  /** 24h-clustered critical changes from the ossification history, ascending. */
  criticalChanges: number[]
  /** False for projects outside the ossification perimeter. */
  hasOssification: boolean
  /** Where the critical changes are explained. */
  ossificationHref?: string
  /** When the project launched; null when unknown. */
  launch: number | null
  latestAudit: AuditsOwnReport | null
  /**
   * Seconds per own audit since the launch or the first audit, whichever
   * came first; null without audits.
   */
  averageAuditInterval: number | null
  /**
   * Seconds per critical upgrade since the launch; null without ossification
   * or without upgrades.
   */
  averageUpgradeInterval: number | null
  /** Critical changes after the latest audit; null without ossification. */
  criticalChangesSinceLatestAudit: number | null
  /** Launch, first audit or first critical change, at least a year ago. */
  from: number
  to: number
}

export interface AuditsProjectDetails {
  slug: string
  projectId: string
  name: string
  shortName?: string
  icon: string
  contractSelection: 'critical' | 'all'
  discoveryTimestamp: number
  generatedAt: number
  datasetRevision?: string
  contracts: number
  contractsWithoutSource: number
  /** Contracts whose every unit is identical to audited code. */
  fullyCoveredContracts: number
  coverage: AuditCoverageNumbers
  uniqueUnits: AuditStatusCounts
  reports: AuditsReportEntry[]
  /** Own, upstream and stack collections ranked for this project. */
  context: AuditsContextEntry[]
  contractEntries: AuditsContractEntry[]
  /** The project's own L2BEAT page, when it has one. */
  projectHref?: string
  discoUiHref?: string
  timeline: AuditsProjectTimeline
}

export interface AuditsDiffLine {
  type: ' ' | '+' | '-'
  oldLine?: number
  newLine?: number
  text: string
  /** Changed line that does not count: comment or require message. */
  ignored?: boolean
}

export interface AuditsDiffHunk {
  oldStart: number
  newStart: number
  lines: AuditsDiffLine[]
}

export interface AuditsUnitDetails {
  startLine: number
  source: string
  diff?: {
    added: number
    removed: number
    ignoredAdded: number
    ignoredRemoved: number
    ignoredOnly: boolean
    hunks: AuditsDiffHunk[]
  }
}
