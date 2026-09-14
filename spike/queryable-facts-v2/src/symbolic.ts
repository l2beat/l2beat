// Symbolic execution of one entry function over the solc AST: every complete execution ("path") as a
// condition over the sender, the calldata and the recorded state, together with the writes it performs.
//
// The walk is a bounded interpreter: statements in order, locals in an environment, `if` and `?:` fork the
// path, loops unroll, internal calls and modifiers inline, external calls to a deployed contract inline
// that contract's function with `msg.sender` = the calling address and its own storage; whatever cannot
// be followed becomes a free symbol of kind `unknown` (recorded on the path as a residual). Reverting
// executions are dropped: a path here is one that completes. The solve stage (src/solve.ts) decides who
// can drive each path with Z3. Rules/2-guards.dl states the same structure declaratively; the per-path
// conditions here must contain every guard it derives (the solve stage checks that).
//
// Bounds: BUDGET.paths live paths per entry, BUDGET.loop iterations per loop, BUDGET.depth nested calls.
// Running out records a residual (too-many-paths, loop-bound, call-depth) instead of dropping executions
// silently: an unexplored execution makes every exclusion on that effect unknown.

import {
  type ArithOp,
  addressLiteral,
  and,
  arith,
  arraySort,
  BOOL,
  BV160,
  BV256,
  boolLiteral,
  bvLiteral,
  bvneg,
  bvnot,
  compare,
  type Declarations,
  distinct,
  eq,
  FALSE,
  isConst,
  ite,
  not,
  or,
  resize,
  type Sort,
  STR,
  select,
  store,
  type Term,
  TRUE,
  truncate,
  UnsupportedTerm,
  zero,
} from './smt'

export interface Budget {
  paths: number
  loop: number
  depth: number
}
export const BUDGET: Budget = { paths: 64, loop: 3, depth: 6 }

export interface Residual {
  kind: string
  where: string
}

// ---------- the AST ----------

export interface AstNode {
  nodeType: string
  id: number
  src: string
  [key: string]: unknown
}

function isNode(x: unknown): x is AstNode {
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof (x as AstNode).nodeType === 'string'
  )
}

function child(n: AstNode, key: string): AstNode | undefined {
  const v = n[key]
  return isNode(v) ? v : undefined
}

function children(n: AstNode, key: string): AstNode[] {
  const v = n[key]
  return Array.isArray(v) ? v.filter(isNode) : []
}

function str(n: AstNode, key: string): string {
  const v = n[key]
  return typeof v === 'string' ? v : ''
}

function num(n: AstNode, key: string): number | undefined {
  const v = n[key]
  return typeof v === 'number' ? v : undefined
}

export function typeString(n: AstNode): string {
  const td = n.typeDescriptions
  if (typeof td === 'object' && td !== null) {
    const ts = (td as { typeString?: unknown }).typeString
    if (typeof ts === 'string') return ts
  }
  return ''
}

function srcKey(n: AstNode): string {
  const [start, len] = n.src.split(':')
  return `${start}:${len}`
}

/** One compiled source file with the lookups the walk needs. */
export interface UnitCode {
  unit: string
  slug: string
  ast: AstNode
  nodes: Map<number, AstNode>
  /** Symbol of every function and modifier definition (from the unit's sourceLoc rows). */
  fnSymbol: Map<number, string>
  /** `<unit>:<Contract>.<name>` of every contract-level variable declaration. */
  varSymbol: Map<number, string>
  /** `${C}|${F}|${G0}` → G: resolved internal/modifier dispatch inside deployable C. */
  dispatch: Map<string, string>
  /** Function symbol → 4-byte selector (public/external functions). */
  selector: Map<string, string>
}

export function indexAst(
  unit: string,
  slug: string,
  ast: AstNode,
  sourceLoc: string[][],
  dispatch: string[][],
  functions: string[][],
): UnitCode {
  const nodes = new Map<number, AstNode>()
  const visit = (n: unknown) => {
    if (Array.isArray(n)) {
      for (const x of n) visit(x)
      return
    }
    if (!isNode(n)) return
    nodes.set(n.id, n)
    for (const [k, v] of Object.entries(n)) {
      if (k === 'typeDescriptions' || k === 'documentation') continue
      if (typeof v === 'object' && v !== null) visit(v)
    }
  }
  visit(ast)
  // definitions by source position: the sourceLoc ids without '@' are definitions
  const defBySrc = new Map<string, string>()
  for (const row of sourceLoc) {
    const [id, , , , start, len] = row
    if (!id || id.includes('@')) continue
    defBySrc.set(`${start}:${len}`, id)
  }
  const fnSymbol = new Map<number, string>()
  const varSymbol = new Map<number, string>()
  for (const n of nodes.values()) {
    if (
      n.nodeType === 'FunctionDefinition' ||
      n.nodeType === 'ModifierDefinition'
    ) {
      const sym = defBySrc.get(srcKey(n))
      if (sym) fnSymbol.set(n.id, sym)
    } else if (n.nodeType === 'VariableDeclaration') {
      const scope = num(n, 'scope')
      const owner = scope !== undefined ? nodes.get(scope) : undefined
      if (owner?.nodeType === 'ContractDefinition')
        varSymbol.set(n.id, `${unit}:${str(owner, 'name')}.${str(n, 'name')}`)
      else if (owner?.nodeType === 'SourceUnit')
        varSymbol.set(n.id, `${unit}:${str(n, 'name')}`)
    }
  }
  const dispatchMap = new Map<string, string>()
  for (const [c, f, g0, g] of dispatch)
    if (c && f && g0 && g) dispatchMap.set(`${c}|${f}|${g0}`, g)
  const selector = new Map<string, string>()
  for (const row of functions) {
    const [f, , , , , , , sel] = row
    if (f && sel) selector.set(f, sel)
  }
  return {
    unit,
    slug,
    ast,
    nodes,
    fnSymbol,
    varSymbol,
    dispatch: dispatchMap,
    selector,
  }
}

// ---------- recorded values ----------

/** Discovery's values for one field, as a tree over the flattened paths (`[0]`, `.owner`, `.0xabc…`). */
export interface ValueTree {
  kind?: string
  value?: string
  children: Map<string, ValueTree>
  /** Discovery recorded every entry of this container (arrays always; mappings when a handler says so). */
  complete?: boolean
}

export type AccessPath = Array<
  { kind: 'index'; key: Term } | { kind: 'member'; name: string }
>

function pathText(path: AccessPath): string {
  return path
    .map((p) =>
      p.kind === 'member'
        ? `.${p.name}`
        : `[${p.key.value !== undefined ? p.key.value.toString() : '?'}]`,
    )
    .join('')
}

/** A key the recorded tree can be looked up with: a literal, or a closed hash such as keccak256("ROLE"). */
function closedKey(key: Term): boolean {
  return key.syms.size === 0
}

export function valueTree(): ValueTree {
  return { children: new Map() }
}

export function insertValue(
  root: ValueTree,
  path: string,
  kind: string,
  value: string,
): void {
  const parts = path.match(/\[\d+\]|\.[^.[\]]+/g) ?? []
  let cur = root
  for (const p of parts) {
    let next = cur.children.get(p)
    if (!next) {
      next = valueTree()
      cur.children.set(p, next)
    }
    cur = next
  }
  cur.kind = kind
  cur.value = value
}

// ---------- the world: deployed code, values, symbols ----------

export interface Deployment {
  role: string
  C: string
}

export interface World {
  units: Map<string, UnitCode>
  /** Contract symbol → the unit that defines it. */
  unitOfContract: Map<string, UnitCode>
  /** Address → the contracts running there (self, or proxy + implementation). */
  codeAt: Map<string, Deployment[]>
  /** Address → entry functions callable there, with the role of the code they belong to. */
  entries: Map<string, Array<{ H: string; role: string }>>
  /** Function symbol → its contract symbol. */
  contractOfFn: Map<string, string>
  /** `${addr}|${V}` → recorded values. */
  values: Map<string, ValueTree>
  /** Functions that always revert (unit relation alwaysReverts). */
  alwaysReverts: Set<string>
  /** Sites the structure cannot follow (unit relation opaque): assembly that stores/calls/exits, delegatecall. */
  opaque: Map<string, string>
  /** The symbol table of the walk in progress (one per entry function, see src/solve.ts). */
  decls: Declarations
  budget: Budget
}

// ---------- shapes of storage ----------

type Shape =
  | { kind: 'scalar'; sort: Sort; signed: boolean; valueKind: string }
  | { kind: 'mapping'; key: Sort; value: Shape }
  | { kind: 'array'; elem: Shape }
  | { kind: 'struct'; name: string; members: Map<string, Shape> }
  | { kind: 'other'; what: string }

const UNKNOWN_SHAPE: Shape = { kind: 'other', what: 'unsupported type' }

function elementaryShape(name: string): Shape {
  if (name === 'address' || name === 'address payable')
    return { kind: 'scalar', sort: BV160, signed: false, valueKind: 'address' }
  if (name === 'bool')
    return { kind: 'scalar', sort: BOOL, signed: false, valueKind: 'boolean' }
  if (/^uint\d*$/.test(name) || /^bytes\d+$/.test(name))
    return { kind: 'scalar', sort: BV256, signed: false, valueKind: 'number' }
  if (/^int\d*$/.test(name))
    return { kind: 'scalar', sort: BV256, signed: true, valueKind: 'number' }
  if (name === 'string' || name === 'bytes')
    return { kind: 'scalar', sort: STR, signed: false, valueKind: 'string' }
  return { kind: 'other', what: name }
}

/** The shape of a declared type, from its TypeName node. */
function shapeOfTypeName(
  tn: AstNode | undefined,
  unit: UnitCode,
  depth = 0,
): Shape {
  if (!tn || depth > 8) return UNKNOWN_SHAPE
  switch (tn.nodeType) {
    case 'ElementaryTypeName':
      return elementaryShape(str(tn, 'name'))
    case 'Mapping': {
      const key = shapeOfTypeName(child(tn, 'keyType'), unit, depth + 1)
      const value = shapeOfTypeName(child(tn, 'valueType'), unit, depth + 1)
      return {
        kind: 'mapping',
        key: key.kind === 'scalar' ? key.sort : BV256,
        value,
      }
    }
    case 'ArrayTypeName':
      return {
        kind: 'array',
        elem: shapeOfTypeName(child(tn, 'baseType'), unit, depth + 1),
      }
    case 'UserDefinedTypeName': {
      const ref = num(tn, 'referencedDeclaration')
      const target = ref !== undefined ? unit.nodes.get(ref) : undefined
      if (!target) return UNKNOWN_SHAPE
      if (target.nodeType === 'ContractDefinition')
        return {
          kind: 'scalar',
          sort: BV160,
          signed: false,
          valueKind: 'address',
        }
      if (target.nodeType === 'EnumDefinition')
        return {
          kind: 'scalar',
          sort: BV256,
          signed: false,
          valueKind: 'number',
        }
      if (target.nodeType === 'UserDefinedValueTypeDefinition')
        return shapeOfTypeName(child(target, 'underlyingType'), unit, depth + 1)
      if (target.nodeType === 'StructDefinition') {
        const members = new Map<string, Shape>()
        for (const m of children(target, 'members'))
          members.set(
            str(m, 'name'),
            shapeOfTypeName(child(m, 'typeName'), unit, depth + 1),
          )
        return { kind: 'struct', name: str(target, 'name'), members }
      }
      return UNKNOWN_SHAPE
    }
    default:
      return { kind: 'other', what: tn.nodeType }
  }
}

/** The sort of an expression from solc's typeString (what the walk needs for free symbols and casts). */
export function sortOfType(ts: string): Sort {
  const t = ts.replace(/ (storage|memory|calldata)( ref| pointer| slice)?$/, '')
  if (
    t === 'address' ||
    t === 'address payable' ||
    t.startsWith('contract ') ||
    t.startsWith('interface ')
  )
    return BV160
  if (t === 'bool') return BOOL
  if (
    /^u?int\d*$/.test(t) ||
    /^bytes\d+$/.test(t) ||
    t.startsWith('int_const') ||
    t.startsWith('enum ') ||
    t.startsWith('rational_const')
  )
    return BV256
  if (t.startsWith('mapping(')) {
    const m = /^mapping\((.+?) => (.+)\)$/.exec(t)
    if (m)
      return arraySort(sortOfType(m[1] as string), sortOfType(m[2] as string))
  }
  if (/\[\d*\]$/.test(t))
    return arraySort(BV256, sortOfType(t.replace(/\[\d*\]$/, '')))
  return STR
}

function isSigned(ts: string): boolean {
  return /^int\d*( |$)/.test(ts) || /^int_const -/.test(ts)
}

// ---------- paths ----------

export type Value = Term | Term[]

type Control = 'next' | 'return' | 'break' | 'continue'

export interface State {
  pc: Term[]
  env: Map<string, Value>
  /** Storage overrides on this path: `${addr}|${V}|${path}` → term (whole arrays under their path). */
  store: Map<string, Term>
  effects: Set<string>
  residuals: Residual[]
  /** Storage variables read (`${addr}|${V}`), and those read while evaluating a condition or a call target. */
  reads: Set<string>
  guardReads: Set<string>
  trace: string[]
  ret?: Value
  inCond: number
  /** Checker sites (require/assert calls, if/loop statements, try calls) and the polarity this path took last. */
  guardsTaken: Map<string, string>
  /** For every write performed: the guards taken when it happened (`${addr}|${site}` → site → polarity). */
  effectGuards: Map<string, Map<string, string>>
  /** External call sites whose callee completed on this path. */
  callsMade: Set<string>
}

function cloneState(s: State): State {
  return {
    pc: [...s.pc],
    env: new Map(s.env),
    store: new Map(s.store),
    effects: new Set(s.effects),
    residuals: [...s.residuals],
    reads: new Set(s.reads),
    guardReads: new Set(s.guardReads),
    trace: [...s.trace],
    ret: s.ret,
    inCond: s.inCond,
    guardsTaken: new Map(s.guardsTaken),
    effectGuards: new Map(
      [...s.effectGuards].map(([k, v]) => [k, new Map(v)] as const),
    ),
    callsMade: new Set(s.callsMade),
  }
}

interface Outcome {
  state: State
  control: Control
}

interface Frame {
  id: number
  unit: UnitCode
  /** The address whose storage and identity this code runs with. */
  addr: string
  /** The deployable contract (for dispatch). */
  C: string
  /** The function or modifier whose body is running (for site ids and dispatch). */
  def: AstNode
  defSymbol: string
  sender: Term
  msgValue: Term
  depth: number
  /** For a modifier frame: the function frame whose body runs at `_`, and the remaining modifiers. */
  placeholder?: () => (state: State) => Outcome[]
  returnParams: AstNode[]
}

export interface PathResult {
  id: string
  pc: Term
  /** `${addr}|${writeSite}`: the storage the write lands on, and the site. */
  effects: string[]
  residuals: Residual[]
  reads: string[]
  guardReads: string[]
  trace: string[]
  guardsTaken: Record<string, string>
  effectGuards: Record<string, Record<string, string>>
  callsMade: string[]
}

export interface WalkResult {
  entry: string
  addr: string
  paths: PathResult[]
  /** Residuals that concern the whole walk (a fork not explored). */
  residuals: Residual[]
}

export class Walk {
  private frames = 0
  private alive = 1
  readonly residuals: Residual[] = []
  private readonly entryParams = new Map<string, Term>()

  constructor(
    private readonly world: World,
    private readonly addr: string,
    private readonly entry: string,
  ) {}

  /** Every completing execution of the entry function at this address. */
  run(): WalkResult {
    const w = this.world
    const C = w.contractOfFn.get(this.entry)
    const unit = C ? w.unitOfContract.get(C) : undefined
    const defNode = unit ? findDef(unit, this.entry) : undefined
    const deployment = (w.codeAt.get(this.addr) ?? []).find(
      (d) => C && unit && inheritsFrom(unit, d.C, C),
    )
    if (!unit || !defNode || !deployment)
      return {
        entry: this.entry,
        addr: this.addr,
        paths: [],
        residuals: [
          { kind: 'no-code', where: `${this.entry} at ${this.addr}` },
        ],
      }
    const sender = w.decls.named(
      'sender',
      BV160,
      'chosen',
      'the transaction sender',
    )
    const msgValue = w.decls.named(
      'msg_value',
      BV256,
      'chosen',
      'the value sent with the call',
    )
    const state: State = {
      pc: [],
      env: new Map(),
      store: new Map(),
      effects: new Set(),
      residuals: [],
      reads: new Set(),
      guardReads: new Set(),
      trace: [],
      inCond: 0,
      guardsTaken: new Map(),
      effectGuards: new Map(),
      callsMade: new Set(),
    }
    const outcomes = this.callFunction(
      defNode,
      unit,
      deployment.C,
      this.addr,
      sender,
      msgValue,
      undefined,
      state,
      0,
    )
    const paths = outcomes.map((o, i) => ({
      id: `p${i + 1}`,
      pc: and(...o.state.pc),
      effects: [...o.state.effects],
      residuals: o.state.residuals,
      reads: [...o.state.reads],
      guardReads: [...o.state.guardReads],
      trace: o.state.trace,
      guardsTaken: Object.fromEntries(o.state.guardsTaken),
      effectGuards: Object.fromEntries(
        [...o.state.effectGuards].map(([k, v]) => [k, Object.fromEntries(v)]),
      ),
      callsMade: [...o.state.callsMade],
    }))
    return {
      entry: this.entry,
      addr: this.addr,
      paths,
      residuals: this.residuals,
    }
  }

  // ---------- functions, modifiers, calls ----------

  /**
   * Runs function `def` (with its modifiers) in a fresh frame. `args` bind its parameters (fresh chosen
   * symbols for the entry function). Returns the completing outcomes, each with `state.ret` set.
   */
  private callFunction(
    def: AstNode,
    unit: UnitCode,
    C: string,
    addr: string,
    sender: Term,
    msgValue: Term,
    args: Value[] | undefined,
    state0: State,
    depth: number,
  ): Outcome[] {
    const w = this.world
    const defSymbol = unit.fnSymbol.get(def.id) ?? `${unit.unit}:#${def.id}`
    if (w.alwaysReverts.has(defSymbol)) return []
    if (depth > w.budget.depth) {
      const s = cloneState(state0)
      s.residuals.push({ kind: 'call-depth', where: defSymbol })
      s.pc.push(
        w.decls.fresh(
          'completes',
          BOOL,
          'unknown',
          `whether ${defSymbol} completes (call depth ${depth} beyond the budget)`,
        ),
      )
      s.ret = this.unknownReturn(
        def,
        unit,
        s,
        `result of ${defSymbol} (call depth)`,
      )
      return [{ state: s, control: 'next' }]
    }
    const frame: Frame = {
      id: this.frames++,
      unit,
      addr,
      C,
      def,
      defSymbol,
      sender,
      msgValue,
      depth,
      returnParams: children(
        child(def, 'returnParameters') ?? def,
        'parameters',
      ),
    }
    const state = cloneState(state0)
    state.ret = undefined
    // parameters
    const params = children(child(def, 'parameters') ?? def, 'parameters')
    params.forEach((p, i) => {
      const given = args?.[i]
      const value =
        given ??
        w.decls.named(
          `p_${str(p, 'name') || `arg${i}`}`,
          sortOfType(typeString(p)),
          'chosen',
          `parameter \`${str(p, 'name')}\` of ${defSymbol}`,
        )
      state.env.set(`${frame.id}:${p.id}`, value)
    })
    // named return variables start at zero
    for (const r of frame.returnParams)
      state.env.set(
        `${frame.id}:${r.id}`,
        this.zeroOf(sortOfType(typeString(r))),
      )
    state.trace.push(`${'  '.repeat(depth)}enter ${defSymbol} at ${addr}`)
    // the body, wrapped in the modifiers (base constructor invocations are not modifiers)
    const mods = children(def, 'modifiers').filter((m) => {
      const ref = num(child(m, 'modifierName') ?? m, 'referencedDeclaration')
      const target = ref !== undefined ? unit.nodes.get(ref) : undefined
      return target?.nodeType === 'ModifierDefinition'
    })
    const body = child(def, 'body')
    const runBody = (s: State): Outcome[] => {
      if (!body) return [{ state: s, control: 'next' }]
      return this.execBlock(body, frame, s)
    }
    const outcomes = this.runModifiers(mods, 0, frame, state, runBody)
    // a completing execution: normal end or `return`
    return outcomes
      .filter((o) => o.control === 'next' || o.control === 'return')
      .map((o) => {
        const s = o.state
        if (s.ret === undefined && frame.returnParams.length > 0) {
          const vals = frame.returnParams.map(
            (r) =>
              (s.env.get(`${frame.id}:${r.id}`) as Term) ?? this.zeroOf(BV256),
          )
          s.ret = vals.length === 1 ? (vals[0] as Term) : vals
        }
        s.trace.push(`${'  '.repeat(depth)}leave ${defSymbol}`)
        return { state: s, control: 'next' as Control }
      })
  }

  private runModifiers(
    mods: AstNode[],
    i: number,
    fnFrame: Frame,
    state: State,
    runBody: (s: State) => Outcome[],
  ): Outcome[] {
    const w = this.world
    if (i >= mods.length) return runBody(state)
    const m = mods[i] as AstNode
    const ref =
      num(child(m, 'modifierName') ?? m, 'referencedDeclaration') ?? -1
    const declared = fnFrame.unit.nodes.get(ref)
    if (!declared) return runBody(state)
    const g0 = fnFrame.unit.fnSymbol.get(declared.id) ?? ''
    const resolved =
      fnFrame.unit.dispatch.get(`${fnFrame.C}|${fnFrame.defSymbol}|${g0}`) ?? g0
    const modDef = findDef(fnFrame.unit, resolved) ?? declared
    const modSymbol = fnFrame.unit.fnSymbol.get(modDef.id) ?? g0
    // arguments are evaluated in the function's frame
    const argNodes = children(m, 'arguments')
    const evaluated = this.evalList(argNodes, fnFrame, state)
    const out: Outcome[] = []
    for (const [s1, args] of evaluated) {
      const frame: Frame = {
        id: this.frames++,
        unit: fnFrame.unit,
        addr: fnFrame.addr,
        C: fnFrame.C,
        def: modDef,
        defSymbol: modSymbol,
        sender: fnFrame.sender,
        msgValue: fnFrame.msgValue,
        depth: fnFrame.depth,
        returnParams: [],
        placeholder: () => (s: State) =>
          this.runModifiers(mods, i + 1, fnFrame, s, runBody).map((o) => ({
            state: o.state,
            // a `return` in the body ends the body, and the modifier goes on after `_`
            control: o.control === 'return' ? 'next' : o.control,
          })),
      }
      const params = children(
        child(modDef, 'parameters') ?? modDef,
        'parameters',
      )
      params.forEach((p, k) => {
        const v = args[k]
        if (v !== undefined) s1.env.set(`${frame.id}:${p.id}`, v)
      })
      s1.trace.push(`${'  '.repeat(fnFrame.depth)}modifier ${modSymbol}`)
      const body = child(modDef, 'body')
      const results = body
        ? this.execBlock(body, frame, s1)
        : [{ state: s1, control: 'next' as Control }]
      for (const r of results)
        out.push({
          state: r.state,
          // a `return` inside the modifier ends the whole function normally
          control: r.control === 'return' ? 'next' : r.control,
        })
    }
    void w
    return out
  }

  private unknownReturn(
    def: AstNode,
    unit: UnitCode,
    s: State,
    origin: string,
  ): Value | undefined {
    const rets = children(child(def, 'returnParameters') ?? def, 'parameters')
    if (rets.length === 0) return undefined
    const vals = rets.map((r) =>
      this.world.decls.fresh(
        'ret',
        sortOfType(typeString(r)),
        'unknown',
        origin,
      ),
    )
    void unit
    void s
    return vals.length === 1 ? (vals[0] as Term) : vals
  }

  private zeroOf(sort: Sort): Term {
    switch (sort.kind) {
      case 'Bool':
        return FALSE
      case 'BV':
        return bvLiteral(0n, sort.bits)
      default:
        return this.world.decls.fresh('zero', sort, 'unknown', 'default value')
    }
  }

  // ---------- statements ----------

  private execBlock(block: AstNode, frame: Frame, state: State): Outcome[] {
    return this.execSeq(children(block, 'statements'), 0, frame, state)
  }

  private execSeq(
    stmts: AstNode[],
    i: number,
    frame: Frame,
    state: State,
  ): Outcome[] {
    if (i >= stmts.length) return [{ state, control: 'next' }]
    const out: Outcome[] = []
    for (const o of this.execStmt(stmts[i] as AstNode, frame, state)) {
      if (o.control === 'next')
        out.push(...this.execSeq(stmts, i + 1, frame, o.state))
      else out.push(o)
    }
    return out
  }

  private execStmt(st: AstNode, frame: Frame, state: State): Outcome[] {
    switch (st.nodeType) {
      case 'Block':
      case 'UncheckedBlock':
        return this.execBlock(st, frame, state)
      case 'ExpressionStatement': {
        const e = child(st, 'expression')
        if (!e) return [{ state, control: 'next' }]
        return this.evalExpr(e, frame, state).map(([s]) => ({
          state: s,
          control: 'next' as Control,
        }))
      }
      case 'VariableDeclarationStatement': {
        const decls = (st.declarations as unknown[]) ?? []
        const init = child(st, 'initialValue')
        if (!init) {
          for (const d of decls)
            if (isNode(d))
              state.env.set(
                `${frame.id}:${d.id}`,
                this.zeroOf(sortOfType(typeString(d))),
              )
          return [{ state, control: 'next' }]
        }
        return this.evalExpr(init, frame, state).map(([s, v]) => {
          const vals = Array.isArray(v) ? v : [v]
          decls.forEach((d, k) => {
            if (!isNode(d)) return
            const val = vals[k] ?? (decls.length === 1 ? vals[0] : undefined)
            if (val) s.env.set(`${frame.id}:${d.id}`, val)
          })
          return { state: s, control: 'next' as Control }
        })
      }
      case 'IfStatement': {
        const cond = child(st, 'condition')
        const thenB = child(st, 'trueBody')
        const elseB = child(st, 'falseBody')
        if (!cond) return [{ state, control: 'next' }]
        const out: Outcome[] = []
        for (const [s, c] of this.evalCond(cond, frame, state)) {
          const branches = this.fork(
            s,
            c,
            `if ${describe(cond)}`,
            this.siteId(st, frame),
          )
          for (const [sb, taken] of branches) {
            const body = taken ? thenB : elseB
            if (body) out.push(...this.execStmt(body, frame, sb))
            else out.push({ state: sb, control: 'next' })
          }
        }
        return out
      }
      case 'Return': {
        const e = child(st, 'expression')
        if (!e) return [{ state, control: 'return' }]
        return this.evalExpr(e, frame, state).map(([s, v]) => {
          s.ret = v
          return { state: s, control: 'return' as Control }
        })
      }
      case 'Break':
        return [{ state, control: 'break' }]
      case 'Continue':
        return [{ state, control: 'continue' }]
      case 'RevertStatement':
        return []
      case 'EmitStatement':
        return [{ state, control: 'next' }]
      case 'PlaceholderStatement': {
        const ph = frame.placeholder
        if (!ph) return [{ state, control: 'next' }]
        return ph()(state)
      }
      case 'ForStatement':
      case 'WhileStatement':
      case 'DoWhileStatement':
        return this.execLoop(st, frame, state)
      case 'TryStatement':
        return this.execTry(st, frame, state)
      case 'InlineAssembly': {
        // values assigned inside are unknown; whether the block stores/reverts is decided by
        // rules/2-guards.dl (opaque), which the solve stage reads as a residual
        const s = cloneState(state)
        const refs = st.externalReferences
        if (Array.isArray(refs))
          for (const r of refs) {
            const decl = (r as { declaration?: number }).declaration
            if (typeof decl === 'number' && s.env.has(`${frame.id}:${decl}`)) {
              const node = frame.unit.nodes.get(decl)
              s.env.set(
                `${frame.id}:${decl}`,
                this.world.decls.fresh(
                  'asm',
                  sortOfType(node ? typeString(node) : ''),
                  'unknown',
                  `assigned in inline assembly at ${this.siteId(st, frame)}`,
                ),
              )
            }
          }
        const asmSite = this.siteId(st, frame)
        const why = this.world.opaque.get(asmSite)
        if (why !== undefined) {
          // it may revert, return or store: whether the execution goes on is unknown
          s.residuals.push({ kind: 'opaque', where: `${why} at ${asmSite}` })
          s.pc.push(
            this.world.decls.fresh(
              'asm_completes',
              BOOL,
              'unknown',
              `whether the inline assembly at ${asmSite} lets the execution go on`,
            ),
          )
        }
        s.trace.push(`assembly at ${asmSite}`)
        return [{ state: s, control: 'next' }]
      }
      default:
        state.residuals.push({
          kind: 'unsupported-stmt',
          where: `${st.nodeType} at ${this.siteId(st, frame)}`,
        })
        return [{ state, control: 'next' }]
    }
  }

  private execLoop(st: AstNode, frame: Frame, state: State): Outcome[] {
    const w = this.world
    const cond = child(st, 'condition')
    const body = child(st, 'body')
    const init = child(st, 'initializationExpression')
    const step = child(st, 'loopExpression')
    const doWhile = st.nodeType === 'DoWhileStatement'
    const where = this.siteId(st, frame)
    let states: State[] = init
      ? this.execStmt(init, frame, state)
          .filter((o) => o.control === 'next')
          .map((o) => o.state)
      : [state]
    const done: Outcome[] = []
    const iterate = (s: State): Outcome[] =>
      body ? this.execStmt(body, frame, s) : [{ state: s, control: 'next' }]
    const afterBody = (outs: Outcome[], next: State[]) => {
      for (const o of outs) {
        if (o.control === 'break')
          done.push({ state: o.state, control: 'next' })
        else if (o.control === 'return') done.push(o)
        else {
          // next or continue: the step, then the next test
          const stepped = step
            ? this.execStmt(step, frame, o.state)
                .filter((x) => x.control === 'next')
                .map((x) => x.state)
            : [o.state]
          next.push(...stepped)
        }
      }
    }
    for (let k = 0; k < w.budget.loop && states.length > 0; k++) {
      const next: State[] = []
      for (const s of states) {
        if (doWhile && k === 0) {
          afterBody(iterate(s), next)
          continue
        }
        if (!cond) {
          afterBody(iterate(s), next)
          continue
        }
        for (const [s1, c] of this.evalCond(cond, frame, s))
          for (const [s2, taken] of this.fork(
            s1,
            c,
            `loop ${describe(cond)}`,
            where,
          )) {
            if (taken) afterBody(iterate(s2), next)
            else done.push({ state: s2, control: 'next' })
          }
      }
      states = next
    }
    // executions still looping after the bound: not explored, which every exclusion has to know
    for (const s of states) {
      if (cond) {
        // the exit test of the next iteration decides whether anything was left out
        const exits = this.evalCond(cond, frame, s)
        for (const [s1, c] of exits) {
          if (c.value === false) {
            done.push({ state: s1, control: 'next' })
            continue
          }
          const s2 = cloneState(s1)
          s2.pc.push(not(c))
          s2.residuals.push({
            kind: 'loop-bound',
            where: `${where}: more than ${w.budget.loop} iterations not explored`,
          })
          done.push({ state: s2, control: 'next' })
        }
      } else {
        s.residuals.push({ kind: 'loop-bound', where })
        done.push({ state: s, control: 'next' })
      }
    }
    return done
  }

  private execTry(st: AstNode, frame: Frame, state: State): Outcome[] {
    const callNode = child(st, 'externalCall')
    const clauses = children(st, 'clauses')
    if (!callNode) return [{ state, control: 'next' }]
    const success = clauses[0]
    const catches = clauses.slice(1)
    const out: Outcome[] = []
    // the call: every completing callee path continues into the success clause
    const mark = state.pc.length
    const completing = this.evalExpr(callNode, frame, state)
    const completionConds: Term[] = []
    const callSite = this.siteId(callNode, frame)
    for (const [s, v] of completing) {
      completionConds.push(and(...s.pc.slice(mark)))
      s.guardsTaken.set(callSite, 'true')
      s.callsMade.delete(callSite)
      if (success) {
        const params = children(
          child(success, 'parameters') ?? success,
          'parameters',
        )
        const vals = Array.isArray(v) ? v : [v]
        params.forEach((p, i) => {
          const val = vals[i]
          if (val) s.env.set(`${frame.id}:${p.id}`, val)
        })
        const block = child(success, 'block')
        out.push(
          ...(block
            ? this.execBlock(block, frame, s)
            : [{ state: s, control: 'next' as Control }]),
        )
      } else out.push({ state: s, control: 'next' })
    }
    // the failure: the call did not complete (no completing path, or their conditions all false)
    const fails = cloneState(state)
    const completes = or(...completionConds)
    if (completes.value !== true) {
      fails.pc.push(not(completes))
      fails.trace.push(`catch: ${describe(callNode)} reverted`)
      fails.guardsTaken.set(callSite, 'false')
      for (const c of catches) {
        const s = cloneState(fails)
        const params = children(child(c, 'parameters') ?? c, 'parameters')
        for (const p of params)
          s.env.set(
            `${frame.id}:${p.id}`,
            this.world.decls.fresh(
              'err',
              sortOfType(typeString(p)),
              'unknown',
              'error data of a caught revert',
            ),
          )
        const block = child(c, 'block')
        out.push(
          ...(block
            ? this.execBlock(block, frame, s)
            : [{ state: s, control: 'next' as Control }]),
        )
      }
      if (catches.length === 0) out.push({ state: fails, control: 'next' })
    }
    return out
  }

  /** Splits a state on condition c: [state with c, true] and [state with ¬c, false], minus constant branches. */
  private fork(
    s: State,
    c: Term,
    what: string,
    site?: string,
  ): Array<[State, boolean]> {
    const mark = (st: State, taken: boolean) => {
      if (site) st.guardsTaken.set(site, taken ? 'true' : 'false')
      return st
    }
    if (c.value === true) return [[mark(s, true), true]]
    if (c.value === false) return [[mark(s, false), false]]
    if (this.alive + 1 > this.world.budget.paths) {
      const only = cloneState(s)
      only.pc.push(c)
      only.residuals.push({
        kind: 'too-many-paths',
        where: `${what}: the other branch was not explored (budget ${this.world.budget.paths})`,
      })
      only.trace.push(`${what} → true (budget)`)
      return [[mark(only, true), true]]
    }
    this.alive++
    const a = cloneState(s)
    a.pc.push(c)
    a.trace.push(`${what} → true`)
    const b = cloneState(s)
    b.pc.push(not(c))
    b.trace.push(`${what} → false`)
    return [
      [mark(a, true), true],
      [mark(b, false), false],
    ]
  }

  // ---------- expressions ----------

  private evalCond(
    e: AstNode,
    frame: Frame,
    state: State,
  ): Array<[State, Term]> {
    state.inCond++
    const results = this.evalExpr(e, frame, state)
    state.inCond--
    return results.map(([s, v]) => {
      s.inCond = state.inCond
      const t = Array.isArray(v) ? (v[0] as Term) : v
      return [
        s,
        t.sort.kind === 'Bool' ? t : this.unsupported(s, e, frame, BOOL),
      ]
    })
  }

  private evalList(
    nodes: AstNode[],
    frame: Frame,
    state: State,
  ): Array<[State, Value[]]> {
    let acc: Array<[State, Value[]]> = [[state, []]]
    for (const n of nodes) {
      const next: Array<[State, Value[]]> = []
      for (const [s, vals] of acc)
        for (const [s2, v] of this.evalExpr(n, frame, s))
          next.push([s2, [...vals, v]])
      acc = next
    }
    return acc
  }

  private unsupported(s: State, e: AstNode, frame: Frame, sort?: Sort): Term {
    const where = `${describe(e)} at ${this.siteId(e, frame)}`
    s.residuals.push({ kind: 'unsupported-expr', where })
    return this.world.decls.fresh(
      'x',
      sort ?? sortOfType(typeString(e)),
      'unknown',
      `unsupported expression ${where}`,
    )
  }

  private evalExpr(
    e: AstNode,
    frame: Frame,
    state: State,
  ): Array<[State, Value]> {
    try {
      return this.evalExprInner(e, frame, state)
    } catch (err) {
      // an unsupported construct, or a modelling gap that surfaced as an error: the value is unknown
      const s = cloneState(state)
      if (!(err instanceof UnsupportedTerm))
        s.residuals.push({
          kind: 'unsupported-expr',
          where: `${describe(e)} at ${this.siteId(e, frame)}: ${err instanceof Error ? err.message.slice(0, 120) : String(err)}`,
        })
      return [[s, this.unsupported(s, e, frame)]]
    }
  }

  private evalExprInner(
    e: AstNode,
    frame: Frame,
    state: State,
  ): Array<[State, Value]> {
    const w = this.world
    switch (e.nodeType) {
      case 'Literal':
        return [[state, this.literal(e)]]
      case 'Identifier':
        return [[state, this.identifier(e, frame, state)]]
      case 'TupleExpression': {
        const comps = (e.components as unknown[]) ?? []
        const nodes = comps.filter(isNode)
        if (nodes.length === 1 && comps.length === 1)
          return this.evalExpr(nodes[0] as AstNode, frame, state)
        return this.evalList(nodes, frame, state).map(([s, vals]) => [
          s,
          vals.map((v) => (Array.isArray(v) ? (v[0] as Term) : v)),
        ])
      }
      case 'UnaryOperation': {
        const op = str(e, 'operator')
        const sub = child(e, 'subExpression')
        if (!sub) return [[state, this.unsupported(state, e, frame)]]
        if (op === '++' || op === '--' || op === 'delete')
          return this.assign(sub, op, undefined, e, frame, state)
        return this.evalExpr(sub, frame, state).map(([s, v]) => {
          const t = Array.isArray(v) ? (v[0] as Term) : v
          if (op === '!') return [s, not(t)]
          if (op === '-') return [s, bvneg(t)]
          if (op === '~') return [s, bvnot(t)]
          return [s, this.unsupported(s, e, frame)]
        })
      }
      case 'BinaryOperation': {
        const op = str(e, 'operator')
        const l = child(e, 'leftExpression')
        const r = child(e, 'rightExpression')
        if (!l || !r) return [[state, this.unsupported(state, e, frame)]]
        if (op === '&&' || op === '||') {
          // short-circuit: the right side runs only on one side of the left
          const out: Array<[State, Value]> = []
          for (const [s, lv] of this.evalExpr(l, frame, state)) {
            const lt = Array.isArray(lv) ? (lv[0] as Term) : lv
            if (lt.value === (op === '||')) {
              out.push([s, lt])
              continue
            }
            for (const [s2, rv] of this.evalExpr(r, frame, s)) {
              const rt = Array.isArray(rv) ? (rv[0] as Term) : rv
              out.push([s2, op === '&&' ? and(lt, rt) : or(lt, rt)])
            }
          }
          return out
        }
        const out: Array<[State, Value]> = []
        for (const [s, lv] of this.evalExpr(l, frame, state))
          for (const [s2, rv] of this.evalExpr(r, frame, s)) {
            const lt = Array.isArray(lv) ? (lv[0] as Term) : lv
            const rt = Array.isArray(rv) ? (rv[0] as Term) : rv
            out.push([s2, this.binary(op, lt, rt, l, r, e, frame, s2)])
          }
        return out
      }
      case 'Conditional': {
        const c = child(e, 'condition')
        const a = child(e, 'trueExpression')
        const b = child(e, 'falseExpression')
        if (!c || !a || !b) return [[state, this.unsupported(state, e, frame)]]
        const out: Array<[State, Value]> = []
        for (const [s, ct] of this.evalCond(c, frame, state))
          for (const [sb, taken] of this.fork(s, ct, `?: ${describe(c)}`))
            out.push(...this.evalExpr(taken ? a : b, frame, sb))
        return out
      }
      case 'Assignment': {
        const lhs = child(e, 'leftHandSide')
        const rhs = child(e, 'rightHandSide')
        if (!lhs || !rhs) return [[state, this.unsupported(state, e, frame)]]
        return this.assign(lhs, str(e, 'operator'), rhs, e, frame, state)
      }
      case 'IndexAccess':
      case 'MemberAccess':
        return this.readAccess(e, frame, state)
      case 'FunctionCall':
        return this.call(e, frame, state)
      case 'FunctionCallOptions': {
        // `x.f{value: v}(...)`: the options are read by the call
        const inner = child(e, 'expression')
        return inner
          ? this.evalExpr(inner, frame, state)
          : [[state, this.unsupported(state, e, frame)]]
      }
      case 'NewExpression':
        return [
          [
            state,
            w.decls.fresh(
              'new',
              BV160,
              'unknown',
              `address of a contract created at ${this.siteId(e, frame)}`,
            ),
          ],
        ]
      case 'ElementaryTypeNameExpression':
        return [[state, w.decls.string(typeString(e))]]
      default:
        return [[state, this.unsupported(state, e, frame)]]
    }
  }

  private literal(e: AstNode): Term {
    const kind = str(e, 'kind')
    const ts = typeString(e)
    if (kind === 'bool') return boolLiteral(str(e, 'value') === 'true')
    if (kind === 'number') {
      const raw = str(e, 'value').replace(/_/g, '')
      let v = raw.startsWith('0x') ? BigInt(raw) : parseDecimal(raw)
      const unit = str(e, 'subdenomination')
      const mult: Record<string, bigint> = {
        wei: 1n,
        gwei: 10n ** 9n,
        szabo: 10n ** 12n,
        finney: 10n ** 15n,
        ether: 10n ** 18n,
        seconds: 1n,
        minutes: 60n,
        hours: 3600n,
        days: 86400n,
        weeks: 604800n,
        years: 31536000n,
      }
      if (unit && mult[unit] !== undefined) v *= mult[unit] as bigint
      if (ts === 'address' || ts === 'address payable') return bvLiteral(v, 160)
      return bvLiteral(v, 256)
    }
    return this.world.decls.string(
      `${kind}:${str(e, 'value') || str(e, 'hexValue')}`,
    )
  }

  private identifier(e: AstNode, frame: Frame, state: State): Value {
    const w = this.world
    const ref = num(e, 'referencedDeclaration')
    const name = str(e, 'name')
    if (ref === undefined || ref < 0) {
      if (name === 'this') return addressLiteral(frame.addr)
      if (name === 'now')
        return this.chosenGlobal('block_timestamp', BV256, 'block.timestamp')
      return this.unsupported(state, e, frame)
    }
    const local = state.env.get(`${frame.id}:${ref}`)
    if (local !== undefined) return local
    const decl = frame.unit.nodes.get(ref)
    if (!decl) return this.unsupported(state, e, frame)
    if (decl.nodeType === 'VariableDeclaration') {
      const V = frame.unit.varSymbol.get(decl.id)
      if (V) {
        if (str(decl, 'mutability') === 'constant') {
          const value = child(decl, 'value')
          if (value) {
            const r = this.evalExpr(value, frame, state)[0]
            if (r) return r[1]
          }
        }
        return this.readStorage(frame, state, decl, V, [])
      }
      // a local declared in a scope the environment has not seen (a for-init in a sibling frame, ...)
      return w.decls.fresh(
        `l_${name}`,
        sortOfType(typeString(decl)),
        'unknown',
        `local \`${name}\` without a known value`,
      )
    }
    if (
      decl.nodeType === 'FunctionDefinition' ||
      decl.nodeType === 'ModifierDefinition'
    )
      return w.decls.string(`fn:${frame.unit.fnSymbol.get(decl.id) ?? name}`)
    if (
      decl.nodeType === 'ContractDefinition' ||
      decl.nodeType === 'EnumDefinition' ||
      decl.nodeType === 'StructDefinition'
    )
      return w.decls.string(`type:${name}`)
    return this.unsupported(state, e, frame)
  }

  private chosenGlobal(name: string, sort: Sort, origin: string): Term {
    return this.world.decls.named(name, sort, 'chosen', origin)
  }

  private binary(
    op: string,
    lt: Term,
    rt: Term,
    l: AstNode,
    r: AstNode,
    e: AstNode,
    frame: Frame,
    s: State,
  ): Term {
    const signed = isSigned(typeString(l)) || isSigned(typeString(r))
    const [a, b] = this.unify(lt, rt)
    switch (op) {
      case '==':
        return eq(a, b)
      case '!=':
        return not(eq(a, b))
      case '<':
      case '<=':
      case '>':
      case '>=':
        if (a.sort.kind !== 'BV') return this.unsupported(s, e, frame, BOOL)
        return compare(op, a, b, signed)
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
      case '**':
      case '<<':
      case '>>':
      case '&':
      case '|':
      case '^':
        if (a.sort.kind !== 'BV') return this.unsupported(s, e, frame)
        return arith(op as ArithOp, a, b, signed)
      default:
        return this.unsupported(s, e, frame)
    }
  }

  /** Two bit-vector operands of different widths: widen the narrower one. */
  private unify(a: Term, b: Term): [Term, Term] {
    if (
      a.sort.kind === 'BV' &&
      b.sort.kind === 'BV' &&
      a.sort.bits !== b.sort.bits
    ) {
      const bits = Math.max(a.sort.bits, b.sort.bits)
      return [resize(a, bits), resize(b, bits)]
    }
    return [a, b]
  }

  // ---------- storage and lvalues ----------

  private siteId(n: AstNode, frame: Frame): string {
    return `${frame.defSymbol}@${srcKey(n)}`
  }

  /** `a.b[c].d` → its root declaration and access path; undefined when the root is not a variable. */
  private accessChain(
    e: AstNode,
    frame: Frame,
    state: State,
  ): Array<
    [
      State,
      (
        | {
            root: AstNode
            path: Array<
              { kind: 'index'; key: Term } | { kind: 'member'; name: string }
            >
          }
        | undefined
      ),
    ]
  > {
    if (e.nodeType === 'Identifier') {
      const ref = num(e, 'referencedDeclaration')
      const decl = ref !== undefined ? frame.unit.nodes.get(ref) : undefined
      return [
        [
          state,
          decl?.nodeType === 'VariableDeclaration'
            ? { root: decl, path: [] }
            : undefined,
        ],
      ]
    }
    if (e.nodeType === 'MemberAccess') {
      const base = child(e, 'expression')
      if (!base) return [[state, undefined]]
      return this.accessChain(base, frame, state).map(([s, c]) => [
        s,
        c
          ? {
              root: c.root,
              path: [...c.path, { kind: 'member', name: str(e, 'memberName') }],
            }
          : undefined,
      ])
    }
    if (e.nodeType === 'IndexAccess') {
      const base = child(e, 'baseExpression')
      const idx = child(e, 'indexExpression')
      if (!base) return [[state, undefined]]
      const out: Array<
        [
          State,
          (
            | {
                root: AstNode
                path: Array<
                  | { kind: 'index'; key: Term }
                  | { kind: 'member'; name: string }
                >
              }
            | undefined
          ),
        ]
      > = []
      for (const [s, c] of this.accessChain(base, frame, state)) {
        if (!c) {
          out.push([s, undefined])
          continue
        }
        if (!idx) {
          out.push([s, undefined])
          continue
        }
        for (const [s2, k] of this.evalExpr(idx, frame, s))
          out.push([
            s2,
            {
              root: c.root,
              path: [
                ...c.path,
                { kind: 'index', key: Array.isArray(k) ? (k[0] as Term) : k },
              ],
            },
          ])
      }
      return out
    }
    if (e.nodeType === 'TupleExpression') {
      const comps = (e.components as unknown[]) ?? []
      if (comps.length === 1 && isNode(comps[0]))
        return this.accessChain(comps[0], frame, state)
    }
    if (e.nodeType === 'FunctionCall' && str(e, 'kind') === 'typeConversion') {
      const arg = children(e, 'arguments')[0]
      if (arg) return this.accessChain(arg, frame, state)
    }
    return [[state, undefined]]
  }

  private readAccess(
    e: AstNode,
    frame: Frame,
    state: State,
  ): Array<[State, Value]> {
    const w = this.world
    if (e.nodeType === 'MemberAccess') {
      const base = child(e, 'expression')
      const member = str(e, 'memberName')
      const baseType = base ? typeString(base) : ''
      // globals
      if (base?.nodeType === 'Identifier') {
        const name = str(base, 'name')
        const ref = num(base, 'referencedDeclaration') ?? 0
        if (ref < 0) {
          if (name === 'msg') {
            if (member === 'sender') return [[state, frame.sender]]
            if (member === 'value') return [[state, frame.msgValue]]
            if (member === 'data')
              return [[state, this.chosenGlobal('msg_data', STR, 'calldata')]]
            if (member === 'sig')
              return [
                [
                  state,
                  this.chosenGlobal('msg_sig', BV256, 'the selector called'),
                ],
              ]
          }
          if (name === 'tx') {
            if (member === 'origin')
              return [
                [
                  state,
                  this.chosenGlobal(
                    'tx_origin',
                    BV160,
                    'the transaction origin',
                  ),
                ],
              ]
            if (member === 'gasprice')
              return [
                [
                  state,
                  this.chosenGlobal('tx_gasprice', BV256, 'the gas price'),
                ],
              ]
          }
          if (name === 'block')
            return [
              [
                state,
                this.chosenGlobal(
                  `block_${member}`,
                  member === 'coinbase' ? BV160 : BV256,
                  `block.${member}`,
                ),
              ],
            ]
          if (name === 'abi' || name === 'type')
            return [[state, this.unsupported(state, e, frame)]]
        }
        // enum member: its index
        const decl = frame.unit.nodes.get(ref)
        if (decl?.nodeType === 'EnumDefinition') {
          const idx = children(decl, 'members').findIndex(
            (m) => str(m, 'name') === member,
          )
          if (idx >= 0) return [[state, bvLiteral(BigInt(idx), 256)]]
        }
        // a library or contract constant: `Lib.X`
        if (decl?.nodeType === 'ContractDefinition') {
          const target = children(decl, 'nodes').find(
            (n) =>
              n.nodeType === 'VariableDeclaration' && str(n, 'name') === member,
          )
          const value = target ? child(target, 'value') : undefined
          if (value) return this.evalExpr(value, frame, state)
        }
      }
      // `type(X).max` etc.
      if (
        base?.nodeType === 'FunctionCall' &&
        str(child(base, 'expression') ?? base, 'name') === 'type'
      ) {
        const arg = typeString(children(base, 'arguments')[0] ?? base)
        const m = /^type\(u?int(\d+)\)$/.exec(arg)
        if (m) {
          const bitsN = Number(m[1])
          const signed = arg.startsWith('type(int')
          if (member === 'max')
            return [
              [
                state,
                bvLiteral(
                  signed
                    ? (1n << BigInt(bitsN - 1)) - 1n
                    : (1n << BigInt(bitsN)) - 1n,
                  256,
                ),
              ],
            ]
          if (member === 'min')
            return [
              [
                state,
                signed
                  ? bvLiteral(-(1n << BigInt(bitsN - 1)), 256)
                  : bvLiteral(0n, 256),
              ],
            ]
        }
        return [[state, this.unsupported(state, e, frame)]]
      }
      // `.length` of a storage array, `.balance`, `.selector`, struct members
      if (member === 'length' && base) {
        const chains = this.accessChain(base, frame, state)
        return chains.map(([s, c]) => {
          if (c && this.isStateVar(c.root, frame))
            return [
              s,
              this.readStorage(
                frame,
                s,
                c.root,
                frame.unit.varSymbol.get(c.root.id) as string,
                [...c.path, { kind: 'member', name: 'length' }],
              ),
            ]
          const arr = c ? s.env.get(`${frame.id}:${c.root.id}`) : undefined
          void arr
          return [
            s,
            w.decls.fresh(
              'len',
              BV256,
              baseType.includes('calldata') || baseType.includes('memory')
                ? 'chosen'
                : 'unknown',
              `length of ${describe(base)}`,
            ),
          ]
        })
      }
      if (member === 'balance')
        return [
          [
            state,
            w.decls.fresh(
              'balance',
              BV256,
              'unknown',
              `balance of ${describe(base ?? e)}`,
            ),
          ],
        ]
      if (
        member === 'selector' ||
        member === 'address' ||
        member === 'code' ||
        member === 'codehash'
      )
        return [
          [
            state,
            w.decls.fresh(
              member,
              member === 'address' ? BV160 : BV256,
              'unknown',
              `${describe(e)}`,
            ),
          ],
        ]
    }
    // storage access chain (`m[k]`, `s.x`, `arr[i].y`), or a member of a local struct
    const chains = this.accessChain(e, frame, state)
    const out: Array<[State, Value]> = []
    for (const [s, c] of chains) {
      if (c && this.isStateVar(c.root, frame)) {
        out.push([
          s,
          this.readStorage(
            frame,
            s,
            c.root,
            frame.unit.varSymbol.get(c.root.id) as string,
            c.path,
          ),
        ])
        continue
      }
      if (c && c.path.length > 0) {
        // a local mapping/array/struct: index into a local array value when possible
        const local = s.env.get(`${frame.id}:${c.root.id}`)
        const first = c.path[0]
        if (
          local &&
          !Array.isArray(local) &&
          local.sort.kind === 'Array' &&
          first?.kind === 'index' &&
          c.path.length === 1
        ) {
          out.push([
            s,
            select(
              local,
              resize(
                first.key,
                (local.sort.index as { bits?: number }).bits ?? 256,
              ),
            ),
          ])
          continue
        }
      }
      out.push([s, this.unsupported(s, e, frame)])
    }
    return out
  }

  private isStateVar(decl: AstNode, frame: Frame): boolean {
    return (
      frame.unit.varSymbol.has(decl.id) &&
      str(decl, 'mutability') !== 'constant'
    )
  }

  private storageKey(
    addr: string,
    V: string,
    path: AccessPath,
  ): string | undefined {
    let key = `${addr}|${V}|`
    for (const p of path) {
      if (p.kind === 'member') key += `.${p.name}`
      else if (p.key.value !== undefined) key += `[${p.key.value.toString()}]`
      else return undefined
    }
    return key
  }

  /** The recorded subtree at a concrete path, if discovery recorded it. */
  /** The recorded subtree at a concrete path, if discovery recorded it. */
  private recordedAt(
    tree: ValueTree | undefined,
    path: AccessPath,
    shape: Shape,
  ): { tree?: ValueTree; shape: Shape; exact: boolean } {
    let cur = tree
    let sh = shape
    for (const p of path) {
      if (p.kind === 'member') {
        if (sh.kind === 'struct') sh = sh.members.get(p.name) ?? UNKNOWN_SHAPE
        else if (sh.kind === 'array' && p.name === 'length')
          return {
            tree: cur,
            shape: {
              kind: 'scalar',
              sort: BV256,
              signed: false,
              valueKind: 'length',
            },
            exact: true,
          }
        else sh = UNKNOWN_SHAPE
        cur = cur?.children.get(`.${p.name}`)
      } else {
        if (!closedKey(p.key))
          return { tree: undefined, shape: sh, exact: false }
        if (sh.kind === 'array') {
          sh = sh.elem
          cur = cur?.children.get(`[${p.key.value?.toString() ?? ''}]`)
        } else if (sh.kind === 'mapping') {
          sh = sh.value
          cur = cur ? lookupKey(cur, p.key, sh, this.world.decls) : undefined
        } else {
          sh = UNKNOWN_SHAPE
          cur = undefined
        }
      }
    }
    return { tree: cur, shape: sh, exact: true }
  }

  private readStorage(
    frame: Frame,
    state: State,
    decl: AstNode,
    V: string,
    path: AccessPath,
  ): Term {
    const w = this.world
    const addr = frame.addr
    const shape = shapeOfTypeName(child(decl, 'typeName'), frame.unit)
    state.reads.add(`${addr}|${V}`)
    if (state.inCond > 0) state.guardReads.add(`${addr}|${V}`)
    const key = this.storageKey(addr, V, path)
    // 1. an override written earlier on this path
    if (key !== undefined) {
      const over = state.store.get(key)
      if (over) return over
    }
    // an override of the enclosing array/mapping (a write with a symbolic key)
    const lastIndex = path.map((p) => p.kind).lastIndexOf('index')
    if (lastIndex >= 0) {
      const containerKey = this.storageKey(addr, V, path.slice(0, lastIndex))
      const container =
        containerKey !== undefined ? state.store.get(containerKey) : undefined
      const idx = path[lastIndex]
      if (
        container &&
        container.sort.kind === 'Array' &&
        idx?.kind === 'index' &&
        lastIndex === path.length - 1
      )
        return select(container, this.fitKey(idx.key, container.sort.index))
    }
    // 2. the recorded value along the concrete prefix of the path
    const tree = w.values.get(`${addr}|${V}`)
    const firstSym = path.findIndex(
      (p) => p.kind === 'index' && !closedKey(p.key),
    )
    const prefix = firstSym < 0 ? path : path.slice(0, firstSym)
    const rest = firstSym < 0 ? [] : path.slice(firstSym)
    const at = this.recordedAt(tree, prefix, shape)
    const name = `st_${addr}_${V}${pathText(prefix)}`
    if (
      rest.length === 0 &&
      at.shape.kind === 'scalar' &&
      at.shape.valueKind === 'length'
    ) {
      if (at.tree) {
        const n = [...at.tree.children.keys()].filter((k) =>
          k.startsWith('['),
        ).length
        if (n > 0 || at.tree.value === '[]') return bvLiteral(BigInt(n), 256)
      }
      return w.decls.named(
        `${name}_length`,
        BV256,
        'unknown',
        `length of \`${shortName(V)}\` at ${addr} not recorded`,
      )
    }
    // 3. the value: a leaf, or a (curried) array over the symbolic indices that remain
    const term = this.valueAt(
      at.tree,
      at.shape,
      rest,
      name,
      addr,
      V,
      tree?.complete ?? false,
    )
    let out = term
    for (const p of rest)
      if (p.kind === 'index') {
        if (out.sort.kind !== 'Array') break
        out = select(out, this.fitKey(p.key, out.sort.index))
      }
    return out
  }

  /**
   * The value of `shape` at `tree` (recorded, or not) seen through the remaining path: members walk into
   * the struct, each index becomes one level of an SMT array (recorded entries stored over a base that is
   * the zero array when discovery's list is complete, an unknown array otherwise). The caller selects
   * with the index terms in order.
   */
  private valueAt(
    tree: ValueTree | undefined,
    shape: Shape,
    rest: AccessPath,
    name: string,
    addr: string,
    V: string,
    complete: boolean,
  ): Term {
    const w = this.world
    const done = complete || tree?.complete === true
    const [head, ...tail] = rest
    if (
      head?.kind === 'member' &&
      head.name === 'length' &&
      shape.kind === 'array'
    ) {
      // the length of an array reached through a symbolic index: recorded arrays are whole
      if (tree) {
        const n = [...tree.children.keys()].filter((k) =>
          k.startsWith('['),
        ).length
        if (n > 0 || tree.value === '[]') return bvLiteral(BigInt(n), 256)
      }
      if (done) return bvLiteral(0n, 256)
      return w.decls.named(
        `${name}_length`,
        BV256,
        'unknown',
        `length of \`${shortName(V)}\` at ${addr} not recorded`,
      )
    }
    if (head?.kind === 'member') {
      const sh =
        shape.kind === 'struct'
          ? (shape.members.get(head.name) ?? UNKNOWN_SHAPE)
          : UNKNOWN_SHAPE
      return this.valueAt(
        tree?.children.get(`.${head.name}`),
        sh,
        tail,
        `${name}.${head.name}`,
        addr,
        V,
        done,
      )
    }
    if (
      head?.kind === 'index' ||
      shape.kind === 'mapping' ||
      shape.kind === 'array'
    ) {
      if (shape.kind !== 'mapping' && shape.kind !== 'array')
        return w.decls.fresh(
          'st',
          STR,
          'unknown',
          `\`${shortName(V)}\` at ${addr}: index into a non-container`,
        )
      const keySort = shape.kind === 'mapping' ? shape.key : BV256
      const elemShape = shape.kind === 'mapping' ? shape.value : shape.elem
      const elemSort = this.sortThrough(elemShape, tail)
      const arrSort = arraySort(keySort, elemSort)
      // arrays discovery recorded are whole; mappings only when marked complete
      const whole =
        done ||
        (shape.kind === 'array' &&
          tree !== undefined &&
          (tree.children.size > 0 || tree.value === '[]'))
      const z = zero(arrSort)
      // the base is named by the container's place and the shape of what is read through it (`[]` per
      // index level, `.m` per member), so the same container read to different depths keeps one sort
      const restShape = rest
        .map((p) => (p.kind === 'member' ? `.${p.name}` : '[]'))
        .join('')
      let base =
        whole && z
          ? z
          : w.decls.named(
              `${name}${restShape}`,
              arrSort,
              'unknown',
              `${shape.kind === 'mapping' ? 'entries' : 'elements'} of \`${shortName(V)}${pathText(rest.filter((p) => p.kind === 'member'))}\` at ${addr} beyond those recorded`,
            )
      const keys: Term[] = []
      if (tree)
        for (const [k, sub] of tree.children) {
          const keyTerm = keyLiteral(k, keySort, w.decls)
          if (!keyTerm) continue
          keys.push(keyTerm)
          // the recorded entry's own value tree, named by its key (its unknown parts are its own)
          base = store(
            base,
            keyTerm,
            this.valueAt(sub, elemShape, tail, `${name}${k}`, addr, V, done),
          )
        }
      // recorded keys are distinct values: literals by construction, hashes of constants by assumption
      // (no collisions, and a hash is never a small literal such as DEFAULT_ADMIN_ROLE = 0)
      if (keys.length > 1 && keys.some((k) => k.value === undefined))
        w.decls.assume(distinct(...keys))
      return base
    }
    // a leaf
    if (shape.kind === 'scalar') {
      if (tree?.value !== undefined) {
        const lit = this.recordedLiteral(tree, shape)
        if (lit) return lit
      }
      if (done) {
        const z = zero(shape.sort)
        if (z) return z
      }
      return w.decls.named(
        name,
        shape.sort,
        'unknown',
        `\`${shortName(V)}${name.slice(`st_${addr}_${V}`.length)}\` at ${addr} not recorded`,
      )
    }
    return w.decls.fresh(
      'st',
      STR,
      'unknown',
      `\`${shortName(V)}\` at ${addr}: ${shape.kind === 'other' ? shape.what : 'struct'} value`,
    )
  }

  /** The sort of `shape` seen through the remaining path (members chosen, indices curried into arrays). */
  private sortThrough(shape: Shape, rest: AccessPath): Sort {
    const [head, ...tail] = rest
    if (head?.kind === 'member')
      return this.sortThrough(
        shape.kind === 'struct'
          ? (shape.members.get(head.name) ?? UNKNOWN_SHAPE)
          : UNKNOWN_SHAPE,
        tail,
      )
    if (head?.kind === 'index') {
      if (shape.kind === 'mapping')
        return arraySort(shape.key, this.sortThrough(shape.value, tail))
      if (shape.kind === 'array')
        return arraySort(BV256, this.sortThrough(shape.elem, tail))
      return STR
    }
    return sortOf(shape)
  }

  private fitKey(key: Term, sort: Sort): Term {
    if (
      sort.kind === 'BV' &&
      key.sort.kind === 'BV' &&
      key.sort.bits !== sort.bits
    )
      return resize(key, sort.bits)
    return key
  }

  private recordedLiteral(
    leaf: ValueTree,
    shape: Shape & { kind: 'scalar' },
  ): Term | undefined {
    const v = leaf.value
    if (v === undefined) return undefined
    if (shape.sort.kind === 'Bool')
      return v === 'true' ? TRUE : v === 'false' ? FALSE : undefined
    if (shape.sort.kind === 'BV') {
      const special = specialKey(v, shape.sort, this.world.decls)
      if (special) return special
      if (/^(?:[a-z0-9]+:)?0x[0-9a-fA-F]+$/.test(v)) {
        const hex = v.replace(/^[a-z0-9]+:/, '')
        return bvLiteral(BigInt(hex), shape.sort.bits)
      }
      if (/^-?\d+$/.test(v)) return bvLiteral(BigInt(v), shape.sort.bits)
      return undefined
    }
    if (shape.sort.kind === 'Str') return this.world.decls.string(v)
    return undefined
  }

  private writeStorage(
    frame: Frame,
    state: State,
    decl: AstNode,
    V: string,
    path: AccessPath,
    value: Term,
  ): void {
    const addr = frame.addr
    const key = this.storageKey(addr, V, path)
    if (key !== undefined) {
      state.store.set(key, value)
      return
    }
    // a symbolic index: rewrite the container
    const lastIndex = path.map((p) => p.kind).lastIndexOf('index')
    const idx = path[lastIndex]
    if (idx?.kind === 'index' && lastIndex === path.length - 1) {
      const containerPath = path.slice(0, lastIndex)
      const containerKey = this.storageKey(addr, V, containerPath)
      const current = this.readStorage(frame, state, decl, V, containerPath)
      if (containerKey !== undefined && current.sort.kind === 'Array') {
        state.store.set(
          containerKey,
          store(current, this.fitKey(idx.key, current.sort.index), value),
        )
        return
      }
    }
    state.residuals.push({
      kind: 'unsupported-write',
      where: `${shortName(V)} at ${addr}`,
    })
  }

  /** Assignments, `++`/`--`, `delete`: locals update the environment, storage records an effect. */
  private assign(
    lhs: AstNode,
    op: string,
    rhs: AstNode | undefined,
    site: AstNode,
    frame: Frame,
    state: State,
  ): Array<[State, Value]> {
    const out: Array<[State, Value]> = []
    const rhsValues: Array<[State, Value | undefined]> = rhs
      ? this.evalExpr(rhs, frame, state)
      : [[state, undefined]]
    for (const [s0, rv] of rhsValues) {
      // destructuring `(a, b) = ...`
      if (
        lhs.nodeType === 'TupleExpression' &&
        ((lhs.components as unknown[]) ?? []).length > 1
      ) {
        const comps = (lhs.components as unknown[]) ?? []
        const vals = Array.isArray(rv) ? rv : rv ? [rv] : []
        let states: State[] = [s0]
        comps.forEach((c, i) => {
          if (!isNode(c)) return
          const v = vals[i]
          if (!v) return
          const next: State[] = []
          for (const s of states)
            for (const [s2] of this.assignOne(c, '=', v, site, frame, s))
              next.push(s2)
          states = next
        })
        for (const s of states) out.push([s, rv ?? TRUE])
        continue
      }
      const current = Array.isArray(rv) ? (rv[0] as Term) : rv
      out.push(...this.assignOne(lhs, op, current, site, frame, s0))
    }
    return out
  }

  private assignOne(
    lhs: AstNode,
    op: string,
    rhs: Term | undefined,
    site: AstNode,
    frame: Frame,
    state: State,
  ): Array<[State, Value]> {
    const out: Array<[State, Value]> = []
    for (const [s, chain] of this.accessChain(lhs, frame, state)) {
      if (!chain) {
        out.push([s, this.unsupported(s, lhs, frame)])
        continue
      }
      const isState = this.isStateVar(chain.root, frame)
      const V = frame.unit.varSymbol.get(chain.root.id)
      const localKey = `${frame.id}:${chain.root.id}`
      const sort = sortOfType(typeString(lhs))
      // the old value, for compound operators
      let old: Term | undefined
      if (op !== '=') {
        if (isState && V)
          old = this.readStorage(frame, s, chain.root, V, chain.path)
        else {
          const cur = s.env.get(localKey)
          old =
            cur && !Array.isArray(cur) && chain.path.length === 0
              ? cur
              : undefined
        }
      }
      let value: Term
      if (op === '=') value = rhs ?? this.unsupported(s, lhs, frame, sort)
      else if (op === 'delete') value = this.zeroOf(sort)
      else if (op === '++' || op === '--') {
        const base = old ?? this.unsupported(s, lhs, frame, sort)
        value =
          base.sort.kind === 'BV'
            ? arith(
                op === '++' ? '+' : '-',
                base,
                bvLiteral(1n, base.sort.bits),
                false,
              )
            : base
      } else {
        const base = old ?? this.unsupported(s, lhs, frame, sort)
        const r = rhs ?? this.unsupported(s, lhs, frame, sort)
        const [a, b] = this.unify(base, r)
        value =
          a.sort.kind === 'BV'
            ? arith(op.slice(0, -1) as ArithOp, a, b, isSigned(typeString(lhs)))
            : this.unsupported(s, lhs, frame, sort)
      }
      if (isState && V) {
        if (
          value.sort.kind === 'BV' &&
          sort.kind === 'BV' &&
          value.sort.bits !== sort.bits
        )
          value = resize(value, sort.bits)
        this.writeStorage(frame, s, chain.root, V, chain.path, value)
        const id = this.siteId(site, frame)
        s.effects.add(`${frame.addr}|${id}`)
        s.effectGuards.set(`${frame.addr}|${id}`, new Map(s.guardsTaken))
        s.trace.push(`write ${shortName(V)} at ${id}`)
      } else if (chain.path.length === 0) {
        s.env.set(localKey, value)
      } else {
        // a member or element of a local struct/array: the whole local becomes unknown
        s.env.set(
          localKey,
          this.world.decls.fresh(
            `l_${str(chain.root, 'name')}`,
            sortOfType(typeString(chain.root)),
            'unknown',
            `local \`${str(chain.root, 'name')}\` partially assigned`,
          ),
        )
      }
      out.push([
        s,
        op === '++' || op === '--'
          ? str(site, 'prefix') === 'true'
            ? value
            : (old ?? value)
          : value,
      ])
    }
    return out
  }

  // ---------- calls ----------

  private call(e: AstNode, frame: Frame, state: State): Array<[State, Value]> {
    const w = this.world
    const kind = str(e, 'kind')
    let callee = child(e, 'expression')
    const argNodes = children(e, 'arguments')
    // `f{value: v}(...)`: peel the options
    let valueOption: AstNode | undefined
    if (callee?.nodeType === 'FunctionCallOptions') {
      const names = (callee.names as unknown[]) ?? []
      const opts = children(callee, 'options')
      const vi = names.indexOf('value')
      if (vi >= 0) valueOption = opts[vi]
      callee = child(callee, 'expression')
    }
    if (!callee) return [[state, this.unsupported(state, e, frame)]]
    if (kind === 'typeConversion')
      return this.conversion(e, callee, argNodes, frame, state)
    if (kind === 'structConstructorCall')
      return this.evalList(argNodes, frame, state).map(([s]) => [
        s,
        this.unsupported(s, e, frame),
      ])
    // `T.wrap(x)` / `T.unwrap(x)` of a user-defined value type: the same bits
    if (callee.nodeType === 'MemberAccess') {
      const member = str(callee, 'memberName')
      const base = child(callee, 'expression')
      const baseRef = base ? num(base, 'referencedDeclaration') : undefined
      const baseDecl =
        baseRef !== undefined ? frame.unit.nodes.get(baseRef) : undefined
      if (
        (member === 'wrap' || member === 'unwrap') &&
        baseDecl?.nodeType === 'UserDefinedValueTypeDefinition' &&
        argNodes[0]
      )
        return this.evalExpr(argNodes[0], frame, state).map(([s, v]) => {
          const t = Array.isArray(v) ? (v[0] as Term) : v
          const sort = sortOfType(typeString(e))
          return [
            s,
            t.sort.kind === 'BV' && sort.kind === 'BV'
              ? resize(t, sort.bits)
              : t,
          ]
        })
    }

    // builtins
    if (
      callee.nodeType === 'Identifier' &&
      (num(callee, 'referencedDeclaration') ?? 0) < 0
    ) {
      const name = str(callee, 'name')
      if (name === 'require' || name === 'assert') {
        const c = argNodes[0]
        if (!c) return [[state, TRUE]]
        const out: Array<[State, Value]> = []
        for (const [s, ct] of this.evalCond(c, frame, state)) {
          if (ct.value === false) continue
          const s2 = cloneState(s)
          if (ct.value !== true) s2.pc.push(ct)
          s2.trace.push(`${name} ${describe(c)}`)
          s2.guardsTaken.set(this.siteId(e, frame), 'true')
          out.push([s2, TRUE])
        }
        return out
      }
      if (name === 'revert') return []
      if (
        name === 'keccak256' ||
        name === 'sha256' ||
        name === 'ripemd160' ||
        name === 'ecrecover' ||
        name === 'addmod' ||
        name === 'mulmod' ||
        name === 'blockhash' ||
        name === 'gasleft' ||
        name === 'selfdestruct'
      )
        return this.evalList(argNodes, frame, state).map(([s, args]) => {
          const flat = args.map((a) => (Array.isArray(a) ? (a[0] as Term) : a))
          const ret = name === 'ecrecover' ? BV160 : BV256
          const t = w.decls.apply(
            `uf_${name}`,
            flat.map((a) => (a.sort.kind === 'BV' ? resize(a, 256) : a)),
            ret,
          )
          return [s, this.markUnknown(t, `result of ${name}(…)`)]
        })
    }
    if (callee.nodeType === 'MemberAccess') {
      const base = child(callee, 'expression')
      const member = str(callee, 'memberName')
      if (
        base?.nodeType === 'Identifier' &&
        str(base, 'name') === 'abi' &&
        (num(base, 'referencedDeclaration') ?? 0) < 0
      )
        return this.evalList(argNodes, frame, state).map(([s, args]) => {
          const flat = args
            .map((a) => (Array.isArray(a) ? (a[0] as Term) : a))
            .map((a) => (a.sort.kind === 'BV' ? resize(a, 256) : a))
          return [
            s,
            this.markUnknown(
              w.decls.apply(`uf_abi_${member}`, flat, STR),
              `abi.${member}(…)`,
            ),
          ]
        })
      // low-level calls
      if (
        member === 'call' ||
        member === 'staticcall' ||
        member === 'delegatecall' ||
        member === 'callcode'
      ) {
        return this.lowLevelCall(e, member, base, argNodes, frame, state)
      }
      if ((member === 'push' || member === 'pop') && base)
        return this.arrayOp(e, member, base, argNodes, frame, state)
      if (member === 'transfer' || member === 'send')
        return this.evalList(argNodes, frame, state).map(([s]) => [s, TRUE])
    }

    // resolved callee declaration
    const ref = num(callee, 'referencedDeclaration')
    const decl = ref !== undefined ? frame.unit.nodes.get(ref) : undefined
    if (decl?.nodeType === 'FunctionDefinition') {
      const external =
        callee.nodeType === 'MemberAccess' &&
        this.isExternalCall(callee, decl, frame)
      if (external)
        return this.externalCall(
          e,
          callee,
          decl,
          argNodes,
          valueOption,
          frame,
          state,
        )
      return this.internalCall(e, callee, decl, argNodes, frame, state)
    }
    if (
      decl?.nodeType === 'EventDefinition' ||
      decl?.nodeType === 'ErrorDefinition'
    )
      return this.evalList(argNodes, frame, state).map(([s]) => [s, TRUE])
    // whatever this calls, its arguments run first (an external call among them is a guard)
    return this.evalList(argNodes, frame, state).map(([s]) => [
      s,
      this.unsupported(s, e, frame),
    ])
  }

  private markUnknown(t: Term, origin: string): Term {
    // a hash of constants is a fixed value the walk and discovery agree on (role ids); a hash of something
    // the actor chooses is not a value the actor controls: sat answers resting on it are unknown
    if (t.syms.size === 0) return t
    const marker = this.world.decls.named(
      `ufmark_${t.smt.replace(/[^\w]/g, '').slice(0, 24)}`,
      BOOL,
      'unknown',
      origin,
    )
    return { ...t, syms: new Set([...t.syms, ...marker.syms]) }
  }

  private conversion(
    e: AstNode,
    callee: AstNode,
    argNodes: AstNode[],
    frame: Frame,
    state: State,
  ): Array<[State, Value]> {
    const target = typeString(e)
    const arg = argNodes[0]
    if (!arg) return [[state, this.unsupported(state, e, frame)]]
    return this.evalExpr(arg, frame, state).map(([s, v]) => {
      const t = Array.isArray(v) ? (v[0] as Term) : v
      const sort = sortOfType(target)
      if (sort.kind === 'BV' && t.sort.kind === 'BV') {
        if (sort.bits === 160) return [s, resize(t, 160)]
        const m = /^u?int(\d+)$/.exec(target) ?? /^bytes(\d+)$/.exec(target)
        let out = resize(t, 256)
        if (m) {
          const bitsN = /^bytes/.test(target) ? Number(m[1]) * 8 : Number(m[1])
          if (bitsN < 256 && !target.startsWith('int'))
            out = truncate(out, bitsN)
        }
        return [s, out]
      }
      if (sort.kind === 'Bool' && t.sort.kind === 'Bool') return [s, t]
      if (sort.kind === 'Str')
        return [
          s,
          this.markUnknown(
            this.world.decls.apply(
              `uf_conv_${target.replace(/\W/g, '_')}`,
              [t.sort.kind === 'BV' ? resize(t, 256) : t],
              STR,
            ),
            `conversion to ${target}`,
          ),
        ]
      void callee
      return [s, this.unsupported(s, e, frame)]
    })
  }

  private arrayOp(
    e: AstNode,
    member: string,
    base: AstNode,
    argNodes: AstNode[],
    frame: Frame,
    state: State,
  ): Array<[State, Value]> {
    const out: Array<[State, Value]> = []
    for (const [s, chain] of this.accessChain(base, frame, state)) {
      const V = chain ? frame.unit.varSymbol.get(chain.root.id) : undefined
      if (!chain || !V || !this.isStateVar(chain.root, frame)) {
        out.push([s, this.unsupported(s, e, frame)])
        continue
      }
      const lenPath = [
        ...chain.path,
        { kind: 'member' as const, name: 'length' },
      ]
      const len = this.readStorage(frame, s, chain.root, V, lenPath)
      const id = this.siteId(e, frame)
      if (member === 'push') {
        const vals = argNodes[0]
          ? this.evalExpr(argNodes[0], frame, s)
          : [[s, undefined] as [State, Value | undefined]]
        for (const [s2, v] of vals) {
          const val =
            v === undefined
              ? this.zeroOf(BV256)
              : Array.isArray(v)
                ? (v[0] as Term)
                : v
          this.writeStorage(
            frame,
            s2,
            chain.root,
            V,
            [...chain.path, { kind: 'index', key: len }],
            val,
          )
          this.writeStorage(
            frame,
            s2,
            chain.root,
            V,
            lenPath,
            arith('+', len, bvLiteral(1n, 256), false),
          )
          s2.effects.add(`${frame.addr}|${id}`)
          s2.effectGuards.set(`${frame.addr}|${id}`, new Map(s2.guardsTaken))
          s2.trace.push(`push ${shortName(V)} at ${id}`)
          out.push([s2, TRUE])
        }
      } else {
        this.writeStorage(
          frame,
          s,
          chain.root,
          V,
          lenPath,
          arith('-', len, bvLiteral(1n, 256), false),
        )
        s.effects.add(`${frame.addr}|${id}`)
        s.effectGuards.set(`${frame.addr}|${id}`, new Map(s.guardsTaken))
        s.trace.push(`pop ${shortName(V)} at ${id}`)
        out.push([s, TRUE])
      }
    }
    return out
  }

  private isExternalCall(
    callee: AstNode,
    decl: AstNode,
    frame: Frame,
  ): boolean {
    const base = child(callee, 'expression')
    if (!base) return false
    // `super.f()`, `Base.f()`, `Lib.f()`: internal
    if (base.nodeType === 'Identifier') {
      const name = str(base, 'name')
      if (name === 'super') return false
      const ref = num(base, 'referencedDeclaration')
      const target = ref !== undefined ? frame.unit.nodes.get(ref) : undefined
      if (target?.nodeType === 'ContractDefinition') return false
    }
    // a library function bound with `using for`: internal
    const scope = num(decl, 'scope')
    const owner = scope !== undefined ? frame.unit.nodes.get(scope) : undefined
    if (
      owner?.nodeType === 'ContractDefinition' &&
      str(owner, 'contractKind') === 'library'
    )
      return false
    const bt = typeString(base)
    return (
      bt.startsWith('contract ') ||
      bt.startsWith('interface ') ||
      bt === 'address' ||
      bt === 'address payable'
    )
  }

  private internalCall(
    e: AstNode,
    callee: AstNode,
    decl: AstNode,
    argNodes: AstNode[],
    frame: Frame,
    state: State,
  ): Array<[State, Value]> {
    const w = this.world
    const g0 = frame.unit.fnSymbol.get(decl.id) ?? ''
    const explicit = callee.nodeType === 'MemberAccess'
    const resolved = explicit
      ? g0
      : (frame.unit.dispatch.get(`${frame.C}|${frame.defSymbol}|${g0}`) ?? g0)
    const target = findDef(frame.unit, resolved) ?? decl
    // a bound library call: the receiver is the first argument
    const args = [...argNodes]
    let receiver: AstNode | undefined
    if (callee.nodeType === 'MemberAccess') {
      const scope = num(decl, 'scope')
      const owner =
        scope !== undefined ? frame.unit.nodes.get(scope) : undefined
      const base = child(callee, 'expression')
      const baseRef = base ? num(base, 'referencedDeclaration') : undefined
      const baseDecl =
        baseRef !== undefined ? frame.unit.nodes.get(baseRef) : undefined
      if (
        owner?.nodeType === 'ContractDefinition' &&
        str(owner, 'contractKind') === 'library' &&
        baseDecl?.nodeType !== 'ContractDefinition'
      )
        receiver = base
    }
    const evaluated = receiver
      ? this.evalExpr(receiver, frame, state)
      : [[state, undefined] as [State, Value | undefined]]
    const out: Array<[State, Value]> = []
    for (const [s0, recv] of evaluated)
      for (const [s, vals] of this.evalList(args, frame, s0)) {
        const all = recv !== undefined ? [recv, ...vals] : vals
        const results = this.callFunction(
          target,
          frame.unit,
          frame.C,
          frame.addr,
          frame.sender,
          frame.msgValue,
          all,
          s,
          frame.depth + 1,
        )
        for (const r of results) out.push([r.state, r.state.ret ?? TRUE])
      }
    void w
    void e
    return out
  }

  private externalCall(
    e: AstNode,
    callee: AstNode,
    decl: AstNode,
    argNodes: AstNode[],
    valueOption: AstNode | undefined,
    frame: Frame,
    state: State,
  ): Array<[State, Value]> {
    const w = this.world
    const base = child(callee, 'expression') as AstNode
    const out: Array<[State, Value]> = []
    const site = this.siteId(e, frame)
    // the receiver decides the target; reading it is part of the guard
    state.inCond++
    const receivers = this.evalExpr(base, frame, state)
    state.inCond--
    for (const [s0, rv] of receivers) {
      s0.inCond = state.inCond
      const target = Array.isArray(rv) ? (rv[0] as Term) : rv
      const values = valueOption
        ? this.evalExpr(valueOption, frame, s0)
        : [[s0, bvLiteral(0n, 256)] as [State, Value]]
      for (const [s1, mv] of values)
        for (const [s, args] of this.evalList(argNodes, frame, s1)) {
          const msgValue = Array.isArray(mv) ? (mv[0] as Term) : mv
          if (typeof target.value !== 'bigint') {
            const why = `${describe(e)} at ${site}: receiver not a recorded address`
            s.residuals.push({ kind: 'call-target', where: why })
            s.pc.push(
              w.decls.fresh(
                'completes',
                BOOL,
                'unknown',
                `whether ${why} completes`,
              ),
            )
            s.trace.push(`external call ${describe(e)}: target unknown`)
            out.push([
              s,
              this.unknownReturn(
                decl,
                frame.unit,
                s,
                `result of ${describe(e)} (target unknown)`,
              ) ?? TRUE,
            ])
            continue
          }
          const addr = `eth:0x${target.value.toString(16).padStart(40, '0')}`
          const g0 = frame.unit.fnSymbol.get(decl.id) ?? ''
          const selector = frame.unit.selector.get(g0)
          const entries = w.entries.get(addr) ?? []
          const match = entries.find((en) => {
            const unit = w.unitOfContract.get(w.contractOfFn.get(en.H) ?? '')
            return unit && selector && unit.selector.get(en.H) === selector
          })
          if (!match) {
            const known = w.codeAt.has(addr)
            const why = known
              ? `${describe(e)} at ${site}: ${addr} has no function with selector ${selector ?? '?'}`
              : `${describe(e)} at ${site}: no code known at ${addr}`
            s.residuals.push({ kind: 'call-target', where: why })
            s.pc.push(
              w.decls.fresh(
                'completes',
                BOOL,
                'unknown',
                `whether ${why} completes`,
              ),
            )
            out.push([
              s,
              this.unknownReturn(
                decl,
                frame.unit,
                s,
                `result of ${describe(e)} (no code at ${addr})`,
              ) ?? TRUE,
            ])
            continue
          }
          const C = w.contractOfFn.get(match.H) as string
          const deployment = (w.codeAt.get(addr) ?? []).find(
            (d) => d.role === match.role,
          ) ?? { role: match.role, C }
          const unit = w.unitOfContract.get(C)
          const def = unit ? findDef(unit, match.H) : undefined
          if (!unit || !def) {
            s.residuals.push({
              kind: 'call-target',
              where: `${describe(e)} at ${site}: no source for ${match.H}`,
            })
            out.push([s, TRUE])
            continue
          }
          s.trace.push(`external call ${describe(e)} → ${match.H} at ${addr}`)
          const results = this.callFunction(
            def,
            unit,
            deployment.C,
            addr,
            addressLiteral(frame.addr),
            msgValue,
            args,
            s,
            frame.depth + 1,
          )
          for (const r of results) {
            r.state.callsMade.add(site)
            out.push([r.state, r.state.ret ?? TRUE])
          }
        }
    }
    return out
  }

  private lowLevelCall(
    e: AstNode,
    member: string,
    base: AstNode | undefined,
    argNodes: AstNode[],
    frame: Frame,
    state: State,
  ): Array<[State, Value]> {
    const w = this.world
    const site = this.siteId(e, frame)
    const out: Array<[State, Value]> = []
    const receivers = base
      ? this.evalExpr(base, frame, state)
      : [[state, undefined] as [State, Value | undefined]]
    for (const [s0, rv] of receivers)
      for (const [s, args] of this.evalList(argNodes, frame, s0)) {
        void args
        if (member === 'delegatecall' || member === 'callcode') {
          s.residuals.push({
            kind: 'opaque',
            where: `${member} at ${site}: the callee runs with this contract's storage`,
          })
        }
        const target = rv && !Array.isArray(rv) ? rv : undefined
        const success = w.decls.fresh(
          'ok',
          BOOL,
          'unknown',
          `outcome of ${describe(e)} at ${site}${target?.value !== undefined ? '' : ' (target not a recorded address)'}`,
        )
        const data = w.decls.fresh(
          'ret',
          STR,
          'unknown',
          `return data of ${describe(e)} at ${site}`,
        )
        s.trace.push(`low-level ${member} at ${site}`)
        out.push([s, [success, data]])
      }
    return out
  }
}

// ---------- helpers ----------

function parseDecimal(raw: string): bigint {
  // solc prints rationals like "1e18" or "2.5e3" for some literals
  const m = /^(\d+)(?:\.(\d+))?(?:e(\d+))?$/.exec(raw)
  if (!m) return 0n
  const int = m[1] as string
  const frac = m[2] ?? ''
  const exp = Number(m[3] ?? '0')
  const digits = int + frac
  const shift = exp - frac.length
  if (shift >= 0) return BigInt(digits) * 10n ** BigInt(shift)
  return BigInt(digits.slice(0, digits.length + shift) || '0')
}

/** The recorded child whose key denotes the same value as `key` (a literal or a closed hash term). */
function lookupKey(
  tree: ValueTree,
  key: Term,
  elem: Shape,
  decls: Declarations,
): ValueTree | undefined {
  void elem
  for (const [k, v] of tree.children) {
    const kt = keyLiteral(k, key.sort, decls)
    if (!kt) continue
    if (kt.value !== undefined && key.value !== undefined) {
      if (kt.value === key.value) return v
      continue
    }
    if (kt.smt === key.smt) return v
  }
  return undefined
}

/**
 * Keys discovery cannot write as values: `@keccak256:NAME` is keccak256("NAME") (a role id), `@zero` the
 * zero word. They come from the bridges in src/solve.ts (loadWorld) and match the walk's own terms.
 */
function specialKey(
  text: string,
  sort: Sort,
  decls: Declarations,
): Term | undefined {
  if (sort.kind !== 'BV') return undefined
  if (text === '@zero') return bvLiteral(0n, sort.bits)
  const m = /^@keccak256:(.*)$/.exec(text)
  if (m) {
    const t = decls.apply(
      'uf_keccak256',
      [decls.string(`string:${m[1] ?? ''}`)],
      BV256,
    )
    return sort.bits === 256 ? t : resize(t, sort.bits)
  }
  return undefined
}

/** A recorded child key (`[3]`, `.0xabc…`, `.@keccak256:ROLE`) as a term of the container's key sort. */
function keyLiteral(
  k: string,
  sort: Sort,
  decls: Declarations,
): Term | undefined {
  const m = /^\[(\d+)\]$/.exec(k)
  if (m)
    return sort.kind === 'BV'
      ? bvLiteral(BigInt(m[1] as string), sort.bits)
      : undefined
  const text = k.slice(1)
  const special = specialKey(text, sort, decls)
  if (special) return special
  if (sort.kind === 'BV') {
    if (/^(?:[a-z0-9]+:)?0x[0-9a-fA-F]+$/.test(text))
      return bvLiteral(BigInt(text.replace(/^[a-z0-9]+:/, '')), sort.bits)
    if (/^-?\d+$/.test(text)) return bvLiteral(BigInt(text), sort.bits)
    return undefined
  }
  if (sort.kind === 'Bool')
    return text === 'true' ? TRUE : text === 'false' ? FALSE : undefined
  if (sort.kind === 'Str') return decls.string(text)
  return undefined
}

function sortOf(shape: Shape): Sort {
  switch (shape.kind) {
    case 'scalar':
      return shape.sort
    case 'mapping':
      return arraySort(shape.key, sortOf(shape.value))
    case 'array':
      return arraySort(BV256, sortOf(shape.elem))
    default:
      return STR
  }
}

/** `<unit>:<Contract>.<name>…` → `<name>…` (the unit part may itself contain a colon, as in `x-eth:0x….sol`). */
export function shortName(symbol: string): string {
  return symbol.replace(/^.*\.sol:/, '').replace(/^[^.]*\./, '')
}

function findDef(unit: UnitCode, symbol: string): AstNode | undefined {
  for (const [id, sym] of unit.fnSymbol)
    if (sym === symbol) return unit.nodes.get(id)
  return undefined
}

/** Does deployable `C` (a contract symbol) have `base` in its linearization? Both in the same unit. */
function inheritsFrom(unit: UnitCode, C: string, base: string): boolean {
  if (C === base) return true
  const name = C.slice(C.lastIndexOf(':') + 1)
  const baseName = base.slice(base.lastIndexOf(':') + 1)
  for (const n of unit.nodes.values()) {
    if (n.nodeType !== 'ContractDefinition' || str(n, 'name') !== name) continue
    const lin = (n.linearizedBaseContracts as unknown[]) ?? []
    return lin.some((id) => {
      const b = typeof id === 'number' ? unit.nodes.get(id) : undefined
      return b && str(b, 'name') === baseName
    })
  }
  return false
}

/** A short rendering of an expression for traces and residuals. */
export function describe(n: AstNode): string {
  switch (n.nodeType) {
    case 'Identifier':
      return str(n, 'name')
    case 'Literal':
      return str(n, 'value') || str(n, 'hexValue')
    case 'MemberAccess':
      return `${describe(child(n, 'expression') ?? n)}.${str(n, 'memberName')}`
    case 'IndexAccess':
      return `${describe(child(n, 'baseExpression') ?? n)}[${child(n, 'indexExpression') ? describe(child(n, 'indexExpression') as AstNode) : ''}]`
    case 'BinaryOperation':
      return `${describe(child(n, 'leftExpression') ?? n)} ${str(n, 'operator')} ${describe(child(n, 'rightExpression') ?? n)}`
    case 'UnaryOperation':
      return str(n, 'prefix') === 'true' || n.prefix === true
        ? `${str(n, 'operator')}${describe(child(n, 'subExpression') ?? n)}`
        : `${describe(child(n, 'subExpression') ?? n)}${str(n, 'operator')}`
    case 'FunctionCall':
      return `${describe(child(n, 'expression') ?? n)}(${children(n, 'arguments').map(describe).join(', ')})`
    case 'FunctionCallOptions':
      return describe(child(n, 'expression') ?? n)
    case 'TupleExpression':
      return `(${((n.components as unknown[]) ?? []).filter(isNode).map(describe).join(', ')})`
    case 'Conditional':
      return `${describe(child(n, 'condition') ?? n)} ? … : …`
    case 'ElementaryTypeNameExpression':
      return typeString(n).replace(/^type\((.*)\)$/, '$1')
    case 'Assignment':
      return `${describe(child(n, 'leftHandSide') ?? n)} ${str(n, 'operator')} ${describe(child(n, 'rightHandSide') ?? n)}`
    default:
      return n.nodeType
  }
}

export { isConst, ite }
