// The solve stage: for every write a deployed contract's entry functions can perform, which senders
// can make it persist? Runs after the project stage, reads its relations and the units' ASTs, walks
// every entry function symbolically (src/symbolic.ts) — calls into other deployed contracts included,
// with the caller's address as msg.sender — and asks Z3 (src/smt.ts) per write it met:
//
//   Φ = the disjunction of the conditions of the completing paths that perform the write
//   for every discovered address a:  Φ ∧ sender = a       sat → admits a (a witness), unsat → excludes a
//   for the rest of the world:       Φ ∧ sender ∉ Known   sat → then: is ¬Φ unsat for every such sender
//                                                          with the same inputs? → open to anyone
//
// A sat answer that rests on an *unknown* symbol (storage discovery did not record, a hash, an
// unfollowed call) is not a witness: it is checked again with the actor's inputs fixed and the unknowns
// free; unsat there means the actor passes whatever the unknowns are ("robust"), sat means the verdict
// depends on them (a residual `depends-on`). Unsat answers hold with the unknowns free, so exclusions
// are robust by construction. Paths the walk could not explore (budget, opaque code) turn every
// exclusion of that effect into unknown; admits stay, they are real executions.
//
// Outputs, all under the run folder:
//   solve/<via>/<entry>/walk.json                 the paths of one entry function
//   solve/<via>/<entry>/<effect>/{a,b}.smt2       the scripts sent to Z3, and result.json
//   facts/solved/*.facts                          what the verdict stage reads (rules/0-solved.dl)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { Facts } from './emit'
import { readRelation, type UnitSummary, unitDir } from './pipeline'
import {
  addressText,
  and,
  BV160,
  Declarations,
  eq,
  forall,
  implies,
  not,
  or,
  parseBv,
  runZ3,
  type ScopedSymbol,
  Script,
  type Term,
  z3Version,
} from './smt'
import { readTsv } from './souffle'
import {
  type AstNode,
  BUDGET,
  type Budget,
  indexAst,
  insertValue,
  type PathResult,
  type Residual,
  shortName,
  type UnitCode,
  type ValueTree,
  valueTree,
  Walk,
  type World,
} from './symbolic'

/** The relations written to facts/solved (declared with their meaning in rules/0-solved.dl). */
export const SOLVED_RELATIONS: Record<string, number> = {
  solvedEffect: 6,
  solvedAdmits: 6,
  solvedExcludes: 5,
  solvedOpen: 5,
  solvedResidual: 6,
  solvedReads: 6,
  solvedPath: 6,
  solvedWitness: 6,
}

/** Residual kinds that mean "some execution was not explored" (exclusions are then unknown). */
const EXPLORATION = new Set([
  'too-many-paths',
  'loop-bound',
  'opaque',
  'unsupported-stmt',
  'no-code',
])

export interface SolveOptions {
  budget?: Budget
  timeoutMs?: number
  z3?: string
  onProgress?: (done: number, total: number, what: string) => void
}

export interface SolveSummary {
  entries: number
  effects: number
  checks: number
  residuals: Record<string, number>
  ms: number
  z3: string
  /** Effects whose paths contradict a guard rules/2-guards.dl derived for them (a bug indicator). */
  mismatches: string[]
}

export interface EffectResult {
  addr: string
  via: string
  entry: string
  effect: string
  variable: string
  paths: string[]
  explored: boolean
  admits: Array<{
    actor: string
    how: 'witness' | 'robust'
    inputs: Record<string, string>
  }>
  excludes: string[]
  open?: 'robust'
  residuals: Residual[]
  reads: string[]
  unknownSymbols: string[]
  checks: number
}

function slug(text: string): string {
  return text.replace(/[^\w.-]+/g, '_').slice(0, 120)
}

interface Loaded {
  world: World
  /** Contract → its effect rows (C, E, F, V). */
  effectsOf: Map<string, string[][]>
  /** Write site → the variable it changes. */
  varOfEffect: Map<string, string>
  /** `${C}|${H}` → functions H reaches. */
  reaches: Map<string, Set<string>>
  guards: Map<string, Array<[string, string]>>
  callGuards: Map<string, string[]>
}

function loadWorld(
  runDir: string,
  summaries: UnitSummary[],
  budget: Budget,
): Loaded {
  const units = new Map<string, UnitCode>()
  const unitOfContract = new Map<string, UnitCode>()
  const contractOfFn = new Map<string, string>()
  const alwaysReverts = new Set<string>()
  const opaque = new Map<string, string>()
  const effectsOf = new Map<string, string[][]>()
  const varOfEffect = new Map<string, string>()
  const reaches = new Map<string, Set<string>>()
  const guards = new Map<string, Array<[string, string]>>()
  const callGuards = new Map<string, string[]>()
  for (const u of summaries) {
    if (u.status !== 'ok') continue
    const dir = unitDir(runDir, u.slug)
    const output = JSON.parse(
      readFileSync(join(dir, 'solc-output.json'), 'utf8'),
    ) as { sources?: Record<string, { ast?: AstNode }> }
    const ast =
      output.sources?.[u.unit]?.ast ??
      Object.values(output.sources ?? {})[0]?.ast
    if (!ast) continue
    const rel = (name: string) => readRelation(runDir, name, u.slug)
    const code = indexAst(
      u.unit,
      u.slug,
      ast,
      rel('sourceLoc'),
      rel('dispatch'),
      rel('function'),
    )
    units.set(u.slug, code)
    for (const [c] of rel('contract')) if (c) unitOfContract.set(c, code)
    for (const [f, c] of rel('function')) if (f && c) contractOfFn.set(f, c)
    for (const [f] of rel('alwaysReverts')) if (f) alwaysReverts.add(f)
    for (const [, k, why] of rel('opaque'))
      if (k) opaque.set(k, why ?? 'opaque')
    for (const row of rel('effect')) {
      const [c, e, , v] = row
      if (!c || !e) continue
      const list = effectsOf.get(c) ?? []
      list.push(row)
      effectsOf.set(c, list)
      if (v) varOfEffect.set(e, v)
    }
    for (const [c, e, f] of rel('reachesFrom')) {
      const key = `${c}|${e}`
      const set = reaches.get(key) ?? new Set()
      set.add(f ?? '')
      reaches.set(key, set)
    }
    for (const [c, e, x, pol] of rel('guard')) {
      const key = `${c}|${e}`
      const list = guards.get(key) ?? []
      list.push([x ?? '', pol ?? ''])
      guards.set(key, list)
    }
    for (const [c, e, k] of rel('callGuard')) {
      const key = `${c}|${e}`
      const list = callGuards.get(key) ?? []
      list.push(k ?? '')
      callGuards.set(key, list)
    }
  }
  const codeAt = new Map<string, Array<{ role: string; C: string }>>()
  for (const [addr, role, c] of readRelation(runDir, 'codeOf')) {
    if (!addr || !c) continue
    const list = codeAt.get(addr) ?? []
    list.push({ role: role ?? 'self', C: c })
    codeAt.set(addr, list)
  }
  const entries = new Map<string, Array<{ H: string; role: string }>>()
  for (const [addr, h, role] of readRelation(runDir, 'entryAt')) {
    if (!addr || !h) continue
    const list = entries.get(addr) ?? []
    list.push({ H: h, role: role ?? 'self' })
    entries.set(addr, list)
  }
  // recorded values: fieldOf ties discovery's field names to state variables
  const values = new Map<string, ValueTree>()
  const fields = new Map<string, string[]>()
  for (const [addr, v, field] of readRelation(runDir, 'fieldOf')) {
    if (!addr || !v || field === undefined) continue
    const key = `${addr}|${field}`
    const list = fields.get(key) ?? []
    list.push(v)
    fields.set(key, list)
  }
  for (const [addr, field, path, kind, value] of readTsv(
    join(runDir, 'facts', 'dValue.facts'),
  )) {
    if (!addr || field === undefined) continue
    for (const v of fields.get(`${addr}|${field}`) ?? []) {
      const key = `${addr}|${v}`
      let tree = values.get(key)
      if (!tree) {
        tree = valueTree()
        values.set(key, tree)
      }
      if (field === 'accessControl')
        bridgeAccessControl(tree, path ?? '', value ?? '')
      else insertValue(tree, path ?? '', kind ?? '', value ?? '')
    }
  }
  const world: World = {
    units,
    unitOfContract,
    codeAt,
    entries,
    contractOfFn,
    values,
    alwaysReverts,
    opaque,
    decls: new Declarations(),
    budget,
  }
  return { world, effectsOf, varOfEffect, reaches, guards, callGuards }
}

/**
 * Discovery's `accessControl` handler records `{ ROLE: { adminRole, members: [...] } }` by role *name*;
 * the code keeps `_roles[keccak256("ROLE")]` with a `hasRole`/`members` mapping and an `adminRole`.
 * This writes the recorded roles into the tree of the `_roles` variable under the keys the walk itself
 * computes (`@keccak256:ROLE`, `@zero` for DEFAULT_ADMIN_ROLE), and marks the containers complete: the
 * handler lists every member (from the events), so an address it does not list has no role.
 */
function bridgeAccessControl(
  tree: ValueTree,
  path: string,
  value: string,
): void {
  const m = /^\.([^.[\]]+)\.(adminRole|members)(?:\[(\d+)\])?$/.exec(path)
  if (!m) return
  const roleKey = (name: string) =>
    name === 'DEFAULT_ADMIN_ROLE' ? '@zero' : `@keccak256:${name}`
  tree.complete = true
  const role = child(tree, `.${roleKey(m[1] as string)}`)
  if (m[2] === 'adminRole') {
    child(role, '.adminRole').value = roleKey(value)
    child(role, '.adminRole').kind = 'number'
    return
  }
  for (const member of ['hasRole', 'members']) {
    const map = child(role, `.${member}`)
    map.complete = true
    if (m[3] !== undefined) {
      const leaf = child(map, `.${value.toLowerCase()}`)
      leaf.kind = 'boolean'
      leaf.value = 'true'
    } else if (value === '[]') map.value = '{}'
  }
}

function child(tree: ValueTree, key: string): ValueTree {
  let c = tree.children.get(key)
  if (!c) {
    c = valueTree()
    tree.children.set(key, c)
  }
  return c
}

export function runSolve(
  runDir: string,
  summaries: UnitSummary[],
  opts: SolveOptions = {},
): SolveSummary {
  const started = performance.now()
  const budget = opts.budget ?? BUDGET
  const { world, effectsOf, varOfEffect, reaches, guards, callGuards } =
    loadWorld(runDir, summaries, budget)
  const known = readTsv(join(runDir, 'facts', 'dEntry.facts'))
    .map((r) => r[0] ?? '')
    .filter((a) => a.length > 0)
  const facts = new Facts(SOLVED_RELATIONS)
  const summary: SolveSummary = {
    entries: 0,
    effects: 0,
    checks: 0,
    residuals: {},
    ms: 0,
    z3: z3Version(opts.z3),
    mismatches: [],
  }
  const solveDir = join(runDir, 'solve')
  mkdirSync(solveDir, { recursive: true })
  const targets: Array<{ via: string; H: string; role: string }> = []
  for (const [via, list] of world.entries)
    for (const en of list) targets.push({ via, H: en.H, role: en.role })
  let done = 0
  for (const t of targets) {
    opts.onProgress?.(done++, targets.length, `${t.via} ${shortName(t.H)}`)
    // the writes this entry can perform on its own storage, per the structure
    const direct = new Map<string, { E: string; C: string }>()
    for (const d of world.codeAt.get(t.via) ?? []) {
      const reach = reaches.get(`${d.C}|${t.H}`)
      if (!reach) continue
      for (const [, e, f] of effectsOf.get(d.C) ?? [])
        if (e && f && reach.has(f))
          direct.set(`${t.via}|${e}`, { E: e, C: d.C })
    }
    // one symbol table per entry function: names are stable within a walk (sender, p_x, st_…)
    world.decls = new Declarations()
    const walk = new Walk(world, t.via, t.H)
    let result: ReturnType<Walk['run']>
    try {
      result = walk.run()
    } catch (err) {
      // a failure of the walk is a residual on this entry's own writes, never a crash of the run
      const message = err instanceof Error ? err.message : String(err)
      summary.residuals['solver-error'] =
        (summary.residuals['solver-error'] ?? 0) + 1
      for (const [key, w] of direct) {
        const addr = key.split('|')[0] ?? t.via
        emitFacts(facts, {
          addr,
          via: t.via,
          entry: t.H,
          effect: w.E,
          variable: varOfEffect.get(w.E) ?? '',
          paths: [],
          explored: false,
          admits: [],
          excludes: [],
          residuals: [{ kind: 'solver-error', where: message.slice(0, 300) }],
          reads: [],
          unknownSymbols: [],
          checks: 0,
        })
      }
      continue
    }
    // ...plus every write the paths met, wherever it landed (inside calls to other contracts)
    const wanted = new Map(direct)
    for (const p of result.paths)
      for (const key of p.effects)
        if (!wanted.has(key)) {
          const [addr, e] = key.split('|')
          if (addr && e) wanted.set(key, { E: e, C: '' })
        }
    if (wanted.size === 0) continue
    summary.entries++
    const entryDir = join(solveDir, slug(t.via), slug(shortName(t.H)))
    mkdirSync(entryDir, { recursive: true })
    writeFileSync(
      join(entryDir, 'walk.json'),
      JSON.stringify(
        {
          via: t.via,
          entry: t.H,
          residuals: result.residuals,
          paths: result.paths.map((p) => ({ ...p, pc: p.pc.smt })),
        },
        null,
        2,
      ),
    )
    // writes performed by the same set of paths share one formula and one verdict (an initializer
    // writing twenty variables is decided once)
    const decided = new Map<string, EffectResult>()
    for (const [key, w] of wanted) {
      const addr = key.split('|')[0] ?? t.via
      const paths = result.paths.filter((p) => p.effects.includes(key))
      summary.effects++
      const effectDir = join(
        entryDir,
        slug(
          `${addr === t.via ? '' : `${addr}_`}${shortName(w.E).replace(/^[^@]*\(/, (m) => m)}`,
        ),
      )
      mkdirSync(effectDir, { recursive: true })
      const pathKey = `${addr}|${paths.map((p) => p.id).join(',')}`
      const same = decided.get(pathKey)
      const r: EffectResult = same
        ? {
            ...same,
            addr,
            effect: w.E,
            variable: varOfEffect.get(w.E) ?? '',
            checks: 0,
          }
        : decide(
            world,
            known,
            addr,
            t.via,
            t.H,
            w.E,
            varOfEffect.get(w.E) ?? '',
            paths,
            [...result.residuals],
            effectDir,
            opts,
          )
      if (!same) decided.set(pathKey, r)
      else
        writeFileSync(
          join(effectDir, 'same-as.txt'),
          `decided with ${same.effect} (the same paths perform both writes)\n`,
        )
      summary.checks += r.checks
      for (const res of r.residuals)
        summary.residuals[res.kind] = (summary.residuals[res.kind] ?? 0) + 1
      // consistency with the guard layer (own writes): every path performing E took every derived
      // guard as derived, and completed every call derived as a guard
      if (w.C) {
        const gkey = `${w.C}|${w.E}`
        for (const p of paths) {
          // the polarity that held when the write happened (a loop may test the same condition again later)
          const taken = { ...p.guardsTaken, ...(p.effectGuards[key] ?? {}) }
          for (const [x, pol] of guards.get(gkey) ?? [])
            if (taken[x] !== undefined && taken[x] !== pol)
              summary.mismatches.push(
                `${t.via} ${shortName(t.H)} ${shortName(w.E)}: guard ${shortName(x)} derived ${pol}, path ${p.id} took ${taken[x]}`,
              )
          for (const k of callGuards.get(gkey) ?? [])
            if (
              !p.callsMade.includes(k) &&
              p.guardsTaken[k] === undefined &&
              !p.residuals.some((res) => res.where.includes(k))
            )
              summary.mismatches.push(
                `${t.via} ${shortName(t.H)} ${shortName(w.E)}: call ${shortName(k)} derived as a guard, path ${p.id} did not complete it`,
              )
        }
      }
      writeFileSync(join(effectDir, 'result.json'), JSON.stringify(r, null, 2))
      emitFacts(facts, r)
    }
  }
  const solvedDir = join(runDir, 'facts', 'solved')
  mkdirSync(solvedDir, { recursive: true })
  facts.write(solvedDir)
  summary.ms = performance.now() - started
  writeFileSync(
    join(solveDir, 'summary.json'),
    JSON.stringify(summary, null, 2),
  )
  return summary
}

function emitFacts(facts: Facts, r: EffectResult): void {
  const base = [r.addr, r.via, r.entry, r.effect]
  facts.add(
    'solvedEffect',
    ...base,
    String(r.paths.length),
    r.explored ? 'explored' : 'partial',
  )
  for (const a of r.admits) {
    facts.add('solvedAdmits', ...base, a.actor, a.how)
    facts.add(
      'solvedWitness',
      ...base,
      a.actor,
      Object.entries(a.inputs)
        .map(([k, v]) => `${k}=${v}`)
        .join(' ') || '(no inputs matter)',
    )
  }
  for (const a of r.excludes) facts.add('solvedExcludes', ...base, a)
  if (r.open) facts.add('solvedOpen', ...base, r.open)
  const seen = new Set<string>()
  for (const res of r.residuals) {
    const k = `${res.kind}|${res.where}`
    if (seen.has(k)) continue
    seen.add(k)
    facts.add('solvedResidual', ...base, res.kind, res.where)
  }
  for (const read of r.reads) {
    const [addr2, v2] = read.split('|')
    if (addr2 && v2) facts.add('solvedReads', ...base, addr2, v2)
  }
  r.paths.forEach((p, i) => facts.add('solvedPath', ...base, `p${i + 1}`, p))
}

/** The verdict for one write, reached by calling one entry function. */
function decide(
  world: World,
  known: string[],
  addr: string,
  via: string,
  entry: string,
  effect: string,
  variable: string,
  paths: PathResult[],
  walkResiduals: Residual[],
  dir: string,
  opts: SolveOptions,
): EffectResult {
  const decls = world.decls
  const result: EffectResult = {
    addr,
    via,
    entry,
    effect,
    variable,
    paths: paths.map((p) => p.trace.join(' ; ')),
    explored: true,
    admits: [],
    excludes: [],
    residuals: [],
    reads: [],
    unknownSymbols: [],
    checks: 0,
  }
  const residuals: Residual[] = [...walkResiduals]
  for (const p of paths) residuals.push(...p.residuals)
  const exploration = residuals.filter((r) => EXPLORATION.has(r.kind))
  result.explored = exploration.length === 0
  const reads = new Set<string>()
  for (const p of paths) for (const r of p.guardReads) reads.add(r)
  result.reads = [...reads]
  if (paths.length === 0) {
    // no completing execution performs this write: nobody can, unless an unexplored execution could
    result.residuals = dedupe(exploration)
    if (result.explored) result.excludes = [...known, 'outsider']
    return result
  }
  const phi = or(...paths.map((p) => p.pc))
  const unknowns = [...phi.syms].filter((s) => decls.kindOf(s) === 'unknown')
  const chosen = [...phi.syms].filter(
    (s) => decls.kindOf(s) === 'chosen' && s !== 'sender',
  )
  result.unknownSymbols = unknowns
  const sender = decls.named(
    'sender',
    BV160,
    'chosen',
    'the transaction sender',
  )
  const knownTerms = known.map((a) => [a, addressLit(a)] as const)
  const outsider = and(...knownTerms.map(([, t]) => not(eq(sender, t))))

  // the sender is scoped per check: defined as the actor's address, or declared free (any / outsider)
  const SENDER = 'sender'
  const free: ScopedSymbol = { name: SENDER, sort: BV160 }
  const fixed = (addr: string): ScopedSymbol => ({
    name: SENDER,
    sort: BV160,
    value: addressLit(addr),
  })
  const z3opts = { timeoutMs: opts.timeoutMs, z3: opts.z3 }

  // script 0: can anyone at all drive it? unsat → nobody; no answer → nothing more to ask
  const a0 = new Script()
  a0.check('any', [free], [phi], ['sender', ...chosen])
  const textA0 = a0.text(decls, [SENDER])
  writeFileSync(join(dir, 'a0.smt2'), textA0)
  const runA0 = runZ3(textA0, dir, z3opts)
  result.checks += 1
  const any = runA0.checks[0]
  if (!any || any.result === 'unknown') {
    residuals.push({
      kind: 'solver-timeout',
      where: 'Z3 gave no answer within the budget for the path formula itself',
    })
    result.residuals = dedupe(
      residuals.filter(
        (r) => EXPLORATION.has(r.kind) || r.kind === 'solver-timeout',
      ),
    )
    return result
  }
  if (any.result === 'unsat') {
    if (result.explored) result.excludes = [...known, 'outsider']
    result.residuals = dedupe(residuals.filter((r) => EXPLORATION.has(r.kind)))
    return result
  }
  const senderFree = !phi.syms.has('sender')

  // script A: who satisfies Φ, with which inputs (Φ with the sender defined as each address in turn)
  const satActors: Array<{ actor: string; inputs: Record<string, string> }> = []
  const timeouts: string[] = []
  if (senderFree) {
    // the sender does not matter: what holds for one holds for all
    for (const [actor] of knownTerms)
      satActors.push({ actor, inputs: any.values })
    satActors.push({ actor: 'outsider', inputs: any.values })
  } else {
    const a = new Script()
    const labels: string[] = []
    for (const [actor] of knownTerms) {
      a.check(actor, [fixed(actor)], [phi], chosen)
      labels.push(actor)
    }
    a.check('outsider', [free], [phi, outsider], ['sender', ...chosen])
    labels.push('outsider')
    const textA = a.text(decls, [SENDER])
    writeFileSync(join(dir, 'a.smt2'), textA)
    const runA = runZ3(textA, dir, z3opts)
    result.checks += a.size
    const byLabel = new Map(runA.checks.map((c) => [c.label, c]))
    for (const actor of labels) {
      const c = byLabel.get(actor)
      if (!c || c.result === 'unknown') timeouts.push(actor)
      else if (c.result === 'unsat') result.excludes.push(actor)
      else satActors.push({ actor, inputs: c.values })
    }
    for (const t of timeouts)
      residuals.push({
        kind: 'solver-timeout',
        where: `${t}: Z3 gave no answer within the budget`,
      })
  }

  // script B: is the answer robust? For a sender a: are there inputs such that Φ holds for every value
  // of the unknowns (∃ chosen ∀ unknowns Φ)? For the rest of the world: inputs such that Φ holds for
  // every value of the unknowns and every sender outside the discovered set. A formula that rests on
  // a hash of chosen data is never robust: the solver could pick the function.
  const needB = satActors.filter(
    (s) => unknowns.length > 0 || s.actor === 'outsider',
  )
  const hashed = unknowns.some((n) => n.startsWith('ufmark_'))
  if (needB.length > 0 && !hashed) {
    const bound = unknowns
      .map((n) => decls.symbols.get(n))
      .filter((x): x is NonNullable<typeof x> => x !== undefined)
    const b = new Script()
    for (const s of needB) {
      if (s.actor === 'outsider')
        b.check(
          'outsider',
          [],
          [
            forall(
              [
                { name: SENDER, sort: BV160, kind: 'chosen', origin: '' },
                ...bound,
              ],
              implies(outsider, phi),
            ),
          ],
          chosen,
        )
      else b.check(s.actor, [fixed(s.actor)], [forall(bound, phi)], chosen)
    }
    const textB = b.text(decls, [SENDER])
    writeFileSync(join(dir, 'b.smt2'), textB)
    const runB = runZ3(textB, dir, z3opts)
    result.checks += b.size
    const byLabelB = new Map(runB.checks.map((c) => [c.label, c]))
    for (const s of needB) {
      const c = byLabelB.get(s.actor)
      const ok = c?.result === 'sat'
      const inputs = pickInputs(c?.values ?? s.inputs, chosen)
      if (s.actor === 'outsider') {
        if (ok) result.open = 'robust'
        else if (!c || c.result === 'unknown')
          residuals.push({
            kind: 'solver-timeout',
            where: 'outsider: Z3 gave no answer to the robustness question',
          })
        else {
          const sample = s.inputs.sender ? parseBv(s.inputs.sender) : undefined
          residuals.push({
            kind: unknowns.length > 0 ? 'depends-on' : 'open-unproven',
            where:
              unknowns.length > 0
                ? `whether addresses outside the discovered set pass depends on: ${unknownOrigins(decls, unknowns)}`
                : `some address outside the discovered set passes (e.g. ${sample !== undefined ? addressText(sample) : '?'}) but not every one`,
          })
        }
        continue
      }
      if (ok) result.admits.push({ actor: s.actor, how: 'robust', inputs })
      else if (!c || c.result === 'unknown')
        residuals.push({
          kind: 'solver-timeout',
          where: `${s.actor}: Z3 gave no answer to the robustness question`,
        })
      else
        residuals.push({
          kind: 'depends-on',
          where: `whether ${s.actor} passes depends on: ${unknownOrigins(decls, unknowns)}`,
        })
    }
  } else if (needB.length > 0) {
    for (const s of needB)
      residuals.push({
        kind: 'depends-on',
        where: `whether ${s.actor === 'outsider' ? 'addresses outside the discovered set pass' : `${s.actor} passes`} depends on an uninterpreted result (a hash or signature): ${unknownOrigins(decls, unknowns) || 'see the formula'}`,
      })
  }
  for (const s of satActors) {
    if (s.actor === 'outsider') continue
    if (unknowns.length === 0)
      result.admits.push({
        actor: s.actor,
        how: 'witness',
        inputs: pickInputs(s.inputs, chosen),
      })
  }
  // an exploration residual: exclusions are not exclusions
  if (!result.explored) result.excludes = []
  // residuals that concern the verdict; structural residuals whose unknown symbol did not end up in Φ
  // are informational only (they stay in walk.json)
  result.residuals = dedupe(
    residuals.filter(
      (r) =>
        EXPLORATION.has(r.kind) ||
        r.kind === 'depends-on' ||
        r.kind === 'open-unproven' ||
        r.kind === 'solver-timeout',
    ),
  )
  return result
}

function dedupe(residuals: Residual[]): Residual[] {
  const seen = new Set<string>()
  return residuals.filter((r) => {
    const k = `${r.kind}|${r.where}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

function pickInputs(
  values: Record<string, string>,
  chosen: string[],
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const c of chosen)
    if (values[c] !== undefined) out[c] = values[c] as string
  return out
}

function unknownOrigins(decls: Declarations, names: string[]): string {
  const origins = new Set<string>()
  for (const n of names) {
    const o = decls.symbols.get(n)?.origin
    if (o) origins.add(o)
  }
  return [...origins].join('; ')
}

function addressLit(addr: string): Term {
  const hex = addr.replace(/^[a-z0-9]+:0x/, '').toLowerCase()
  return {
    sort: BV160,
    smt: `#x${hex.padStart(40, '0')}`,
    value: BigInt(`0x${hex}`),
    syms: new Set(),
  }
}

/** Reads a solve summary if the run has one. */
export function loadSolveSummary(runDir: string): SolveSummary | undefined {
  const p = join(runDir, 'solve', 'summary.json')
  return existsSync(p)
    ? (JSON.parse(readFileSync(p, 'utf8')) as SolveSummary)
    : undefined
}

/** The solver's result for one write, if the run has one. */
export function loadEffectResult(
  runDir: string,
  via: string,
  entry: string,
  effect: string,
  addr = via,
): { result: EffectResult; dir: string } | undefined {
  const dir = join(
    runDir,
    'solve',
    slug(via),
    slug(shortName(entry)),
    slug(`${addr === via ? '' : `${addr}_`}${shortName(effect)}`),
  )
  const p = join(dir, 'result.json')
  return existsSync(p)
    ? { result: JSON.parse(readFileSync(p, 'utf8')) as EffectResult, dir }
    : undefined
}
