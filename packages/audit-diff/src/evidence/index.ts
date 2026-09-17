import path from 'path'
import {
  auditedFileRepoPath,
  type Collection,
  type Dataset,
  githubBlobUrl,
  readAuditedFile,
  referencedRepositories,
} from '../dataset/read.js'
import type { AuditReport } from '../dataset/types.js'
import { sha256 } from '../deployed/format.js'
import {
  type PreparedUnit,
  type PreparedUnitCache,
  prepareFile,
} from './units.js'

/** One audited unit at one audited revision, inside one collection. */
export interface AuditedUnitVersion extends PreparedUnit {
  collection: string
  report: AuditReport
  repository: string
  /** Repository-relative path. */
  path: string
  commit: string
  timestamp: string | null
  url: string
  auditStatus: string
  reviewPhase: string
  coverage: string
  majorFindings: number
  /** Report identifiers of the open major findings, as printed in the report. */
  findingIds: string[]
  /** Sort key, larger is newer. */
  order: number
}

export interface CollectionIndex {
  collection: Collection
  /** Unit name → versions, newest first. Solidity units only. */
  units: Map<string, AuditedUnitVersion[]>
  /** Whole-file (non-Solidity) versions, newest first. */
  files: AuditedUnitVersion[]
  /** Global report id (`<collection>/<id>`) → report. */
  reports: Map<string, AuditReport>
  /** Repositories referenced by relevant reports. */
  repositories: string[]
}

export interface EvidenceLog {
  skippedVersions: string[]
  parseErrors: string[]
}

/**
 * Everything the resolver needs about the audited side:
 *   - per collection: units by name, whole-file units, reports;
 *   - `nameIndex`: unit name → collections that declare it;
 *   - `hashIndex`: comparable-text hash → identical audited versions anywhere;
 *   - `repoIndex`: repository → collections referencing it;
 *   - `pathIndex`: last two path segments → whole-file versions, for
 *     path-suffix matching of zk programs and circuits.
 */
export class EvidenceIndex {
  readonly collections = new Map<string, CollectionIndex>()
  readonly nameIndex = new Map<string, Set<string>>()
  readonly hashIndex = new Map<string, AuditedUnitVersion[]>()
  readonly repoIndex = new Map<string, Set<string>>()
  readonly pathIndex = new Map<string, AuditedUnitVersion[]>()
  readonly log: EvidenceLog = { skippedVersions: [], parseErrors: [] }

  constructor(
    readonly dataset: Dataset,
    private readonly cache: PreparedUnitCache,
  ) {
    for (const collection of dataset.collections) {
      this.collections.set(collection.id, this.indexCollection(collection))
    }
    for (const list of this.hashIndex.values()) {
      list.sort((a, b) => b.order - a.order)
    }
    for (const list of this.pathIndex.values()) {
      list.sort((a, b) => b.order - a.order)
    }
  }

  collection(id: string): CollectionIndex | undefined {
    return this.collections.get(id)
  }

  /** Collections declaring a Solidity unit with this name. */
  collectionsDeclaring(name: string): string[] {
    return [...(this.nameIndex.get(name) ?? [])]
  }

  /** Collections whose relevant reports reference the repository. */
  collectionsReferencing(repository: string): string[] {
    return [...(this.repoIndex.get(repository) ?? [])]
  }

  private indexCollection(collection: Collection): CollectionIndex {
    const units = new Map<string, AuditedUnitVersion[]>()
    const files: AuditedUnitVersion[] = []
    const reports = new Map<string, AuditReport>()
    const repositories = referencedRepositories(collection)
    for (const repository of repositories) {
      getOrCreate(this.repoIndex, repository).add(collection.id)
    }

    // The same (repo, path, commit) can be scoped by several reports; the
    // first relevant report listing it wins.
    const seen = new Set<string>()
    const manifestByKey = new Map<
      string,
      Collection['manifest']['sources'][number]
    >()
    for (const source of collection.manifest.sources) {
      manifestByKey.set(
        `${source.repository}|${source.source_path}|${source.commit}`,
        source,
      )
    }

    for (const report of collection.summary.reports) {
      if (!report.isRelevant) continue
      reports.set(`${collection.id}/${report.id}`, report)
      for (const scope of report.scopes) {
        for (const [scopedPath, entry] of Object.entries(scope.paths)) {
          entry.versions.forEach((version, versionIndex) => {
            const commit = version.revision.commit
            if (!commit || version.status === 'not_audited') return
            const key = `${scope.repository}|${scopedPath}|${commit}`
            const source = manifestByKey.get(key)
            if (!source) {
              this.log.skippedVersions.push(
                `${collection.id}/${report.id}: ${scope.repository}/${scopedPath}@${commit.slice(0, 8)} has no fetched sources`,
              )
              return
            }
            if (seen.has(key)) return
            seen.add(key)

            const order = versionOrder(
              version.revision.timestamp ?? null,
              report.report_date,
              versionIndex,
            )
            for (const file of source.files) {
              const repoPath = auditedFileRepoPath(source, file.file)
              const prepared = this.prepare(collection, file.file, file.sha256)
              if (!prepared) continue
              for (const unit of prepared) {
                const audited: AuditedUnitVersion = {
                  ...unit,
                  collection: collection.id,
                  report,
                  repository: scope.repository,
                  path: repoPath,
                  commit,
                  timestamp: version.revision.timestamp ?? null,
                  url: githubBlobUrl(source, repoPath),
                  auditStatus: version.status,
                  reviewPhase: version.review_phase,
                  coverage: version.coverage,
                  majorFindings: version.major_findings,
                  findingIds: version.finding_ids ?? [],
                  order,
                }
                getOrCreate(this.hashIndex, unit.unitHash, []).push(audited)
                if (unit.kind === 'program') {
                  files.push(audited)
                  getOrCreate(this.pathIndex, pathKey(repoPath), []).push(
                    audited,
                  )
                } else {
                  getOrCreate(units, unit.name, []).push(audited)
                  getOrCreate(this.nameIndex, unit.name).add(collection.id)
                }
              }
            }
          })
        }
      }
    }

    for (const list of units.values()) list.sort((a, b) => b.order - a.order)
    files.sort((a, b) => b.order - a.order)
    return { collection, units, files, reports, repositories }
  }

  private prepare(
    collection: Collection,
    file: string,
    manifestHash: string | undefined,
  ): PreparedUnit[] | undefined {
    let content: string | undefined
    let fileHash = manifestHash
    if (!fileHash) {
      content = readAuditedFile(collection, file)
      fileHash = sha256(content)
    }
    const cached = this.cache.get(fileHash)
    if (cached) return cached
    content ??= readAuditedFile(collection, file)
    try {
      const prepared = prepareFile(path.posix.basename(file), content)
      this.cache.set(fileHash, prepared)
      return prepared
    } catch (e) {
      this.log.parseErrors.push(`${collection.id}: ${file}: ${String(e)}`)
      return undefined
    }
  }
}

/** Last two segments of a repository path, the key of `pathIndex`. */
export function pathKey(repoPath: string): string {
  const segments = repoPath.split('/').filter((s) => s !== '')
  return segments.slice(-2).join('/')
}

/** Number of trailing path segments two repository paths share. */
export function commonSuffixLength(a: string, b: string): number {
  const sa = a.split('/').filter((s) => s !== '')
  const sb = b.split('/').filter((s) => s !== '')
  let n = 0
  while (
    n < sa.length &&
    n < sb.length &&
    sa[sa.length - 1 - n] === sb[sb.length - 1 - n]
  ) {
    n++
  }
  return n
}

function getOrCreate<K, V>(map: Map<K, V>, key: K, empty?: V): V {
  let value = map.get(key)
  if (value === undefined) {
    value = (empty ?? (new Set() as unknown)) as V
    map.set(key, value)
  }
  return value
}

/**
 * Newest first by commit timestamp. Without a timestamp fall back to the
 * report date plus the position within the report's version list (which is
 * chronological by dataset convention).
 */
function versionOrder(
  timestamp: string | null,
  reportDate: string | null,
  versionIndex: number,
): number {
  const ts = timestamp ? Date.parse(timestamp) : Number.NaN
  if (!Number.isNaN(ts)) return ts
  const rd = reportDate ? Date.parse(reportDate) : Number.NaN
  return (Number.isNaN(rd) ? 0 : rd) + versionIndex
}
