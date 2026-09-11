// `q`: the commands a person or an agent uses inside a run folder. Deliberately few: the questions
// come from the rule language, not from a list of commands.
//
//   ./q catalog [--all]                       the relations, one line each (--all: unit-internal ones too)
//   ./q show <relation>                       declaration, meaning, rules, count, sample rows
//   ./q rows <relation> [text...] [--unit s] [--limit N]   rows containing every text, printed as atoms
//   ./q run <file.dl> [--name n] [--limit N]  run rules against the run; print the tuples they derive
//   ./q why '<atom>' [--depth N]              the proof tree of a tuple; leaves say where to continue
//   ./q source <id> | <unit> [<a>-<b>]        source lines
//   ./q units                                 the source files of the run
//
// Runs as `tsx src/cli.ts q --run <dir> ...` behind the `q` shim the pipeline writes into every run.

import { existsSync, readdirSync, readFileSync } from 'fs'
import { join, resolve } from 'path'
import {
  loadRun,
  type RunMeta,
  readRelation,
  runLibrary,
  unitDir,
} from './pipeline'
import type { ProgramClause } from './program'
import { allQueryDirs, explainAnywhere } from './proof'
import { listQueries, runQuery } from './query'
import {
  catalog,
  firstLine,
  formatDecl,
  type Library,
  type RelationRecord,
} from './rules'
import { formatAtom, type ProofNode, readTsv } from './souffle'

type Flags = Record<string, string | boolean>

const out: string[] = []
const print = (s = '') => out.push(s)
const flush = () => {
  if (out.length > 0) process.stdout.write(`${out.join('\n')}\n`)
  out.length = 0
}

function fail(message: string): never {
  flush()
  process.stderr.write(`${message}\n`)
  process.exit(1)
}

function limitOf(flags: Flags, fallback = 40): number {
  return typeof flags.limit === 'string' ? Number(flags.limit) : fallback
}

interface Ctx {
  runDir: string
  askDir?: string
  meta: RunMeta
  lib: Library
}

function rowsOf(ctx: Ctx, rec: RelationRecord, slug?: string): string[][] {
  if (slug) return readRelation(ctx.runDir, rec.name, slug)
  if (rec.stage === 'project' || rec.exported)
    return readRelation(ctx.runDir, rec.name)
  // unit-internal: the union over units, each row prefixed with nothing (ids carry the unit already
  // when they are names; node ids do not, so the caller should pass --unit)
  const all: string[][] = []
  for (const u of ctx.meta.units)
    if (u.status === 'ok')
      for (const r of readRelation(ctx.runDir, rec.name, u.slug)) all.push(r)
  return all
}

function cmdCatalog(ctx: Ctx, flags: Flags): void {
  print(catalog(ctx.lib, Boolean(flags.all)))
}

function cmdUnits(ctx: Ctx): void {
  print('# slug\tunit\trole\taddress\tentry\tsolc\tstatus')
  for (const u of ctx.meta.units)
    print(
      [
        u.slug,
        u.unit,
        u.role ?? '',
        u.address ?? '',
        u.entryName ?? '',
        (u.solcVersion ?? '').split('+')[0],
        u.status,
      ].join('\t'),
    )
}

function cmdShow(ctx: Ctx, args: string[], flags: Flags): void {
  const name = args[0]
  if (!name) fail('usage: q show <relation>')
  const rec = ctx.lib.relations.get(name)
  if (!rec) fail(`unknown relation ${name} (see ./q catalog --all)`)
  const program = rec.stage === 'unit' ? ctx.lib.unit : ctx.lib.project
  print(
    `# ${rec.section} · ${rec.file}:${rec.line} · ${rec.stage} stage · ${rec.kind}${rec.exported ? ', exported' : rec.stage === 'unit' && rec.kind === 'derived' ? ', unit-internal (usable in unit-level queries only)' : ''}`,
  )
  print(formatDecl(rec.name, rec.columns))
  if (rec.comment) for (const l of rec.comment.split('\n')) print(`// ${l}`)
  const clauses = program.items.filter(
    (i): i is ProgramClause => i.kind === 'clause' && i.head === rec.name,
  )
  if (clauses.length > 0) {
    print()
    for (const c of clauses) {
      if (c.comment) for (const l of c.comment.split('\n')) print(`// ${l}`)
      print(c.text)
    }
  }
  const rows = rowsOf(ctx, rec)
  const limit = limitOf(flags, 8)
  print()
  print(
    `# ${rows.length} row${rows.length === 1 ? '' : 's'}${rows.length > limit ? `, first ${limit}` : ''}`,
  )
  for (const r of rows.slice(0, limit))
    print(formatAtom(rec.name, r, rec.columns))
}

function cmdRows(ctx: Ctx, args: string[], flags: Flags): void {
  const [name, ...filters] = args
  if (!name)
    fail('usage: q rows <relation> [text...] [--unit <slug>] [--limit N]')
  const rec = ctx.lib.relations.get(name)
  if (!rec) fail(`unknown relation ${name} (see ./q catalog --all)`)
  const slug = typeof flags.unit === 'string' ? flags.unit : undefined
  const needles = filters.map((f) => f.toLowerCase())
  const rows = rowsOf(ctx, rec, slug).filter((r) => {
    const line = r.join('\t').toLowerCase()
    return needles.every((n) => line.includes(n))
  })
  const limit = limitOf(flags)
  print(
    `# ${rec.name}(${rec.columns.map((c) => c.name).join(', ')}) — ${rows.length} row${rows.length === 1 ? '' : 's'}${needles.length ? ` containing ${needles.map((n) => JSON.stringify(n)).join(' and ')}` : ''}${rows.length > limit ? `, first ${limit} (--limit)` : ''}`,
  )
  for (const r of rows.slice(0, limit))
    print(formatAtom(rec.name, r, rec.columns))
}

function nextQueryName(dir: string): string {
  const existing = listQueries(dir).map((q) => q.name)
  let k = existing.length + 1
  while (existing.includes(`q${k}`)) k++
  return `q${k}`
}

function cmdRun(ctx: Ctx, args: string[], flags: Flags): void {
  const file = args[0]
  if (!file) fail('usage: q run <file.dl> [--name <name>] [--limit N]')
  const path = resolve(process.cwd(), file)
  if (!existsSync(path)) fail(`no such file ${file}`)
  const base = ctx.askDir ?? ctx.runDir
  const name =
    typeof flags.name === 'string' && /^[\w.-]+$/.test(flags.name)
      ? flags.name
      : nextQueryName(base)
  const result = runQuery(
    ctx.runDir,
    readFileSync(path, 'utf8'),
    join(base, 'queries', name),
    name,
    { meta: ctx.meta, lib: ctx.lib },
  )
  const where =
    result.level === 'project'
      ? 'project level: composes reviewed relations'
      : `unit level in ${result.units?.length ?? 0} units: reads ${result.unitOnly.join(', ')} — an interpretation of the syntax tree, experimental until reviewed`
  print(
    `# ${name} · ${where} · reads ${result.reads.join(', ') || 'nothing from the library'} · ${Math.round(result.ms)} ms`,
  )
  if (result.error) {
    print(`# error`)
    print(result.error)
    flush()
    process.exit(1)
  }
  const limit = limitOf(flags)
  for (const rel of result.outputs) {
    const decl = result.declared.find((d) => d.name === rel)
    const rows = result.rows[rel] ?? []
    print()
    print(
      `# ${rel}(${(decl?.columns ?? []).map((c) => c.name).join(', ')}) — ${rows.length} row${rows.length === 1 ? '' : 's'}${rows.length > limit ? `, first ${limit} (--limit)` : ''}`,
    )
    if (rows.length === 0)
      print(
        '# (no rows: check the names you matched with ./q rows <relation> <text>)',
      )
    for (const r of rows.slice(0, limit))
      print(formatAtom(rel, r, decl?.columns ?? []))
  }
}

function collapse(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

function printProof(
  node: ProofNode,
  depth: number,
  ctx: Ctx,
  shown = new Set<string>(),
): void {
  const pad = '  '.repeat(depth)
  if (node.kind === 'constraint') return
  if (node.kind === 'missing') {
    print(`${pad}✗ ${node.text}`)
    return
  }
  if (node.kind === 'negation') {
    print(`${pad}∄ ${node.text}   (no such tuple)`)
    return
  }
  if (node.kind === 'fact') {
    const relation = /^(\w+)\(/.exec(node.text)?.[1] ?? ''
    const rec = ctx.lib.relations.get(relation)
    let note = ''
    if (node.stage === 'solidity') note = 'solc fact'
    else if (node.stage === 'discovery') note = 'discovery fact'
    else if (rec?.kind === 'derived')
      note = `derived in the ${node.stage ?? rec.stage} stage — continue with ./q why '${node.text}'`
    print(`${pad}● ${node.text}   ← ${note}`)
    return
  }
  if (shown.has(node.text)) {
    print(`${pad}↳ ${node.text}   (derived above)`)
    return
  }
  shown.add(node.text)
  print(`${pad}${depth === 0 ? '⊢' : '↳'} ${node.text}`)
  if (node.rule)
    print(`${pad}    rule ${node.ruleNumber ?? ''}: ${collapse(node.rule)}`)
  for (const c of node.children) printProof(c, depth + 1, ctx, shown)
}

function cmdWhy(ctx: Ctx, args: string[], flags: Flags): void {
  const atom = args.join(' ').trim()
  if (!atom) fail('usage: q why \'<relation>("a", "b", 3)\'')
  const queryDirs = [
    ...(ctx.askDir ? allQueryDirsOf(ctx.askDir) : []),
    ...allQueryDirs(ctx.runDir),
  ]
  const explained = explainAnywhere(ctx.runDir, atom, {
    queryDirs: [...new Set(queryDirs)],
    depth: typeof flags.depth === 'string' ? Number(flags.depth) : undefined,
  })
  const h = explained.located.home
  print(
    `# ${explained.located.atom} · ${h.stage === 'query' ? `query ${h.query}` : `${h.stage} stage`}${h.slug ? ` · unit ${h.slug}` : ''} · ${Math.round(explained.ms)} ms`,
  )
  printProof(explained.proof, 0, ctx)
}

function allQueryDirsOf(askDir: string): string[] {
  const q = join(askDir, 'queries')
  if (!existsSync(q)) return []
  return readdirSync(q)
    .sort()
    .map((d) => join(q, d))
}

function unitBySlugOrName(ctx: Ctx, text: string) {
  return ctx.meta.units.find(
    (u) => u.slug === text || u.unit === text || u.unit === `${text}.sol`,
  )
}

function cmdSource(ctx: Ctx, args: string[]): void {
  const [what, range] = args
  if (!what) fail('usage: q source <id> | q source <unit> [<from>-<to>]')
  let unit = unitBySlugOrName(ctx, what)
  let from = 1
  let to = Number.POSITIVE_INFINITY
  if (unit) {
    const m = /^(\d+)(?:-(\d+))?$/.exec(range ?? '')
    if (m) {
      from = Number(m[1])
      to = m[2] ? Number(m[2]) : from
    } else if (!range) to = from + 60
  } else {
    // an id: look it up in sourceLoc (Id, File, StartLine, EndLine, Start, Length)
    const loc = readTsv(join(ctx.runDir, 'facts', 'sourceLoc.facts')).find(
      (r) => r[0] === what,
    )
    if (!loc)
      fail(
        `${what} is neither a unit nor an id with a source location (try ./q rows sourceLoc <text>)`,
      )
    unit = unitBySlugOrName(ctx, loc[1] ?? '')
    if (!unit) fail(`unit ${loc[1]} not in this run`)
    from = Math.max(1, Number(loc[2]) - 1)
    to = Number(loc[3]) + 1
  }
  const lines = readFileSync(
    join(unitDir(ctx.runDir, unit.slug), 'source.sol'),
    'utf8',
  ).split('\n')
  to = Math.min(to, lines.length)
  print(`# ${unit.unit} L${from}-L${to}`)
  for (let i = from; i <= to; i++)
    print(`${String(i).padStart(5)}  ${lines[i - 1] ?? ''}`)
}

const HELP = `./q catalog [--all]                       the relations, one line each (--all: unit-internal ones too)
./q show <relation>                       declaration, meaning, rules, count, sample rows
./q rows <relation> [text...] [--unit s] [--limit N]   rows containing every text, printed as atoms
./q run <file.dl> [--name n] [--limit N]  run rules against the run; print the tuples they derive
./q why '<atom>' [--depth N]              the proof tree of a tuple; leaves say where to continue
./q source <id> | <unit> [<a>-<b>]        source lines
./q units                                 the source files of the run`

export function qMain(positional: string[], flags: Flags): void {
  const runDir = resolve(
    typeof flags.run === 'string'
      ? flags.run
      : (process.env.Q_RUN ?? process.cwd()),
  )
  if (!existsSync(join(runDir, 'run.json')))
    fail(`${runDir} is not a run folder (no run.json); pass --run <dir>`)
  const askDir =
    typeof flags.ask === 'string'
      ? resolve(flags.ask)
      : process.env.Q_ASK
        ? resolve(process.env.Q_ASK)
        : undefined
  const ctx: Ctx = {
    runDir,
    askDir,
    meta: loadRun(runDir),
    lib: runLibrary(runDir),
  }
  const [command, ...args] = positional
  switch (command) {
    case 'catalog':
      cmdCatalog(ctx, flags)
      break
    case 'units':
      cmdUnits(ctx)
      break
    case 'show':
      cmdShow(ctx, args, flags)
      break
    case 'rows':
      cmdRows(ctx, args, flags)
      break
    case 'run':
      cmdRun(ctx, args, flags)
      break
    case 'why':
      cmdWhy(ctx, args, flags)
      break
    case 'source':
      cmdSource(ctx, args)
      break
    case 'help':
    case undefined:
      print(HELP)
      break
    default:
      fail(`unknown command ${command}\n${HELP}`)
  }
  flush()
}

export { firstLine }
