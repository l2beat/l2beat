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
    cache.set(name, rows)
  }
  return rows
}

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

/** @param {string} id */
function label(id) {
  return id.startsWith(`${UNIT}:`) ? id.slice(UNIT.length + 1) : id
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

const [command = 'help', ...rest] = process.argv.slice(2)
if (!existsSync(join(RUN, 'derived')) && command !== 'help') {
  fail(
    `${RUN} has no derived/ folder: run this from a run folder, or set QF_RUN`,
  )
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
