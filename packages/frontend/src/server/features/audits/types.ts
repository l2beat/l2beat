// View models served to the audits pages. They are derived on the server from
// `project.auditCoverage` (the output of `l2b audit-coverage`, see
// packages/l2b/src/implementations/audit-coverage/README.md) so that page
// components never depend on that format directly.

export type AuditUnitStatus = 'identical' | 'library' | 'differs' | 'unaudited'
export type AuditUnitKind =
  | 'contract'
  | 'abstract'
  | 'interface'
  | 'library'
  /** A free function declared at file level. */
  | 'function'

/**
 * How the collection of an audit report relates to the project: the project's
 * own audits, the audits of its stack (OP Stack chains and the `optimism`
 * collection), an audited standard library, or another project that deployed
 * the same code.
 */
export type AuditReportOrigin = 'own' | 'stack' | 'library' | 'other'

export type AuditStatusCounts = Record<AuditUnitStatus, number>

/**
 * Unit and line counts of the counted units. Interfaces are listed and
 * diffed but never counted, see `countsTowardCoverage` in coverageModel.
 */
export interface AuditCoverageNumbers {
  units: AuditStatusCounts
  lines: { total: number; covered: number; uncovered: number }
}

/**
 * A dated report that counts as one of the project's audits: a report of its
 * own collection, or a matched report of its stack collection. See
 * docs/superpowers/specs/2026-10-07-audit-timeline-project-audits-design.md.
 */
export interface AuditsProjectReport {
  id: string
  title: string
  auditor: string
  timestamp: number
  url: string
  origin: 'own' | 'stack'
  collectionName: string
  /** The report matched at least one deployed unit; always true unless own. */
  matched: boolean
}

/**
 * A dated matched report that is not a project audit: a library audit or a
 * report of another project.
 */
export interface AuditsOtherReport {
  id: string
  title: string
  auditor: string
  timestamp: number
  url: string
  origin: AuditReportOrigin
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
  /** Project audit dates, own and stack, ascending. */
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
  /** Contracts whose every counted unit is identical to audited code. */
  fullyCoveredContracts: number
  coverage: AuditCoverageNumbers
  uniqueUnits: AuditStatusCounts
  /** Reports from the project's own collection that matched a unit. */
  ownReportsCount: number
  /** Matched reports from every other collection (stack, libraries, ...). */
  sharedReportsCount: number
  discoveryTimestamp: number
  timeline: AuditsSummaryTimeline
}

export interface AuditsReportEntry {
  id: string
  title: string
  auditor: string
  reportDate: string | null
  /** The report document in the dataset repository. */
  url: string
  origin: AuditReportOrigin
  collection: string
  collectionName: string
  /** The report matched at least one deployed unit. */
  matched: boolean
}

export interface AuditsUnitReportRef {
  id: string
  title: string
  auditor: string
  url: string
  origin: AuditReportOrigin
  collectionName: string
}

export interface AuditsUnitMatchEntry {
  /** Closest origin among the unit's reports: own, stack, library, other. */
  origin: AuditReportOrigin
  collectionName: string
  /** Name of the audited unit when it differs from the deployed one. */
  auditedName?: string
  /** The report shown for the unit, see primaryReportId. */
  report: AuditsUnitReportRef
  /** Every report that audited a file containing the matched code. */
  reports: AuditsUnitReportRef[]
  repository: string
  path: string
  commit: string
  /** The audited file in its upstream repository. */
  url: string
  /** Identifiers of the major findings open in the audited code, by report. */
  findings: { report: AuditsUnitReportRef; ids: string[] }[]
  /** Flattened finding identifiers, in report order. */
  findingIds: string[]
}

export interface AuditsUnitEntry {
  /** Unique within a project page: `<flat hash>:<unit id>`. */
  id: string
  /** Parameters of the unit details query. */
  flat: string
  unitId: string
  name: string
  kind: AuditUnitKind
  startLine: number
  endLine: number
  lines: number
  status: AuditUnitStatus
  coveredLines: number
  match?: AuditsUnitMatchEntry
  /** Changed lines when the unit differs from the audited code. */
  changedLines?: { added: number; removed: number }
}

export interface AuditsSourceEntry {
  /** Chain specific address whose verified source this is. */
  address: string
  role: 'proxy' | 'implementation'
  /** sha256 of the flat source; undefined without verified Solidity. */
  flat?: string
  lines: number
  units: AuditsUnitEntry[]
}

export interface AuditsContractEntry {
  name: string
  /** Chain specific address, e.g. `eth:0x...`. */
  address: string
  chain: string
  /** Address without the chain prefix. */
  shortAddress: string
  noSource: boolean
  coverage: AuditCoverageNumbers
  sources: AuditsSourceEntry[]
}

/** Markers and stats of the audits and upgrades timeline section. */
export interface AuditsProjectTimeline {
  /** The project's audits, own and stack, ascending. */
  audits: AuditsProjectReport[]
  /** Dated matched reports that are not project audits, ascending. */
  otherAudits: AuditsOtherReport[]
  /** 24h-clustered critical changes from the ossification history, ascending. */
  criticalChanges: number[]
  /** False for projects outside the ossification perimeter. */
  hasOssification: boolean
  /** Where the critical changes are explained. */
  ossificationHref?: string
  /** When the project launched; null when unknown. */
  launch: number | null
  latestAudit: AuditsProjectReport | null
  /**
   * The project's audit cadence: seconds per audit since the launch or the
   * first own audit, whichever came first, over the audits since then. Stack
   * audits before that start describe the stack's history, not the
   * project's cadence. Null without audits since the start.
   */
  auditInterval: { start: number; audits: number; average: number } | null
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
  /** The audit dataset commit the coverage was generated from. */
  datasetCommit: string
  datasetUrl: string
  contracts: number
  contractsWithoutSource: number
  /** Contracts whose every counted unit is identical to audited code. */
  fullyCoveredContracts: number
  coverage: AuditCoverageNumbers
  uniqueUnits: AuditStatusCounts
  reports: AuditsReportEntry[]
  /** The stack collection whose matched audits count as project audits. */
  stackCollectionName?: string
  contractEntries: AuditsContractEntry[]
  /** The project's own L2BEAT page, when it has one. */
  projectHref?: string
  discoUiHref?: string
  timeline: AuditsProjectTimeline
}

export interface AuditsDiffLine {
  type: ' ' | '+' | '-'
  /** Line in the audited file. */
  oldLine?: number
  /** Line in the deployed flat source. */
  newLine?: number
  text: string
}

export interface AuditsDiffHunk {
  oldStart: number
  newStart: number
  lines: AuditsDiffLine[]
}

export interface AuditsUnitDetails {
  /** First line of the unit in the deployed flat source. */
  startLine: number
  /** The deployed unit, line by line. */
  source: string
  /**
   * The deployed flat source the coverage was generated from is not the one
   * the database holds: the contract changed since. No source is returned.
   */
  stale?: true
  audited?: {
    url: string
    /** First line of the audited unit in the dataset's formatted copy. */
    startLine: number
  }
  diff?: {
    added: number
    removed: number
    hunks: AuditsDiffHunk[]
  }
}
