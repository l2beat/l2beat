import { v } from '@l2beat/validate'

// Data contract between the diff engine and its consumers (the frontend).
// Any tool that produces JSON matching `ProjectAuditCoverage` can replace the
// engine in this package without touching the consumers.

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
])
export type UnitKind = v.infer<typeof UnitKind>

export const MatchOrigin = v.enum(['project', 'library'])
export type MatchOrigin = v.infer<typeof MatchOrigin>

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
  /** Same, deduplicated by normalized source text. */
  uniqueUnits: StatusCounts,
  lines: v.object({
    total: v.number(),
    covered: v.number(),
    uncovered: v.number(),
  }),
})
export type CoverageSummary = v.infer<typeof CoverageSummary>

export const AuditReportRef = v.object({
  id: v.string(),
  title: v.string(),
  auditor: v.string(),
  reportDate: v.union([v.string(), v.null()]),
  reportFile: v.string(),
  /** Link to the report file (pdf when available) in the dataset repository. */
  url: v.string().optional(),
  origin: MatchOrigin,
  libraryId: v.string().optional(),
})
export type AuditReportRef = v.infer<typeof AuditReportRef>

export const LibraryRef = v.object({ id: v.string(), name: v.string() })
export type LibraryRef = v.infer<typeof LibraryRef>

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
  /** True when every changed line is ignored; such a unit is still identical. */
  ignoredOnly: v.boolean(),
  hunks: v.array(DiffHunk),
})
export type UnitDiff = v.infer<typeof UnitDiff>

export const UnitMatch = v.object({
  origin: MatchOrigin,
  libraryId: v.string().optional(),
  matchedBy: v.enum(['name', 'alias', 'similarity']),
  /** Name of the audited unit; differs from the deployed name when renamed. */
  auditedName: v.string(),
  /** Line similarity between the deployed unit and the chosen version, 0..1. */
  similarity: v.number(),
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
  isLatestVersion: v.boolean(),
  laterAuditedVersionExists: v.boolean(),
  totalVersions: v.number(),
})
export type UnitMatch = v.infer<typeof UnitMatch>

export const UnitWarning = v.enum(['low-similarity', 'kind-mismatch'])
export type UnitWarning = v.infer<typeof UnitWarning>

export const UnitCoverage = v.object({
  id: v.string(),
  name: v.string(),
  kind: UnitKind,
  startLine: v.number(),
  endLine: v.number(),
  lines: v.number(),
  status: UnitStatus,
  coveredLines: v.number(),
  /** Deployed unit text, normalized. */
  source: v.string(),
  match: UnitMatch.optional(),
  /** Present for `differs`, and for identical units that have ignored-only changes. */
  diff: UnitDiff.optional(),
  warnings: v.array(UnitWarning),
})
export type UnitCoverage = v.infer<typeof UnitCoverage>

export const SourceFileCoverage = v.object({
  /** Relative to the dataset project directory. */
  path: v.string(),
  role: v.enum(['implementation', 'proxy']),
  lines: v.number(),
  units: v.array(UnitCoverage),
})
export type SourceFileCoverage = v.infer<typeof SourceFileCoverage>

export const ContractCoverage = v.object({
  name: v.string(),
  address: v.string(),
  chain: v.string(),
  template: v.string().optional(),
  noSource: v.boolean(),
  summary: CoverageSummary,
  files: v.array(SourceFileCoverage),
})
export type ContractCoverage = v.infer<typeof ContractCoverage>

export const ProjectAuditCoverage = v.object({
  schemaVersion: v.literal(1),
  /** Dataset directory name. */
  projectId: v.string(),
  /** L2BEAT project slug. */
  slug: v.string(),
  generatedAt: v.number(),
  datasetRevision: v.string().optional(),
  discoveryTimestamp: v.number(),
  contractSelection: v.enum(['critical', 'all']),
  summary: CoverageSummary,
  reports: v.array(AuditReportRef),
  libraries: v.array(LibraryRef),
  contracts: v.array(ContractCoverage),
})
export type ProjectAuditCoverage = v.infer<typeof ProjectAuditCoverage>
