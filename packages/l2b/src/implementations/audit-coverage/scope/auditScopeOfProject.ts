import type { ProjectAuditScope } from '@l2beat/config'
import {
  ConfigReader,
  get$Implementations,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import type { Unit } from '../AuditCoverage'
import {
  type AuditedCode,
  buildAuditedCode,
  type ImpliedCode,
  withImpliedUnits,
} from '../AuditedCode'
import type { AuditIndex } from '../AuditIndex'
import { type AuditObjects, sha1BlobId } from '../AuditObjects'
import { type CoveredUnit, coverFlat } from '../coverFlat'
import type { GetDeployedSource } from '../deployedSource'
import type { GitRepos } from './GitRepos'
import { RepoSnapshot } from './RepoSnapshot'
import { type ReportPlan, readReportPlans } from './reportPlans'
import { buildScopeGraph, type ImpliedUnit } from './scopeGraph'

export interface AuditScopeInputs {
  index: AuditIndex
  objects: AuditObjects
  dataset: { repository: string; commit: string }
  /** A checkout of the audit dataset at `dataset.commit`. */
  datasetDir: string
  repos: GitRepos
}

export interface AuditScopeLog {
  status(message: string): void
  warn(message: string): void
}

type ScopeUnits = ProjectAuditScope['units']
type ScopeFiles = ProjectAuditScope['auditedFiles']

/**
 * The scope graphs of a project's own reports and the deployed code covered
 * under the strict and the relaxed reading. See
 * docs/superpowers/specs/2026-11-17-audit-scope-explicitness-design.md.
 */
export async function auditScopeOfProject(
  project: string,
  inputs: AuditScopeInputs,
  getDeployedSource: GetDeployedSource,
  log: AuditScopeLog,
): Promise<ProjectAuditScope> {
  const plans = readReportPlans(inputs.datasetDir, project)
  const reports: ProjectAuditScope['reports'] = {}
  const implied: { report: string; unit: ImpliedUnit }[] = []
  for (const plan of plans) {
    const snapshots = []
    for (const snapshot of plan.snapshots) {
      const label = `${plan.id} ${snapshot.repository}@${snapshot.commit.slice(0, 8)}`
      log.status(`Reading ${label}`)
      try {
        const repo = new RepoSnapshot(
          inputs.repos,
          snapshot.url,
          snapshot.commit,
        )
        const built = buildScopeGraph(snapshot, repo)
        snapshots.push(built.snapshot)
        for (const unit of built.implied) {
          implied.push({ report: plan.id, unit })
        }
        for (const warning of built.warnings) {
          log.warn(`${label}: ${warning}`)
        }
      } catch (error) {
        log.warn(`${label}: ${firstLine(error)}`)
      }
    }
    reports[plan.id] = {
      status: plan.status,
      ...(plan.unlisted === undefined ? {} : { unlisted: plan.unlisted }),
      snapshots,
    }
  }

  log.status('Indexing audited code')
  const strictIndex = withoutExpandedImports(inputs.index, plans)
  const scoped = new Set(
    Object.values(strictIndex.repositories).flatMap((byCommit) =>
      Object.values(byCommit).flatMap((s) => Object.values(s.files)),
    ),
  )
  const strict = buildAuditedCode(
    strictIndex,
    new Map([...inputs.objects].filter(([object]) => scoped.has(object))),
    () => {},
  )
  const upstream = new Map<string, string>()
  const relaxed = withImpliedUnits(
    strict,
    implied.map(({ report, unit }): ImpliedCode => {
      const object = impliedObjectId(unit)
      upstream.set(object, unit.origin.blob)
      return {
        object,
        name: unit.name,
        source: unit.content,
        occurrence: {
          repository: unit.origin.repository,
          commit: unit.origin.commit,
          timestamp: unit.timestamp,
          path: unit.origin.path,
          findings: { [report]: [] },
          directoryScoped: [],
          collections: [project],
        },
      }
    }),
  )

  const units: ScopeUnits = {}
  const auditedFiles: ScopeFiles = {}
  const discovered = new ConfigReader(
    getDiscoveryPaths().discovery,
  ).readDiscovery(project)
  const seen = new Set<string>()
  for (const entry of discovered.entries) {
    if (entry.type !== 'Contract') continue
    for (const address of [
      entry.address,
      ...get$Implementations(entry.values),
    ]) {
      log.status(`Covering ${address}`)
      const source = await getDeployedSource(address)
      if (source.kind !== 'flat') continue
      const flat = createHash('sha256').update(source.flat).digest('hex')
      if (seen.has(flat)) continue
      seen.add(flat)
      const cover = (code: AuditedCode) =>
        coverFlat(source.flat, source.aliases, code, project)
      const strictUnits = cover(strict)
      const relaxedUnits = cover(relaxed)
      strictUnits.forEach((covered, i) => {
        const other = relaxedUnits[i] as CoveredUnit
        assert(covered.id === other.id, 'Readings split a flat differently')
        addFile(auditedFiles, covered, inputs.objects, upstream)
        const differs =
          JSON.stringify(covered.unit) !== JSON.stringify(other.unit)
        if (differs) addFile(auditedFiles, other, inputs.objects, upstream)
        units[covered.id] = {
          strict: covered.unit,
          ...(differs
            ? { relaxed: { ...other.unit, impliedBy: other.impliedBy ?? [] } }
            : {}),
        }
      })
    }
  }

  const reportIds = new Set([
    ...Object.keys(reports),
    ...Object.values(units).flatMap((unit) => [
      ...(unit.strict.reports ?? []),
      ...(unit.relaxed?.reports ?? []),
    ]),
  ])
  const reportInfo: ProjectAuditScope['reportInfo'] = {}
  const collections: ProjectAuditScope['collections'] = {}
  for (const id of [...reportIds].sort()) {
    const report = inputs.index.reports[id]
    if (report === undefined) continue
    const { title, auditor, date, document } = report
    reportInfo[id] = {
      collections: report.collections,
      title,
      auditor,
      ...(date === null ? {} : { date }),
      document,
    }
    for (const collection of report.collections) {
      const info = inputs.index.collections[collection]
      if (info !== undefined) collections[collection] = info
    }
  }

  return {
    schema_version: '0.1.0',
    project,
    dataset: inputs.dataset,
    reports,
    reportInfo,
    collections,
    auditedFiles: Object.fromEntries(
      Object.entries(auditedFiles).sort(([a], [b]) => (a < b ? -1 : 1)),
    ),
    units,
  }
}

/**
 * The export without the files its import expansion added to these reports:
 * only the paths a report lists stay scoped, and a file no remaining audit
 * covers is dropped.
 */
function withoutExpandedImports(
  index: AuditIndex,
  plans: ReportPlan[],
): AuditIndex {
  const named = new Map(plans.map((plan) => [plan.id, plan.named]))
  const repositories: AuditIndex['repositories'] = {}
  for (const [repository, byCommit] of Object.entries(index.repositories)) {
    for (const [commit, snapshot] of Object.entries(byCommit)) {
      const audits: typeof snapshot.audits = {}
      for (const [report, paths] of Object.entries(snapshot.audits)) {
        const listed = named.get(report)?.get(`${repository}@${commit}`)
        const kept =
          named.get(report) === undefined
            ? paths
            : Object.fromEntries(
                Object.entries(paths).filter(([p]) => listed?.has(p)),
              )
        if (Object.keys(kept).length > 0) audits[report] = kept
      }
      const scoped = Object.values(audits).flatMap((paths) =>
        Object.keys(paths),
      )
      const files = Object.fromEntries(
        Object.entries(snapshot.files).filter(([file]) =>
          scoped.some((p) => file === p || file.startsWith(`${p}/`)),
        ),
      )
      if (Object.keys(files).length === 0) continue
      repositories[repository] ??= {}
      repositories[repository][commit] = { ...snapshot, files, audits }
    }
  }
  return { ...index, repositories }
}

const OBJECT_ID_LENGTH = 12

function impliedObjectId(unit: ImpliedUnit): string {
  return createHash('sha1')
    .update(`${unit.origin.blob}\0${unit.name}`)
    .digest('hex')
    .slice(0, OBJECT_ID_LENGTH)
}

function addFile(
  files: ScopeFiles,
  covered: CoveredUnit,
  objects: AuditObjects,
  upstream: Map<string, string>,
) {
  if (covered.auditedFile === undefined) return
  const { object, file } = covered.auditedFile
  const blob = upstream.get(object)
  if (blob !== undefined) {
    files[object] = { ...file, blob, upstream: true }
    return
  }
  const content = objects.get(object)
  assert(content !== undefined, `Object ${object} is not in the bundle`)
  files[object] = { ...file, blob: sha1BlobId(content) }
}

/** Lines of counted units covered under a reading, over distinct units. */
export function coveredLines(
  scope: ProjectAuditScope,
  reading: 'strict' | 'relaxed',
): { total: number; covered: number } {
  let total = 0
  let covered = 0
  for (const entry of Object.values(scope.units)) {
    const unit: Unit =
      reading === 'relaxed' ? (entry.relaxed ?? entry.strict) : entry.strict
    if (unit.kind === 'interface') continue
    total += unit.lines
    if (unit.status === 'identical') covered += unit.lines
    if (unit.status === 'differs') covered += unit.covered ?? 0
  }
  return { total, covered }
}

function firstLine(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  return message.split('\n').find((line) => line.trim().length > 0) ?? ''
}
