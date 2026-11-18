import { v } from '@l2beat/validate'
import { readFileSync } from 'fs'
import path from 'path'
import type { ScopedPath, SnapshotPlan } from './scopeGraph'
import { SCOPE_OVERRIDES } from './scopeOverrides'

const Version = v.object({
  revision: v.object({
    kind: v.string(),
    commit: v.union([v.string(), v.null()]).optional(),
  }),
  status: v.string(),
})

const Summary = v.object({
  reports: v.array(
    v.object({
      id: v.string(),
      isRelevant: v.boolean(),
      imports: v.string().optional(),
      repositories: v
        .array(v.object({ id: v.string(), url: v.string() }))
        .optional(),
      scopes: v.array(
        v.object({
          repository: v.string(),
          paths: v.record(
            v.string(),
            v.object({
              path_kind: v.string(),
              kind: v.string(),
              versions: v.array(Version),
            }),
          ),
        }),
      ),
    }),
  ),
})

export type ReportStatus =
  | 'graph'
  | 'partial'
  | 'unpinned'
  | 'unreviewed'
  | 'no-solidity'

export interface ReportPlan {
  id: string
  status: ReportStatus
  unlisted?: 'not-mentioned' | 'excluded'
  /** One per audited commit with a fully audited path. */
  snapshots: SnapshotPlan[]
  /** Every path the report lists at a pinned commit, by `repository@commit`. */
  named: Map<string, Set<string>>
}

const FULL_COMMIT = /^[0-9a-f]{40}([0-9a-f]{24})?$/

/** What each relevant report of a collection lists, from its audit summary. */
export function readReportPlans(
  datasetDir: string,
  collection: string,
): ReportPlan[] {
  const file = path.join(datasetDir, collection, 'audit-summary.json')
  const summary = Summary.parse(JSON.parse(readFileSync(file, 'utf8')))
  return summary.reports
    .filter((report) => report.isRelevant)
    .map((report): ReportPlan => {
      const override = SCOPE_OVERRIDES[report.id]
      const unlisted =
        override?.unlisted ??
        (report.imports === 'audited_unless_excluded'
          ? 'not-mentioned'
          : report.imports === 'not_audited'
            ? 'excluded'
            : undefined)
      const urls = new Map(
        (report.repositories ?? []).map((r) => [r.id, r.url]),
      )
      const named = new Map<string, Set<string>>()
      const byCommit = new Map<
        string,
        { included: ScopedPath[]; partial: ScopedPath[] }
      >()
      const excluded = new Map<string, string[]>()
      let solidity = false
      let pinned = false
      for (const scope of report.scopes) {
        for (const [scopedPath, data] of Object.entries(scope.paths)) {
          if (data.kind !== 'evm') continue
          solidity = true
          const scoped = {
            path: scopedPath,
            directory: data.path_kind === 'directory_recursive',
          }
          for (const version of data.versions) {
            if (version.status === 'not_audited') {
              const list = excluded.get(scope.repository) ?? []
              if (!list.includes(scopedPath)) list.push(scopedPath)
              excluded.set(scope.repository, list)
              continue
            }
            const commit = version.revision.commit?.toLowerCase()
            if (
              commit === undefined ||
              version.revision.kind === 'commit_range' ||
              !FULL_COMMIT.test(commit)
            ) {
              continue
            }
            pinned = true
            const key = `${scope.repository}@${commit}`
            named.set(key, (named.get(key) ?? new Set()).add(scopedPath))
            const lists = byCommit.get(key) ?? { included: [], partial: [] }
            const full = version.status.startsWith('audited_with')
            ;(full ? lists.included : lists.partial).push(scoped)
            byCommit.set(key, lists)
          }
        }
      }
      const snapshots = [...byCommit]
        .filter(([, lists]) => lists.included.length > 0)
        .map(([key, lists]): SnapshotPlan => {
          const [repository, commit] = key.split('@') as [string, string]
          return {
            repository,
            url: urls.get(repository) ?? `https://github.com/${repository}`,
            commit,
            included: lists.included,
            partial: lists.partial,
            excluded: [
              ...(excluded.get(repository) ?? []),
              ...(override?.excluded ?? []),
            ],
            unlisted: unlisted ?? 'not-mentioned',
            ...(override?.dependencies
              ? { dependencies: override.dependencies }
              : {}),
          }
        })
      const status: ReportStatus = !solidity
        ? 'no-solidity'
        : !pinned
          ? 'unpinned'
          : snapshots.length === 0
            ? 'partial'
            : unlisted === undefined
              ? 'unreviewed'
              : 'graph'
      return {
        id: report.id,
        status,
        ...(unlisted === undefined ? {} : { unlisted }),
        snapshots: status === 'graph' ? snapshots : [],
        named,
      }
    })
}
