#!/usr/bin/env node
// qf — ask one run of the queryable-facts pipeline the questions it already knows how to answer.
//
// The pipeline copies this file into every run folder next to a `qf` wrapper, so from inside a run:
//
//   ./qf help                      the commands, the answer relations and the tier legend
//   ./qf writers [<variable>]      who may write a storage variable, how, and where
//   ./qf function <name>           one function: signature, modifiers, callers, callees, writes, findings
//   ./qf guards <entry point>      what the rules found about sender checks on the way to its writes
//   ./qf gaps [<entry point>]      effects the analysis could not follow, and extractor coverage
//   ./qf rows <relation> [<text>]  rows of any derived relation, as citable atoms with a header
//   ./qf source <function>|<a>-<b> numbered source lines
//   ./qf explain '<atom>'          why a derived tuple holds (Soufflé's proof tree)
//   ./qf query <file.dl>           run extra Datalog rules against this run's facts
//
// In a *project* run folder (many flattened files + discovered.json, see src/project.ts) the same script
// answers project questions instead — ./qf help lists them: contracts, contract, values, writers (who can
// change a variable of a deployed contract, with the paths through Safes, modules and admins), paths, who,
// calls, gaps — and hands unit questions (function, guards, source, explain of a unit relation) to the
// unit's own qf under units/<slug>/.
//
// Every relation printed here is computed by rules/*.dl; this file only filters and formats. Rows are
// printed as Datalog atoms so an answer can quote them verbatim and the explorer can link them.

import { spawnSync } from 'child_process'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from 'fs'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const ROW_LIMIT = 200

// ----------------------------------------------------------------------------------------------
// The run folder and its files
// ----------------------------------------------------------------------------------------------

const RUN = resolve(
  process.env.QF_RUN ?? dirname(realpathSync(fileURLToPath(import.meta.url))),
)

/** @param {string} rel */
function readTsv(rel) {
  const path = join(RUN, rel)
  if (!existsSync(path)) return []
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((l) => l.length > 0)
    .map((l) => l.split('\t'))
}

/** @type {Map<string, string[][]>} */
const cache = new Map()
/** @param {string} name */
function rel(name) {
  let rows = cache.get(name)
  if (!rows) {
    rows = readTsv(`derived/${name}.csv`)
    // a project run reads the units' relations as inputs: they live in facts/
    if (rows.length === 0 && !existsSync(join(RUN, `derived/${name}.csv`)))
      rows = readTsv(`facts/${name}.facts`)
    cache.set(name, rows)
  }
  return rows
}

/** run.json, when the run wrote one (explorer runs and project runs do). */
const META = existsSync(join(RUN, 'run.json'))
  ? JSON.parse(readFileSync(join(RUN, 'run.json'), 'utf8'))
  : {}
/** A project run: many units under units/<slug>/ plus discovery's facts. */
const PROJECT = META.kind === 'project' || existsSync(join(RUN, 'units'))

const PROGRAM = existsSync(join(RUN, 'program.dl'))
  ? readFileSync(join(RUN, 'program.dl'), 'utf8')
  : ''

/** Column names and types per relation, from the `.decl` lines of the program. */
const DECLS = new Map()
/** Which rule file declared each relation (the program is the rule files concatenated with markers). */
const DECLARED_IN = new Map()
{
  let file = ''
  for (const line of PROGRAM.split('\n')) {
    const marker = /^\/\/ ----- (\S+) -----/.exec(line)
    if (marker) file = marker[1] ?? ''
    const decl = /^\.decl\s+(\w+)\s*\(/.exec(line)
    if (decl) DECLARED_IN.set(decl[1], file)
  }
}
for (const m of PROGRAM.matchAll(/^\.decl\s+(\w+)\s*\(([^)]*)\)/gm)) {
  const cols = (m[2] ?? '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => {
      const [name, type] = c.split(':').map((s) => s.trim())
      return { name: name ?? '', type: type ?? 'symbol' }
    })
  DECLS.set(m[1], cols)
}

/** Comment above a `.decl`, for `help` and `rows`. */
function docOf(name) {
  const at = PROGRAM.search(new RegExp(`^\\.decl\\s+${name}\\s*\\(`, 'm'))
  if (at < 0) return ''
  const before = PROGRAM.slice(0, at).split('\n').slice(0, -1)
  const doc = []
  for (let i = before.length - 1; i >= 0 && before[i].startsWith('//'); i--) {
    const line = before[i].replace(/^\/\/\s?/, '')
    if (/^-{10,}|^={10,}/.test(line)) break
    doc.unshift(line)
  }
  return doc.join(' ').replace(/\s+/g, ' ').trim()
}

const UNIT = (readTsv('facts/unit.facts')[0] ?? [''])[0] ?? ''
const SOURCE = existsSync(join(RUN, 'source.sol'))
  ? readFileSync(join(RUN, 'source.sol'), 'utf8').split('\n')
  : []

/** Unit names of a project run (`codeUnit` rows), longest first so prefixes match unambiguously. */
const UNITS = PROJECT
  ? rel('codeUnit')
      .map((r) => r[0] ?? '')
      .sort((a, b) => b.length - a.length)
  : [UNIT]
/** @param {string} id */
function unitOf(id) {
  return UNITS.find((u) => id.startsWith(`${u}:`))
}
/** @param {string} id */
function label(id) {
  const u = unitOf(id)
  return u ? id.slice(u.length + 1) : id
}
/** The run folder of the unit an id belongs to (project runs). @param {string} unit */
function unitDir(unit) {
  return join(
    RUN,
    'units',
    unit.replace(/\.sol$/, '').replace(/[^\w.-]+/g, '_'),
  )
}

/** @type {Map<string, {start: number, end: number}>} */
const LINES = new Map()
for (const [id, , l1, l2] of rel('sourceLoc'))
  LINES.set(id ?? '', { start: Number(l1), end: Number(l2) })
/** @param {string} id */
function lineRef(id) {
  const loc = LINES.get(id)
  if (!loc) return ''
  return loc.start === loc.end ? `L${loc.start}` : `L${loc.start}-L${loc.end}`
}

// ----------------------------------------------------------------------------------------------
// Formatting
// ----------------------------------------------------------------------------------------------

/** @param {string} name @param {string[]} row */
function atom(name, row) {
  const cols = DECLS.get(name) ?? []
  const args = row.map((v, i) =>
    cols[i]?.type === 'number' ? v : JSON.stringify(v),
  )
  return `${name}(${args.join(', ')})`
}

/** @param {string} name */
function header(name) {
  const cols = DECLS.get(name)
  return cols ? `# ${name}(${cols.map((c) => c.name).join(', ')})` : `# ${name}`
}

const out = []
/** @param {...string} lines */
function print(...lines) {
  out.push(...lines)
}
function flush() {
  process.stdout.write(`${out.join('\n')}\n`)
}

/** @param {string} message @param {number} [code] */
function fail(message, code = 1) {
  process.stderr.write(`qf: ${message}\n`)
  process.exit(code)
}

// ----------------------------------------------------------------------------------------------
// Resolving names
// ----------------------------------------------------------------------------------------------

/**
 * Finds ids whose label matches a query: the full id, the label (`Contract.f(uint256)`), the short
 * name (`f` or `Contract.f`), or a case-insensitive substring. Exact matches win over loose ones.
 * @param {string} query @param {string[]} ids @param {string} what
 */
function resolveId(query, ids, what) {
  const q = query.trim()
  const exact = ids.filter((id) => id === q || label(id) === q)
  if (exact.length === 1) return exact[0]
  const short = ids.filter((id) => {
    const l = label(id)
    const bare = l.replace(/\(.*$/, '')
    return bare === q || bare.endsWith(`.${q}`) || l.startsWith(`${q}(`)
  })
  if (short.length === 1) return short[0]
  const loose = ids.filter((id) =>
    label(id).toLowerCase().includes(q.toLowerCase()),
  )
  const candidates = short.length > 0 ? short : loose
  if (candidates.length === 1) return candidates[0]
  if (candidates.length === 0) fail(`no ${what} matches "${query}"`, 2)
  fail(
    `"${query}" matches ${candidates.length} ${what}s, be more specific:\n${candidates
      .map((c) => `  ${label(c)}`)
      .join('\n')}`,
    2,
  )
  return ''
}

function functionIds() {
  return rel('function').map((r) => r[0] ?? '')
}
function variableIds() {
  return rel('stateVariable').map((r) => r[0] ?? '')
}

// ----------------------------------------------------------------------------------------------
// Commands
// ----------------------------------------------------------------------------------------------

const ANSWER_RELATIONS = [
  'storageWriters',
  'writerDetail',
  'findings',
  'entryPoint',
  'writesIn',
  'callsIn',
  'opaqueWrites',
  'senderCheck',
  'senderGate',
  'checkPrincipal',
  'callerSelectable',
  'function',
  'stateVariable',
  'storageSlot',
  'param',
  'callSite',
  'writeSite',
  'condition',
  'sourceLoc',
]

const TIERS = [
  [
    'structural',
    'read off the syntax tree: this check with this condition sits here',
  ],
  [
    'may',
    'over-approximation: paths that can never run are included (writers are this)',
  ],
  [
    'guaranteed',
    'holds on every completing execution, under the model (structured control flow, internal calls resolved, no unknown effect on the path)',
  ],
  [
    'heuristic',
    'pattern-based: path coverage from straight-line position; "no check" relative to what the rules recognise as a check',
  ],
  [
    'unknown',
    'an effect the analysis cannot follow; nothing universal holds past it',
  ],
]

function cmdHelp() {
  print(
    `qf — questions this run (${UNIT}) already knows how to answer. Ids are printed in full so they can be quoted.`,
    '',
    'commands',
    '  qf writers [<variable>]        who may write a storage variable, how, and where (all variables if none given)',
    '  qf function <name>             one function: signature, modifiers, callers, callees, writes, findings',
    '  qf guards <entry point>        sender-check findings on the way to each variable it may write, with the checks',
    '  qf gaps [<entry point>]        effects the analysis could not follow (delegatecall, unresolved sstore, pointers...)',
    '  qf rows <relation> [<text>]    rows of any derived relation containing <text>, as atoms with a header',
    '  qf source <function>|<a>-<b>   numbered source lines of a function, or lines a to b',
    "  qf explain '<atom>'            why a derived tuple holds: Soufflé's proof down to the AST facts",
    '  qf query <file.dl>             run extra rules (with .decl and .output) against this run; prints their rows',
    '',
    'names: a function is matched by id, `Contract.name(types)`, `Contract.name` or `name`; a variable by `Contract.name` or `name`.',
    '',
    'tiers (the Tier column of findings)',
    ...TIERS.map(([t, d]) => `  ${t.padEnd(11)} ${d}`),
    '',
    'answer relations (qf rows <name>)',
    ...ANSWER_RELATIONS.filter((r) => DECLS.has(r)).map(
      (r) => `  ${header(r).slice(2)}\n      ${docOf(r)}`,
    ),
  )
}

/** @param {string[]} args */
function cmdWriters(args) {
  const query = args[0]
  const vars = query
    ? [resolveId(query, variableIds(), 'variable')]
    : variableIds()
  const slots = new Map()
  for (const [C, V, slot] of rel('storageSlot')) slots.set(`${C}\t${V}`, slot)
  const types = new Map()
  for (const [V, , , type] of rel('stateVariable')) types.set(V, type)
  const writers = rel('storageWriters')
  const details = rel('writerDetail')
  const cited = []
  for (const V of vars) {
    const rows = writers.filter((r) => r[1] === V)
    const contracts = [...new Set(rows.map((r) => r[0]))]
    const inLayout = [...slots.keys()].filter((k) => k.endsWith(`\t${V}`))
    if (rows.length === 0 && inLayout.length === 0) {
      print(
        `${V}  (${types.get(V) ?? '?'}): not in any deployable contract's storage layout (constant, immutable, or abstract)`,
      )
      continue
    }
    for (const key of inLayout) {
      const C = key.split('\t')[0]
      print(
        `${V}  slot ${slots.get(key)}  ${types.get(V) ?? '?'}  in ${label(C)}`,
      )
      const mine = rows.filter((r) => r[0] === C)
      if (mine.length === 0) print('  no writers after deployment')
      for (const r of mine.sort((a, b) =>
        (a[3] ?? '').localeCompare(b[3] ?? ''),
      )) {
        const E = r[3] ?? ''
        const how = details
          .filter((d) => d[0] === C && d[1] === V && d[2] === E)
          .map((d) => {
            const F = d[3] ?? ''
            const via = F && F !== E ? `via ${label(F)}, ` : ''
            return `${via}${d[4]} L${d[5]}`
          })
        print(
          `  ${E === 'constructor' ? 'constructor (deployment)' : E}  [may]  ${how.join('; ')}`,
        )
        cited.push(atom('storageWriters', r))
      }
      if (!contracts.includes(C)) continue
    }
  }
  const unknown = rel('finding').filter((f) => f[3] === 'unknown-effect')
  if (unknown.length > 0 && !query) {
    print('', 'unknown effects (may touch any slot):')
    for (const f of unknown) print(`  ${f[1]}  ${f[4]}  ${lineRef(f[6] ?? '')}`)
  }
  if (cited.length > 0) print('', header('storageWriters'), ...cited)
}

/** @param {string[]} args */
function cmdFunction(args) {
  if (!args[0]) fail('usage: qf function <name>')
  const F = resolveId(args[0], functionIds(), 'function')
  const row = rel('function').find((r) => r[0] === F) ?? []
  const [, C, , sig, kind, vis, mut, selector] = row
  print(`${F}  ${lineRef(F)}`)
  print(
    `  ${kind} ${vis}${mut && mut !== 'nonpayable' ? ` ${mut}` : ''}  ${sig}${selector ? `  selector ${selector}` : ''}  in ${label(C ?? '')}`,
  )
  const entries = rel('entryPoint')
    .filter((r) => r[1] === F)
    .map((r) => label(r[0] ?? ''))
  if (entries.length > 0) print(`  entry point of: ${entries.join(', ')}`)
  const mods = rel('callSite').filter((r) => r[2] === F && r[3] === 'modifier')
  if (mods.length > 0)
    print(`  modifiers: ${mods.map((m) => label(m[4] ?? '')).join(', ')}`)
  const callers = [
    ...new Set(
      rel('callsIn')
        .filter((r) => r[2] === F)
        .map((r) => r[1] ?? ''),
    ),
  ]
  const callees = [
    ...new Set(
      rel('callsIn')
        .filter((r) => r[1] === F)
        .map((r) => r[2] ?? ''),
    ),
  ]
  if (callers.length > 0) print(`  called by: ${callers.map(label).join(', ')}`)
  if (callees.length > 0) print(`  calls: ${callees.map(label).join(', ')}`)
  const writes = [
    ...new Set(
      rel('writesIn')
        .filter((r) => r[1] === F)
        .map((r) => r[2] ?? ''),
    ),
  ]
  const unknownHere = rel('finding').some(
    (f) => f[1] === F && f[5] === 'unknown',
  )
  print(
    writes.length > 0
      ? `  may write: ${writes.map(label).join(', ')}`
      : unknownHere
        ? '  writes no named storage variable (an unknown effect on the way may write any slot, see findings)'
        : '  writes no storage variable',
  )
  const findings = rel('findings').filter((r) => r[1] === F)
  if (findings.length > 0) {
    print('  findings:')
    for (const f of findings)
      print(`    [${f[5]}] ${f[3]}  ${f[6] === '0' ? '' : `L${f[6]}`}  ${f[4]}`)
  }
  print('', header('function'), atom('function', row))
  if (findings.length > 0)
    print(header('findings'), ...findings.map((f) => atom('findings', f)))
}

/** @param {string[]} args */
function cmdGuards(args) {
  if (!args[0]) fail('usage: qf guards <entry point>')
  const E = resolveId(args[0], functionIds(), 'function')
  const findings = rel('findings').filter((r) => r[1] === E)
  const isEntry = rel('entryPoint').some((r) => r[1] === E)
  print(
    `${E}  ${lineRef(E)}${isEntry ? '' : '  (not an entry point: findings are made per entry point)'}`,
  )
  const writes = [
    ...new Set(
      rel('writesIn')
        .filter((r) => r[1] === E)
        .map((r) => r[2] ?? ''),
    ),
  ]
  print(`writes [may]: ${writes.length > 0 ? writes.join(', ') : 'none'}`)
  if (findings.length === 0) {
    print('findings: none')
  } else {
    const byVar = new Map()
    for (const f of findings) {
      const V = f[2] === '*' ? '* (any slot: unknown effect)' : (f[2] ?? '')
      if (!byVar.has(V)) byVar.set(V, [])
      byVar.get(V).push(f)
    }
    for (const [V, list] of byVar) {
      print(`findings for ${V}:`)
      for (const f of list)
        print(`  [${f[5]}] ${f[3]}  ${f[6] === '0' ? '' : `L${f[6]}`}  ${f[4]}`)
    }
  }
  const checkIds = new Set([
    ...rel('alwaysChecks')
      .filter((r) => r[1] === E)
      .map((r) => r[2] ?? ''),
    ...rel('sometimesChecks')
      .filter((r) => r[1] === E)
      .map((r) => r[2] ?? ''),
    ...rel('senderGate')
      .filter((r) => r[1] === E)
      .map((r) => r[0] ?? ''),
  ])
  if (checkIds.size > 0) {
    const cond = new Map(rel('condition').map((r) => [r[0], r[1]]))
    print('checks found on the way:')
    for (const X of checkIds) {
      const principals = rel('checkPrincipal')
        .filter((r) => r[0] === X)
        .map((r) => label(r[1] ?? ''))
      const gate = rel('senderGate').some((r) => r[0] === X)
      const selectable = rel('callerSelectable').find((r) => r[0] === X)
      print(
        `  ${gate ? 'gate ' : 'check'} ${lineRef(X)}  \`${cond.get(X) ?? '?'}\`  in ${label(X.replace(/@.*$/, ''))}${
          principals.length > 0
            ? `  compares with: ${principals.join(', ')}`
            : ''
        }${selectable ? `  under if(${selectable[3]}) with no else` : ''}`,
      )
    }
  }
  const unknown = rel('finding').filter((f) => f[1] === E && f[5] === 'unknown')
  print(
    unknown.length === 0
      ? 'unknown effects on the way: none'
      : 'unknown effects on the way:',
  )
  for (const f of unknown) print(`  ${lineRef(f[6] ?? '')}  ${f[4]}`)
  if (findings.length > 0)
    print('', header('findings'), ...findings.map((f) => atom('findings', f)))
}

/** @param {string[]} args */
function cmdGaps(args) {
  const E = args[0] ? resolveId(args[0], functionIds(), 'function') : undefined
  const unknown = rel('finding').filter(
    (f) => f[5] === 'unknown' && (!E || f[1] === E),
  )
  const effects = unknown.filter((f) => f[3] === 'unknown-effect')
  const asm = unknown.filter((f) => f[3] === 'assembly')
  print(
    effects.length === 0
      ? `unknown effects${E ? ` from ${label(E)}` : ''}: none — every call and write on the way from ${E ? 'this entry point' : 'every entry point'} was followed`
      : `unknown effects${E ? ` from ${label(E)}` : ''} (may touch any slot):`,
  )
  for (const f of effects) print(`  ${f[1]}  ${lineRef(f[6] ?? '')}  ${f[4]}`)
  if (asm.length > 0) {
    const byEntry = new Map()
    for (const f of asm) {
      if (!byEntry.has(f[1])) byEntry.set(f[1], new Set())
      byEntry
        .get(f[1])
        .add(
          `${label((f[6] ?? '').replace(/@.*$/, ''))} ${lineRef(f[6] ?? '')}`,
        )
    }
    print(
      'inline assembly reached (its stores were named, but nothing universal is guaranteed past it):',
    )
    for (const [entry, blocks] of byEntry)
      print(`  ${entry}  in ${[...blocks].join(', ')}`)
  }
  const unhandled = rel('unhandled')
  print(
    unhandled.length === 0
      ? 'extractor coverage: no unhandled AST constructs'
      : `extractor coverage: ${unhandled.length} unhandled construct(s):`,
  )
  for (const u of unhandled) print(`  ${u[0]}  ${u[1]}  ${u[2]}`)
  if (effects.length > 0)
    print(
      '',
      header('opaqueWrites'),
      ...rel('opaqueWrites')
        .filter((r) => !E || r[1] === E)
        .map((r) => atom('opaqueWrites', r)),
    )
}

/** @param {string[]} args */
function cmdRows(args) {
  const name = args[0]
  if (!name) fail('usage: qf rows <relation> [<text>]')
  if (!/^\w+$/.test(name)) fail(`bad relation name ${name}`)
  if (!existsSync(join(RUN, `derived/${name}.csv`))) {
    const known = readdirSync(join(RUN, 'derived'))
      .filter((f) => f.endsWith('.csv'))
      .map((f) => f.slice(0, -4))
    const near = known.filter((k) =>
      k.toLowerCase().includes(name.toLowerCase()),
    )
    fail(
      `no derived relation ${name}${near.length > 0 ? `; did you mean: ${near.join(', ')}` : ''}`,
      2,
    )
  }
  const text = args.slice(1).join(' ').toLowerCase()
  const rows = rel(name).filter(
    (r) => !text || r.join('\t').toLowerCase().includes(text),
  )
  print(header(name))
  const doc = docOf(name)
  if (doc) print(`# ${doc}`)
  if (rows.length === 0)
    print(
      `# no rows${text ? ` containing "${args.slice(1).join(' ')}"` : ''} (${rel(name).length} in the relation)`,
    )
  for (const r of rows.slice(0, ROW_LIMIT)) print(atom(name, r))
  if (rows.length > ROW_LIMIT)
    print(
      `# ... ${rows.length - ROW_LIMIT} more rows; narrow with a text filter`,
    )
}

/** @param {string[]} args */
function cmdSource(args) {
  const spec = args[0]
  if (!spec) fail('usage: qf source <function>|<from>-<to>|<line>')
  let start
  let end
  const range = /^L?(\d+)(?:\s*[-–]\s*L?(\d+))?$/.exec(spec)
  if (range) {
    start = Number(range[1])
    end = Number(range[2] ?? range[1])
  } else {
    const F = resolveId(spec, functionIds(), 'function')
    const loc = LINES.get(F)
    if (!loc) fail(`no source location for ${F}`)
    start = loc.start
    end = loc.end
    print(`// ${F}`)
  }
  for (let n = Math.max(1, start); n <= Math.min(end, SOURCE.length); n++)
    print(`${String(n).padStart(4)}  ${SOURCE[n - 1]}`)
}

function souffleBinary() {
  const flagAt = process.argv.indexOf('--souffle')
  if (flagAt >= 0 && process.argv[flagAt + 1]) return process.argv[flagAt + 1]
  if (process.env.SOUFFLE) return process.env.SOUFFLE
  try {
    const run = JSON.parse(readFileSync(join(RUN, 'run.json'), 'utf8'))
    const first = String(run?.souffle?.command ?? '').split(' ')[0]
    if (first) return first
  } catch {
    // no run.json: a CLI run; fall through to PATH
  }
  return 'souffle'
}

/**
 * Soufflé's explain mode prints JSON with escapes JSON does not have (`\;`): keep the valid escapes,
 * drop the backslash from the others.
 * @param {string} text
 */
function fixSouffleJson(text) {
  let out = ''
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c !== '\\') {
      out += c
      continue
    }
    const next = text[i + 1] ?? ''
    if ('"\\/bfnrtu'.includes(next)) out += c + next
    else out += next
    i++
  }
  return out
}

/** Extracts the first balanced `{...}` from Soufflé's chatty stdout. */
function firstJsonObject(text) {
  const start = text.indexOf('{')
  if (start < 0) return undefined
  let depth = 0
  let inString = false
  for (let i = start; i < text.length; i++) {
    const c = text[i]
    if (inString) {
      if (c === '\\') i++
      else if (c === '"') inString = false
      continue
    }
    if (c === '"') inString = true
    else if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) return text.slice(start, i + 1)
    }
  }
  return undefined
}

/** @param {string[]} args */
/**
 * Relations of layers 0 and 1 (facts and concepts) are printed as leaves: "why is this a call site"
 * is a question about the tree, not about the analysis. `--deep` expands them too.
 * @param {string} relation
 */
function isConceptLevel(relation) {
  const file = DECLARED_IN.get(relation) ?? ''
  return file === 'concepts.dl' || file === 'schema.dl'
}

function cmdExplain(args) {
  const deep = args.includes('--deep')
  const atomText = args
    .filter((a) => a !== '--souffle' && a !== '--deep')
    .join(' ')
    .trim()
  const relation = /^(\w+)\(/.exec(atomText)?.[1]
  if (!relation)
    fail(
      'usage: qf explain \'relation("col", ...)\'  (copy an atom printed by another command)',
    )
  if (!DECLS.has(relation)) fail(`unknown relation ${relation}`)
  const scratch = join(RUN, 'scratch')
  mkdirSync(join(scratch, 'explain'), { recursive: true })
  const programPath = join(scratch, `explain.${relation}.dl`)
  if (!existsSync(programPath)) {
    const text = PROGRAM.split('\n')
      .filter((l) => !/^\.output\b/.test(l))
      .join('\n')
    writeFileSync(programPath, `${text}\n.output ${relation}\n`)
  }
  const run = spawnSync(
    souffleBinary(),
    [
      '--no-preprocessor',
      '-t',
      'explain',
      '-F',
      join(RUN, 'facts'),
      '-D',
      join(scratch, 'explain'),
      programPath,
    ],
    {
      encoding: 'utf8',
      input: `setdepth 60\nformat json\nexplain ${atomText}\nexit\n`,
      maxBuffer: 64 * 1024 * 1024,
    },
  )
  if (run.error) fail(`could not run ${souffleBinary()}: ${run.error.message}`)
  if (run.status !== 0)
    fail(`souffle -t explain exited with ${run.status}: ${run.stderr}`)
  const json = firstJsonObject(run.stdout)
  if (!json) fail(`no proof in Soufflé's output:\n${run.stdout.slice(0, 1500)}`)
  let parsed
  try {
    parsed = JSON.parse(fixSouffleJson(json))
  } catch (e) {
    fail(
      `could not parse Soufflé's proof: ${e instanceof Error ? e.message : e}`,
    )
  }
  const rules = new Map()
  for (const r of parsed.rules ?? [])
    rules.set(
      `${r['rule-number']}|${/^(\w+)\(/.exec(r.rule)?.[1] ?? ''}`,
      r.rule,
    )
  const used = new Map()
  const walk = (node, depth) => {
    const pad = '  '.repeat(depth)
    if (node.premises !== undefined) {
      const relName = /^(\w+)\(/.exec(node.premises)?.[1] ?? ''
      const number = String(node['rule-number'] ?? '').replace(/[()]/g, '')
      const rule =
        rules.get(`(R${number})|${relName}`) ??
        rules.get(`${node['rule-number']}|${relName}`)
      const key = `${relName}#${number}`
      if (!deep && depth > 0 && isConceptLevel(relName)) {
        print(
          `${pad}${node.premises}   [concept, from the tree; --deep expands]`,
        )
        return
      }
      if (rule && !used.has(key)) used.set(key, rule)
      print(`${pad}${node.premises}${number ? `   [${key}]` : ''}`)
      for (const c of node.children ?? []) walk(c, depth + 1)
      return
    }
    const axiom = String(node.axiom ?? '')
    if (axiom === 'Tuple not found')
      print(
        `${pad}!! ${axiom}: this tuple is not in the relation (check quoting and ids)`,
      )
    else print(`${pad}${axiom}`)
  }
  walk(parsed.proof, 0)
  if (used.size > 0) {
    print('', 'rules used:')
    for (const [key, rule] of used)
      print(
        `  ${key}: ${rule
          .replace(/\+underscore_\d+/g, '_')
          .replace(/@generator_\d+/g, '_')
          .replace(/\s*\n\s*/g, ' ')}`,
      )
  }
}

/** @param {string[]} args */
function cmdQuery(args) {
  const file = args[0]
  if (!file)
    fail(
      'usage: qf query <file.dl>   (a file with .decl, rules and .output for the relations to print)',
    )
  const path = resolve(process.cwd(), file)
  if (!existsSync(path)) fail(`no such file ${file}`)
  const extra = readFileSync(path, 'utf8')
  const declared = [...extra.matchAll(/^\.decl\s+(\w+)\s*\(/gm)].map(
    (m) => m[1],
  )
  const outputs = new Set(
    [...extra.matchAll(/^\.output\s+(\w+)/gm)].map((m) => m[1]),
  )
  const missing = declared.filter((d) => !outputs.has(d))
  const scratch = join(RUN, 'scratch')
  mkdirSync(join(scratch, 'out'), { recursive: true })
  const programPath = join(scratch, 'q.dl')
  writeFileSync(
    programPath,
    `${PROGRAM}\n// ----- ${file} -----\n${extra}\n${missing.map((d) => `.output ${d}`).join('\n')}\n`,
  )
  const t0 = performance.now()
  const run = spawnSync(
    souffleBinary(),
    [
      '--no-preprocessor',
      '-F',
      join(RUN, 'facts'),
      '-D',
      join(scratch, 'out'),
      programPath,
    ],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  )
  if (run.error) fail(`could not run ${souffleBinary()}: ${run.error.message}`)
  if (run.status !== 0)
    fail(`souffle exited with ${run.status}:\n${run.stderr || run.stdout}`)
  const ms = Math.round(performance.now() - t0)
  const toPrint = [...new Set([...declared, ...outputs])]
  if (toPrint.length === 0)
    print(
      `# ran in ${ms} ms; the file declares no relation to print (add .decl/.output)`,
    )
  for (const name of toPrint) {
    const cols = /\.decl\s+(\w+)\s*\(([^)]*)\)/.exec(
      extra.split('\n').find((l) => l.startsWith(`.decl ${name}`)) ?? '',
    )
    const colNames = (cols?.[2] ?? '')
      .split(',')
      .map((c) => c.split(':')[0].trim())
      .filter(Boolean)
    const types = (cols?.[2] ?? '')
      .split(',')
      .map((c) => (c.split(':')[1] ?? 'symbol').trim())
    const rows = readTsv(`scratch/out/${name}.csv`)
    print(
      `# ${name}(${colNames.join(', ')})  ${rows.length} row${rows.length === 1 ? '' : 's'}, ${ms} ms`,
    )
    for (const r of rows.slice(0, ROW_LIMIT))
      print(
        `${name}(${r.map((v, i) => (types[i] === 'number' ? v : JSON.stringify(v))).join(', ')})`,
      )
    if (rows.length > ROW_LIMIT)
      print(
        `# ... ${rows.length - ROW_LIMIT} more rows in scratch/out/${name}.csv`,
      )
  }
}

// ----------------------------------------------------------------------------------------------

// ==============================================================================================
// Project mode: many deployed contracts, one snapshot of values (rules/project.dl)
// ==============================================================================================

const PROJECT_TIERS = [
  [
    'checked',
    'a guaranteed sender check at the unit level + a discovered value for what it compares with',
  ],
  ['checked-or', 'the same, but the sender test is one side of an OR'],
  [
    'signature',
    'a guaranteed signature check + a discovered value: whoever holds a signature by that address passes',
  ],
  [
    'signature-lead',
    'a signature check that runs only on some paths (a loop over signatures, a branch)',
  ],
  [
    'lead',
    'a sender check that runs only on some paths (heuristic at the unit level)',
  ],
  ['discovered', "discovery's proxy admin slot, for a proxy's own functions"],
  [
    'open',
    'no sender check and no signature check the rules recognise: anyone',
  ],
]

const PROJECT_RELATIONS = [
  'deployed',
  'codeOf',
  'entryAt',
  'storageAt',
  'valueOf',
  'getterValue',
  'refersTo',
  'allowed',
  'comparesWith',
  'acts',
  'safeMember',
  'safeModule',
  'crossCall',
  'relayed',
  'canCall',
  'hop',
  'mayWrite',
  'whoCanWrite',
  'whoCanUpgrade',
  'ultimately',
  'delayAt',
  'unresolvedCheck',
  'crossCallGap',
  'writerUnreached',
  'unknownAt',
  'unmatchedValue',
  'codeGap',
  'permissionCheck',
  'dEntry',
  'dImpl',
  'dUnit',
  'dValue',
  'dPermission',
]

/** @param {string} a */
function shortAddress(a) {
  const m = /^(?:[a-z0-9]+:)?(0x[0-9a-fA-F]{40})$/.exec(a)
  return m?.[1] ? `${m[1].slice(0, 6)}…${m[1].slice(-4)}` : a
}
const NAMES = new Map()
for (const [a, n] of rel('deployed')) NAMES.set(a, n)
for (const [a, n] of rel('eoa')) if (n) NAMES.set(a, n)
const EOAS = new Set(rel('eoa').map((r) => r[0]))
/** @param {string} a */
function who(a) {
  if (a === 'anyone') return 'anyone'
  const n = NAMES.get(a)
  return n ? `${n} (${shortAddress(a)})` : shortAddress(a)
}
/** @param {string} text */
function named(text) {
  return text.replace(/(?:[a-z0-9]+:)?0x[0-9a-fA-F]{40}/g, (m) => who(m))
}

/** Deployed contract by name, address (or prefix), or Solidity contract name. @param {string} query */
function resolveDeployed(query) {
  const q = query.trim().toLowerCase()
  const deployed = rel('deployed')
  const exact = deployed.filter(
    (r) =>
      r[0].toLowerCase() === q ||
      r[1].toLowerCase() === q ||
      r[0].toLowerCase() === `eth:${q}`,
  )
  if (exact.length === 1) return exact[0][0]
  const byCode = rel('codeOf').filter((r) => label(r[2]).toLowerCase() === q)
  if (byCode.length === 1) return byCode[0][0]
  const loose = deployed.filter(
    (r) =>
      r[1].toLowerCase().includes(q) ||
      r[0].toLowerCase().startsWith(q) ||
      r[0].toLowerCase().startsWith(`eth:${q}`),
  )
  const candidates = loose.length > 0 ? loose : byCode
  if (candidates.length === 1) return candidates[0][0]
  if (candidates.length === 0) {
    const e = rel('eoa').find(
      (r) =>
        r[0].toLowerCase() === q ||
        r[0].toLowerCase() === `eth:${q}` ||
        (r[1] && r[1].toLowerCase() === q),
    )
    if (e) return e[0]
    fail(`no deployed contract matches "${query}" (try ./qf contracts)`, 2)
  }
  fail(
    `"${query}" matches ${candidates.length} contracts, be more specific:\n${candidates.map((c) => `  ${c[1]}  ${c[0]}`).join('\n')}`,
    2,
  )
  return ''
}

/**
 * `Name.member`, `Contract.member` or `member` across every unit; a leading deployed-contract name narrows
 * the search to that address's code. Returns the matching ids.
 * @param {string} query @param {string[]} ids @param {string} what
 */
function resolveAcross(query, ids, what) {
  let q = query.trim()
  let scope = undefined
  const dot = q.indexOf('.')
  if (dot > 0) {
    const head = q.slice(0, dot)
    const deployed = rel('deployed').find(
      (r) => r[1].toLowerCase() === head.toLowerCase(),
    )
    if (deployed) {
      scope = new Set(
        rel('codeOf')
          .filter((r) => r[0] === deployed[0])
          .map((r) => r[2]),
      )
      q = q.slice(dot + 1)
    }
  }
  const inScope = (id) => {
    if (!scope) return true
    const c = id.replace(/\.[^.]*$/, '')
    // ids look like <unit>:Contract.member: the contract of the member must be in the scope's linearization
    return [...scope].some((sc) =>
      rel('inherits').some((r) => r[0] === sc && r[1] === c),
    )
  }
  const pool = ids.filter(inScope)
  const exact = pool.filter((id) => id === q || label(id) === q)
  if (exact.length > 0) return exact
  const short = pool.filter((id) => {
    const l = label(id)
    const bare = l.replace(/\(.*$/, '')
    return bare === q || bare.endsWith(`.${q}`) || l.startsWith(`${q}(`)
  })
  if (short.length > 0) return short
  const loose = pool.filter((id) =>
    label(id).toLowerCase().includes(q.toLowerCase()),
  )
  if (loose.length === 0) fail(`no ${what} matches "${query}"`, 2)
  return loose
}

// ---- paths: walk `hop` backwards from an entry point, fold Safe signers -------------------------

const HOPS = new Map()
for (const row of rel('hop')) {
  const key = `${row[1]}\t${row[2]}`
  if (!HOPS.has(key)) HOPS.set(key, [])
  HOPS.get(key).push(row)
}
const DRIVERS = new Map()
for (const row of rel('acts')) {
  if (!DRIVERS.has(row[1])) DRIVERS.set(row[1], [])
  DRIVERS.get(row[1]).push(row)
}

/** @param {string} A @param {string} tail @param {Set<string>} seen @param {string[]} out @param {number} limit */
function expandActor(A, tail, seen, out, limit) {
  if (out.length >= limit) return
  const ds = DRIVERS.get(A) ?? []
  if (ds.length === 0 || seen.has(A)) {
    out.push(`${who(A)}${tail}`)
    return
  }
  const eoaSigners = ds.filter((d) => EOAS.has(d[0]) || !NAMES.has(d[0]))
  const contractSigners = ds.filter((d) => !EOAS.has(d[0]) && NAMES.has(d[0]))
  const threshold = /\((\d+) of (\d+)/.exec(ds[0][2] ?? '')
  const next = new Set(seen)
  next.add(A)
  if (eoaSigners.length > 0)
    out.push(
      `${threshold?.[1] ?? '?'} of ${ds.length} signers of ${who(A)} (${eoaSigners.length} EOA${eoaSigners.length === 1 ? '' : 's'}${contractSigners.length > 0 ? `, ${contractSigners.length} contract${contractSigners.length === 1 ? '' : 's'}` : ''}) → ${who(A)}${tail}`,
    )
  for (const d of contractSigners)
    expandActor(
      d[0],
      ` → (${named(d[2])}) → ${who(A)}${tail}`,
      next,
      out,
      limit,
    )
}

/**
 * Every way the rules found from an actor to entry H of deployed T, one line each, most direct first:
 *   actor → (how it drives the next) → … → Contract.function [the check at the end, resolved]
 * @param {string} T @param {string} H @param {number} limit
 */
function pathsTo(T, H, limit = 12) {
  const out = []
  const seenLines = new Set()
  const push = (line) => {
    if (!seenLines.has(line)) {
      seenLines.add(line)
      out.push(line)
    }
  }
  const walk = (t, h, suffix, visited) => {
    if (out.length >= limit) return
    const here = ` → ${who(t)}.${label(h)}`
    const rows = HOPS.get(`${t}\t${h}`) ?? []
    const groups = new Map()
    for (const [A, , , Via, , How] of rows) {
      if (Via !== '') continue
      const key = How.replace(/(?:[a-z0-9]+:)?0x[0-9a-fA-F]{40}/g, '*')
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(A)
    }
    for (const [A, , , Via, ViaEntry, How] of rows) {
      if (Via === '') {
        const key = How.replace(/(?:[a-z0-9]+:)?0x[0-9a-fA-F]{40}/g, '*')
        const group = (groups.get(key) ?? []).filter(
          (a) => !DRIVERS.get(a)?.length,
        )
        if (group.length > 3 && group.includes(A)) {
          if (group[0] === A)
            push(
              `${group.length} addresses (${group.map((a) => who(a)).join(', ')})${here} [${How.replace(/= (?:[a-z0-9]+:)?0x[0-9a-fA-F]{40}/, '= each of them')}]${suffix}`,
            )
          continue
        }
        const lines = []
        expandActor(
          A,
          `${here} [${named(How)}]${suffix}`,
          new Set(),
          lines,
          limit,
        )
        for (const l of lines) push(l)
        continue
      }
      if (ViaEntry === '') continue
      const key = `${Via}\t${ViaEntry}`
      if (visited.has(key)) continue
      const v = new Set(visited)
      v.add(key)
      walk(Via, ViaEntry, ` → (${named(How)})${here}${suffix}`, v)
    }
  }
  walk(T, H, '', new Set([`${T}\t${H}`]))
  return out.slice(0, limit)
}

/** The atoms behind the paths to (T, H): allowed and hop rows, for quoting. */
function pathAtoms(T, H) {
  const out = []
  const seen = new Set()
  const visit = (t, h) => {
    const key = `${t}\t${h}`
    if (seen.has(key)) return
    seen.add(key)
    for (const r of rel('allowed').filter((r) => r[1] === t && r[2] === h))
      out.push(atom('allowed', r))
    for (const r of HOPS.get(key) ?? []) {
      if (r[3] !== '' && r[4] !== '') visit(r[3], r[4])
    }
  }
  visit(T, H)
  return out
}

// ---- project commands ---------------------------------------------------------------------------

function cmdProjectHelp() {
  print(
    `qf — project mode: ${rel('deployed').length} deployed contracts of ${META.project ?? 'this project'}, their values, and who can do what. Ids are printed in full so they can be quoted.`,
    '',
    'project commands',
    '  qf contracts                     every deployed contract: name, address, proxy type, code, storage, entry points',
    '  qf contract <name|address>       one contract: code units, discovered values, references, entry points and who passes their checks',
    '  qf values <name|address> [field] the values discovery recorded, and the state variable each one matched',
    '  qf writers <Contract.var|var>    who may write a storage variable of a deployed contract, and every path from an actor to each writer',
    '  qf paths <Contract.function>     every way an actor reaches an entry point: direct callers, Safe signers, modules, admin chains',
    '  qf who <name|address>            what an actor is (EOA, Safe with signers and modules, contract), who drives it, what it can call',
    '  qf calls [<name|address>]        calls between contracts resolved through discovered values, and calls relayed by Safe modules',
    '  qf gaps                          what the project could not resolve: checks without a value, calls without a target, values without a variable',
    '  qf rows <relation> [<text>]      rows of any project relation (or of a unit relation, across all units), as atoms',
    "  qf explain '<atom>'              why a project tuple holds; a unit tuple is explained by its unit's qf",
    '  qf query <file.dl>               extra rules against the project facts (with .decl and .output)',
    '',
    'unit commands (answered by the unit the id belongs to: units/<slug>/qf)',
    '  qf function <name>   qf guards <entry point>   qf source <function>|<unit> <a>-<b>',
    '',
    'names: a deployed contract by its discovery name ("Optimism Security Council"), address, or Solidity contract name;',
    '       a function or variable by `Deployed.member`, `Contract.member` or `member` (ambiguous names list the candidates).',
    '',
    'tiers (the Tier column of allowed)',
    ...PROJECT_TIERS.map(([t, d]) => `  ${t.padEnd(15)} ${d}`),
    '',
    'project relations (qf rows <name>)',
    ...PROJECT_RELATIONS.filter((r) => DECLS.has(r)).map(
      (r) => `  ${header(r).slice(2)}\n      ${docOf(r)}`,
    ),
  )
}

function cmdContracts() {
  const rows = rel('deployed').sort((a, b) => a[1].localeCompare(b[1]))
  for (const [addr, name, ptype] of rows) {
    const codes = rel('codeOf')
      .filter((r) => r[0] === addr)
      .map((r) => `${r[1]}: ${label(r[2])}`)
    const vars = new Set(
      rel('storageAt')
        .filter((r) => r[0] === addr)
        .map((r) => r[1]),
    ).size
    const entries = new Set(
      rel('entryAt')
        .filter((r) => r[0] === addr)
        .map((r) => r[1]),
    ).size
    const gaps = rel('codeGap')
      .filter((r) => r[0] === addr)
      .map((r) => r[3])
    const safe = rel('safe').some((r) => r[0] === addr)
    const extra = safe
      ? `  ${rel('dValue').find((r) => r[0] === addr && r[1] === '$threshold')?.[4] ?? '?'} of ${rel('safeMember').filter((r) => r[0] === addr).length} signers, ${rel('safeModule').filter((r) => r[0] === addr).length} module(s)`
      : ''
    print(`${name}  ${addr}  ${ptype}`)
    print(
      `  code: ${codes.join(', ') || '—'}${gaps.length > 0 ? `  ⚠ ${gaps.join('; ')}` : ''}  · ${vars} storage vars · ${entries} entry points${extra}`,
    )
  }
  const eoas = rel('eoa')
  print(
    '',
    `${eoas.length} EOAs${
      eoas.some((r) => r[1])
        ? `; named: ${eoas
            .filter((r) => r[1])
            .map((r) => `${r[1]} ${r[0]}`)
            .join(', ')}`
        : ''
    }`,
  )
  print('', header('deployed'), ...rows.map((r) => atom('deployed', r)))
}

/** @param {string[]} args */
function cmdContract(args) {
  if (!args[0]) fail('usage: qf contract <name|address>')
  const addr = resolveDeployed(args.join(' '))
  const d = rel('deployed').find((r) => r[0] === addr)
  if (!d) {
    cmdWho([addr])
    return
  }
  print(`${d[1]}  ${addr}  ${d[2]}`)
  for (const [, role, c] of rel('codeOf').filter((r) => r[0] === addr)) {
    const unit = unitOf(c) ?? ''
    print(
      `  ${role}: ${label(c)}  (unit ${unit}; ./qf source, function, guards work on its ids; its own run: units/${unit.replace(/\.sol$/, '').replace(/[^\w.-]+/g, '_')}/)`,
    )
  }
  for (const g of rel('codeGap').filter((r) => r[0] === addr))
    print(`  ⚠ ${g[2]}: ${g[3]}`)
  const admin = rel('proxyAdminOf').find((r) => r[0] === addr)
  if (admin) print(`  proxy admin (discovered): ${who(admin[1])}`)
  const impl = rel('dValue').find(
    (r) => r[0] === addr && r[1] === '$implementation',
  )
  if (impl) print(`  implementation (discovered): ${impl[4]}`)
  if (rel('safe').some((r) => r[0] === addr)) {
    print(
      `  Safe: ${rel('dValue').find((r) => r[0] === addr && r[1] === '$threshold')?.[4] ?? '?'} of ${rel('safeMember').filter((r) => r[0] === addr).length} signers: ${rel(
        'safeMember',
      )
        .filter((r) => r[0] === addr)
        .map((r) => who(r[1]))
        .join(', ')}`,
    )
    const mods = rel('safeModule').filter((r) => r[0] === addr)
    if (mods.length > 0)
      print(`  modules: ${mods.map((r) => who(r[1])).join(', ')}`)
  }
  const values = rel('valueOf').filter((r) => r[0] === addr)
  if (values.length > 0) {
    print('', 'values (state variable = discovered value):')
    const byVar = new Map()
    for (const [, v, kind, val] of values) {
      if (!byVar.has(v)) byVar.set(v, [])
      byVar
        .get(v)
        .push(
          kind === 'address' && NAMES.has(val)
            ? `${val} (${NAMES.get(val)})`
            : val,
        )
    }
    for (const [v, vals] of byVar)
      print(
        `  ${label(v)} = ${vals.length > 4 ? `${vals.slice(0, 4).join(', ')}, … (${vals.length})` : vals.join(', ')}`,
      )
  }
  const getters = rel('getterValue').filter(
    (r) => r[0] === addr && !rel('returnsStateVar').some((s) => s[0] === r[1]),
  )
  if (getters.length > 0) {
    print('', 'getters (no state variable behind them) = discovered value:')
    for (const [, g, kind, val] of getters.slice(0, 40))
      print(
        `  ${label(g)} = ${kind === 'address' && NAMES.has(val) ? `${val} (${NAMES.get(val)})` : val}`,
      )
  }
  const refs = rel('refersTo').filter((r) => r[0] === addr)
  if (refs.length > 0) {
    print('', 'references to other discovered addresses:')
    for (const [, v, t] of refs) print(`  ${label(v)} → ${who(t)}`)
  }
  const entries = [
    ...new Set(
      rel('entryAt')
        .filter((r) => r[0] === addr)
        .map((r) => r[1]),
    ),
  ].sort((a, b) => label(a).localeCompare(label(b)))
  print(
    '',
    `entry points (${entries.length}) and who passes their checks (one hop; ./qf paths <function> for the whole chain):`,
  )
  for (const h of entries) {
    const allowed = rel('allowed').filter((r) => r[1] === addr && r[2] === h)
    const groups = new Map()
    for (const [a, , , , tier] of allowed) {
      if (!groups.has(tier)) groups.set(tier, [])
      groups.get(tier).push(who(a))
    }
    const summary = [...groups.entries()]
      .map(
        ([tier, whos]) =>
          `${tier}: ${whos.length > 4 ? `${whos.slice(0, 4).join(', ')}, … (${whos.length})` : whos.join(', ')}`,
      )
      .join(' · ')
    const unresolved = rel('unresolvedCheck').filter(
      (r) => r[0] === addr && r[1] === h,
    )
    const writes = new Set(
      rel('mayWrite')
        .filter((r) => r[0] === addr && r[2] === h)
        .map((r) => label(r[1])),
    )
    print(
      `  ${label(h)}${writes.size > 0 ? `  writes ${[...writes].join(', ')}` : ''}`,
    )
    print(
      `      ${summary || 'no known caller'}${unresolved.length > 0 ? `  · unresolved: ${[...new Set(unresolved.map((u) => u[3]))].join('; ')}` : ''}`,
    )
  }
  const unknown = rel('unknownAt').filter((r) => r[0] === addr)
  if (unknown.length > 0) {
    print(
      '',
      `unknown effects in this code (${unknown.length}; may touch any slot):`,
    )
    for (const [, e, , detail] of unknown.slice(0, 15))
      print(`  ${label(e)}: ${detail}`)
  }
  print(
    '',
    header('codeOf'),
    ...rel('codeOf')
      .filter((r) => r[0] === addr)
      .map((r) => atom('codeOf', r)),
  )
}

/** @param {string[]} args */
function cmdValues(args) {
  if (!args[0]) fail('usage: qf values <name|address> [field]')
  const addr = resolveDeployed(args[0])
  const field = args[1]
  const rows = rel('dValue').filter(
    (r) =>
      r[0] === addr &&
      (!field ||
        r[1].toLowerCase() === field.toLowerCase() ||
        r[1].toLowerCase().includes(field.toLowerCase())),
  )
  const matched = new Map()
  for (const [a, v, f] of rel('fieldOf')) if (a === addr) matched.set(f, v)
  print(
    `${who(addr)}: ${rows.length} recorded value${rows.length === 1 ? '' : 's'}${field ? ` for "${field}"` : ''}`,
  )
  for (const [, f, path, kind, val] of rows) {
    const v = matched.get(f)
    const val2 =
      kind === 'address' && NAMES.has(val) ? `${val} (${NAMES.get(val)})` : val
    print(
      `  ${f}${path}  =  ${val2}  [${kind}]${v ? `  ← ${label(v)}` : f.startsWith('$') ? '  (discovery field)' : '  (no state variable or getter of this name)'}`,
    )
  }
  print(
    '',
    header('dValue'),
    ...rows.slice(0, ROW_LIMIT).map((r) => atom('dValue', r)),
  )
}

/** @param {string[]} args */
function cmdProjectWriters(args) {
  if (!args[0]) fail('usage: qf writers <Contract.var|var>')
  const vars = resolveAcross(
    args.join(' '),
    [...new Set(rel('storageAt').map((r) => r[1]))],
    'storage variable',
  )
  const cited = []
  for (const V of vars) {
    for (const [addr, , role, slot] of rel('storageAt').filter(
      (r) => r[1] === V,
    )) {
      const values = rel('valueOf').filter((r) => r[0] === addr && r[1] === V)
      print(
        `${label(V)}  slot ${slot}  in ${who(addr)} (${role} code)${values.length === 1 ? `  = ${values[0][3]}${NAMES.has(values[0][3]) ? ` (${NAMES.get(values[0][3])})` : ''}` : values.length > 1 ? `  (${values.length} values, ./qf values)` : ''}`,
      )
      const writers = rel('mayWrite').filter((r) => r[0] === addr && r[1] === V)
      if (writers.length === 0) print('  no writers after deployment')
      for (const w of writers.sort((a, b) =>
        label(a[2]).localeCompare(label(b[2])),
      )) {
        const H = w[2]
        const how = rel('writerDetail')
          .filter((d) => d[1] === V && d[2] === H)
          .map(
            (d) =>
              `${d[3] !== H ? `via ${label(d[3])}, ` : ''}${d[4]} L${d[5]}`,
          )
        print(`  ${label(H)}  [may write: ${how.join('; ') || '?'}]`)
        const paths = pathsTo(addr, H, 10)
        if (paths.length === 0) {
          const why = [
            ...new Set(
              rel('unresolvedCheck')
                .filter((r) => r[0] === addr && r[1] === H)
                .map((r) => r[3]),
            ),
          ]
          print(
            `    no known actor reaches it${why.length > 0 ? `: ${why.join('; ')}` : ''}`,
          )
        }
        for (const p of paths) print(`    ${p}`)
        cited.push(atom('mayWrite', w))
        for (const r of rel('whoCanWrite')
          .filter(
            (r) => r[0] === addr && r[1] === V && r[2] === H && !EOAS.has(r[3]),
          )
          .slice(0, 8))
          cited.push(atom('whoCanWrite', r))
        for (const a of pathAtoms(addr, H).slice(0, 12)) cited.push(a)
      }
      const unknown = rel('unknownAt').filter((r) => r[0] === addr)
      if (unknown.length > 0)
        print(
          `  (${unknown.length} unknown effect(s) in this code may touch any slot: ./qf contract ${JSON.stringify(NAMES.get(addr) ?? addr)})`,
        )
    }
  }
  if (cited.length > 0)
    print(
      '',
      '# atoms behind the above (EOA rows of whoCanWrite left out; ./qf rows whoCanWrite <variable> lists them)',
      ...[...new Set(cited)],
    )
}

/** @param {string[]} args */
function cmdPaths(args) {
  if (!args[0]) fail('usage: qf paths <Contract.function>')
  const fns = resolveAcross(
    args.join(' '),
    [...new Set(rel('entryAt').map((r) => r[1]))],
    'entry point',
  )
  const cited = []
  for (const H of fns) {
    for (const [addr, , role] of rel('entryAt').filter((r) => r[1] === H)) {
      print(`${who(addr)}.${label(H)}  (${role} code)`)
      const paths = pathsTo(addr, H, 20)
      if (paths.length === 0) {
        const why = [
          ...new Set(
            rel('unresolvedCheck')
              .filter((r) => r[0] === addr && r[1] === H)
              .map((r) => r[3]),
          ),
        ]
        print(
          `  no known actor reaches it${why.length > 0 ? `: ${why.join('; ')}` : ''}`,
        )
      }
      for (const p of paths) print(`  ${p}`)
      const delays = rel('delayAt').filter((r) => r[0] === addr && r[1] === H)
      for (const [, , x, v, val] of delays)
        print(
          `  time condition ${lineRef(x)}: compares block.timestamp with ${label(v)} = ${val}`,
        )
      cited.push(...pathAtoms(addr, H))
    }
  }
  if (cited.length > 0)
    print('', '# atoms behind the above', ...[...new Set(cited)].slice(0, 60))
}

/** @param {string[]} args */
function cmdWho(args) {
  if (!args[0]) fail('usage: qf who <name|address>')
  const addr = resolveDeployed(args.join(' '))
  const actor = rel('actor').find((r) => r[0] === addr)
  print(`${who(addr)}: ${actor?.[1] ?? 'unknown'}`)
  if (rel('safe').some((r) => r[0] === addr)) {
    const members = rel('safeMember').filter((r) => r[0] === addr)
    print(
      `  ${rel('dValue').find((r) => r[0] === addr && r[1] === '$threshold')?.[4] ?? '?'} of ${members.length} signers must sign:`,
    )
    for (const m of members)
      print(
        `    ${who(m[1])}${rel('safe').some((s) => s[0] === m[1]) ? '  (a Safe itself)' : EOAS.has(m[1]) ? '  (EOA)' : ''}`,
      )
    const mods = rel('safeModule').filter((r) => r[0] === addr)
    if (mods.length > 0) {
      print(
        '  enabled modules (may make this Safe call, through execTransactionFromModule):',
      )
      for (const m of mods) {
        const relays = rel('relayed').filter(
          (r) => r[0] === m[1] && r[2] === addr,
        )
        print(
          `    ${who(m[1])}${relays.length > 0 ? `: ${relays.map((r) => `${label(r[1])} → ${who(r[3])}.${label(r[4])}`).join('; ')}` : ''}`,
        )
      }
    }
  }
  const memberOf = rel('acts').filter((r) => r[0] === addr)
  if (memberOf.length > 0)
    print(
      `  signer of: ${memberOf.map((r) => `${who(r[1])} (${named(r[2])})`).join('; ')}`,
    )
  const direct = rel('allowed').filter((r) => r[0] === addr)
  if (direct.length > 0) {
    print(
      '',
      `passes the checks of (${direct.length} entry point${direct.length === 1 ? '' : 's'}, one hop):`,
    )
    const byTarget = new Map()
    for (const [, t, h, , tier] of direct) {
      if (!byTarget.has(t)) byTarget.set(t, [])
      byTarget.get(t).push(`${label(h)} [${tier}]`)
    }
    for (const [t, list] of byTarget) print(`  ${who(t)}: ${list.join(', ')}`)
  }
  const reach = rel('canCall').filter(
    (r) => r[0] === addr && !direct.some((d) => d[1] === r[1] && d[2] === r[2]),
  )
  if (reach.length > 0) {
    print('', `can also reach, through others (${reach.length}):`)
    const byTarget = new Map()
    for (const [, t, h] of reach) {
      if (!byTarget.has(t)) byTarget.set(t, [])
      byTarget.get(t).push(label(h))
    }
    for (const [t, list] of byTarget)
      print(
        `  ${who(t)}: ${list.length > 8 ? `${list.slice(0, 8).join(', ')}, … (${list.length})` : list.join(', ')}`,
      )
  }
  const perms = rel('dPermission').filter((r) => r[0] === addr)
  if (perms.length > 0) {
    print('', "discovery's own permission model says:")
    for (const [, direct2, p, from, role, via] of perms)
      print(
        `  ${p} at ${who(from)} (${role})${direct2 === '1' ? '' : ` via ${named(via)}`}  ${rel('permissionCheck').find((c) => c[0] === addr && c[1] === from && c[2] === p)?.[4] ?? ''}`,
      )
  }
  print(
    '',
    header('actor'),
    ...(actor ? [atom('actor', actor)] : []),
    ...rel('acts')
      .filter((r) => r[0] === addr || r[1] === addr)
      .map((r) => atom('acts', r)),
  )
}

/** @param {string[]} args */
function cmdCalls(args) {
  const addr = args[0] ? resolveDeployed(args.join(' ')) : undefined
  const calls = rel('crossCall').filter(
    (r) => !addr || r[0] === addr || r[2] === addr,
  )
  const seen = new Set()
  print(
    `calls between contracts${addr ? ` involving ${who(addr)}` : ''} (receiver resolved through a discovered value, or caller-chosen where the target admits the caller):`,
  )
  for (const [from, e, to, h, , tier] of calls.sort(
    (a, b) =>
      who(a[0]).localeCompare(who(b[0])) ||
      label(a[1]).localeCompare(label(b[1])),
  )) {
    const key = `${from}\t${e}\t${to}\t${h}`
    if (seen.has(key)) continue
    seen.add(key)
    print(`  ${who(from)}.${label(e)} → ${who(to)}.${label(h)}  [${tier}]`)
  }
  const relayed = rel('relayed').filter(
    (r) => !addr || r[0] === addr || r[2] === addr || r[3] === addr,
  )
  if (relayed.length > 0) {
    print('', 'relayed through a Safe by a module:')
    for (const [mod, e, s, t, h] of relayed)
      print(
        `  ${who(mod)}.${label(e)} makes ${who(s)} call ${who(t)}.${label(h)}`,
      )
  }
  const gaps = rel('crossCallGap').filter((r) => !addr || r[0] === addr)
  if (gaps.length > 0)
    print('', `${gaps.length} external call(s) not resolved (./qf gaps)`)
  print(
    '',
    header('crossCall'),
    ...calls.slice(0, ROW_LIMIT).map((r) => atom('crossCall', r)),
  )
}

function cmdProjectGaps() {
  const codeGaps = rel('codeGap')
  print(
    codeGaps.length === 0
      ? 'code: every discovered contract has a compiled unit'
      : `code gaps (${codeGaps.length}):`,
  )
  for (const g of codeGaps) print(`  ${who(g[0])} → ${g[2]}: ${g[3]}`)
  const unresolved = rel('unresolvedCheck')
  print(
    '',
    `checks whose principal has no discovered value (${unresolved.length}): "who" is not answered there`,
  )
  const byWhy = new Map()
  for (const [addr, h, , why] of unresolved) {
    if (!byWhy.has(why)) byWhy.set(why, [])
    byWhy.get(why).push(`${who(addr)}.${label(h)}`)
  }
  for (const [why, list] of byWhy)
    print(
      `  ${why}: ${list.length > 6 ? `${list.slice(0, 6).join(', ')}, … (${list.length})` : list.join(', ')}`,
    )
  const callGaps = rel('crossCallGap')
  print(
    '',
    `external calls whose target could not be resolved (${callGaps.length}):`,
  )
  const byWhy2 = new Map()
  for (const [addr, e, , g, why] of callGaps) {
    if (!byWhy2.has(why)) byWhy2.set(why, [])
    byWhy2.get(why).push(`${who(addr)}.${label(e)} → ${label(g)}`)
  }
  for (const [why, list] of byWhy2)
    print(
      `  ${why}: ${list.length > 5 ? `${list.slice(0, 5).join(', ')}, … (${list.length})` : list.join(', ')}`,
    )
  const unmatched = rel('unmatchedValue')
  print(
    '',
    `discovered values that match no state variable or getter (${unmatched.length}; handlers, events, computed fields):`,
  )
  const byAddr = new Map()
  for (const [addr, f] of unmatched) {
    if (!byAddr.has(addr)) byAddr.set(addr, [])
    byAddr.get(addr).push(f)
  }
  for (const [addr, list] of byAddr) print(`  ${who(addr)}: ${list.join(', ')}`)
  const unreached = rel('writerUnreached')
  print('', `writers nobody known can reach (${unreached.length}):`)
  for (const [addr, v, h] of unreached.slice(0, 30))
    print(`  ${who(addr)}.${label(v)} ← ${label(h)}`)
  const unknown = rel('unknownAt')
  print(
    '',
    `unknown effects in the code (${unknown.length}; proxy forwarding excluded): ./qf rows unknownAt`,
  )
}

/** Runs a unit's own qf for an id that belongs to it. @param {string} id @param {string[]} argv */
function delegateToUnit(id, argv) {
  const unit = unitOf(id)
  if (!unit) fail(`${id} belongs to no unit of this project`)
  const dir = unitDir(unit)
  if (!existsSync(join(dir, 'qf'))) fail(`no unit run at ${dir}`)
  const run = spawnSync(process.execPath, [join(dir, 'qf.mjs'), ...argv], {
    encoding: 'utf8',
    env: { ...process.env, QF_RUN: dir },
  })
  print(`# unit ${unit} (units/${dir.split('/').pop()}/)`)
  if (run.stdout) print(run.stdout.trimEnd())
  if (run.status !== 0)
    fail(
      run.stderr.trim() || `unit qf exited with ${run.status}`,
      run.status ?? 1,
    )
}

/** @param {string} command @param {string[]} args */
function projectCommand(command, args) {
  switch (command) {
    case 'help':
    case '--help':
    case '-h':
      cmdProjectHelp()
      return
    case 'contracts':
      cmdContracts()
      return
    case 'contract':
      cmdContract(args)
      return
    case 'values':
      cmdValues(args)
      return
    case 'writers':
      cmdProjectWriters(args)
      return
    case 'paths':
      cmdPaths(args)
      return
    case 'who':
      cmdWho(args)
      return
    case 'calls':
      cmdCalls(args)
      return
    case 'gaps':
      cmdProjectGaps()
      return
    case 'rows':
      cmdRows(args)
      return
    case 'query':
      cmdQuery(args)
      return
    case 'explain': {
      const text = args
        .filter((a) => a !== '--deep' && a !== '--souffle')
        .join(' ')
      const relation = /^(\w+)\(/.exec(text)?.[1] ?? ''
      const file = DECLARED_IN.get(relation) ?? ''
      if (file === 'project.dl') {
        cmdExplain(args)
        return
      }
      // a unit relation: find the unit from the first id-like column and ask that unit
      const cols = [...text.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1])
      const id = cols.find((c) => unitOf(c))
      if (!id)
        fail(
          `${relation} is a unit relation; quote an atom whose ids carry a unit prefix so the unit can be found`,
        )
      delegateToUnit(id, ['explain', ...args])
      return
    }
    case 'function':
    case 'fn':
    case 'guards': {
      if (!args[0]) fail(`usage: qf ${command} <name>`)
      const ids = resolveAcross(
        args.join(' '),
        rel('function').map((r) => r[0]),
        'function',
      )
      if (ids.length > 1)
        fail(
          `"${args.join(' ')}" matches ${ids.length} functions, be more specific:\n${ids.map((c) => `  ${c}`).join('\n')}`,
          2,
        )
      delegateToUnit(ids[0], [command, ids[0]])
      return
    }
    case 'source': {
      if (!args[0])
        fail('usage: qf source <function> | qf source <unit> <a>-<b>')
      if (args[1] && UNITS.includes(args[0])) {
        delegateToUnit(`${args[0]}:`, ['source', args[1]])
        return
      }
      const ids = resolveAcross(
        args.join(' '),
        rel('function').map((r) => r[0]),
        'function',
      )
      if (ids.length > 1)
        fail(
          `"${args.join(' ')}" matches ${ids.length} functions, be more specific:\n${ids.map((c) => `  ${c}`).join('\n')}`,
          2,
        )
      delegateToUnit(ids[0], ['source', ids[0]])
      return
    }
    default:
      fail(`unknown command ${command}; try: qf help`, 2)
  }
}

const [command = 'help', ...rest] = process.argv.slice(2)
if (!existsSync(join(RUN, 'derived')) && command !== 'help') {
  fail(
    `${RUN} has no derived/ folder: run this from a run folder, or set QF_RUN`,
  )
}
if (PROJECT) {
  projectCommand(command, rest)
  flush()
  process.exit(0)
}
switch (command) {
  case 'help':
  case '--help':
  case '-h':
    cmdHelp()
    break
  case 'writers':
    cmdWriters(rest)
    break
  case 'function':
  case 'fn':
    cmdFunction(rest)
    break
  case 'guards':
    cmdGuards(rest)
    break
  case 'gaps':
    cmdGaps(rest)
    break
  case 'rows':
    cmdRows(rest)
    break
  case 'source':
    cmdSource(rest)
    break
  case 'explain':
    cmdExplain(rest)
    break
  case 'query':
    cmdQuery(rest)
    break
  default:
    fail(`unknown command ${command}; try: qf help`, 2)
}
flush()
