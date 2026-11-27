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
 * Why a unit is listed and diffed but never counted: it is an interface, or
 * vendor code that differs from its audited library version. See
 * `notCountedReason` in coverageModel.
 */
export type AuditNotCountedReason = 'interface' | 'vendor'

/**
 * How audit reports are read. Strict: only code a report explicitly includes
 * is audited. Relaxed: code the named code depends on is audited too. See
 * docs/superpowers/specs/2026-11-17-audit-scope-explicitness-design.md.
 */
export type AuditReading = 'strict' | 'relaxed'

/** Unit and line counts of the counted units, see AuditNotCountedReason. */
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
 * the summary table. Same scale as AuditsProjectTimeline.
 */
export interface AuditsSummaryTimeline {
  /** Launch, first audit or first critical code change, whichever came first. */
  from: number
  to: number
  /** When the project launched; null when unknown. */
  launch: number | null
  /** Project audit dates, own and stack, ascending. */
  audits: number[]
  latestAudit: number | null
  /** Critical code changes after the latest audit; null without ossification. */
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
  /** Null when the coverage has no history. */
  coverageHistory: AuditsSummaryCoverageHistory | null
}

/**
 * The uncovered lines of AuditsCoverageHistory alone, from the launch to the
 * present, see AuditsCoverageSparkline.
 */
export interface AuditsSummaryCoverageHistory {
  launch: number
  /** Ascending; the last point is the present. */
  points: { timestamp: number; uncovered: number }[]
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
  /** Set when the unit is shown but left out of every count. */
  notCounted?: AuditNotCountedReason
  /**
   * Relaxed reading only: reports that never name the matched code and only
   * imply it, as a dependency of code they do name.
   */
  impliedBy?: AuditsUnitReportRef[]
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

/** One point of the coverage history, see AuditsCoverageChart. */
export interface AuditsCoverageHistoryPoint {
  timestamp: number
  /** covered / total, 0 when total is 0. */
  percent: number
  /** uncovered is what the chart draws: every line is a possible exploit. */
  lines: { total: number; covered: number; uncovered: number }
  units: { identical: number; differs: number; unaudited: number }
  contracts: number
  withoutSource: number
  /** Reports that began to count at this point and matched its code. */
  reports: AuditsUnitReportRef[]
  changes: {
    address: string
    name: string
    kind: 'added' | 'removed' | 'upgraded'
  }[]
}

/**
 * The share of the perimeter's lines matching audited code over time, from
 * the launch to the present, as `l2b audit-coverage --history` computed it.
 */
export interface AuditsCoverageHistory {
  launch: number
  /** Ascending; the last point is the present and equals the dashboard. */
  points: AuditsCoverageHistoryPoint[]
  /** Counted only at the present, having no date. */
  undatedReports: AuditsUnitReportRef[]
}

/** Markers and stats of the audits and upgrades timeline section. */
export interface AuditsProjectTimeline {
  /** The project's audits, own and stack, ascending. */
  audits: AuditsProjectReport[]
  /** Dated matched reports that are not project audits, ascending. */
  otherAudits: AuditsOtherReport[]
  /**
   * 24h-clustered critical code changes from the ossification history,
   * ascending. State changes alter no deployed code and are left out.
   */
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
   * Seconds per critical code change since the launch; null without
   * ossification or without code changes.
   */
  averageUpgradeInterval: number | null
  /** Critical code changes after the latest audit; null without ossification. */
  criticalChangesSinceLatestAudit: number | null
  /** Launch, first audit or first critical code change, at least a year ago. */
  from: number
  to: number
  /** Only for projects whose coverage was generated with a history. */
  coverageHistory?: AuditsCoverageHistory
}

/** The numbers and contract entries of one reading. */
export interface AuditsReadingDetails {
  fullyCoveredContracts: number
  coverage: AuditCoverageNumbers
  uniqueUnits: AuditStatusCounts
  contractEntries: AuditsContractEntry[]
}

export type AuditsScopeState =
  | 'included'
  | 'excluded'
  | 'not-mentioned'
  | 'unavailable'

export interface AuditsScopeNode {
  name: string
  kind: 'contract' | 'abstract' | 'library' | 'function'
  path: string
  state: AuditsScopeState
  /** Reviewed as a diff or for selected functions only. */
  partial?: true
  /** The state comes from a general statement about dependencies. */
  generic?: true
  external?: { package: string; version?: string }
  /** The file at the audited commit; own code only. */
  url?: string
}

export interface AuditsScopeShare {
  named: number
  total: number
}

/** The dependency graph of what a report names at one audited commit. */
export interface AuditsScopeSnapshot {
  repository: string
  commit: string
  url: string
  nodes: AuditsScopeNode[]
  /**
   * `[from, to, kind]` with node indexes: from depends on to, as its base
   * contract or as code it calls, links or refers to.
   */
  edges: [number, number, 'inherits' | 'uses'][]
  /** Interfaces reached but not drawn. */
  interfaces: number
  explicitness: { own: AuditsScopeShare; external: AuditsScopeShare }
}

export interface AuditsReportScope {
  status: 'graph' | 'partial' | 'unpinned' | 'unreviewed' | 'no-solidity'
  unlisted?: 'not-mentioned' | 'excluded'
  snapshots: AuditsScopeSnapshot[]
}

/** Only for projects with an audit-scope.json. */
export interface AuditsProjectScope {
  strict: AuditsReadingDetails
  relaxed: AuditsReadingDetails
  /** By report id, the project's own reports. */
  reports: Record<string, AuditsReportScope>
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
  /** ZK verifiers among the selected contracts, left out of every number. */
  verifiers: number
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
  scope?: AuditsProjectScope
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
