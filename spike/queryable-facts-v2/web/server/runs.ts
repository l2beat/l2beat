// What the API serves about runs: the inputs to choose from, the list of runs on disk, one run's
// summary and library, one unit, pages of rows, one ask. Everything is read from the run folder.

import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { basename, join } from 'path'
import type { AskEvent } from '../../src/agent'
import { listAsks } from '../../src/agent'
import { listProjects } from '../../src/discovery'
import { BASE_RELATIONS } from '../../src/emit'
import {
  CACHE_DIR,
  FIXTURES_DIR,
  LOCAL_PROJECTS_DIR,
  listRuns,
  PROJECTS_DIR,
  projectDir,
  RULES_DIR,
  RUNS_DIR,
  runDirOf,
  slugify,
  timestamp,
} from '../../src/paths'
import {
  loadRun,
  type RunMeta,
  type RunProgress,
  readRelation,
  runAll,
  runLibrary,
  unitDir,
} from '../../src/pipeline'
import { listQueries } from '../../src/query'
import type { Library } from '../../src/rules'
import { readTsv } from '../../src/souffle'
import type {
  AskDetail,
  Inputs,
  LibraryInfo,
  RowsPage,
  RunInfo,
  RunListItem,
  RunRequest,
  StorageEntry,
  UnitInfo,
} from '../shared/types'

export function listInputs(): Inputs {
  const choice =
    (where: 'synthetic' | 'config') =>
    (p: ReturnType<typeof listProjects>[number]) => ({
      id: p.id,
      name: p.name,
      where,
      contracts: p.contracts,
      eoas: p.eoas,
      units: p.units,
      timestamp: p.timestamp,
    })
  const projects = [
    ...listProjects(LOCAL_PROJECTS_DIR).map(choice('synthetic')),
    ...listProjects(PROJECTS_DIR).map(choice('config')),
  ]
  const fixtures = existsSync(FIXTURES_DIR)
    ? readdirSync(FIXTURES_DIR)
        .filter((f) => f.endsWith('.sol'))
        .sort()
        .map((f) => {
          const text = readFileSync(join(FIXTURES_DIR, f), 'utf8')
          return {
            id: f,
            label: f,
            lines: text.split('\n').length,
            bytes: Buffer.byteLength(text),
          }
        })
    : []
  return { projects, fixtures }
}

export function listRunItems(): RunListItem[] {
  return listRuns().map((r) => {
    const meta = loadRun(r.dir)
    const asks = join(r.dir, 'asks')
    return {
      id: r.id,
      name: meta.name,
      kind: meta.input.kind,
      createdAt: meta.createdAt,
      units: meta.units.length,
      ok: meta.units.filter((u) => u.status === 'ok').length,
      asks: existsSync(asks) ? readdirSync(asks).length : 0,
    }
  })
}

function lineCount(path: string): number {
  if (!existsSync(path)) return 0
  const text = readFileSync(path, 'utf8')
  if (text.length === 0) return 0
  return text.split('\n').length - (text.endsWith('\n') ? 1 : 0)
}

const countsCache = new Map<
  string,
  { stamp: number; counts: Record<string, number> }
>()

/** Rows per relation for the whole run (see RunInfo.counts). Cached per run folder. */
function relationCounts(
  runDir: string,
  meta: RunMeta,
  lib: Library,
): Record<string, number> {
  const stamp = statSync(join(runDir, 'run.json')).mtimeMs
  const hit = countsCache.get(runDir)
  if (hit && hit.stamp === stamp) return hit.counts
  const counts: Record<string, number> = {}
  const okUnits = meta.units.filter((u) => u.status === 'ok')
  for (const rec of lib.relations.values()) {
    if (rec.stage === 'project')
      counts[rec.name] = lineCount(
        rec.kind === 'input'
          ? join(runDir, 'facts', `${rec.name}.facts`)
          : join(runDir, 'derived', `${rec.name}.csv`),
      )
    else if (rec.exported)
      counts[rec.name] = lineCount(join(runDir, 'facts', `${rec.name}.facts`))
    else {
      let n = 0
      for (const u of okUnits)
        n += lineCount(
          rec.kind === 'input'
            ? join(unitDir(runDir, u.slug), 'facts', `${rec.name}.facts`)
            : join(unitDir(runDir, u.slug), 'derived', `${rec.name}.csv`),
        )
      counts[rec.name] = n
    }
  }
  countsCache.set(runDir, { stamp, counts })
  return counts
}

function libraryInfo(lib: Library): LibraryInfo {
  return {
    files: lib.files,
    unit: lib.unit,
    project: lib.project,
    relations: [...lib.relations.values()],
    exported: lib.exported,
  }
}

export function runInfo(id: string): RunInfo {
  const runDir = runDirOf(id)
  const meta = loadRun(runDir)
  const lib = runLibrary(runDir)
  return {
    meta,
    counts: relationCounts(runDir, meta, lib),
    library: libraryInfo(lib),
  }
}

export function unitInfo(id: string, slug: string): UnitInfo {
  const runDir = runDirOf(id)
  const dir = unitDir(runDir, slug)
  if (!existsSync(join(dir, 'unit.json')))
    throw new Error(`unknown unit ${slug}`)
  const summary = JSON.parse(
    readFileSync(join(dir, 'unit.json'), 'utf8'),
  ) as UnitInfo['summary']
  const source = existsSync(join(dir, 'source.sol'))
    ? readFileSync(join(dir, 'source.sol'), 'utf8')
    : ''
  const factCounts: Record<string, number> = {}
  for (const r of Object.keys(BASE_RELATIONS))
    factCounts[r] = lineCount(join(dir, 'facts', `${r}.facts`))
  const derivedCounts: Record<string, number> = {}
  const derivedDir = join(dir, 'derived')
  if (existsSync(derivedDir))
    for (const f of readdirSync(derivedDir))
      if (f.endsWith('.csv'))
        derivedCounts[f.replace(/\.csv$/, '')] = lineCount(join(derivedDir, f))
  const storage: StorageEntry[] = []
  let solc: UnitInfo['solc'] = {
    astNodes: factCounts.node ?? 0,
    contracts: [],
    bytes: 0,
    warnings: 0,
  }
  const outPath = join(dir, 'solc-output.json')
  if (existsSync(outPath)) {
    const text = readFileSync(outPath, 'utf8')
    const output = JSON.parse(text) as {
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
            }
          }
        >
      >
      errors?: Array<{ severity: string }>
    }
    const contracts = Object.values(output.contracts ?? {})[0] ?? {}
    for (const [contract, data] of Object.entries(contracts))
      for (const s of data.storageLayout?.storage ?? [])
        storage.push({
          contract,
          label: s.label,
          slot: String(s.slot),
          offset: s.offset,
          type: s.type,
          astId: s.astId,
        })
    solc = {
      astNodes: factCounts.node ?? 0,
      contracts: Object.keys(contracts),
      bytes: Buffer.byteLength(text),
      warnings: (output.errors ?? []).filter((e) => e.severity !== 'error')
        .length,
    }
  }
  return { summary, source, factCounts, derivedCounts, storage, solc }
}

/** Raw solc output of a unit (can be large; fetched on demand). */
export function unitSolcOutput(id: string, slug: string): string {
  const path = join(unitDir(runDirOf(id), slug), 'solc-output.json')
  if (!existsSync(path)) throw new Error('no solc output')
  return readFileSync(path, 'utf8')
}

export function rowsPage(
  id: string,
  relation: string,
  opts: {
    unit?: string
    offset?: number
    limit?: number
    filter?: string
    ask?: string
    query?: string
  },
): RowsPage {
  const runDir = runDirOf(id)
  const lib = runLibrary(runDir)
  let columns = lib.relations.get(relation)?.columns
  let rows: string[][]
  if (opts.query) {
    // rows of a query's relation
    const base = opts.ask ? join(runDir, 'asks', opts.ask) : runDir
    if (!/^[\w.-]+$/.test(opts.query) || (opts.ask && !/^\d+$/.test(opts.ask)))
      throw new Error('bad query')
    const q = listQueries(base).find((x) => x.name === opts.query)
    if (!q) throw new Error(`unknown query ${opts.query}`)
    columns = q.declared.find((d) => d.name === relation)?.columns
    rows = q.rows[relation] ?? []
  } else {
    const rec = lib.relations.get(relation)
    if (!rec) throw new Error(`unknown relation ${relation}`)
    if (opts.unit) rows = readRelation(runDir, relation, opts.unit)
    else if (rec.stage === 'project' || rec.exported)
      rows = readRelation(runDir, relation)
    else {
      rows = []
      const meta = loadRun(runDir)
      for (const u of meta.units)
        if (u.status === 'ok')
          for (const r of readRelation(runDir, relation, u.slug)) rows.push(r)
    }
  }
  if (opts.filter) {
    const needles = opts.filter.toLowerCase().split(/\s+/).filter(Boolean)
    rows = rows.filter((r) => {
      const line = r.join('\t').toLowerCase()
      return needles.every((n) => line.includes(n))
    })
  }
  const offset = Math.max(0, opts.offset ?? 0)
  const limit = Math.min(1000, Math.max(1, opts.limit ?? 200))
  return {
    relation,
    columns: columns ?? [],
    total: rows.length,
    offset,
    rows: rows.slice(offset, offset + limit),
  }
}

export function fixtureSource(id: string): { name: string; source: string } {
  if (!/^[\w.-]+\.sol$/.test(id)) throw new Error('bad fixture id')
  const path = join(FIXTURES_DIR, id)
  if (!existsSync(path)) throw new Error(`unknown fixture ${id}`)
  return { name: basename(path), source: readFileSync(path, 'utf8') }
}

export async function startRun(
  req: RunRequest,
  emit: (event: RunProgress) => void,
): Promise<RunInfo> {
  let input: Parameters<typeof runAll>[0]['input']
  let name: string
  if (req.kind === 'project') {
    const dir = projectDir(req.id)
    if (!dir) throw new Error(`unknown project ${req.id}`)
    input = { kind: 'project', dir }
    name = req.id
  } else if (req.kind === 'fixture') {
    const f = fixtureSource(req.id)
    input = { kind: 'file', name: f.name, source: f.source }
    name = slugify(f.name)
  } else {
    if (typeof req.source !== 'string' || req.source.trim() === '')
      throw new Error('empty source')
    const fileName = (req.name || 'Pasted.sol').replace(/[^\w.-]+/g, '_')
    input = {
      kind: 'file',
      name: fileName.endsWith('.sol') ? fileName : `${fileName}.sol`,
      source: req.source,
    }
    name = slugify(fileName)
  }
  const id = `${name}-${timestamp()}`
  await runAll({
    input,
    outDir: join(RUNS_DIR, id),
    rulesDir: RULES_DIR,
    cacheDir: CACHE_DIR,
    onProgress: emit,
  })
  return runInfo(id)
}

export function askDetail(id: string, ask: string): AskDetail {
  if (!/^\d+$/.test(ask)) throw new Error('bad ask')
  const runDir = runDirOf(id)
  const dir = join(runDir, 'asks', ask)
  const record = listAsks(runDir).find((a) => a.ask === ask)
  if (!record) throw new Error(`unknown ask ${ask}`)
  const events = existsSync(join(dir, 'events.jsonl'))
    ? readFileSync(join(dir, 'events.jsonl'), 'utf8')
        .split('\n')
        .filter(Boolean)
        .map((l) => JSON.parse(l) as AskEvent)
    : []
  const queries = listQueries(dir).map((q) => ({
    ...q,
    text: existsSync(join(q.dir, 'query.dl'))
      ? readFileSync(join(q.dir, 'query.dl'), 'utf8')
      : '',
  }))
  return {
    record,
    briefing: existsSync(join(dir, 'briefing.md'))
      ? readFileSync(join(dir, 'briefing.md'), 'utf8')
      : '',
    events,
    queries,
  }
}

export { readTsv }
