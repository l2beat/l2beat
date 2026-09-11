// Project runs for the explorer: list the discovery projects that have flattened sources, describe
// one before running, run it (streaming progress), and rebuild a unit's RunResult from its folder on
// disk so steps 2–7 can show any unit of a project run without recompiling.

import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { join, relative, resolve } from 'path'
import { extractPragmaConstraints } from '../../src/compile'
import { listProjects, loadProject, type Project } from '../../src/discovery'
import { BASE_RELATIONS } from '../../src/emit'
import { runProject } from '../../src/project'
import type {
  ContractStorageLayout,
  Diagnostic,
  ProjectChoice,
  ProjectContractInfo,
  ProjectEvent,
  ProjectInfo,
  ProjectRunResult,
  ProjectUnitInfo,
  RunResult,
} from '../shared/types'
import { parseProgram } from './program'
import { ROOT, RUNS_DIR, timestamp } from './run'

export const PROJECTS_DIR = resolve(
  ROOT,
  '..',
  '..',
  'packages',
  'config',
  'src',
  'projects',
)

export function listProjectChoices(): ProjectChoice[] {
  return listProjects(PROJECTS_DIR).map((p) => ({
    id: p.id,
    name: p.name,
    contracts: p.contracts,
    eoas: p.eoas,
    units: p.units,
    timestamp: p.timestamp,
  }))
}

function projectDir(id: string): string {
  if (!/^[\w.-]+$/.test(id)) throw new Error('bad project id')
  const dir = join(PROJECTS_DIR, id)
  if (!existsSync(join(dir, 'discovered.json')))
    throw new Error(`unknown project ${id}`)
  return dir
}

function contractsOf(project: Project): ProjectContractInfo[] {
  const byAddress = new Map<string, ProjectContractInfo>()
  for (const e of project.discovered.entries) {
    if (e.type !== 'Contract') continue
    byAddress.set(e.address, {
      address: e.address,
      name: e.name ?? e.address,
      proxyType: e.proxyType ?? '',
      template: e.template ?? '',
      units: [],
    })
  }
  for (const u of project.units)
    byAddress.get(u.address)?.units.push(unitInfo(u))
  return [...byAddress.values()].sort((a, b) => a.name.localeCompare(b.name))
}

function unitInfo(u: Project['units'][number]): ProjectUnitInfo {
  return {
    unit: u.unit,
    slug: u.slug,
    address: u.address,
    entryName: u.entryName,
    codeAddress: u.codeAddress,
    contractName: u.contractName,
    role: u.role,
    bytes: u.bytes,
  }
}

export function projectInfo(id: string): ProjectInfo {
  const dir = projectDir(id)
  const project = loadProject(dir)
  return {
    id,
    name: project.name,
    dir: relative(ROOT, dir),
    contracts: contractsOf(project),
    eoas: project.discovered.entries.filter((e) => e.type === 'EOA').length,
    units: project.units.map(unitInfo),
    missing: project.missing.map((m) => ({
      entryName: m.entryName,
      contractName: m.contractName,
      expectedPath: m.expectedPath,
    })),
  }
}

/** Runs a whole project into out/runs/<project>-<timestamp>/, reporting progress through `emit`. */
export async function runProjectForExplorer(
  id: string,
  emit: (event: ProjectEvent) => void,
): Promise<ProjectRunResult> {
  const dir = projectDir(id)
  const runId = `${id}-${timestamp()}`
  const runDir = join(RUNS_DIR, runId)
  const result = await runProject({
    projectDir: dir,
    outDir: runDir,
    rulesDir: join(ROOT, 'rules'),
    cacheDir: join(ROOT, '.cache'),
    outputAllRelations: true,
    onProgress: (e) => emit(e),
  })
  const contracts = contractsOf(result.project)
  const summaries = new Map(result.units.map((u) => [u.unit, u]))
  for (const c of contracts)
    c.units = c.units.map((u) => {
      const s = summaries.get(u.unit)
      return s
        ? {
            ...u,
            status: s.status,
            error: s.error,
            solcVersion: s.solcVersion,
            timings: s.timings,
            baseRows: s.baseRows,
            derivedRows: s.derivedRows,
          }
        : u
    })
  return {
    kind: 'project',
    runId,
    runDir: relative(ROOT, runDir),
    project: result.project.name,
    projectId: id,
    contracts,
    units: result.units.map((s) => ({
      ...unitInfo(s),
      status: s.status,
      error: s.error,
      solcVersion: s.solcVersion,
      timings: s.timings,
      baseRows: s.baseRows,
      derivedRows: s.derivedRows,
    })),
    discovery: Object.keys(result.discovery.arity).map((relation) => ({
      relation,
      rows: result.discovery.entries(relation),
    })),
    imported: result.imported,
    program: parseProgram(result.program),
    derived: [...result.derived.entries()].map(([relation, rows]) => ({
      relation,
      rows,
    })),
    souffle: result.souffle,
    timings: result.timings,
    report: result.report,
    files: readdirSync(runDir).sort(),
  }
}

function readTsv(path: string): string[][] {
  if (!existsSync(path)) return []
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => line.split('\t'))
}

/** The folder of a unit inside a project run, checked to be one. */
export function unitRunDir(runId: string, slug: string): string {
  if (!/^[\w.-]+$/.test(runId)) throw new Error('bad runId')
  if (!/^[\w.-]+$/.test(slug)) throw new Error('bad unit')
  const dir = join(RUNS_DIR, runId, 'units', slug)
  if (!existsSync(join(dir, 'run.json')))
    throw new Error(`unknown unit ${slug} in ${runId}`)
  return dir
}

/**
 * Rebuilds a RunResult from a unit run folder: source.sol, solc-input/output.json, facts/, derived/,
 * program.dl, report.md and run.json are all there, so nothing is recompiled.
 */
export function loadUnitRun(runId: string, slug: string): RunResult {
  const dir = unitRunDir(runId, slug)
  const meta = JSON.parse(readFileSync(join(dir, 'run.json'), 'utf8')) as {
    unit: string
    solcVersion?: string
    resolvedFrom?: string
    souffle?: { command: string; stderr: string; version: string }
    timings?: RunResult['timings']
    syntheticIds?: number
  }
  const unit = meta.unit
  const source = readFileSync(join(dir, 'source.sol'), 'utf8')
  const output = JSON.parse(
    readFileSync(join(dir, 'solc-output.json'), 'utf8'),
  ) as {
    sources?: Record<string, { ast?: unknown }>
    contracts?: Record<
      string,
      Record<
        string,
        {
          storageLayout?: {
            storage: Array<{
              label: string
              slot: string
              offset: number
              type: string
              astId: number
            }>
            types?: Record<
              string,
              { label: string; numberOfBytes: string; encoding: string }
            >
          }
        }
      >
    >
    errors?: Diagnostic[]
  }
  const input = existsSync(join(dir, 'solc-input.json'))
    ? (JSON.parse(readFileSync(join(dir, 'solc-input.json'), 'utf8')) as {
        sources?: Record<string, { content?: string }>
      })
    : {}
  const ast = output.sources?.[unit]?.ast
  if (!ast || typeof ast !== 'object') throw new Error(`no AST in ${dir}`)
  const storageLayout: ContractStorageLayout[] = []
  for (const [contract, data] of Object.entries(
    output.contracts?.[unit] ?? {},
  )) {
    const layout = data.storageLayout
    if (!layout) continue
    storageLayout.push({
      contract,
      storage: layout.storage.map((s) => ({
        label: s.label,
        slot: String(s.slot),
        offset: s.offset,
        type: s.type,
        astId: s.astId,
      })),
      types: Object.fromEntries(
        Object.entries(layout.types ?? {}).map(([k, v]) => [
          k,
          {
            label: v.label,
            numberOfBytes: String(v.numberOfBytes),
            encoding: v.encoding,
          },
        ]),
      ),
    })
  }
  const facts = Object.keys(BASE_RELATIONS).map((relation) => ({
    relation,
    rows: readTsv(join(dir, 'facts', `${relation}.facts`)),
  }))
  const derivedDir = join(dir, 'derived')
  const derived = existsSync(derivedDir)
    ? readdirSync(derivedDir)
        .filter((f) => f.endsWith('.csv'))
        .sort()
        .map((f) => ({
          relation: f.replace(/\.csv$/, ''),
          rows: readTsv(join(derivedDir, f)),
        }))
    : []
  const program = readFileSync(join(dir, 'program.dl'), 'utf8')
  const report = existsSync(join(dir, 'report.md'))
    ? readFileSync(join(dir, 'report.md'), 'utf8')
    : ''
  const timings = meta.timings ?? {
    resolveMs: 0,
    compileMs: 0,
    emitMs: 0,
    souffleMs: 0,
    reportMs: 0,
  }
  return {
    runId,
    runDir: relative(ROOT, dir),
    unit,
    unitSlug: slug,
    source,
    compile: {
      constraints: extractPragmaConstraints(source),
      solcVersion: meta.solcVersion ?? '?',
      resolvedFrom: meta.resolvedFrom ?? '?',
      backend: 'native',
      warnings: (output.errors ?? []).filter((e) => e.severity !== 'error')
        .length,
      input: {
        ...input,
        sources: Object.fromEntries(
          Object.keys(input.sources ?? {}).map((k) => [
            k,
            { content: '<the source text>' },
          ]),
        ),
      },
      diagnostics: (output.errors ?? []).map((e) => ({
        severity: e.severity,
        message: e.message,
        formattedMessage: e.formattedMessage,
      })),
    },
    ast: ast as RunResult['ast'],
    storageLayout,
    facts,
    syntheticIds: meta.syntheticIds ?? 0,
    program: parseProgram(program),
    derived,
    souffle: meta.souffle ?? { command: '', stderr: '', version: '' },
    timings,
    report,
    files: readdirSync(dir).sort(),
  }
}

/** Size of a unit's source, for the picker. */
export function unitBytes(path: string): number {
  return statSync(path).size
}
