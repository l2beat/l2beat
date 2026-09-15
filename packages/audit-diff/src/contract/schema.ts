import { v } from '@l2beat/validate'

// Data contract between the diff engine and its consumers (the frontend).
// The store is content addressed: `units/<unitHash>.json` holds one record per
// unique deployed unit, `projects/<slug>.json` references those records, and
// `reports.json` / `collections.json` hold shared metadata.

export const UNIT_STATUSES = [
  'identical',
  'library',
  'differs',
  'unaudited',
] as const
export const UnitStatus = v.enum([...UNIT_STATUSES])
export type UnitStatus = v.infer<typeof UnitStatus>

export const UnitKind = v.enum([
  'contract',
  'abstract',
  'interface',
  'library',
  'file-level',
  /** A whole non-Solidity source file, e.g. a zk circuit. */
  'program',
])
export type UnitKind = v.infer<typeof UnitKind>

/** How the evidence collection relates to the project the unit was found in. */
export const MatchOrigin = v.enum([
  'own',
  'upstream',
  'stack',
  'library',
  'other',
])
export type MatchOrigin = v.infer<typeof MatchOrigin>

export const MatchRelation = v.union([
  v.object({ type: v.literal('own') }),
  v.object({ type: v.literal('fork_of'), repository: v.string() }),
  v.object({ type: v.literal('template'), template: v.string() }),
  v.object({ type: v.literal('library') }),
  v.object({ type: v.literal('name') }),
])
export type MatchRelation = v.infer<typeof MatchRelation>

const StatusCounts = v.object({
  identical: v.number(),
  library: v.number(),
  differs: v.number(),
  unaudited: v.number(),
})
export type StatusCounts = v.infer<typeof StatusCounts>

export const CoverageSummary = v.object({
  contracts: v.number(),
  contractsWithoutSource: v.number(),
  /** Deployed unit instances per status. */
  units: StatusCounts,
  /** Same, deduplicated by unit hash. */
  uniqueUnits: StatusCounts,
  lines: v.object({
    total: v.number(),
    covered: v.number(),
    uncovered: v.number(),
  }),
})
export type CoverageSummary = v.infer<typeof CoverageSummary>

export const AuditReportRef = v.object({
  /** Global id: `<collection>/<report id>`. */
  id: v.string(),
  collection: v.string(),
  title: v.string(),
  auditor: v.string(),
  reportDate: v.union([v.string(), v.null()]),
  reportFile: v.string(),
  /** Link to the report file (pdf when available) in the dataset repository. */
  url: v.string().optional(),
})
export type AuditReportRef = v.infer<typeof AuditReportRef>

export const CollectionRef = v.object({
  id: v.string(),
  name: v.string(),
  kind: v.enum(['project', 'library']),
})
export type CollectionRef = v.infer<typeof CollectionRef>

export const DiffLine = v.object({
  type: v.enum([' ', '+', '-']),
  oldLine: v.number().optional(),
  newLine: v.number().optional(),
  text: v.string(),
  /** Changed line that does not count as a difference (comment or require message). */
  ignored: v.boolean().optional(),
})
export type DiffLine = v.infer<typeof DiffLine>

export const DiffHunk = v.object({
  oldStart: v.number(),
  oldLines: v.number(),
  newStart: v.number(),
  newLines: v.number(),
  lines: v.array(DiffLine),
})
export type DiffHunk = v.infer<typeof DiffHunk>

export const DiffStats = v.object({
  added: v.number(),
  removed: v.number(),
  ignoredAdded: v.number(),
  ignoredRemoved: v.number(),
  unchanged: v.number(),
  /** True when every changed line is ignored; such a unit is still identical. */
  ignoredOnly: v.boolean(),
})
export type DiffStats = v.infer<typeof DiffStats>

/**
 * Diff from the audited version (old) to the deployed unit (new).
 * `added`/`removed` count significant lines only; ignored lines (comments,
 * require messages) are counted separately and never affect the status.
 */
export const UnitDiff = v.object({
  added: v.number(),
  removed: v.number(),
  ignoredAdded: v.number(),
  ignoredRemoved: v.number(),
  unchanged: v.number(),
  ignoredOnly: v.boolean(),
  hunks: v.array(DiffHunk),
})
export type UnitDiff = v.infer<typeof UnitDiff>

export const UnitMatch = v.object({
  origin: MatchOrigin,
  collection: v.string(),
  relation: MatchRelation,
  /** 0 own, 1 upstream, 2 stack, 3 library, 4 other. */
  rank: v.number(),
  matchedBy: v.enum(['identity', 'name', 'alias', 'similarity']),
  /** Name of the audited unit; differs from the deployed name when renamed. */
  auditedName: v.string(),
  /** Line similarity between the deployed unit and the chosen version, 0..1. */
  similarity: v.number(),
  /** Global report id, see AuditReportRef.id. */
  reportId: v.string(),
  repository: v.string(),
  path: v.string(),
  commit: v.string(),
  commitTimestamp: v.union([v.string(), v.null()]),
  url: v.string(),
  /** Dataset status string, e.g. audited_with_no_major_findings. */
  auditStatus: v.string(),
  reviewPhase: v.string(),
  coverage: v.string(),
  majorFindings: v.number(),
  /** Identifiers of those findings as printed in the report; only when majorFindings > 0. */
  findingIds: v.array(v.string()).optional(),
  isLatestVersion: v.boolean(),
  laterAuditedVersionExists: v.boolean(),
  totalVersions: v.number(),
})
export type UnitMatch = v.infer<typeof UnitMatch>

export const UnitWarning = v.enum(['low-similarity', 'kind-mismatch'])
export type UnitWarning = v.infer<typeof UnitWarning>

/** Outcome of resolving one unique unit in one ranking context. */
export const UnitResolution = v.object({
  status: UnitStatus,
  coveredLines: v.number(),
  match: UnitMatch.optional(),
  /** Present for `differs`, and for identical units that have ignored-only changes. */
  diff: UnitDiff.optional(),
  warnings: v.array(UnitWarning),
})
export type UnitResolution = v.infer<typeof UnitResolution>

/** `units/<unitHash>.json`: one unique deployed unit and its resolutions. */
export const UnitRecord = v.object({
  schemaVersion: v.literal(2),
  unitHash: v.string(),
  name: v.string(),
  kind: UnitKind,
  lines: v.number(),
  /** Deployed unit text, normalized. */
  source: v.string(),
  /** Keyed by the ranking context key the unit was resolved in. */
  resolutions: v.record(v.string(), UnitResolution),
})
export type UnitRecord = v.infer<typeof UnitRecord>

/** Reference from a project file to a unit record, with what the rows display. */
export const UnitRef = v.object({
  unitHash: v.string(),
  contextKey: v.string(),
  name: v.string(),
  kind: UnitKind,
  startLine: v.number(),
  endLine: v.number(),
  lines: v.number(),
  status: UnitStatus,
  coveredLines: v.number(),
  match: UnitMatch.optional(),
  diffStats: DiffStats.optional(),
  warnings: v.array(UnitWarning),
})
export type UnitRef = v.infer<typeof UnitRef>

export const SourceFileCoverage = v.object({
  /** Path relative to the l2beat config projects directory, or to the zk cache. */
  path: v.string(),
  role: v.enum(['implementation', 'proxy', 'program']),
  lines: v.number(),
  units: v.array(UnitRef),
})
export type SourceFileCoverage = v.infer<typeof SourceFileCoverage>

/** Present when the entry is a zk verifier / program rather than a deployed contract. */
export const ZkSourceInfo = v.object({
  type: v.enum(['verifier', 'program']),
  /** GitHub link the sources were fetched from. */
  link: v.string(),
  commit: v.string(),
})
export type ZkSourceInfo = v.infer<typeof ZkSourceInfo>

export const ContractCoverage = v.object({
  name: v.string(),
  /** Empty for zk programs without an onchain deployment. */
  address: v.string(),
  chain: v.string(),
  template: v.string().optional(),
  zk: ZkSourceInfo.optional(),
  noSource: v.boolean(),
  summary: CoverageSummary,
  files: v.array(SourceFileCoverage),
})
export type ContractCoverage = v.infer<typeof ContractCoverage>

export const ContextCollection = v.object({
  id: v.string(),
  rank: v.number(),
  origin: MatchOrigin,
  relation: MatchRelation,
})
export type ContextCollection = v.infer<typeof ContextCollection>

/** `projects/<slug>.json`. */
export const ProjectAuditCoverage = v.object({
  schemaVersion: v.literal(2),
  /** L2BEAT project id (config directory name). */
  projectId: v.string(),
  /** L2BEAT project slug. */
  slug: v.string(),
  generatedAt: v.number(),
  datasetRevision: v.string().optional(),
  discoveryTimestamp: v.number(),
  contractSelection: v.enum(['critical', 'all']),
  /** Ranking context used for non-identity matches. */
  context: v.object({
    key: v.string(),
    collections: v.array(ContextCollection),
  }),
  summary: CoverageSummary,
  /** Global ids of reports referenced by this project's matches. */
  reportIds: v.array(v.string()),
  contracts: v.array(ContractCoverage),
})
export type ProjectAuditCoverage = v.infer<typeof ProjectAuditCoverage>

export const ReportsFile = v.object({
  schemaVersion: v.literal(2),
  reports: v.record(v.string(), AuditReportRef),
})
export type ReportsFile = v.infer<typeof ReportsFile>

export const CollectionsFile = v.object({
  schemaVersion: v.literal(2),
  collections: v.record(v.string(), CollectionRef),
})
export type CollectionsFile = v.infer<typeof CollectionsFile>
