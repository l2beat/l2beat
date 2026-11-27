import { v } from '@l2beat/validate'

const HEX_DIGITS = '0123456789abcdef'

const ObjectId = v
  .string()
  .check((value) => isHex(value, [12]), 'Expected a short object id')

const Commit = v
  .string()
  .check((value) => isHex(value, [40, 64]), 'Expected a full commit id')

const UnixSeconds = v
  .number()
  .check((value) => Number.isInteger(value) && value > 0, 'Expected seconds')

const AuditIndexCollection = v.object({
  name: v.string(),
  kind: v.enum(['project', 'library']),
})

const AuditIndexReport = v.object({
  collections: v.array(v.string()),
  title: v.string(),
  auditor: v.string(),
  date: v.union([v.string(), v.null()]),
  document: v.string(),
})
export type AuditIndexReport = v.infer<typeof AuditIndexReport>

const AuditIndexSnapshot = v.object({
  timestamp: UnixSeconds,
  files: v.record(v.string(), ObjectId),
  audits: v.record(v.string(), v.record(v.string(), v.array(v.string()))),
  // Paths a report says it did not review, also below a path it scopes.
  excluded: v.record(v.string(), v.array(v.string())).optional(),
  // The paths in `audits` that a report does not list and only implies.
  implied: v.record(v.string(), v.array(v.string())).optional(),
})
export type AuditIndexSnapshot = v.infer<typeof AuditIndexSnapshot>

/**
 * The index as the coverage code reads it: `audits` holds, per report, the
 * paths it counts as audited. Read an export with `parseAuditIndex`.
 */
export const AuditIndex = v.object({
  schema_version: v.union([v.literal('1.1.0'), v.literal('2.0.0')]),
  collections: v.record(v.string(), AuditIndexCollection),
  reports: v.record(v.string(), AuditIndexReport),
  repositories: v.record(v.string(), v.record(Commit, AuditIndexSnapshot)),
})
export type AuditIndex = v.infer<typeof AuditIndex>

const Paths = v.array(v.string()).optional()

/** audit-index.json of the dataset, schema 2.0.0: see export.md there. */
const AuditIndexExport = v.object({
  schema_version: v.literal('2.0.0'),
  collections: v.record(v.string(), AuditIndexCollection),
  reports: v.record(v.string(), AuditIndexReport),
  repositories: v.record(
    v.string(),
    v.record(
      Commit,
      v.object({
        timestamp: UnixSeconds,
        files: v.record(v.string(), ObjectId),
        audits: v.record(
          v.string(),
          v.object({
            listed: v.record(v.string(), v.array(v.string())),
            excluded: Paths,
            implied: Paths,
            included: Paths,
          }),
        ),
      }),
    ),
  ),
})

/**
 * Reads an export of either schema. From 2.0.0 a report's audited paths are
 * the ones it lists plus the files of the same repository it implies or
 * includes, as 1.1.0 exported them. Files a report only excludes or can see,
 * and snapshots that are only dependencies, are left out: no audit covers them.
 */
export function parseAuditIndex(json: unknown): AuditIndex {
  const version = (json as { schema_version?: unknown }).schema_version
  if (version === '1.1.0') return AuditIndex.parse(json)
  const exported = AuditIndexExport.parse(json)
  const repositories: AuditIndex['repositories'] = {}
  for (const [repository, byCommit] of Object.entries(exported.repositories)) {
    for (const [commit, snapshot] of Object.entries(byCommit)) {
      const audits: AuditIndexSnapshot['audits'] = {}
      const excluded: Record<string, string[]> = {}
      const implied: Record<string, string[]> = {}
      for (const [report, audit] of Object.entries(snapshot.audits)) {
        if (audit.excluded) excluded[report] = audit.excluded
        const paths = { ...audit.listed }
        for (const file of audit.included ?? []) {
          if (snapshot.files[file] !== undefined) paths[file] ??= []
        }
        for (const file of audit.implied ?? []) {
          if (snapshot.files[file] === undefined || file in paths) continue
          paths[file] = []
          implied[report] = [...(implied[report] ?? []), file]
        }
        audits[report] = paths
      }
      const normalized = {
        timestamp: snapshot.timestamp,
        files: snapshot.files,
        audits,
        ...(Object.keys(excluded).length > 0 ? { excluded } : {}),
        ...(Object.keys(implied).length > 0 ? { implied } : {}),
      }
      const files = Object.fromEntries(
        Object.entries(snapshot.files).filter(([file]) =>
          Object.keys(audits).some((report) =>
            auditedBy(normalized, report, file),
          ),
        ),
      )
      if (Object.keys(files).length === 0) continue
      repositories[repository] ??= {}
      repositories[repository][commit] = { ...normalized, files }
    }
  }
  return { ...exported, repositories }
}

/** Whether a report audited a file: it scopes it and does not exclude it. */
export function auditedBy(
  snapshot: Pick<AuditIndexSnapshot, 'audits' | 'excluded'>,
  report: string,
  filePath: string,
): boolean {
  const scoped = Object.keys(snapshot.audits[report] ?? {})
  return (
    scoped.some((scopedPath) => covers(scopedPath, filePath)) &&
    !(snapshot.excluded?.[report] ?? []).some((path) => covers(path, filePath))
  )
}

export function covers(scopePath: string, filePath: string): boolean {
  return filePath === scopePath || filePath.startsWith(`${scopePath}/`)
}

function isHex(value: string, lengths: number[]): boolean {
  if (!lengths.includes(value.length)) {
    return false
  }
  return [...value].every((char) => HEX_DIGITS.includes(char))
}
