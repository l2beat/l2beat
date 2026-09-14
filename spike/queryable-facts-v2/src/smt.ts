// SMT-LIB terms for the solve stage, and Z3 as a subprocess.
//
// A Term is SMT-LIB text with its sort, the free symbols it mentions, and (for literals) its value, so
// that conditions decided by recorded state fold to constants before any solver runs (`if (checked)`
// with `checked` recorded true). Sorts: Bool, bit-vectors of 160 (addresses) and 256 (everything
// numeric: QF_BV, wrap-around semantics), an uninterpreted sort Str for strings and byte arrays, and
// SMT arrays for mappings and storage arrays. Every free symbol is declared with a *kind*:
//   chosen    the actor picks it (sender, tx.origin, calldata, msg.value, block data)
//   unknown   nobody here knows it (storage discovery did not record, a hash, an unsupported expression)
// The decision procedure in src/solve.ts treats sat answers that rest on unknown symbols as unknown.

import { existsSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import { spawnToFiles } from './souffle'

export type Sort =
  | { kind: 'Bool' }
  | { kind: 'BV'; bits: number }
  | { kind: 'Str' }
  | { kind: 'Array'; index: Sort; elem: Sort }

export const BOOL: Sort = { kind: 'Bool' }
export const BV160: Sort = { kind: 'BV', bits: 160 }
export const BV256: Sort = { kind: 'BV', bits: 256 }
export const STR: Sort = { kind: 'Str' }
export const arraySort = (index: Sort, elem: Sort): Sort => ({
  kind: 'Array',
  index,
  elem,
})

export function sortText(s: Sort): string {
  switch (s.kind) {
    case 'Bool':
      return 'Bool'
    case 'BV':
      return `(_ BitVec ${s.bits})`
    case 'Str':
      return 'Str'
    case 'Array':
      return `(Array ${sortText(s.index)} ${sortText(s.elem)})`
  }
}

export function sameSort(a: Sort, b: Sort): boolean {
  return sortText(a) === sortText(b)
}

export interface Term {
  readonly sort: Sort
  /** SMT-LIB text; a large subterm is replaced by the name of a shared definition (see expand). */
  readonly smt: string
  /** Literal value when the term is a constant (bit-vectors as non-negative bigint). */
  readonly value?: bigint | boolean
  /** Free symbols the term mentions (through its definitions too). */
  readonly syms: ReadonlySet<string>
  /** Shared definitions the text refers to directly. */
  readonly defs?: ReadonlySet<string>
}

// ---------- shared definitions ----------
// Path formulas repeat the same subterms (a modifier's arithmetic on every path, a store chain in every
// select). Any application whose text grows past a threshold is registered once and referred to by
// name; `expand` prints a term with its definitions as nested `let`s, inside whatever quantifier binds
// the symbols they mention. Identical subterms share one definition, so a formula is a DAG on disk.

interface Definition {
  name: string
  smt: string
  sort: Sort
  deps: ReadonlySet<string>
}
const DEFS = new Map<string, Definition>()
const DEF_BY_SMT = new Map<string, string>()
const DEFINE_THRESHOLD = 160

function defsOf(...terms: Term[]): ReadonlySet<string> {
  const out = new Set<string>()
  for (const t of terms) if (t.defs) for (const d of t.defs) out.add(d)
  return out
}

/** The term's text with every definition it rests on bound by `let`, innermost last. */
export function expand(t: Term): string {
  if (!t.defs || t.defs.size === 0) return t.smt
  const order: Definition[] = []
  const seen = new Set<string>()
  const visit = (name: string) => {
    if (seen.has(name)) return
    seen.add(name)
    const d = DEFS.get(name)
    if (!d) return
    for (const dep of d.deps) visit(dep)
    order.push(d)
  }
  for (const d of t.defs) visit(d)
  let text = t.smt
  for (let i = order.length - 1; i >= 0; i--) {
    const d = order[i] as Definition
    text = `(let ((${d.name} ${d.smt})) ${text})`
  }
  return text
}

export type SymKind = 'chosen' | 'unknown'

export interface Symbol {
  name: string
  sort: Sort
  kind: SymKind
  /** Why the value is free, in words (becomes the residual text for unknown symbols). */
  origin: string
}

const NONE: ReadonlySet<string> = new Set()

function union(...sets: ReadonlySet<string>[]): ReadonlySet<string> {
  const out = new Set<string>()
  for (const s of sets) for (const x of s) out.add(x)
  return out
}

function mask(bits: number): bigint {
  return (1n << BigInt(bits)) - 1n
}

export function bvLiteral(value: bigint, bits: number): Term {
  const v =
    ((value % (1n << BigInt(bits))) + (1n << BigInt(bits))) %
    (1n << BigInt(bits))
  const hex = v.toString(16).padStart(bits / 4, '0')
  return { sort: { kind: 'BV', bits }, smt: `#x${hex}`, value: v, syms: NONE }
}

export function boolLiteral(b: boolean): Term {
  return { sort: BOOL, smt: b ? 'true' : 'false', value: b, syms: NONE }
}

export const TRUE = boolLiteral(true)
export const FALSE = boolLiteral(false)

export function symbol(name: string, sort: Sort): Term {
  return { sort, smt: name, syms: new Set([name]) }
}

export function isConst(t: Term): boolean {
  return t.value !== undefined
}

function bits(t: Term): number {
  if (t.sort.kind !== 'BV') throw new Error(`not a bit-vector: ${t.smt}`)
  return t.sort.bits
}

function toSigned(v: bigint, n: number): bigint {
  return v >= 1n << BigInt(n - 1) ? v - (1n << BigInt(n)) : v
}

function app(op: string, sort: Sort, args: Term[]): Term {
  const smt = `(${op} ${args.map((a) => a.smt).join(' ')})`
  const syms = union(...args.map((a) => a.syms))
  const deps = defsOf(...args)
  if (smt.length <= DEFINE_THRESHOLD) return { sort, smt, syms, defs: deps }
  let name = DEF_BY_SMT.get(smt)
  if (!name) {
    name = `d${DEFS.size}`
    DEFS.set(name, { name, smt, sort, deps })
    DEF_BY_SMT.set(smt, name)
  }
  return { sort, smt: name, syms, defs: new Set([name]) }
}

// ---------- boolean connectives ----------

export function not(a: Term): Term {
  if (typeof a.value === 'boolean') return boolLiteral(!a.value)
  if (a.smt.startsWith('(not ') && a.smt.endsWith(')'))
    return { sort: BOOL, smt: a.smt.slice(5, -1), syms: a.syms, defs: a.defs }
  return app('not', BOOL, [a])
}

export function and(...xs: Term[]): Term {
  const args: Term[] = []
  for (const x of xs) {
    if (x.value === false) return FALSE
    if (x.value === true) continue
    args.push(x)
  }
  if (args.length === 0) return TRUE
  if (args.length === 1) return args[0] as Term
  return app('and', BOOL, args)
}

export function or(...xs: Term[]): Term {
  const args: Term[] = []
  for (const x of xs) {
    if (x.value === true) return TRUE
    if (x.value === false) continue
    args.push(x)
  }
  if (args.length === 0) return FALSE
  if (args.length === 1) return args[0] as Term
  return app('or', BOOL, args)
}

export function implies(a: Term, b: Term): Term {
  return or(not(a), b)
}

export function ite(c: Term, a: Term, b: Term): Term {
  if (c.value === true) return a
  if (c.value === false) return b
  if (a.smt === b.smt) return a
  return app('ite', a.sort, [c, a, b])
}

// ---------- equality and comparison ----------

export function eq(a: Term, b: Term): Term {
  if (a.value !== undefined && b.value !== undefined)
    return boolLiteral(a.value === b.value)
  if (a.smt === b.smt) return TRUE
  return app('=', BOOL, [a, b])
}

export function distinct(...xs: Term[]): Term {
  if (xs.length < 2) return TRUE
  return app('distinct', BOOL, xs)
}

/** `<`, `<=`, `>`, `>=` on bit-vectors, unsigned unless `signed`. */
export function compare(
  op: '<' | '<=' | '>' | '>=',
  a: Term,
  b: Term,
  signed: boolean,
): Term {
  const n = bits(a)
  if (typeof a.value === 'bigint' && typeof b.value === 'bigint') {
    const x = signed ? toSigned(a.value, n) : a.value
    const y = signed ? toSigned(b.value, n) : b.value
    const r =
      op === '<' ? x < y : op === '<=' ? x <= y : op === '>' ? x > y : x >= y
    return boolLiteral(r)
  }
  const name = {
    '<': signed ? 'bvslt' : 'bvult',
    '<=': signed ? 'bvsle' : 'bvule',
    '>': signed ? 'bvsgt' : 'bvugt',
    '>=': signed ? 'bvsge' : 'bvuge',
  }[op]
  return app(name, BOOL, [a, b])
}

// ---------- arithmetic (wrap-around) ----------

export type ArithOp =
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '**'
  | '<<'
  | '>>'
  | '&'
  | '|'
  | '^'

export function arith(op: ArithOp, a: Term, b: Term, signed: boolean): Term {
  const n = bits(a)
  if (typeof a.value === 'bigint' && typeof b.value === 'bigint') {
    const x = a.value
    const y = b.value
    const sx = toSigned(x, n)
    const sy = toSigned(y, n)
    let r: bigint | undefined
    switch (op) {
      case '+':
        r = x + y
        break
      case '-':
        r = x - y
        break
      case '*':
        r = x * y
        break
      case '/':
        if (y !== 0n) r = signed ? sx / sy : x / y
        break
      case '%':
        if (y !== 0n) r = signed ? sx % sy : x % y
        break
      case '**':
        if (y <= 512n) r = x ** y
        break
      case '<<':
        r = y < BigInt(n) ? x << y : 0n
        break
      case '>>':
        r = signed
          ? sx >> (y < BigInt(n) ? y : BigInt(n - 1))
          : y < BigInt(n)
            ? x >> y
            : 0n
        break
      case '&':
        r = x & y
        break
      case '|':
        r = x | y
        break
      case '^':
        r = x ^ y
        break
    }
    if (r !== undefined) return bvLiteral(r & mask(n), n)
  }
  const name: Record<ArithOp, string | undefined> = {
    '+': 'bvadd',
    '-': 'bvsub',
    '*': 'bvmul',
    '/': signed ? 'bvsdiv' : 'bvudiv',
    '%': signed ? 'bvsrem' : 'bvurem',
    '**': undefined,
    '<<': 'bvshl',
    '>>': signed ? 'bvashr' : 'bvlshr',
    '&': 'bvand',
    '|': 'bvor',
    '^': 'bvxor',
  }
  const fn = name[op]
  if (!fn) throw new UnsupportedTerm(`operator ${op} on symbolic operands`)
  return app(fn, a.sort, [a, b])
}

export function bvnot(a: Term): Term {
  if (typeof a.value === 'bigint')
    return bvLiteral(~a.value & mask(bits(a)), bits(a))
  return app('bvnot', a.sort, [a])
}

export function bvneg(a: Term): Term {
  if (typeof a.value === 'bigint')
    return bvLiteral(-a.value & mask(bits(a)), bits(a))
  return app('bvneg', a.sort, [a])
}

/** Resize a bit-vector: zero-extend (or sign-extend) when widening, truncate when narrowing. */
export function resize(a: Term, to: number, signed = false): Term {
  const from = bits(a)
  if (from === to) return a
  if (typeof a.value === 'bigint') {
    const v = signed && from < to ? toSigned(a.value, from) : a.value
    return bvLiteral(v & mask(to), to)
  }
  if (from < to)
    return {
      sort: { kind: 'BV', bits: to },
      smt: `((_ ${signed ? 'sign_extend' : 'zero_extend'} ${to - from}) ${a.smt})`,
      syms: a.syms,
      defs: a.defs,
    }
  return {
    sort: { kind: 'BV', bits: to },
    smt: `((_ extract ${to - 1} 0) ${a.smt})`,
    syms: a.syms,
    defs: a.defs,
  }
}

/** Keep the low `keep` bits of a 256-bit value (a narrowing conversion such as uint8(x)). */
export function truncate(a: Term, keep: number): Term {
  if (keep >= bits(a)) return a
  return arith('&', a, bvLiteral(mask(keep), bits(a)), false)
}

// ---------- arrays ----------

/** A closed term: no free symbols (a literal, a string constant, a hash of constants). */
function closed(t: Term): boolean {
  return t.syms.size === 0
}

export function select(arr: Term, idx: Term): Term {
  if (arr.sort.kind !== 'Array') throw new Error(`select on ${arr.smt}`)
  // select over a chain of stores folds while the keys are decidable: two closed terms are equal when
  // they print the same and different otherwise (literals by value; distinct string constants and
  // hashes of distinct constants are asserted distinct by Declarations, hashes never equal a literal)
  let cur = arr
  while (isStore(cur)) {
    const [base, key, val] = cur.storeArgs
    if (closed(idx) && closed(key)) {
      if (idx.smt === key.smt) return val
      cur = base
      continue
    }
    break
  }
  if (isConstArray(cur) && closed(idx)) return cur.constDefault
  if (cur !== arr && !isStore(cur))
    return app('select', arr.sort.elem, [cur, idx])
  return app('select', arr.sort.elem, [arr, idx])
}

interface ConstArrayTerm extends Term {
  constDefault: Term
}

function isConstArray(t: Term): t is ConstArrayTerm {
  return 'constDefault' in t
}

/** `((as const (Array K V)) default)`: an array holding `dflt` at every key. */
export function constArray(sort: Sort, dflt: Term): Term {
  const t: ConstArrayTerm = {
    sort,
    smt: `((as const ${sortText(sort)}) ${dflt.smt})`,
    syms: dflt.syms,
    defs: dflt.defs,
    constDefault: dflt,
  }
  return t
}

/** The zero of a sort: false, 0, and for arrays the constant array of zeros (strings have none). */
export function zero(sort: Sort): Term | undefined {
  switch (sort.kind) {
    case 'Bool':
      return FALSE
    case 'BV':
      return bvLiteral(0n, sort.bits)
    case 'Array': {
      const z = zero(sort.elem)
      return z ? constArray(sort, z) : undefined
    }
    default:
      return undefined
  }
}

interface StoreTerm extends Term {
  storeArgs: [Term, Term, Term]
}

function isStore(t: Term): t is StoreTerm {
  return 'storeArgs' in t
}

export function store(arr: Term, idx: Term, val: Term): Term {
  if (arr.sort.kind !== 'Array') throw new Error(`store on ${arr.smt}`)
  const t: StoreTerm = {
    ...app('store', arr.sort, [arr, idx, val]),
    storeArgs: [arr, idx, val],
  }
  return t
}

// ---------- quantifiers ----------

/**
 * `(forall ((x S) ...) body)`; the body itself when nothing is bound. A bound name may be that of a
 * declared constant (`sender`): inside the quantifier the bound variable shadows it, which is how the
 * outsider check quantifies over the sender without rewriting the formula.
 */
export function forall(bound: Symbol[], body: Term): Term {
  if (bound.length === 0) return body
  const names = new Set(bound.map((b) => b.name))
  return {
    sort: BOOL,
    smt: `(forall (${bound.map((b) => `(${b.name} ${sortText(b.sort)})`).join(' ')}) ${expand(body)})`,
    syms: new Set([...body.syms].filter((s) => !names.has(s))),
  }
}

// ---------- uninterpreted functions ----------

export class UnsupportedTerm extends Error {}

/** The declarations a script needs: symbols by kind, uninterpreted functions, string constants. */
export class Declarations {
  readonly symbols = new Map<string, Symbol>()
  readonly functions = new Map<string, { args: Sort[]; ret: Sort }>()
  readonly strings = new Map<string, string>()
  /** Hash applications on distinct closed arguments: asserted pairwise distinct (no collisions). */
  private readonly hashes = new Map<string, Term>()
  /** Extra assertions every script starts with (assumptions such as "these keys are distinct"). */
  private readonly assumptions = new Map<string, Term>()
  private counter = 0

  /** Assume `t` in every check (a modelling assumption, stated in the script's header). */
  assume(t: Term): void {
    if (t.value === true) return
    this.assumptions.set(t.smt, t)
  }

  fresh(prefix: string, sort: Sort, kind: SymKind, origin: string): Term {
    const name = `${prefix}_${this.counter++}`.replace(/[^\w]/g, '_')
    this.symbols.set(name, { name, sort, kind, origin })
    return symbol(name, sort)
  }

  /** A named symbol, declared once; the same name always denotes the same value. */
  named(name: string, sort: Sort, kind: SymKind, origin: string): Term {
    const clean = name.replace(/[^\w]/g, '_')
    const have = this.symbols.get(clean)
    if (have) {
      if (!sameSort(have.sort, sort))
        throw new Error(`symbol ${clean} used with two sorts`)
      return symbol(clean, sort)
    }
    this.symbols.set(clean, { name: clean, sort, kind, origin })
    return symbol(clean, sort)
  }

  /** An application of uninterpreted function `name` (declared by its argument sorts). */
  apply(name: string, args: Term[], ret: Sort): Term {
    const sig = `${name}_${args.map((a) => sortText(a.sort).replace(/[^\w]/g, '')).join('_')}`
    if (!this.functions.has(sig))
      this.functions.set(sig, { args: args.map((a) => a.sort), ret })
    if (args.length === 0) return symbol(sig, ret)
    const t = app(sig, ret, args)
    if (/^uf_(keccak256|sha256)_/.test(sig) && args.every(closed))
      this.hashes.set(t.smt, t)
    return t
  }

  /** A string / bytes literal: one distinct constant of sort Str per distinct text. */
  string(text: string): Term {
    let name = this.strings.get(text)
    if (!name) {
      name = `str_${this.strings.size}`
      this.strings.set(text, name)
    }
    return { sort: STR, smt: name, syms: NONE }
  }

  kindOf(name: string): SymKind | undefined {
    return this.symbols.get(name)?.kind
  }

  header(skip: ReadonlySet<string> = new Set()): string[] {
    const lines = ['(set-option :produce-models true)', '(declare-sort Str 0)']
    for (const s of this.symbols.values())
      if (!skip.has(s.name))
        lines.push(`(declare-const ${s.name} ${sortText(s.sort)})`)
    for (const [name, f] of this.functions) {
      if (f.args.length === 0)
        lines.push(`(declare-const ${name} ${sortText(f.ret)})`)
      else
        lines.push(
          `(declare-fun ${name} (${f.args.map(sortText).join(' ')}) ${sortText(f.ret)})`,
        )
    }
    for (const name of this.strings.values())
      lines.push(`(declare-const ${name} Str)`)
    if (this.strings.size > 1)
      lines.push(`(assert (distinct ${[...this.strings.values()].join(' ')}))`)
    if (this.hashes.size > 1)
      lines.push(
        `(assert (distinct ${[...this.hashes.values()].map((h) => h.smt).join(' ')}))`,
      )
    for (const a of this.assumptions.values())
      lines.push(`(assert ${expand(a)})`)
    return lines
  }
}

// ---------- scripts and Z3 ----------

export type SatResult = 'sat' | 'unsat' | 'unknown'

export interface Check {
  label: string
  result: SatResult
  /** Values of the requested symbols when sat (as Z3 prints them: #x..., true/false). */
  values: Record<string, string>
}

/**
 * One SMT-LIB script: assertions shared by every check, then the checks, each under its own assumptions
 * (`check-sat-assuming` with indicator literals: the solver keeps what it learnt about the shared part).
 */
export interface ScopedSymbol {
  name: string
  sort: Sort
  /** Defined to this value inside the check (`define-fun`); declared free when absent. */
  value?: Term
}

/**
 * One SMT-LIB script of independent checks, each inside push/pop. Symbols listed as *scoped* are not
 * declared globally: every check defines them to a value (`define-fun`, so the solver folds them away)
 * or declares them free. Asking "does Φ hold for sender a" with `sender` defined as the literal a is
 * far cheaper than the same question with `sender` free and constrained.
 */
export class Script {
  private readonly checks: Array<{
    label: string
    scoped: ScopedSymbol[]
    asserts: Term[]
    want: string[]
  }> = []

  check(
    label: string,
    scoped: ScopedSymbol[],
    asserts: Term[],
    want: string[] = [],
  ): number {
    this.checks.push({ label, scoped, asserts, want })
    return this.checks.length - 1
  }

  get size(): number {
    return this.checks.length
  }

  text(decls: Declarations, scopedNames: Iterable<string>): string {
    const skip = new Set(scopedNames)
    const lines = decls.header(skip)
    for (const c of this.checks) {
      lines.push('(push)', `(echo "@${c.label}")`)
      for (const sym of c.scoped)
        lines.push(
          sym.value
            ? `(define-fun ${sym.name} () ${sortText(sym.sort)} ${expand(sym.value)})`
            : `(declare-const ${sym.name} ${sortText(sym.sort)})`,
        )
      for (const t of c.asserts)
        if (t.value !== true) lines.push(`(assert ${expand(t)})`)
      lines.push('(check-sat)')
      const want = c.want.filter(
        (w) => decls.symbols.has(w) || c.scoped.some((x) => x.name === w),
      )
      if (want.length > 0) lines.push(`(get-value (${want.join(' ')}))`)
      lines.push('(pop)')
    }
    return `${lines.join('\n')}\n`
  }
}

export const Z3_BIN =
  process.env.Z3_BIN ??
  (existsSync(join(homedir(), '.local', 'bin', 'z3'))
    ? join(homedir(), '.local', 'bin', 'z3')
    : 'z3')

export interface Z3Run {
  checks: Check[]
  ms: number
  command: string
  stderr: string
}

/** Runs a script through Z3 (stdio bound to files in `dir`, see souffle.ts) and parses the answers in order. */
export function runZ3(
  script: string,
  dir: string,
  opts: { timeoutMs?: number; hardTimeoutS?: number; z3?: string } = {},
): Z3Run {
  const bin = opts.z3 ?? Z3_BIN
  const args = [
    '-in',
    `-t:${opts.timeoutMs ?? 500}`,
    `-T:${opts.hardTimeoutS ?? 60}`,
    '-memory:2048',
  ]
  const t0 = performance.now()
  const run = spawnToFiles(bin, args, dir, script, 'z3')
  const ms = performance.now() - t0
  if (run.error)
    throw new Error(
      `could not run '${bin}': ${run.error.message} (set $Z3_BIN)`,
    )
  return {
    checks: parseZ3(run.stdout),
    ms,
    command: [bin, ...args].join(' '),
    stderr: run.stderr.trim(),
  }
}

export function z3Version(z3?: string): string {
  const run = spawnToFiles(
    z3 ?? Z3_BIN,
    ['--version'],
    join(process.cwd(), 'out'),
    '',
    'z3-version',
  )
  return run.stdout.trim() || 'unavailable'
}

/** Z3's output: `@label` echoes, sat/unsat/unknown, `((a #x..) (b true))` value lists, and errors. */
export function parseZ3(stdout: string): Check[] {
  const checks: Check[] = []
  let current: Check | undefined
  const lines = stdout.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = (lines[i] ?? '').trim()
    if (line.length === 0) continue
    if (line.startsWith('@')) {
      current = { label: line.slice(1), result: 'unknown', values: {} }
      checks.push(current)
    } else if (line === 'sat' || line === 'unsat' || line === 'unknown') {
      if (current) current.result = line
    } else if (line.startsWith('((') || line.startsWith('(error')) {
      // a value list may span several lines; gather until the parentheses balance
      let text = line
      let depth = balance(line)
      while (depth > 0 && i + 1 < lines.length) {
        i++
        text += ` ${(lines[i] ?? '').trim()}`
        depth = balance(text)
      }
      if (current && !text.startsWith('(error')) {
        for (const m of text.matchAll(
          /\((\w+)\s+([^()\s]+|\(_ bv\d+ \d+\))\)/g,
        ))
          current.values[m[1] as string] = m[2] as string
      }
    }
  }
  return checks
}

function balance(text: string): number {
  let d = 0
  for (const ch of text) {
    if (ch === '(') d++
    else if (ch === ')') d--
  }
  return d
}

/** A Z3 value (`#x…`, `(_ bv5 256)`) as a bigint. */
export function parseBv(text: string): bigint | undefined {
  if (text.startsWith('#x')) return BigInt(`0x${text.slice(2)}`)
  if (text.startsWith('#b')) return BigInt(`0b${text.slice(2)}`)
  const m = /^\(_ bv(\d+) \d+\)$/.exec(text)
  if (m) return BigInt(m[1] as string)
  return undefined
}

/** An `eth:0x…` address as a 160-bit literal. */
export function addressLiteral(addr: string): Term {
  const hex = addr.replace(/^[a-z0-9]+:/, '')
  return bvLiteral(BigInt(hex), 160)
}

/** A 160-bit literal as `eth:0x…` (lower-case). */
export function addressText(value: bigint): string {
  return `eth:0x${value.toString(16).padStart(40, '0')}`
}
