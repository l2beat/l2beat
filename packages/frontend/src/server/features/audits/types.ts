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

export type AuditStatusCounts = Record<AuditUnitStatus, number>

export interface AuditCoverageNumbers {
  units: AuditStatusCounts
  lines: { total: number; covered: number; uncovered: number }
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
  coverage: AuditCoverageNumbers
  uniqueUnits: AuditStatusCounts
  reportsCount: number
  libraryReportsCount: number
  discoveryTimestamp: number
}

export interface AuditsReportEntry {
  id: string
  title: string
  auditor: string
  reportDate: string | null
  /** Report file (pdf when available) in the dataset repository. */
  url?: string
  origin: 'project' | 'library'
  libraryName?: string
}

export interface AuditsUnitMatchEntry {
  origin: 'project' | 'library'
  libraryName?: string
  auditedName: string
  renamed: boolean
  matchedBy: 'name' | 'alias' | 'similarity'
  similarity: number
  reportId: string
  reportTitle: string
  auditor: string
  repository: string
  path: string
  commit: string
  commitTimestamp: string | null
  url: string
  auditStatus: string
  reviewPhase: string
  coverage: string
  majorFindings: number
  laterAuditedVersionExists: boolean
  totalVersions: number
}

export interface AuditsUnitEntry {
  id: string
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

export interface AuditsProjectDetails {
  slug: string
  projectId: string
  name: string
  icon: string
  contractSelection: 'critical' | 'all'
  discoveryTimestamp: number
  generatedAt: number
  datasetRevision?: string
  contracts: number
  contractsWithoutSource: number
  coverage: AuditCoverageNumbers
  uniqueUnits: AuditStatusCounts
  reports: AuditsReportEntry[]
  libraries: { id: string; name: string }[]
  contractEntries: AuditsContractEntry[]
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
