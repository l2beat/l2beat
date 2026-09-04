// Stage 2: solc compact AST + storage layout → base facts (TSV, one file per relation).
//
// The extractor computes nothing clever: every row is a single-pass truth the compiler
// front end already knows. Anything with "transitively" in it is a rule (see rules/).
// Anything the walker does not understand becomes an `unhandled` row instead of silence.

import type { SolidityOutput } from '@ethereum-sourcify/compilers-types'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import {
  type AstNode,
  childNodes,
  cleanType,
  isNode,
  parseSrc,
  SourceText,
  typeIdentifierOf,
  typeStringOf,
  walk,
} from './ast'

/** Base relations and their arity. Every relation gets a `.facts` file, even when empty. */
export const RELATIONS: Record<string, number> = {
  codeUnit: 3, // (Unit, File, SolcVersion)
  contract: 4, // (C, Name, Kind, Abstract)
  inherits: 3, // (C, Base, Order)  C3 linearization; Order 0 is C itself
  usingFor: 3, // (C, LibraryOrFunction, TypeText)
  function: 8, // (F, C, Name, Signature, Kind, Visibility, Mutability, Selector)
  overrides: 2, // (F, BaseF)
  param: 5, // (F, Index, P, Type, Location)
  localVar: 5, // (L, F, Name, Type, Location)
  stateVariable: 6, // (V, C, Name, Type, Mutability, Visibility)
  initializer: 2, // (V, Text)  state variable declared with an inline initializer
  storageSlot: 4, // (C, V, Slot, Offset)  from solc's storageLayout of contract C
  event: 3, // (E, C, Name)
  functionBody: 2, // (F, Block)
  stmt: 5, // (S, F, Kind, Parent, Index)
  condition: 2, // (X, Text)  X is an if/loop statement or a require/assert call
  condShape: 2, // (X, Shape)  top-level shape of the condition: simple | and | or | not
  refs: 2, // (X, What)  condition X mentions What: msg.sender, tx.origin, a state var, or a callee
  writeSite: 5, // (W, S, F, Target, Op)  Target is a state var or a storage reference (local/param)
  readsDirect: 2, // (F, V)
  refBinding: 2, // (R, X)  storage reference R is bound to X (state var or another reference)
  callSite: 6, // (K, S, F, Kind, Callee, Text)
  argBinding: 3, // (K, Index, X)  call K passes state var / storage reference X as parameter Index
  assembly: 3, // (A, F, HasYul)  HasYul is 0 for solc < 0.6 (no Yul AST, only text)
  asmExtRef: 4, // (A, YulName, V, Kind)  Kind: slot | offset | value
  asmSstore: 5, // (K, A, SlotKind, SlotText, SlotNum)  SlotKind: literal | ident | expr; SlotNum is -1 unless a literal that fits int64
  asmLet: 4, // (A, Var, ValueKind, ValueText)
  asmCall: 3, // (K, A, Name)  Yul calls with storage/control effects: delegatecall, callcode, call, staticcall, create, create2, selfdestruct, tstore
  returnsRef: 3, // (F, Index, X)  F's Index-th return value is the storage reference X (state var, local/param, or call result)
  callResult: 3, // (X, K, Index)  X = "<K>#<Index>" names the Index-th value returned by call K
  sourceLoc: 6, // (Id, File, StartLine, EndLine, Start, Length)
  unhandled: 3, // (Ctx, What, Text)  loud coverage check
}

const LOW_LEVEL_MEMBERS = new Set([
  'call',
  'delegatecall',
  'staticcall',
  'callcode',
  'send',
  'transfer',
])
// solc < 0.6 gives builtins positive ids that point at declarations outside the AST; fall back to names.
const BUILTIN_NAMES = new Set([
  'require',
  'assert',
  'revert',
  'keccak256',
  'sha256',
  'sha3',
  'ripemd160',
  'ecrecover',
  'addmod',
  'mulmod',
  'selfdestruct',
  'suicide',
  'blockhash',
  'gasleft',
  'msg',
  'block',
  'tx',
  'abi',
  'this',
  'super',
  'now',
  'type',
  'log0',
  'log1',
  'log2',
  'log3',
  'log4',
])
const OPAQUE_YUL_CALLS = new Set([
  'delegatecall',
  'callcode',
  'call',
  'staticcall',
  'create',
  'create2',
  'selfdestruct',
  'tstore',
])
const GLOBAL_REFS = new Set([
  'msg.sender',
  'msg.value',
  'msg.data',
  'tx.origin',
  'block.timestamp',
  'block.number',
])

/** Decimal text → number when it fits comfortably in Soufflé's signed 64-bit `number`, else -1. */
function smallNumber(text: string): number {
  try {
    const big = BigInt(text)
    return big >= 0n && big < 2n ** 53n ? Number(big) : -1
  } catch {
    return -1
  }
}

/**
 * Builtins (`require`, `msg`, `abi`, `super`, ...) have negative declaration ids inside solc,
 * but the compact JSON AST prints them as uint32 (e.g. `require` = 4294967278 = 2^32 - 18).
 */
function isBuiltinRef(ref: unknown): boolean {
  return typeof ref !== 'number' || ref < 0 || ref >= 0x80000000
}

function sanitize(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

export class Facts {
  readonly rows = new Map<string, Set<string>>()

  constructor() {
    for (const name of Object.keys(RELATIONS)) this.rows.set(name, new Set())
  }

  add(relation: string, ...cols: Array<string | number>): void {
    const arity = RELATIONS[relation]
    if (arity === undefined) throw new Error(`unknown relation ${relation}`)
    if (cols.length !== arity) {
      throw new Error(
        `${relation} expects ${arity} columns, got ${cols.length}: ${JSON.stringify(cols)}`,
      )
    }
    const row = cols
      .map((c) => (typeof c === 'number' ? String(c) : sanitize(c)))
      .join('\t')
    this.rows.get(relation)?.add(row)
  }

  count(relation: string): number {
    return this.rows.get(relation)?.size ?? 0
  }

  /** Writes `<relation>.facts` files; returns total rows and bytes. */
  write(dir: string): { rows: number; bytes: number } {
    mkdirSync(dir, { recursive: true })
    let rows = 0
    let bytes = 0
    for (const [relation, set] of this.rows) {
      const sorted = [...set].sort()
      const content = sorted.length > 0 ? `${sorted.join('\n')}\n` : ''
      writeFileSync(join(dir, `${relation}.facts`), content)
      rows += sorted.length
      bytes += Buffer.byteLength(content)
    }
    return { rows, bytes }
  }
}

interface Decl {
  id: string
  nodeType: string
  node: AstNode
  /** Stable id of the contract this declaration belongs to (if any). */
  contract?: string
  stateVariable: boolean
  storageLocation?: string
}

interface Ctx {
  F: string
  /** Enclosing statement id, or '' when the expression sits on a function header (modifier args). */
  S: string
}

interface CallInfo {
  kind: string
  callee: string
  calleeDecl?: Decl
  /** `using for` bound call: the receiver is the callee's first parameter. */
  bound: boolean
  base?: AstNode
  calleeNode?: AstNode
}

export interface ExtractInput {
  unit: string
  fileName: string
  source: string
  output: SolidityOutput
  solcVersion: string
}

export interface ExtractResult {
  facts: Facts
  stats: { ignoredDeclarations: number; unhandled: number }
}

export function extractFacts(input: ExtractInput): ExtractResult {
  const extractor = new Extractor(input)
  extractor.run()
  return {
    facts: extractor.facts,
    stats: {
      ignoredDeclarations: extractor.ignoredDeclarations,
      unhandled: extractor.facts.count('unhandled'),
    },
  }
}

class Extractor {
  readonly facts = new Facts()
  readonly text: SourceText
  readonly decls = new Map<number, Decl>()
  readonly contractKind = new Map<string, string>()
  readonly constructorOf = new Map<number, string>()
  /** Storage location of each return parameter, per function id. */
  readonly returnLocations = new Map<string, string[]>()
  ignoredDeclarations = 0
  private readonly ast: AstNode

  constructor(private readonly input: ExtractInput) {
    this.text = new SourceText(input.source)
    const ast = input.output.sources?.[input.fileName]?.ast
    if (!isNode(ast))
      throw new Error(`no AST for ${input.fileName} in solc output`)
    this.ast = ast
  }

  run(): void {
    const { unit, fileName, solcVersion } = this.input
    this.facts.add('codeUnit', unit, fileName, solcVersion)
    this.index(this.ast, {})
    for (const node of this.topLevelNodes()) this.emitTopLevel(node)
    this.emitStorageLayout()
  }

  private topLevelNodes(): AstNode[] {
    const nodes = this.ast.nodes
    return Array.isArray(nodes) ? nodes.filter(isNode) : []
  }

  // ---------------------------------------------------------------------------
  // Pass 1: mint stable ids for every declaration the AST can reference
  // ---------------------------------------------------------------------------

  private index(
    node: AstNode,
    ctx: {
      contract?: { name: string; id: string }
      fn?: string
      owner?: string
    },
  ): void {
    let next = ctx
    const { unit } = this.input
    const name = typeof node.name === 'string' ? node.name : ''
    switch (node.nodeType) {
      case 'ContractDefinition': {
        const id = `${unit}:${name}`
        this.decls.set(node.id, {
          id,
          nodeType: node.nodeType,
          node,
          stateVariable: false,
        })
        this.contractKind.set(id, String(node.contractKind))
        next = { contract: { name, id } }
        break
      }
      case 'FunctionDefinition':
      case 'ModifierDefinition': {
        const id = this.functionId(node, ctx.contract?.name)
        this.decls.set(node.id, {
          id,
          nodeType: node.nodeType,
          node,
          contract: ctx.contract?.id,
          stateVariable: false,
        })
        if (node.kind === 'constructor' && ctx.contract) {
          const contractAstId = (node.scope as number) ?? -1
          this.constructorOf.set(contractAstId, id)
        }
        next = { ...ctx, fn: id }
        break
      }
      case 'EventDefinition':
      case 'ErrorDefinition':
      case 'StructDefinition':
      case 'EnumDefinition':
      case 'UserDefinedValueTypeDefinition': {
        const id = ctx.contract
          ? `${ctx.contract.id}.${name}`
          : `${unit}:${name}`
        this.decls.set(node.id, {
          id,
          nodeType: node.nodeType,
          node,
          contract: ctx.contract?.id,
          stateVariable: false,
        })
        next = { ...ctx, owner: id }
        break
      }
      case 'VariableDeclaration': {
        const { start } = parseSrc(node.src)
        let id: string
        if (node.stateVariable && ctx.contract) {
          id = `${ctx.contract.id}.${name}`
        } else if (ctx.owner) {
          id = `${ctx.owner}.${name}` // struct member, event/error parameter
        } else if (ctx.fn) {
          id = `${ctx.fn}/${name || '_'}@${start}`
        } else {
          id = `${unit}:${name}` // file-level constant
        }
        this.decls.set(node.id, {
          id,
          nodeType: node.nodeType,
          node,
          contract: ctx.contract?.id,
          stateVariable: Boolean(node.stateVariable),
          storageLocation:
            typeof node.storageLocation === 'string'
              ? node.storageLocation
              : undefined,
        })
        break
      }
    }
    for (const child of childNodes(node)) this.index(child, next)
  }

  private functionId(node: AstNode, contractName: string | undefined): string {
    const sig = this.signature(node)
    return contractName
      ? `${this.input.unit}:${contractName}.${sig}`
      : `${this.input.unit}:${sig}`
  }

  private functionKind(node: AstNode): string {
    return node.nodeType === 'ModifierDefinition'
      ? 'modifier'
      : String(node.kind)
  }

  private functionName(node: AstNode): string {
    const kind = this.functionKind(node)
    if (kind === 'constructor' || kind === 'fallback' || kind === 'receive')
      return kind
    return String(node.name)
  }

  private paramNodes(node: AstNode): AstNode[] {
    const list = node.parameters as AstNode | undefined
    const params = list?.parameters
    return Array.isArray(params) ? params.filter(isNode) : []
  }

  private signature(node: AstNode): string {
    // Slither prints `address` for `address payable` in canonical names; match it so labels line up.
    const types = this.paramNodes(node).map((p) =>
      cleanType(typeStringOf(p)).replace(/\baddress payable\b/g, 'address'),
    )
    return `${this.functionName(node)}(${types.join(',')})`
  }

  // ---------------------------------------------------------------------------
  // Pass 2: emit facts
  // ---------------------------------------------------------------------------

  /** `require`, `msg`, `super`, ... — see isBuiltinRef and BUILTIN_NAMES. */
  private isBuiltinIdentifier(node: AstNode): boolean {
    const ref = node.referencedDeclaration
    if (isBuiltinRef(ref)) return true
    return (
      !this.decls.has(ref as number) && BUILTIN_NAMES.has(String(node.name))
    )
  }

  /** Names the Index-th value returned by a call (and records the callResult fact). */
  private callResultId(F: string, call: AstNode, index: number): string {
    const K = this.site(F, call)
    const X = `${K}#${index}`
    this.facts.add('callResult', X, K, index)
    return X
  }

  private declId(astId: unknown): string {
    if (typeof astId !== 'number') return ''
    return this.decls.get(astId)?.id ?? `?ast${astId}`
  }

  private site(F: string, node: AstNode): string {
    const { start, length } = parseSrc(node.src)
    return `${F}@${start}:${length}`
  }

  private loc(id: string, node: AstNode): void {
    const { start, end, length } = this.text.range(node)
    this.facts.add(
      'sourceLoc',
      id,
      this.input.fileName,
      this.text.lineAt(start),
      this.text.lineAt(end),
      start,
      length,
    )
  }

  private unhandled(ctx: string, what: string, node: AstNode): void {
    const id = `${ctx}@${parseSrc(node.src).start}:unhandled`
    this.facts.add('unhandled', ctx, what, this.text.slice(node))
    this.loc(id, node)
  }

  private emitTopLevel(node: AstNode): void {
    switch (node.nodeType) {
      case 'ContractDefinition':
        this.emitContract(node)
        return
      case 'FunctionDefinition':
        this.emitFunction(node, '')
        return
      case 'VariableDeclaration': {
        const V = this.declId(node.id)
        this.facts.add(
          'stateVariable',
          V,
          '',
          String(node.name),
          cleanType(typeStringOf(node)),
          'constant',
          String(node.visibility ?? 'internal'),
        )
        this.loc(V, node)
        return
      }
      case 'PragmaDirective':
      case 'ImportDirective':
        return
      case 'StructDefinition':
      case 'EnumDefinition':
      case 'ErrorDefinition':
      case 'EventDefinition':
      case 'UsingForDirective':
      case 'UserDefinedValueTypeDefinition':
        this.ignoredDeclarations++
        return
      default:
        this.unhandled(this.input.unit, `top:${node.nodeType}`, node)
    }
  }

  private emitContract(node: AstNode): void {
    const C = this.declId(node.id)
    const name = String(node.name)
    this.facts.add(
      'contract',
      C,
      name,
      String(node.contractKind),
      node.abstract ? 1 : 0,
    )
    this.loc(C, node)

    const linearized = node.linearizedBaseContracts
    if (Array.isArray(linearized)) {
      linearized.forEach((baseAstId, order) => {
        this.facts.add('inherits', C, this.declId(baseAstId), order)
      })
    }

    const children = Array.isArray(node.nodes) ? node.nodes.filter(isNode) : []
    for (const child of children) {
      switch (child.nodeType) {
        case 'FunctionDefinition':
        case 'ModifierDefinition':
          this.emitFunction(child, C)
          break
        case 'VariableDeclaration':
          this.emitStateVariable(child, C)
          break
        case 'EventDefinition': {
          const E = this.declId(child.id)
          this.facts.add('event', E, C, String(child.name))
          this.loc(E, child)
          break
        }
        case 'UsingForDirective':
          this.emitUsingFor(child, C)
          break
        case 'StructDefinition':
        case 'EnumDefinition':
        case 'ErrorDefinition':
        case 'UserDefinedValueTypeDefinition':
          this.ignoredDeclarations++
          break
        default:
          this.unhandled(C, `member:${child.nodeType}`, child)
      }
    }

    // `contract A is B(1, 2)` — base constructor arguments given at the inheritance specifier.
    const bases = Array.isArray(node.baseContracts)
      ? node.baseContracts.filter(isNode)
      : []
    for (const spec of bases) {
      const args = spec.arguments
      if (!Array.isArray(args) || args.length === 0) continue
      const baseName = spec.baseName as AstNode | undefined
      const baseAstId = baseName?.referencedDeclaration as number | undefined
      const ownCtor = this.constructorOf.get(node.id)
      const baseCtor =
        baseAstId !== undefined ? this.constructorOf.get(baseAstId) : undefined
      if (!ownCtor || !baseCtor) {
        this.unhandled(
          C,
          'InheritanceSpecifier.arguments without both constructors',
          spec,
        )
        continue
      }
      const K = this.site(ownCtor, spec)
      this.facts.add(
        'callSite',
        K,
        '',
        ownCtor,
        'baseConstructor',
        baseCtor,
        this.text.slice(spec),
      )
      this.loc(K, spec)
      for (const arg of args.filter(isNode))
        this.visitExpr(arg, { F: ownCtor, S: '' })
    }
  }

  private emitUsingFor(node: AstNode, C: string): void {
    const typeName = node.typeName as AstNode | undefined
    const typeText = typeName ? cleanType(typeStringOf(typeName)) : '*'
    const library = node.libraryName as AstNode | undefined
    if (library) {
      this.facts.add(
        'usingFor',
        C,
        this.declId(library.referencedDeclaration),
        typeText,
      )
      return
    }
    // `using {f, g} for T` (solc >= 0.8.13)
    const list = node.functionList
    if (Array.isArray(list)) {
      for (const entry of list) {
        const def = (entry as { definition?: AstNode }).definition
        if (def)
          this.facts.add(
            'usingFor',
            C,
            this.declId(def.referencedDeclaration),
            typeText,
          )
      }
    }
  }

  private emitStateVariable(node: AstNode, C: string): void {
    const V = this.declId(node.id)
    const mutability =
      typeof node.mutability === 'string'
        ? node.mutability
        : node.constant
          ? 'constant'
          : 'mutable'
    this.facts.add(
      'stateVariable',
      V,
      C,
      String(node.name),
      cleanType(typeStringOf(node)),
      mutability,
      String(node.visibility),
    )
    this.loc(V, node)
    const value = node.value
    if (isNode(value)) this.facts.add('initializer', V, this.text.slice(value))
  }

  private emitFunction(node: AstNode, C: string): void {
    const F = this.declId(node.id)
    const kind = this.functionKind(node)
    this.facts.add(
      'function',
      F,
      C,
      this.functionName(node),
      this.signature(node),
      kind,
      String(node.visibility ?? ''),
      typeof node.stateMutability === 'string' ? node.stateMutability : '',
      typeof node.functionSelector === 'string' ? node.functionSelector : '',
    )
    this.loc(F, node)

    for (const key of ['baseFunctions', 'baseModifiers']) {
      const bases = node[key]
      if (Array.isArray(bases)) {
        for (const b of bases) this.facts.add('overrides', F, this.declId(b))
      }
    }

    this.paramNodes(node).forEach((p, i) => {
      const P = this.declId(p.id)
      this.facts.add(
        'param',
        F,
        i,
        P,
        cleanType(typeStringOf(p)),
        String(p.storageLocation ?? 'default'),
      )
      this.loc(P, p)
    })
    const returns = node.returnParameters as AstNode | undefined
    const returnParams = Array.isArray(returns?.parameters)
      ? returns.parameters.filter(isNode)
      : []
    this.returnLocations.set(
      F,
      returnParams.map((r) => String(r.storageLocation ?? 'default')),
    )
    returnParams.forEach((r, i) => {
      this.emitLocal(r, F)
      if (r.storageLocation === 'storage' && r.name) {
        this.facts.add('returnsRef', F, i, this.declId(r.id))
      }
    })

    const modifiers = Array.isArray(node.modifiers)
      ? node.modifiers.filter(isNode)
      : []
    for (const m of modifiers) {
      const nameNode = m.modifierName as AstNode | undefined
      const refAstId = nameNode?.referencedDeclaration as number | undefined
      const target =
        refAstId !== undefined ? this.decls.get(refAstId) : undefined
      let kind = 'modifier'
      let callee = target?.id ?? ''
      if (target?.nodeType === 'ContractDefinition') {
        kind = 'baseConstructor'
        callee =
          refAstId !== undefined ? (this.constructorOf.get(refAstId) ?? '') : ''
      }
      const K = this.site(F, m)
      this.facts.add('callSite', K, '', F, kind, callee, this.text.slice(m))
      this.loc(K, m)
      const args = Array.isArray(m.arguments) ? m.arguments.filter(isNode) : []
      args.forEach((arg, i) => {
        this.visitExpr(arg, { F, S: '' })
        for (const root of this.valueRoots(arg, F))
          this.facts.add('argBinding', K, i, root)
      })
    }

    const body = node.body
    if (isNode(body)) {
      const B = this.site(F, body)
      this.facts.add('functionBody', F, B)
      this.visitStmt(body, F, '', 0)
    }
  }

  private emitLocal(node: AstNode, F: string): void {
    const L = this.declId(node.id)
    this.facts.add(
      'localVar',
      L,
      F,
      String(node.name ?? ''),
      cleanType(typeStringOf(node)),
      String(node.storageLocation ?? 'default'),
    )
    this.loc(L, node)
  }

  // ---------------------------------------------------------------------------
  // Statements
  // ---------------------------------------------------------------------------

  private visitStmt(
    node: AstNode,
    F: string,
    parent: string,
    index: number,
  ): void {
    const S = this.site(F, node)
    this.facts.add('stmt', S, F, node.nodeType, parent, index)
    this.loc(S, node)
    const ctx: Ctx = { F, S }
    const child = (key: string): AstNode | undefined => {
      const value = node[key]
      return isNode(value) ? value : undefined
    }
    switch (node.nodeType) {
      case 'Block':
      case 'UncheckedBlock': {
        const statements = Array.isArray(node.statements)
          ? node.statements.filter(isNode)
          : []
        statements.forEach((s, i) => this.visitStmt(s, F, S, i))
        return
      }
      case 'IfStatement': {
        const cond = child('condition')
        if (cond) this.visitCondition(cond, S, F)
        const t = child('trueBody')
        if (t) this.visitStmt(t, F, S, 0)
        const f = child('falseBody')
        if (f) this.visitStmt(f, F, S, 1)
        return
      }
      case 'ForStatement': {
        const init = child('initializationExpression')
        if (init) this.visitStmt(init, F, S, 0)
        const cond = child('condition')
        if (cond) this.visitCondition(cond, S, F)
        const loop = child('loopExpression')
        if (loop) this.visitStmt(loop, F, S, 1)
        const body = child('body')
        if (body) this.visitStmt(body, F, S, 2)
        return
      }
      case 'WhileStatement':
      case 'DoWhileStatement': {
        const cond = child('condition')
        if (cond) this.visitCondition(cond, S, F)
        const body = child('body')
        if (body) this.visitStmt(body, F, S, 0)
        return
      }
      case 'ExpressionStatement': {
        const e = child('expression')
        if (e) this.visitExpr(e, ctx)
        return
      }
      case 'VariableDeclarationStatement': {
        const decls = Array.isArray(node.declarations) ? node.declarations : []
        const declared = decls.filter(isNode)
        for (const d of declared) this.emitLocal(d, F)
        const init = child('initialValue')
        if (init) {
          this.visitExpr(init, ctx)
          const [only] = declared
          if (
            declared.length === 1 &&
            only &&
            only.storageLocation === 'storage'
          ) {
            const roots = this.valueRoots(init, F)
            for (const root of roots)
              this.facts.add('refBinding', this.declId(only.id), root)
            if (roots.length === 0) {
              this.unhandled(
                F,
                'storage reference bound to unresolved value',
                init,
              )
            }
          } else if (declared.length > 1 && init.nodeType === 'FunctionCall') {
            // `(A storage a, , B storage b) = f(...)` — bind each storage component to the call's i-th result.
            decls.forEach((d, i) => {
              if (isNode(d) && d.storageLocation === 'storage') {
                this.facts.add(
                  'refBinding',
                  this.declId(d.id),
                  this.callResultId(F, init, i),
                )
              }
            })
          }
        }
        return
      }
      case 'Return': {
        const e = child('expression')
        if (e) {
          this.visitExpr(e, ctx)
          const locations = this.returnLocations.get(F) ?? []
          const parts =
            e.nodeType === 'TupleExpression' &&
            locations.length > 1 &&
            Array.isArray(e.components)
              ? e.components
              : [e]
          parts.forEach((part, i) => {
            if (!isNode(part) || locations[i] !== 'storage') return
            for (const root of this.valueRoots(part, F))
              this.facts.add('returnsRef', F, i, root)
          })
        }
        return
      }
      case 'EmitStatement': {
        const e = child('eventCall')
        if (e) this.visitExpr(e, ctx)
        return
      }
      case 'RevertStatement': {
        const e = child('errorCall')
        if (e) this.visitExpr(e, ctx)
        return
      }
      case 'InlineAssembly':
        this.visitAssembly(node, S, F)
        return
      case 'TryStatement': {
        const call = child('externalCall')
        if (call) this.visitExpr(call, ctx)
        const clauses = Array.isArray(node.clauses)
          ? node.clauses.filter(isNode)
          : []
        clauses.forEach((clause, i) => {
          const params = clause.parameters as AstNode | undefined
          const list = Array.isArray(params?.parameters)
            ? params.parameters.filter(isNode)
            : []
          for (const p of list) this.emitLocal(p, F)
          const block = clause.block
          if (isNode(block)) this.visitStmt(block, F, S, i)
        })
        return
      }
      case 'PlaceholderStatement':
      case 'Break':
      case 'Continue':
      case 'Throw':
        return
      default:
        this.unhandled(F, `stmt:${node.nodeType}`, node)
    }
  }

  private visitCondition(expr: AstNode, X: string, F: string): void {
    this.facts.add('condition', X, this.text.slice(expr))
    this.facts.add('condShape', X, this.conditionShape(expr))
    for (const what of this.collectRefs(expr)) this.facts.add('refs', X, what)
    this.visitExpr(expr, { F, S: X })
  }

  private conditionShape(expr: AstNode): string {
    let e = expr
    while (e.nodeType === 'TupleExpression' && Array.isArray(e.components)) {
      const [first] = e.components
      if (e.components.length !== 1 || !isNode(first)) break
      e = first
    }
    if (e.nodeType === 'BinaryOperation') {
      if (e.operator === '||') return 'or'
      if (e.operator === '&&') return 'and'
    }
    if (e.nodeType === 'UnaryOperation' && e.operator === '!') return 'not'
    return 'simple'
  }

  /** Things a condition talks about: globals like msg.sender, state variables, callees. */
  private collectRefs(expr: AstNode): Set<string> {
    const out = new Set<string>()
    walk(expr, (n) => {
      if (n.nodeType === 'MemberAccess') {
        const base = n.expression
        if (
          isNode(base) &&
          base.nodeType === 'Identifier' &&
          this.isBuiltinIdentifier(base)
        ) {
          const global = `${String(base.name)}.${String(n.memberName)}`
          if (GLOBAL_REFS.has(global)) out.add(global)
        }
      } else if (n.nodeType === 'Identifier') {
        const decl = this.decls.get(n.referencedDeclaration as number)
        if (decl?.stateVariable) out.add(decl.id)
      } else if (n.nodeType === 'FunctionCall') {
        const info = this.classifyCall(n)
        if (info.calleeDecl) out.add(info.callee)
      }
      return true
    })
    return out
  }

  // ---------------------------------------------------------------------------
  // Expressions
  // ---------------------------------------------------------------------------

  private visitExpr(node: AstNode, ctx: Ctx): void {
    const child = (key: string): AstNode | undefined => {
      const value = node[key]
      return isNode(value) ? value : undefined
    }
    switch (node.nodeType) {
      case 'Assignment': {
        const lhs = child('leftHandSide')
        const rhs = child('rightHandSide')
        if (lhs) this.emitWrite(lhs, node, ctx, String(node.operator), rhs)
        if (rhs) this.visitExpr(rhs, ctx)
        return
      }
      case 'UnaryOperation': {
        const sub = child('subExpression')
        const op = String(node.operator)
        if (sub && (op === '++' || op === '--' || op === 'delete')) {
          this.emitWrite(sub, node, ctx, op)
        } else if (sub) {
          this.visitExpr(sub, ctx)
        }
        return
      }
      case 'FunctionCall':
        this.visitCall(node, ctx)
        return
      case 'Identifier': {
        const decl = this.decls.get(node.referencedDeclaration as number)
        if (decl?.stateVariable) this.facts.add('readsDirect', ctx.F, decl.id)
        return
      }
      case 'MemberAccess':
      case 'IndexAccess':
      case 'IndexRangeAccess':
      case 'BinaryOperation':
      case 'Conditional':
      case 'TupleExpression':
      case 'FunctionCallOptions':
        for (const c of childNodes(node)) this.visitExpr(c, ctx)
        return
      case 'Literal':
      case 'ElementaryTypeNameExpression':
      case 'NewExpression':
        return
      default:
        this.unhandled(ctx.F, `expr:${node.nodeType}`, node)
        for (const c of childNodes(node)) this.visitExpr(c, ctx)
    }
  }

  /** Strips index/member accesses off an lvalue or rvalue and returns the root declaration. */
  private rootOf(expr: AstNode): {
    decl?: Decl
    bare: boolean
    node: AstNode
    indexes: AstNode[]
  } {
    let node = expr
    let bare = true
    const indexes: AstNode[] = []
    for (;;) {
      if (node.nodeType === 'IndexAccess') {
        const idx = node.indexExpression
        if (isNode(idx)) indexes.push(idx)
        node = node.baseExpression as AstNode
        bare = false
      } else if (node.nodeType === 'IndexRangeAccess') {
        node = node.baseExpression as AstNode
        bare = false
      } else if (node.nodeType === 'MemberAccess') {
        node = node.expression as AstNode
        bare = false
      } else if (
        node.nodeType === 'TupleExpression' &&
        Array.isArray(node.components) &&
        node.components.length === 1 &&
        isNode(node.components[0])
      ) {
        node = node.components[0]
      } else {
        break
      }
    }
    const decl =
      node.nodeType === 'Identifier'
        ? this.decls.get(node.referencedDeclaration as number)
        : undefined
    return { decl, bare, node, indexes }
  }

  /**
   * The state variables / storage references an rvalue may be rooted in: both arms of a ternary,
   * and — for storage-typed call results such as `_find(...)` — the call's return value.
   */
  private valueRoots(expr: AstNode, F: string): string[] {
    if (expr.nodeType === 'Conditional') {
      const t = expr.trueExpression
      const f = expr.falseExpression
      return [
        ...(isNode(t) ? this.valueRoots(t, F) : []),
        ...(isNode(f) ? this.valueRoots(f, F) : []),
      ]
    }
    const root = this.rootOf(expr)
    if (root.node.nodeType === 'FunctionCall') {
      return typeIdentifierOf(root.node).includes('_storage')
        ? [this.callResultId(F, root.node, 0)]
        : []
    }
    const { decl } = root
    if (!decl || decl.nodeType !== 'VariableDeclaration') return []
    if (decl.stateVariable || decl.storageLocation === 'storage')
      return [decl.id]
    return []
  }

  private emitWrite(
    lhs: AstNode,
    site: AstNode,
    ctx: Ctx,
    op: string,
    rhs?: AstNode,
  ): void {
    if (lhs.nodeType === 'TupleExpression' && Array.isArray(lhs.components)) {
      const parts = lhs.components.filter(isNode)
      if (parts.length !== 1) {
        for (const part of parts) this.emitWrite(part, site, ctx, op)
        return
      }
    }
    const root = this.rootOf(lhs)
    for (const idx of root.indexes) this.visitExpr(idx, ctx)
    const decl = root.decl
    const W = this.site(ctx.F, site)
    if (
      !decl &&
      root.node.nodeType === 'FunctionCall' &&
      typeIdentifierOf(root.node).includes('_storage')
    ) {
      this.visitExpr(root.node, ctx) // the call itself is a call site too
      this.facts.add(
        'writeSite',
        W,
        ctx.S,
        ctx.F,
        this.callResultId(ctx.F, root.node, 0),
        op,
      )
      this.loc(W, site)
      return
    }
    if (!decl || decl.nodeType !== 'VariableDeclaration') {
      this.unhandled(ctx.F, `lvalue:${root.node.nodeType}`, lhs)
      return
    }
    if (decl.stateVariable) {
      this.facts.add('writeSite', W, ctx.S, ctx.F, decl.id, op)
      this.loc(W, site)
      if (op !== '=' && op !== 'delete')
        this.facts.add('readsDirect', ctx.F, decl.id)
      return
    }
    if (decl.storageLocation === 'storage') {
      if (root.bare && op === '=' && rhs) {
        // `d = other;` re-points the storage reference instead of writing through it.
        const targets = this.valueRoots(rhs, ctx.F)
        for (const target of targets)
          this.facts.add('refBinding', decl.id, target)
        if (targets.length === 0) {
          this.unhandled(
            ctx.F,
            'storage reference re-bound to unresolved value',
            rhs,
          )
        }
        return
      }
      this.facts.add('writeSite', W, ctx.S, ctx.F, decl.id, op)
      this.loc(W, site)
    }
    // memory/calldata/value locals: not storage, nothing to record
  }

  private classifyCall(call: AstNode): CallInfo {
    let expr = call.expression as AstNode
    if (expr.nodeType === 'FunctionCallOptions')
      expr = expr.expression as AstNode
    const callKind = String(call.kind)
    if (callKind === 'typeConversion') {
      return {
        kind: 'typeConversion',
        callee: cleanType(typeStringOf(call)),
        bound: false,
      }
    }
    if (callKind === 'structConstructorCall') {
      return {
        kind: 'structConstructor',
        callee: cleanType(typeStringOf(call)),
        bound: false,
      }
    }
    if (expr.nodeType === 'Identifier') {
      const ref = expr.referencedDeclaration as number | null | undefined
      const decl = typeof ref === 'number' ? this.decls.get(ref) : undefined
      if (this.isBuiltinIdentifier(expr)) {
        return { kind: 'builtin', callee: String(expr.name), bound: false }
      }
      if (decl?.nodeType === 'FunctionDefinition') {
        return {
          kind: 'internal',
          callee: decl.id,
          calleeDecl: decl,
          bound: false,
          calleeNode: decl.node,
        }
      }
      if (decl?.nodeType === 'EventDefinition')
        return { kind: 'emit', callee: decl.id, calleeDecl: decl, bound: false }
      if (decl?.nodeType === 'ErrorDefinition')
        return {
          kind: 'error',
          callee: decl.id,
          calleeDecl: decl,
          bound: false,
        }
      if (decl?.nodeType === 'VariableDeclaration') {
        return { kind: 'functionPointer', callee: decl.id, bound: false }
      }
      return { kind: 'unknown', callee: '', bound: false }
    }
    if (expr.nodeType === 'MemberAccess') {
      const base = expr.expression as AstNode
      const member = String(expr.memberName)
      const ref = expr.referencedDeclaration as number | null | undefined
      const decl = typeof ref === 'number' ? this.decls.get(ref) : undefined
      const baseType = typeIdentifierOf(base)
      const baseIsIdentifier = base.nodeType === 'Identifier'
      const baseRef = baseIsIdentifier
        ? (base.referencedDeclaration as number | null)
        : null
      const baseIsBuiltin = baseIsIdentifier && this.isBuiltinIdentifier(base)
      const baseDecl =
        typeof baseRef === 'number' ? this.decls.get(baseRef) : undefined
      if (decl?.nodeType === 'FunctionDefinition') {
        const ownerKind = decl.contract
          ? this.contractKind.get(decl.contract)
          : undefined
        const common = {
          callee: decl.id,
          calleeDecl: decl,
          base,
          calleeNode: decl.node,
        }
        if (ownerKind === 'library') {
          const direct = baseDecl?.nodeType === 'ContractDefinition'
          return { ...common, kind: 'library', bound: !direct }
        }
        if (
          baseIsIdentifier &&
          (base.name === 'super' || baseDecl?.nodeType === 'ContractDefinition')
        ) {
          return { ...common, kind: 'internalExplicit', bound: false }
        }
        if (baseIsIdentifier && base.name === 'this')
          return { ...common, kind: 'external', bound: false }
        if (baseType.startsWith('t_contract'))
          return { ...common, kind: 'external', bound: false }
        return { ...common, kind: 'unknown', bound: false }
      }
      if (decl?.nodeType === 'EventDefinition')
        return {
          kind: 'emit',
          callee: decl.id,
          calleeDecl: decl,
          bound: false,
          base,
        }
      if (decl?.nodeType === 'ErrorDefinition')
        return {
          kind: 'error',
          callee: decl.id,
          calleeDecl: decl,
          bound: false,
          base,
        }
      if (decl?.nodeType === 'VariableDeclaration') {
        return { kind: 'functionPointer', callee: decl.id, bound: false, base }
      }
      if (isBuiltinRef(ref) || (!decl && baseIsBuiltin)) {
        if (LOW_LEVEL_MEMBERS.has(member) && baseType.startsWith('t_address')) {
          return { kind: 'lowLevel', callee: member, bound: false, base }
        }
        if (
          (member === 'push' || member === 'pop') &&
          baseType.includes('_storage')
        ) {
          return { kind: 'arrayOp', callee: member, bound: false, base }
        }
        if (baseIsBuiltin) {
          return {
            kind: 'builtin',
            callee: `${String(base.name)}.${member}`,
            bound: false,
            base,
          }
        }
        return { kind: 'builtin', callee: member, bound: false, base }
      }
      return { kind: 'unknown', callee: '', bound: false, base }
    }
    if (expr.nodeType === 'NewExpression') {
      const typeName = expr.typeName as AstNode | undefined
      return {
        kind: 'new',
        callee: cleanType(typeStringOf(typeName)),
        bound: false,
      }
    }
    return { kind: 'unknown', callee: '', bound: false }
  }

  private visitCall(call: AstNode, ctx: Ctx): void {
    const info = this.classifyCall(call)
    const K = this.site(ctx.F, call)
    this.facts.add(
      'callSite',
      K,
      ctx.S,
      ctx.F,
      info.kind,
      info.callee,
      this.text.slice(call),
    )
    this.loc(K, call)
    if (info.kind === 'unknown') this.unhandled(ctx.F, 'call:unresolved', call)

    const args = Array.isArray(call.arguments)
      ? call.arguments.filter(isNode)
      : []
    if (
      info.kind === 'builtin' &&
      (info.callee === 'require' || info.callee === 'assert')
    ) {
      const [cond] = args
      if (cond) {
        this.facts.add('condition', K, this.text.slice(cond))
        this.facts.add('condShape', K, this.conditionShape(cond))
        for (const what of this.collectRefs(cond))
          this.facts.add('refs', K, what)
      }
    }
    if (info.kind === 'arrayOp' && info.base) {
      this.emitWrite(info.base, call, ctx, info.callee)
    } else if (info.base) {
      this.visitExpr(info.base, ctx)
    }

    // Argument → parameter bindings for state variables / storage references.
    const paramNames = info.calleeNode
      ? this.paramNodes(info.calleeNode).map((p) => String(p.name))
      : []
    const names = Array.isArray(call.names) ? (call.names as string[]) : []
    const offset = info.bound ? 1 : 0
    if (info.bound && info.base) {
      for (const receiver of this.valueRoots(info.base, ctx.F)) {
        this.facts.add('argBinding', K, 0, receiver)
      }
    }
    args.forEach((arg, i) => {
      this.visitExpr(arg, ctx)
      let index = i + offset
      if (names.length > 0 && paramNames.length > 0) {
        const named = paramNames.indexOf(names[i] ?? '')
        if (named >= 0) index = named
      }
      for (const root of this.valueRoots(arg, ctx.F))
        this.facts.add('argBinding', K, index, root)
    })

    const options = call.expression as AstNode
    if (
      options.nodeType === 'FunctionCallOptions' &&
      Array.isArray(options.options)
    ) {
      for (const o of options.options.filter(isNode)) this.visitExpr(o, ctx)
    }
  }

  // ---------------------------------------------------------------------------
  // Inline assembly (Yul)
  // ---------------------------------------------------------------------------

  private visitAssembly(node: AstNode, A: string, F: string): void {
    const yul = node.AST
    this.facts.add('assembly', A, F, isNode(yul) ? 1 : 0)
    if (!isNode(yul)) {
      this.unhandled(F, 'InlineAssembly without Yul AST', node)
      return
    }
    const yulNameBySrc = new Map<string, string>()
    walk(yul, (y) => {
      if (y.nodeType === 'YulIdentifier')
        yulNameBySrc.set(y.src, String(y.name))
      return true
    })
    const refs = Array.isArray(node.externalReferences)
      ? node.externalReferences
      : []
    for (const ref of refs as Array<Record<string, unknown>>) {
      const src = String(ref.src)
      const name = yulNameBySrc.get(src) ?? '?'
      const kind =
        typeof ref.suffix === 'string'
          ? ref.suffix
          : ref.isSlot
            ? 'slot'
            : ref.isOffset
              ? 'offset'
              : 'value'
      this.facts.add('asmExtRef', A, name, this.declId(ref.declaration), kind)
    }
    walk(yul, (y) => {
      if (y.nodeType === 'YulFunctionCall') {
        const fn = y.functionName as AstNode | undefined
        if (typeof fn?.name === 'string' && OPAQUE_YUL_CALLS.has(fn.name)) {
          const K = this.site(F, y)
          this.facts.add('asmCall', K, A, fn.name)
          this.loc(K, y)
        }
        if (fn?.name === 'sstore') {
          const args = Array.isArray(y.arguments)
            ? y.arguments.filter(isNode)
            : []
          const [slot] = args
          const [kind, text] = slot ? this.yulOperand(slot) : ['expr', '?']
          const K = this.site(F, y)
          this.facts.add(
            'asmSstore',
            K,
            A,
            kind,
            text,
            kind === 'literal' ? smallNumber(text) : -1,
          )
          this.loc(K, y)
        }
      } else if (
        y.nodeType === 'YulVariableDeclaration' ||
        y.nodeType === 'YulAssignment'
      ) {
        const vars = (
          y.nodeType === 'YulVariableDeclaration'
            ? y.variables
            : y.variableNames
        ) as unknown
        const value = y.value
        if (
          Array.isArray(vars) &&
          vars.length === 1 &&
          isNode(vars[0]) &&
          isNode(value)
        ) {
          const [kind, text] = this.yulOperand(value)
          this.facts.add('asmLet', A, String(vars[0].name), kind, text)
        }
      }
      return true
    })
  }

  private yulOperand(y: AstNode): [string, string] {
    if (y.nodeType === 'YulLiteral') {
      const value = String(y.value ?? y.hexValue ?? '')
      if (y.kind === 'number') {
        try {
          return ['literal', BigInt(value).toString()]
        } catch {
          return ['literal', value]
        }
      }
      return ['literal', value]
    }
    if (y.nodeType === 'YulIdentifier') return ['ident', String(y.name)]
    return ['expr', this.text.slice(y)]
  }

  // ---------------------------------------------------------------------------
  // Storage layout
  // ---------------------------------------------------------------------------

  private emitStorageLayout(): void {
    const contracts = this.input.output.contracts?.[this.input.fileName] ?? {}
    for (const [name, contract] of Object.entries(contracts)) {
      const layout = contract.storageLayout
      if (!layout) continue
      const C = `${this.input.unit}:${name}`
      for (const entry of layout.storage) {
        const decl = this.decls.get(entry.astId)
        this.facts.add(
          'storageSlot',
          C,
          decl?.id ?? `?${entry.label}`,
          Number(entry.slot),
          entry.offset,
        )
      }
    }
  }
}
