import { existsSync } from 'fs'
import path from 'path'
import type {
  AuditReportRef,
  ContractCoverage,
  CoverageSummary,
  LibraryRef,
  ProjectAuditCoverage,
  SourceFileCoverage,
  StatusCounts,
  UnitCoverage,
  UnitMatch,
  UnitStatus,
} from './contract/schema.js'
import {
  listZkSourceFiles,
  readDeployedFile,
  readProjectDir,
  readZkSources,
} from './dataset/read.js'
import type { AuditReport } from './dataset/types.js'
import { buildUnitDiff } from './diffing/diff.js'
import {
  comparableText,
  countLines,
  normalizeSource,
} from './diffing/normalize.js'
import { lineSimilarity } from './diffing/similarity.js'
import {
  type AuditedIndex,
  buildAuditedIndex,
  type IndexLog,
  joinComparableLines,
  wholeFileUnit,
} from './matching/index.js'
import { type MatchResult, matchUnit } from './matching/match.js'
import { selectVersion } from './matching/select.js'
import { type ExtractedUnit, extractUnits } from './solidity/extractUnits.js'

export interface ProjectConfig {
  slug?: string
  /** Deployed unit name → audited unit name, for renamed contracts. */
  aliases?: Record<string, string>
}

export interface GenerateOptions {
  datasetDir: string
  projectId: string
  libraries: AuditedIndex[]
  config?: ProjectConfig
  datasetRevision?: string
  /** Base URL of the dataset repository, used to link audit report files. */
  datasetRepoUrl?: string
  log?: (message: string) => void
}

export function generateProject(
  options: GenerateOptions,
): ProjectAuditCoverage {
  const log = options.log ?? (() => {})
  const projectDir = path.join(options.datasetDir, options.projectId)
  const data = readProjectDir(projectDir)

  const indexLog: IndexLog = { skippedVersions: [], parseErrors: [] }
  const projectIndex = buildAuditedIndex(
    data,
    'project',
    options.projectId,
    undefined,
    indexLog,
  )
  for (const line of indexLog.skippedVersions) log(`skip: ${line}`)
  for (const line of indexLog.parseErrors) log(`parse error: ${line}`)

  const usedReports = new Map<string, AuditReportRef>()
  const usedLibraries = new Map<string, LibraryRef>()
  const aliases = options.config?.aliases ?? {}

  /**
   * Matches one deployed unit against the audited indexes and returns its
   * coverage entry. Shared by Solidity units and whole-file zk programs; the
   * latter only ever match project audited files with the same basename.
   */
  function classify(
    unit: ExtractedUnit,
    ownerId: string,
    ownerName: string,
    file: string,
  ): UnitCoverage {
    const normalized = normalizeSource(unit.source)
    const comparable = comparableText(normalized)
    const comparableJoined = joinComparableLines(normalized)
    const base = {
      id: `${ownerId}/${path.posix.basename(file)}#${unit.name}`,
      name: unit.name,
      kind: unit.kind,
      startLine: unit.startLine,
      endLine: unit.endLine,
      lines: unit.endLine - unit.startLine + 1,
      source: normalized,
    }

    const match =
      unit.kind === 'program'
        ? matchProgramFile(unit, comparableJoined)
        : matchUnit(
            unit,
            comparableJoined,
            projectIndex,
            options.libraries,
            aliases,
          )
    const selection =
      match && selectVersion(comparable, comparableJoined, match.versions)
    if (!match || !selection) {
      if (unit.kind !== 'file-level') {
        log(`${ownerName}/${unit.name}: no audited source`)
      }
      return { ...base, status: 'unaudited', coveredLines: 0, warnings: [] }
    }

    const { index } = match
    const version = selection.version
    usedReports.set(
      version.report.id,
      toReportRef(version.report, index, options.datasetRepoUrl),
    )
    if (index.libraryId) {
      usedLibraries.set(index.libraryId, {
        id: index.libraryId,
        name: index.libraryName ?? index.libraryId,
      })
    }
    if (match.matchedBy === 'similarity') {
      log(
        `${ownerName}/${unit.name}: matched ${match.auditedName} by similarity ${match.similarity.toFixed(2)}`,
      )
    }

    const unitMatch: UnitMatch = {
      origin: index.origin,
      libraryId: index.libraryId,
      matchedBy: match.matchedBy,
      auditedName: match.auditedName,
      similarity: round(selection.similarity),
      reportId: version.report.id,
      repository: version.repository,
      path: version.path,
      commit: version.commit,
      commitTimestamp: version.timestamp,
      url: version.url,
      auditStatus: version.auditStatus,
      reviewPhase: version.reviewPhase,
      coverage: version.coverage,
      majorFindings: version.majorFindings,
      isLatestVersion: version === match.versions[0],
      laterAuditedVersionExists: selection.laterAuditedVersionExists,
      totalVersions: match.versions.length,
    }

    if (selection.identical) {
      const status: UnitStatus =
        index.origin === 'library' ? 'library' : 'identical'
      // Identical modulo ignored changes: keep the diff so the reader can see
      // the comment / message changes; status is unaffected.
      const diff =
        version.normalized === normalized
          ? undefined
          : buildUnitDiff(version.normalized, normalized, { allIgnored: true })
      return {
        ...base,
        status,
        coveredLines: base.lines,
        match: unitMatch,
        diff,
        warnings: match.warnings,
      }
    }

    const diff = buildUnitDiff(version.normalized, normalized)
    return {
      ...base,
      status: 'differs',
      coveredLines: base.lines - diff.added,
      match: unitMatch,
      diff,
      warnings: match.warnings,
    }
  }

  /** Whole-file program units match audited files with the same basename. */
  function matchProgramFile(
    unit: ExtractedUnit,
    comparableJoined: string,
  ): MatchResult | undefined {
    const versions = projectIndex.programFiles.get(unit.name)
    if (!versions) return undefined
    let similarity = 0
    for (const version of versions) {
      similarity = Math.max(
        similarity,
        lineSimilarity(comparableJoined, version.comparableLines),
      )
    }
    return {
      index: projectIndex,
      auditedName: unit.name,
      matchedBy: 'name',
      versions,
      similarity,
      warnings: [],
    }
  }

  const contracts: ContractCoverage[] = data.deployed.contracts.map(
    (contract) => {
      const files: SourceFileCoverage[] = contract.sourceFiles.map((file) => {
        const source = readDeployedFile(projectDir, file)
        return {
          path: file,
          role: file.endsWith('.p.sol') ? 'proxy' : 'implementation',
          lines: countLines(source),
          units: extractUnits(source).map((unit) =>
            classify(unit, contract.chainSpecificAddress, contract.name, file),
          ),
        }
      })

      return {
        name: contract.name,
        address: contract.address,
        chain: contract.chain,
        template: contract.template,
        noSource: contract.sourceFiles.length === 0,
        summary: summarize(
          files.flatMap((f) => f.units),
          1,
          files.length === 0 ? 1 : 0,
        ),
        files,
      }
    },
  )

  // zk verifiers and programs fetched into deployed-contracts/_zk; each entry
  // is listed next to the deployed contracts, one whole-file unit per source.
  for (const entry of readZkSources(projectDir)) {
    const [chain, address] = entry.address?.includes(':')
      ? (entry.address.split(':') as [string, string])
      : ['', entry.address ?? '']
    const ownerId = entry.address ?? `zk:${entry.path}`
    const files: SourceFileCoverage[] = listZkSourceFiles(projectDir, entry)
      .filter((file) => !file.endsWith('.json'))
      .map((file) => {
        const content = readDeployedFile(projectDir, file)
        const unit = wholeFileUnit(path.posix.basename(file), content)
        return {
          path: file,
          role: 'program' as const,
          lines: countLines(content),
          units: [classify(unit, ownerId, entry.name, file)],
        }
      })
    contracts.push({
      name: entry.name,
      address,
      chain,
      zk: { type: entry.type, link: entry.link, commit: entry.commit },
      noSource: files.length === 0,
      summary: summarize(
        files.flatMap((f) => f.units),
        1,
        files.length === 0 ? 1 : 0,
      ),
      files,
    })
  }

  const allUnits = contracts.flatMap((c) => c.files.flatMap((f) => f.units))
  return {
    schemaVersion: 1,
    projectId: options.projectId,
    slug: options.config?.slug ?? options.projectId,
    generatedAt: Math.floor(Date.now() / 1000),
    datasetRevision: options.datasetRevision,
    discoveryTimestamp: data.deployed.discoveryTimestamp,
    contractSelection: data.deployed.contractSelection,
    summary: summarize(
      allUnits,
      contracts.length,
      contracts.filter((c) => c.noSource).length,
    ),
    reports: [...usedReports.values()].sort((a, b) => a.id.localeCompare(b.id)),
    libraries: [...usedLibraries.values()],
    contracts,
  }
}

function summarize(
  units: UnitCoverage[],
  contracts: number,
  contractsWithoutSource: number,
): CoverageSummary {
  const counts = emptyCounts()
  const unique = emptyCounts()
  const seen = new Set<string>()
  let total = 0
  let covered = 0
  for (const unit of units) {
    counts[unit.status]++
    const key = `${unit.status}|${unit.source}`
    if (!seen.has(key)) {
      seen.add(key)
      unique[unit.status]++
    }
    total += unit.lines
    covered += unit.coveredLines
  }
  return {
    contracts,
    contractsWithoutSource,
    units: counts,
    uniqueUnits: unique,
    lines: { total, covered, uncovered: total - covered },
  }
}

function emptyCounts(): StatusCounts {
  return { identical: 0, library: 0, differs: 0, unaudited: 0 }
}

function toReportRef(
  report: AuditReport,
  index: AuditedIndex,
  datasetRepoUrl: string | undefined,
): AuditReportRef {
  return {
    id: report.id,
    title: report.title,
    auditor: report.auditor,
    reportDate: report.report_date,
    reportFile: report.report_file,
    url: datasetRepoUrl
      ? reportUrl(datasetRepoUrl, index, report.report_file)
      : undefined,
    origin: index.origin,
    libraryId: index.libraryId,
  }
}

/**
 * Link to the report in the dataset repository. The summary references the
 * Markdown conversion; the original pdf (or html) with the same stem is
 * preferred when it exists next to it.
 */
function reportUrl(
  datasetRepoUrl: string,
  index: AuditedIndex,
  reportFile: string,
): string {
  const stem = reportFile.replace(/\.md$/, '')
  let file = reportFile
  for (const ext of ['.pdf', '.html']) {
    if (existsSync(path.join(index.dir, 'reports', `${stem}${ext}`))) {
      file = `${stem}${ext}`
      break
    }
  }
  const segments = [
    ...index.relativeDir.split('/'),
    'reports',
    ...file.split('/'),
  ]
  const base = datasetRepoUrl.replace(/\/$/, '')
  return `${base}/${segments.map(encodeURIComponent).join('/')}`
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000
}
