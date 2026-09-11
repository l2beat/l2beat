// Queries: rules an agent (or a person) writes against a run. A query program declares and reads only
// the library relations it mentions (`.input` with explicit file names, from the run's derived files),
// adds the new rules, and writes out the relations the query declares. Nothing is recomputed: the
// library's tuples are read back from disk, so a query costs Soufflé's start-up plus the new joins.
//
// Two levels, decided from the relations a query mentions:
//   project   only exported unit relations, discovery facts and project relations: one program over
//             the union of all units. Such a query *composes* reviewed relations.
//   unit      it mentions a layer-0 fact relation or a unit-internal relation (ones keyed by node ids):
//             one program per unit, results united. Such a query *interprets* the syntax tree anew,
//             and its results should be read as experimental until reviewed.

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import { join, resolve } from 'path'
import { loadRun, type RunMeta, runLibrary, unitDir } from './pipeline'
import {
  bodyRelations,
  type Column,
  type ProgramDecl,
  parseProgram,
} from './program'
import { formatDecl, type Library, type RelationRecord } from './rules'
import { readTsv, runSouffle, SouffleError } from './souffle'

export type QueryLevel = 'project' | 'unit'
export type QueryClass = 'composition' | 'interpretation'

export interface QueryResult {
  name: string
  dir: string
  /** The rules as written. */
  text: string
  level: QueryLevel
  classification: QueryClass
  /** Relations the query declares, with their columns. */
  declared: Array<{ name: string; columns: Column[] }>
  /** Relations printed: the query's `.output`s, or every declared relation when it has none. */
  outputs: string[]
  /** Library relations the query reads. */
  reads: string[]
  /** The ones that forced unit level (layer-0 facts and unit-internal relations). */
  unitOnly: string[]
  rows: Record<string, string[][]>
  ms: number
  /** Units the query ran in (unit level). */
  units?: string[]
  error?: string
}

const FUNCTORS = new Set([
  'cat',
  'count',
  'min',
  'max',
  'sum',
  'to_string',
  'to_number',
  'strlen',
  'substr',
  'match',
  'contains',
  'ord',
  'range',
  'as',
  'mean',
])

/** Every relation name that appears in a rule body or a head of the query text. */
function mentioned(text: string): { heads: Set<string>; bodies: Set<string> } {
  const program = parseProgram(text)
  const heads = new Set<string>()
  const bodies = new Set<string>()
  for (const item of program.items) {
    if (item.kind === 'clause') {
      heads.add(item.head)
      for (const r of bodyRelations(item.text)) bodies.add(r)
    }
  }
  return { heads, bodies }
}

/** Where a library relation's rows live in a run (project stage), as a path Soufflé can read. */
function projectPath(runDir: string, rel: RelationRecord): string {
  if (rel.stage === 'project')
    return rel.kind === 'input'
      ? join(runDir, 'facts', `${rel.name}.facts`)
      : join(runDir, 'derived', `${rel.name}.csv`)
  return join(runDir, 'facts', `${rel.name}.facts`)
}

function unitPath(runDir: string, slug: string, rel: RelationRecord): string {
  const dir = unitDir(runDir, slug)
  return rel.kind === 'input'
    ? join(dir, 'facts', `${rel.name}.facts`)
    : join(dir, 'derived', `${rel.name}.csv`)
}

function inputLine(rel: RelationRecord, path: string): string {
  return `${formatDecl(rel.name, rel.columns)}\n.input ${rel.name}(IO=file, filename=${JSON.stringify(path)})`
}

/** `.output` for every declared relation the text does not output already. */
function outputLines(text: string, declared: string[]): string {
  const has = new Set(
    [...text.matchAll(/^\.output\s+(\w+)/gm)].map((m) => m[1] ?? ''),
  )
  return declared
    .filter((d) => !has.has(d))
    .map((d) => `.output ${d}`)
    .join('\n')
}

export function classify(
  lib: Library,
  text: string,
): {
  level: QueryLevel
  classification: QueryClass
  reads: RelationRecord[]
  unitOnly: string[]
  unknown: string[]
  declared: ProgramDecl[]
} {
  const program = parseProgram(text)
  const declared = program.items.filter(
    (i): i is ProgramDecl => i.kind === 'decl',
  )
  const own = new Set(declared.map((d) => d.relation))
  const { heads, bodies } = mentioned(text)
  const unknown = [...new Set([...heads, ...bodies])].filter(
    (r) => !own.has(r) && !lib.relations.has(r) && !FUNCTORS.has(r),
  )
  const reads = [...bodies]
    .filter((r) => !own.has(r))
    .map((r) => lib.relations.get(r))
    .filter((r): r is RelationRecord => Boolean(r))
  const unitOnly = reads
    .filter((r) => r.stage === 'unit' && !r.exported)
    .map((r) => r.name)
  const level: QueryLevel = unitOnly.length > 0 ? 'unit' : 'project'
  return {
    level,
    classification: level === 'unit' ? 'interpretation' : 'composition',
    reads,
    unitOnly,
    unknown,
    declared,
  }
}

function runOne(
  program: string,
  dir: string,
  souffle?: string,
): { ms: number; error?: string } {
  mkdirSync(join(dir, 'out'), { recursive: true })
  const path = join(dir, 'program.dl')
  writeFileSync(path, program)
  try {
    const run = runSouffle({
      program: path,
      facts: dir,
      out: join(dir, 'out'),
      souffle,
    })
    return { ms: run.ms }
  } catch (e) {
    if (e instanceof SouffleError)
      return {
        ms: 0,
        error:
          `${e.message}\n${(e.stderr || e.stdout).replace(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 'program.dl')}`.trim(),
      }
    throw e
  }
}

/**
 * Runs the rules in `text` against the run at `runDir`, inside `dir` (created). Returns the rows of
 * every output relation; Soufflé's error text when the rules do not compile.
 */
export function runQuery(
  runDirIn: string,
  text: string,
  dirIn: string,
  name: string,
  opts: { souffle?: string; meta?: RunMeta; lib?: Library } = {},
): QueryResult {
  // Soufflé prepends its fact directory to relative file names: everything must be absolute
  const runDir = resolve(runDirIn)
  const dir = resolve(dirIn)
  const meta = opts.meta ?? loadRun(runDir)
  const lib = opts.lib ?? runLibrary(runDir)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'query.dl'), text)
  const c = classify(lib, text)
  const declared = c.declared.map((d) => ({
    name: d.relation,
    columns: d.columns,
  }))
  const outputs = (() => {
    const explicit = [...text.matchAll(/^\.output\s+(\w+)/gm)].map(
      (m) => m[1] ?? '',
    )
    return explicit.length > 0 ? explicit : declared.map((d) => d.name)
  })()
  const base: QueryResult = {
    name,
    dir,
    text,
    level: c.level,
    classification: c.classification,
    declared,
    outputs,
    reads: c.reads.map((r) => r.name),
    unitOnly: c.unitOnly,
    rows: {},
    ms: 0,
  }
  if (c.unknown.length > 0) {
    const result = {
      ...base,
      error: `unknown relation(s): ${c.unknown.join(', ')} — declare them with .decl, or use a library relation (./q catalog)`,
    }
    writeFileSync(join(dir, 'result.json'), JSON.stringify(result, null, 2))
    return result
  }
  if (declared.length === 0) {
    const result = {
      ...base,
      error:
        'the query declares no relation: add `.decl name(Col: type, ...)` and rules for it',
    }
    writeFileSync(join(dir, 'result.json'), JSON.stringify(result, null, 2))
    return result
  }
  const body = `// ----- ${name} -----\n${text}\n${outputLines(
    text,
    declared.map((d) => d.name),
  )}\n`
  let result: QueryResult
  if (c.level === 'project') {
    const imports = c.reads
      .map((r) => inputLine(r, projectPath(runDir, r)))
      .join('\n')
    const run = runOne(
      `// ----- inputs -----\n${imports}\n\n${body}`,
      dir,
      opts.souffle,
    )
    const rows: Record<string, string[][]> = {}
    if (!run.error)
      for (const o of outputs) rows[o] = readTsv(join(dir, 'out', `${o}.csv`))
    result = { ...base, rows, ms: run.ms, error: run.error }
  } else {
    const units = meta.units.filter((u) => u.status === 'ok').map((u) => u.slug)
    const rows: Record<string, string[][]> = {}
    const seen: Record<string, Set<string>> = {}
    for (const o of outputs) {
      rows[o] = []
      seen[o] = new Set()
    }
    let ms = 0
    let error: string | undefined
    for (const slug of units) {
      const imports = c.reads
        .map((r) =>
          inputLine(
            r,
            r.stage === 'project'
              ? projectPath(runDir, r)
              : unitPath(runDir, slug, r),
          ),
        )
        .join('\n')
      const udir = join(dir, 'units', slug)
      const run = runOne(
        `// ----- inputs (unit ${slug}) -----\n${imports}\n\n${body}`,
        udir,
        opts.souffle,
      )
      ms += run.ms
      if (run.error) {
        error = run.error
        break
      }
      for (const o of outputs)
        for (const row of readTsv(join(udir, 'out', `${o}.csv`))) {
          const key = row.join('\t')
          if (!seen[o]?.has(key)) {
            seen[o]?.add(key)
            rows[o]?.push(row)
          }
        }
    }
    result = { ...base, rows, ms, units, error }
  }
  writeFileSync(join(dir, 'result.json'), JSON.stringify(result, null, 2))
  return result
}

/** The queries saved under `dir/queries`, most recent last. */
export function listQueries(dir: string): QueryResult[] {
  const qdir = join(dir, 'queries')
  if (!existsSync(qdir)) return []
  return readdirSync(qdir)
    .sort()
    .filter((d) => existsSync(join(qdir, d, 'result.json')))
    .map(
      (d) =>
        JSON.parse(
          readFileSync(join(qdir, d, 'result.json'), 'utf8'),
        ) as QueryResult,
    )
}
