import path from 'path'
import type { MatchOrigin } from '../contract/schema.js'
import {
  type AuditedSourcesDir,
  auditedFileRepoPath,
  findManifestSource,
  githubBlobUrl,
  readAuditedFile,
} from '../dataset/read.js'
import type { AuditReport } from '../dataset/types.js'
import {
  comparableLines,
  comparableText,
  countLines,
  normalizeSource,
} from '../diffing/normalize.js'
import { type ExtractedUnit, extractUnits } from '../solidity/extractUnits.js'

/** One audited unit at one audited revision. */
export interface AuditedUnitVersion {
  unit: ExtractedUnit
  /** Normalized source, used for the displayed diff. */
  normalized: string
  /** Comparable text (comments and require messages removed), used for identity. */
  comparable: string
  /** Comparable non-empty lines joined, used for similarity. */
  comparableLines: string
  report: AuditReport
  repository: string
  path: string
  commit: string
  timestamp: string | null
  url: string
  auditStatus: string
  reviewPhase: string
  coverage: string
  majorFindings: number
  /** Sort key, larger is newer. */
  order: number
}

export interface AuditedIndex {
  origin: MatchOrigin
  /** Absolute dataset directory this index was built from. */
  dir: string
  /** Directory relative to the dataset root, e.g. `tornado-cash` or `libs/openzeppelin`. */
  relativeDir: string
  /** Set for library indexes: vendor directory name and display name. */
  libraryId?: string
  libraryName?: string
  /** Unit name → versions, newest first. */
  units: Map<string, AuditedUnitVersion[]>
  /**
   * Non-Solidity audited files (circuits, programs) as whole-file units,
   * keyed by file basename, newest first.
   */
  programFiles: Map<string, AuditedUnitVersion[]>
  reports: Map<string, AuditReport>
}

export interface IndexLog {
  skippedVersions: string[]
  parseErrors: string[]
}

/**
 * Extracts every unit from every fetched audited Solidity file of one
 * dataset directory (a project or a libs/<vendor>) and groups them by name.
 * Versions marked `not_audited` and versions without fetched sources
 * (branches, tags, unresolved PRs) are skipped.
 */
export function buildAuditedIndex(
  data: AuditedSourcesDir,
  origin: MatchOrigin,
  relativeDir: string,
  library?: { id: string; name: string },
  log: IndexLog = { skippedVersions: [], parseErrors: [] },
): AuditedIndex {
  const units = new Map<string, AuditedUnitVersion[]>()
  const programFiles = new Map<string, AuditedUnitVersion[]>()
  const reports = new Map<string, AuditReport>()
  // Same (repo, path, commit) can be scoped by several reports; extract once.
  const seen = new Set<string>()

  for (const report of data.summary.reports) {
    if (!report.isRelevant) continue
    reports.set(report.id, report)
    for (const scope of report.scopes) {
      for (const [scopedPath, entry] of Object.entries(scope.paths)) {
        entry.versions.forEach((version, versionIndex) => {
          const commit = version.revision.commit
          if (!commit || version.status === 'not_audited') return
          const source = findManifestSource(
            data.manifest,
            scope.repository,
            scopedPath,
            commit,
          )
          if (!source) {
            log.skippedVersions.push(
              `${report.id}: ${scope.repository}/${scopedPath}@${commit.slice(0, 8)} has no fetched sources`,
            )
            return
          }
          const key = `${scope.repository}|${scopedPath}|${commit}`
          if (seen.has(key)) return
          seen.add(key)

          const order = versionOrder(
            version.revision.timestamp ?? null,
            report.report_date,
            versionIndex,
          )
          for (const file of source.files) {
            const repoPath = auditedFileRepoPath(source, file.file)
            const content = readAuditedFile(data.dir, file.file)
            let extracted: ExtractedUnit[]
            let target = units
            if (file.file.endsWith('.sol')) {
              try {
                extracted = extractUnits(content)
              } catch (e) {
                log.parseErrors.push(`${file.file}: ${String(e)}`)
                continue
              }
            } else {
              // circuits and other programs: the whole file is one unit
              extracted = [
                wholeFileUnit(path.posix.basename(repoPath), content),
              ]
              target = programFiles
            }
            for (const unit of extracted) {
              const list = target.get(unit.name) ?? []
              const normalized = normalizeSource(unit.source)
              list.push({
                unit,
                normalized,
                comparable: comparableText(normalized),
                comparableLines: joinComparableLines(normalized),
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
                order,
              })
              target.set(unit.name, list)
            }
          }
        })
      }
    }
  }

  for (const list of [...units.values(), ...programFiles.values()]) {
    list.sort((a, b) => b.order - a.order)
  }

  return {
    origin,
    dir: data.dir,
    relativeDir,
    libraryId: library?.id,
    libraryName: library?.name,
    units,
    programFiles,
    reports,
  }
}

/** A non-Solidity source file treated as a single unit named by its basename. */
export function wholeFileUnit(name: string, content: string): ExtractedUnit {
  const normalized = normalizeSource(content)
  return {
    name,
    kind: 'program',
    startLine: 1,
    endLine: Math.max(1, countLines(normalized)),
    source: normalized,
  }
}

export function joinComparableLines(normalized: string): string {
  return comparableLines(normalized)
    .filter((line) => line !== '')
    .join('\n')
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
