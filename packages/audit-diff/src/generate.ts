import { existsSync, readFileSync } from 'fs'
import path from 'path'
import type { ProjectConfig } from './config.js'
import type {
  AuditReportRef,
  ContractCoverage,
  CoverageSummary,
  ProjectAuditCoverage,
  SourceFileCoverage,
  StatusCounts,
  UnitMatch,
  UnitRef,
  UnitResolution,
  UnitStatus,
} from './contract/schema.js'
import type { Collection } from './dataset/read.js'
import type { AuditReport } from './dataset/types.js'
import type { Formatter } from './deployed/format.js'
import { readDeployedProject } from './deployed/read.js'
import { listZkSourceFiles, readZkSources } from './deployed/zk.js'
import { buildUnitDiff } from './diffing/diff.js'
import { countLines } from './diffing/normalize.js'
import type { EvidenceIndex } from './evidence/index.js'
import { type PreparedUnit, prepareFile } from './evidence/units.js'
import { buildContext, type RankingContext } from './resolve/context.js'
import { type Resolution, resolveUnit } from './resolve/resolve.js'
import type { UnitStore } from './store/store.js'

export interface GenerateOptions {
  projectId: string
  /** `packages/config/src/projects`. */
  projectsDir: string
  /** `.cache/zk`, synchronized from project config by the CLI. */
  zkCacheDir: string
  evidence: EvidenceIndex
  store: UnitStore
  formatter: Formatter
  collectionHints: Record<string, string | string[]>
  config?: ProjectConfig
  allContracts?: boolean
  datasetRevision?: string
  /** Base URL of the dataset repository, used to link audit report files. */
  datasetRepoUrl?: string
  log?: (message: string) => void
}

export function generateProject(
  options: GenerateOptions,
): ProjectAuditCoverage {
  const log = options.log ?? (() => {})
  const { evidence, store } = options
  const deployed = readDeployedProject(options.projectsDir, options.projectId, {
    allContracts: options.allContracts,
  })
  const context = buildContext(evidence, {
    projectId: options.projectId,
    ownCollection: options.config?.collection,
    templates: deployed.templates,
    collectionHints: options.collectionHints,
    aliases: options.config?.aliases,
  })
  log(
    `context ${context.key}: ${
      [...context.ranked.values()]
        .filter((c) => c.rank <= 2)
        .map((c) => `${c.origin}=${c.id}`)
        .join(', ') || '(no own/upstream/stack collections)'
    }`,
  )

  const usedReports = new Set<string>()
  // Resolved once per (unit hash, context) within this run.
  const resolvedInRun = new Map<string, UnitResolution>()

  function resolvePrepared(
    unit: PreparedUnit,
    ownerName: string,
    repoPath?: string,
  ): UnitResolution {
    const cacheKey = `${unit.unitHash}|${context.key}`
    let resolution = resolvedInRun.get(cacheKey)
    if (!resolution) {
      resolution = store.getResolution(unit.unitHash, context.key)
      if (!resolution) {
        resolution = classify(
          unit,
          resolveUnit(unit, evidence, context, repoPath),
          context,
          evidence,
        )
        store.putResolution(
          {
            unitHash: unit.unitHash,
            name: unit.name,
            kind: unit.kind,
            lines: countLines(unit.normalized),
            source: unit.normalized,
          },
          context.key,
          resolution,
        )
        if (resolution.status === 'unaudited' && unit.kind !== 'file-level') {
          log(`${ownerName}/${unit.name}: no audited source`)
        } else if (resolution.match?.matchedBy === 'similarity') {
          log(
            `${ownerName}/${unit.name}: matched ${resolution.match.auditedName} in ${resolution.match.collection} by similarity ${resolution.match.similarity.toFixed(2)}`,
          )
        }
      }
      resolvedInRun.set(cacheKey, resolution)
    }
    if (resolution.match) {
      usedReports.add(resolution.match.reportId)
      const report = evidence
        .collection(resolution.match.collection)
        ?.reports.get(resolution.match.reportId)
      const collection = evidence.collection(
        resolution.match.collection,
      )?.collection
      if (report && collection) {
        store.addReport(toReportRef(collection, report, options.datasetRepoUrl))
      }
    }
    return resolution
  }

  function toRef(unit: PreparedUnit, resolution: UnitResolution): UnitRef {
    return {
      unitHash: unit.unitHash,
      contextKey: context.key,
      name: unit.name,
      kind: unit.kind,
      startLine: unit.startLine,
      endLine: unit.endLine,
      lines: unit.endLine - unit.startLine + 1,
      status: resolution.status,
      coveredLines: resolution.coveredLines,
      match: resolution.match,
      diffStats: resolution.diff && {
        added: resolution.diff.added,
        removed: resolution.diff.removed,
        ignoredAdded: resolution.diff.ignoredAdded,
        ignoredRemoved: resolution.diff.ignoredRemoved,
        unchanged: resolution.diff.unchanged,
        ignoredOnly: resolution.diff.ignoredOnly,
      },
      warnings: resolution.warnings,
    }
  }

  // Format every deployed Solidity file up front (one forge run per chunk).
  const formatted = options.formatter.formatFiles(
    deployed.contracts.flatMap((c) => c.sourceFiles.map((f) => f.file)),
  )

  const contracts: ContractCoverage[] = deployed.contracts.map((contract) => {
    const files: SourceFileCoverage[] = contract.sourceFiles.map((file) => {
      const content =
        formatted.get(file.file) ?? readFileSync(file.file, 'utf8')
      let units: UnitRef[]
      try {
        units = prepareFile(path.basename(file.file), content).map((unit) =>
          toRef(unit, resolvePrepared(unit, contract.name)),
        )
      } catch (e) {
        log(
          `${contract.name}: parse error in ${file.relativePath}: ${String(e)}`,
        )
        units = []
      }
      return {
        path: file.relativePath,
        role: file.role,
        lines: countLines(content),
        units,
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
  })

  // zk programs synchronized from config; one whole-file unit per source,
  // matched by identity or by repository path suffix.
  for (const entry of readZkSources(options.zkCacheDir, options.projectId)) {
    const [chain, address] = entry.address?.includes(':')
      ? (entry.address.split(':') as [string, string])
      : ['', entry.address ?? '']
    const files: SourceFileCoverage[] = listZkSourceFiles(
      options.zkCacheDir,
      options.projectId,
      entry,
    ).map((file) => {
      const content = readFileSync(file.file, 'utf8')
      const units = prepareFile(path.basename(file.file), content)
      return {
        path: file.relativePath,
        role: 'program' as const,
        lines: countLines(content),
        units: units.map((unit) =>
          toRef(unit, resolvePrepared(unit, entry.name, file.repoPath)),
        ),
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
    schemaVersion: 2,
    projectId: options.projectId,
    slug: options.config?.slug ?? options.projectId,
    generatedAt: Math.floor(Date.now() / 1000),
    datasetRevision: options.datasetRevision,
    discoveryTimestamp: deployed.discoveryTimestamp,
    contractSelection: deployed.contractSelection,
    context: {
      key: context.key,
      collections: [...context.ranked.values()].sort(
        (a, b) => a.rank - b.rank || a.id.localeCompare(b.id),
      ),
    },
    summary: summarize(
      allUnits,
      contracts.length,
      contracts.filter((c) => c.noSource).length,
    ),
    reportIds: [...usedReports].sort(),
    contracts,
  }
}

/** Turns a resolution into the stored outcome: status, match, diff. */
function classify(
  unit: PreparedUnit,
  resolution: Resolution | undefined,
  context: RankingContext,
  evidence: EvidenceIndex,
): UnitResolution {
  const lines = countLines(unit.normalized)
  if (!resolution) {
    return { status: 'unaudited', coveredLines: 0, warnings: [] }
  }
  const { selection } = resolution
  const version = selection.version
  const ranked = context.ranked.get(resolution.collection)
  const collection = evidence.collection(resolution.collection)?.collection
  const match: UnitMatch = {
    origin: ranked?.origin ?? 'other',
    collection: resolution.collection,
    relation: ranked?.relation ?? { type: 'name' },
    rank: ranked?.rank ?? 4,
    matchedBy: resolution.matchedBy,
    auditedName: resolution.auditedName,
    similarity: round(selection.similarity),
    reportId: `${resolution.collection}/${version.report.id}`,
    repository: version.repository,
    path: version.path,
    commit: version.commit,
    commitTimestamp: version.timestamp,
    url: version.url,
    auditStatus: version.auditStatus,
    reviewPhase: version.reviewPhase,
    coverage: version.coverage,
    majorFindings: version.majorFindings,
    findingIds: version.findingIds.length > 0 ? version.findingIds : undefined,
    isLatestVersion: version === resolution.versions[0],
    laterAuditedVersionExists: selection.laterAuditedVersionExists,
    totalVersions: resolution.versions.length,
  }

  if (selection.identical) {
    const status: UnitStatus =
      collection?.kind === 'library' ? 'library' : 'identical'
    // Identical modulo ignored changes: keep the diff so the reader can see
    // the comment / message changes; status is unaffected.
    const diff =
      version.normalized === unit.normalized
        ? undefined
        : buildUnitDiff(version.normalized, unit.normalized, {
            allIgnored: true,
          })
    return {
      status,
      coveredLines: lines,
      match,
      diff,
      warnings: resolution.warnings,
    }
  }

  const diff = buildUnitDiff(version.normalized, unit.normalized)
  return {
    status: 'differs',
    coveredLines: Math.max(0, lines - diff.added),
    match,
    diff,
    warnings: resolution.warnings,
  }
}

function summarize(
  units: UnitRef[],
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
    if (!seen.has(unit.unitHash)) {
      seen.add(unit.unitHash)
      unique[unit.status]++
    }
    total += unit.lines
    covered += Math.min(unit.lines, unit.coveredLines)
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

export function toReportRef(
  collection: Collection,
  report: AuditReport,
  datasetRepoUrl: string | undefined,
): AuditReportRef {
  return {
    id: `${collection.id}/${report.id}`,
    collection: collection.id,
    title: report.title,
    auditor: report.auditor,
    reportDate: report.report_date,
    reportFile: report.report_file,
    url: datasetRepoUrl
      ? reportUrl(datasetRepoUrl, collection, report.report_file)
      : undefined,
  }
}

/**
 * Link to the report in the dataset repository. The summary references the
 * Markdown conversion; the original pdf (or html) with the same stem is
 * preferred when it exists next to it.
 */
function reportUrl(
  datasetRepoUrl: string,
  collection: Collection,
  reportFile: string,
): string {
  const stem = reportFile.replace(/\.md$/, '')
  let file = reportFile
  for (const ext of ['.pdf', '.html']) {
    if (existsSync(path.join(collection.dir, 'reports', `${stem}${ext}`))) {
      file = `${stem}${ext}`
      break
    }
  }
  const segments = [
    ...collection.relativeDir.split('/'),
    'reports',
    ...file.split('/'),
  ]
  const base = datasetRepoUrl.replace(/\/$/, '')
  return `${base}/${segments.map(encodeURIComponent).join('/')}`
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000
}
