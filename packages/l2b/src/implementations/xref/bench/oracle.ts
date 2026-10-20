import type { IProvider } from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import {
  type FlatEntry,
  type FlatWorkspace,
  isProxySource,
} from '../FlatWorkspace'
import { evaluateAddress } from './evaluateAddress'
import type {
  ContractNode,
  ExpressionNode,
  FunctionNode,
  SolcAst,
  VariableNode,
} from './SolcAst'
import { sourceRange } from './SolcAst'
import type { SolcNode, StorageSlot } from './solc'

export type CallKind =
  | 'internal'
  | 'super'
  | 'library'
  | 'static'
  | 'external'
  | 'reference'

export interface TruthTarget {
  path: string
  start: number
  end: number
}

export type Truth =
  | { kind: 'known'; targets: TruthTarget[] }
  | { kind: 'outside'; address: ChainSpecificAddress }
  | { kind: 'dynamic'; reason: string }
  | { kind: 'unknown'; reason: string }

export interface OracleSite {
  path: string
  offset: number
  call: CallKind
  truth: Truth
}

export interface CompiledSource {
  path: string
  ast: SolcAst
  storage: Map<string, StorageSlot[]>
}

export interface Oracle {
  workspace: FlatWorkspace
  compiled(path: string): Promise<CompiledSource | undefined>
  provider(address: ChainSpecificAddress): Promise<IProvider>
}

export async function oracleSites(
  oracle: Oracle,
  entry: FlatEntry,
  source: CompiledSource,
): Promise<OracleSite[]> {
  const sites: OracleSite[] = []
  for (const call of source.ast.all('FunctionCall') as ExpressionNode[]) {
    if (call.kind !== 'functionCall' || call.expression === undefined) {
      continue
    }
    const caller = source.ast.enclosing<ContractNode>(
      call,
      'ContractDefinition',
    )
    // Code of contracts the flat declares but does not deploy never runs here.
    if (
      caller === undefined ||
      (caller.contractKind !== 'library' &&
        deployedContract(source.ast, caller) !== source.ast.mainContract)
    ) {
      continue
    }
    const site = await classifyCall(oracle, entry, source, caller, call)
    if (site !== undefined) {
      sites.push(site)
    }
  }
  sites.push(...referenceSites(source))
  return sites
}

const REFERENCE_NODES = [
  'Identifier',
  'MemberAccess',
  'IdentifierPath',
  'UserDefinedTypeName',
]
const REFERENCED_DECLARATIONS = [
  'VariableDeclaration',
  'EnumValue',
  'EnumDefinition',
  'StructDefinition',
  'ContractDefinition',
  'EventDefinition',
  'ErrorDefinition',
  'UserDefinedValueTypeDefinition',
  'FunctionDefinition',
]

// A function named without a call, like a function pointer, is virtual too.
function referenceTruth(
  source: CompiledSource,
  node: ExpressionNode,
  declaration: SolcNode,
): Truth {
  const caller = source.ast.enclosing<ContractNode>(node, 'ContractDefinition')
  if (
    node.nodeType === 'Identifier' &&
    declaration.nodeType === 'FunctionDefinition' &&
    caller !== undefined
  ) {
    return dispatch(source, declaration as FunctionNode, caller)
  }
  return known(source, [declaration])
}

function referenceSites(source: CompiledSource): OracleSite[] {
  const { ast, path } = source
  const sites: OracleSite[] = []
  for (const nodeType of REFERENCE_NODES) {
    for (const node of ast.all(nodeType) as ExpressionNode[]) {
      const declaration = ast.node(node.referencedDeclaration)
      if (
        declaration === undefined ||
        !REFERENCED_DECLARATIONS.includes(declaration.nodeType) ||
        ast.parent(node)?.nodeType === 'UserDefinedTypeName' ||
        isCallee(ast, node, declaration)
      ) {
        continue
      }
      sites.push({
        path,
        offset: referenceOffset(ast, node),
        call: 'reference',
        truth: referenceTruth(source, node, declaration),
      })
    }
  }
  return sites
}

// Calls, getter calls like `token.owner()` included, are scored apart.
function isCallee(
  ast: SolcAst,
  node: ExpressionNode,
  declaration: SolcNode,
): boolean {
  const calledByName =
    node.nodeType === 'Identifier' &&
    declaration.nodeType === 'FunctionDefinition'
  if (node.nodeType !== 'MemberAccess' && !calledByName) {
    return false
  }
  let callee: ExpressionNode = node
  let parent = ast.parent(node) as ExpressionNode | undefined
  if (parent?.nodeType === 'FunctionCallOptions') {
    callee = parent
    parent = ast.parent(parent) as ExpressionNode | undefined
  }
  // Before 0.7 options were calls of their own: `t.deposit.value(1)()`.
  while (isLegacyOption(parent)) {
    const options = ast.parent(parent) as ExpressionNode | undefined
    if (options?.nodeType !== 'FunctionCall') {
      break
    }
    callee = options
    parent = ast.parent(options) as ExpressionNode | undefined
  }
  return (
    parent?.nodeType === 'FunctionCall' &&
    parent.kind === 'functionCall' &&
    parent.expression === callee
  )
}

function isLegacyOption(
  node: ExpressionNode | undefined,
): node is ExpressionNode {
  return (
    node?.nodeType === 'MemberAccess' &&
    (node.memberName === 'value' || node.memberName === 'gas')
  )
}

function referenceOffset(ast: SolcAst, node: ExpressionNode): number {
  const named = node as ExpressionNode & {
    pathNode?: { name?: string }
    namePath?: string
  }
  const name =
    named.memberName ??
    named.name ??
    named.pathNode?.name ??
    named.namePath ??
    ''
  const last = name.slice(name.lastIndexOf('.') + 1)
  const [byteStart, byteLength] = sourceRange(node)
  if (node.nodeType === 'Identifier') {
    return ast.character(byteStart)
  }
  return ast.character(byteStart + byteLength - Buffer.byteLength(last))
}

async function classifyCall(
  oracle: Oracle,
  entry: FlatEntry,
  source: CompiledSource,
  caller: ContractNode,
  call: ExpressionNode,
): Promise<OracleSite | undefined> {
  const { ast, path } = source
  const callee = unwrapOptions(call.expression as ExpressionNode)
  const declaration = ast.node(callee.referencedDeclaration)
  if (callee.nodeType === 'Identifier') {
    if (declaration?.nodeType !== 'FunctionDefinition') {
      return undefined
    }
    const offset = ast.character(sourceRange(callee)[0])
    const truth = dispatch(source, declaration as FunctionNode, caller)
    return { path, offset, call: 'internal', truth }
  }
  if (callee.nodeType !== 'MemberAccess' || !isCallable(declaration)) {
    return undefined
  }
  const offset = memberOffset(ast, callee)
  const receiver = callee.expression?.typeDescriptions?.typeIdentifier ?? ''
  const owner = ast.parent(declaration) as ContractNode | undefined
  if (receiver.includes('t_super')) {
    const truth = superDispatch(source, declaration as FunctionNode, caller)
    return { path, offset, call: 'super', truth }
  }
  if (owner?.contractKind === 'library') {
    return {
      path,
      offset,
      call: 'library',
      truth: known(source, [declaration]),
    }
  }
  if (receiver.startsWith('t_type$_t_contract')) {
    return { path, offset, call: 'static', truth: known(source, [declaration]) }
  }
  if (!receiver.startsWith('t_contract')) {
    return undefined
  }
  const selector = selectorOf(declaration as FunctionNode | VariableNode)
  if (selector === undefined) {
    return { path, offset, call: 'external', truth: unknown('no selector') }
  }
  // A constructor ran once at deployment, against state long gone.
  const fn = ast.enclosing<FunctionNode>(call, 'FunctionDefinition')
  if (fn?.kind === 'constructor') {
    return { path, offset, call: 'external', truth: unknown('constructor') }
  }
  const context = { oracle, entry, source, caller, call }
  const evaluated = await evaluateAddress(
    context,
    callee.expression as ExpressionNode,
  )
  const truth =
    evaluated.kind === 'address'
      ? await targetTruth(oracle, evaluated.address, selector)
      : evaluated
  return { path, offset, call: 'external', truth }
}

function dispatch(
  source: CompiledSource,
  fn: FunctionNode,
  caller: ContractNode,
): Truth {
  const owner = source.ast.parent(fn) as ContractNode | undefined
  // Private functions cannot be overridden.
  if (
    owner?.nodeType !== 'ContractDefinition' ||
    owner.contractKind === 'library' ||
    fn.visibility === 'private'
  ) {
    return known(source, [fn])
  }
  const deployed = deployedContract(source.ast, caller)
  for (const id of deployed.linearizedBaseContracts) {
    // Before 0.6 overriding is implicit, so the AST has no base functions:
    // an equal signature further down the linearization is the override.
    const found = implementedFunctions(source.ast, id).find(
      (candidate) =>
        candidate.id === fn.id ||
        overrides(source.ast, candidate, fn.id) ||
        signatureOf(candidate) === signatureOf(fn),
    )
    if (found !== undefined) {
      return known(source, [found])
    }
  }
  return unknown('no implementation')
}

// `super` follows the linearization of the deployed contract, which can put
// contracts between the caller and the base the compiler names statically.
function superDispatch(
  source: CompiledSource,
  fn: FunctionNode,
  caller: ContractNode,
): Truth {
  const lineage = deployedContract(source.ast, caller).linearizedBaseContracts
  const signature = signatureOf(fn)
  for (const id of lineage.slice(lineage.indexOf(caller.id) + 1)) {
    const found = implementedFunctions(source.ast, id).find(
      (candidate) => signatureOf(candidate) === signature,
    )
    if (found !== undefined) {
      return known(source, [found])
    }
  }
  return unknown('no super implementation')
}

async function targetTruth(
  oracle: Oracle,
  address: ChainSpecificAddress,
  selector: string,
): Promise<Truth> {
  const entry = oracle.workspace.entryAt(address)
  if (entry === undefined || entry.sourcePaths.length === 0) {
    return { kind: 'outside', address }
  }
  const targets: TruthTarget[] = []
  for (const path of entry.sourcePaths) {
    if (isProxySource(path) && targets.length > 0) {
      break
    }
    const compiled = await oracle.compiled(path)
    if (compiled === undefined) {
      return unknown('target does not compile')
    }
    const found = findBySelector(compiled.ast, selector)
    if (found !== undefined) {
      targets.push(toTarget(compiled, found))
    }
  }
  return targets.length > 0
    ? { kind: 'known', targets }
    : unknown('selector not in target')
}

function findBySelector(ast: SolcAst, selector: string): SolcNode | undefined {
  for (const id of ast.mainContract?.linearizedBaseContracts ?? []) {
    const contract = ast.node<ContractNode>(id)
    const found = contract?.nodes.find((node) => {
      if (node.nodeType === 'VariableDeclaration') {
        return selectorOf(node as VariableNode) === selector
      }
      const fn = node as FunctionNode
      return (
        node.nodeType === 'FunctionDefinition' &&
        fn.implemented &&
        selectorOf(fn) === selector
      )
    })
    if (found !== undefined) {
      return found
    }
  }
  return undefined
}

export function deployedContract(
  ast: SolcAst,
  caller: ContractNode,
): ContractNode {
  const main = ast.mainContract
  if (main?.linearizedBaseContracts.includes(caller.id)) {
    return main
  }
  return caller
}

function implementedFunctions(
  ast: SolcAst,
  contractId: number,
): FunctionNode[] {
  const contract = ast.node<ContractNode>(contractId)
  return (contract?.nodes ?? []).filter(
    (node): node is FunctionNode =>
      node.nodeType === 'FunctionDefinition' &&
      (node as FunctionNode).implemented,
  )
}

function overrides(ast: SolcAst, fn: FunctionNode, baseId: number): boolean {
  const visited = new Set<number>()
  const stack = [...(fn.baseFunctions ?? [])]
  while (stack.length > 0) {
    const id = stack.pop()
    if (id === undefined || visited.has(id)) {
      continue
    }
    if (id === baseId) {
      return true
    }
    visited.add(id)
    stack.push(...(ast.node<FunctionNode>(id)?.baseFunctions ?? []))
  }
  return false
}

function signatureOf(fn: FunctionNode): string {
  const types = fn.parameters.parameters.map((p) =>
    (p.typeDescriptions.typeString ?? '')
      .split(' ')
      .filter((w) => w !== 'memory' && w !== 'calldata' && w !== 'storage')
      .join(' '),
  )
  return `${fn.name}(${types.join(',')})`
}

// Compilers before 0.6 do not put selectors in the AST.
export function selectorOf(
  declaration: FunctionNode | VariableNode,
): string | undefined {
  if (declaration.functionSelector !== undefined) {
    return declaration.functionSelector
  }
  if (
    declaration.visibility !== 'public' &&
    declaration.visibility !== 'external'
  ) {
    return undefined
  }
  const parameters =
    declaration.nodeType === 'FunctionDefinition'
      ? (declaration as FunctionNode).parameters.parameters
      : []
  if (declaration.nodeType === 'VariableDeclaration') {
    const type = (declaration as VariableNode).typeDescriptions.typeString ?? ''
    if (type.startsWith('mapping') || type.includes('[')) {
      return undefined
    }
  }
  const types = parameters.map((p) =>
    canonicalType(p.typeDescriptions.typeString ?? ''),
  )
  if (types.some((t) => t === undefined)) {
    return undefined
  }
  return utils.id(`${declaration.name}(${types.join(',')})`).slice(2, 10)
}

function canonicalType(typeString: string): string | undefined {
  const ignored = ['memory', 'calldata', 'storage', 'pointer', 'ref', 'payable']
  const words = typeString.split(' ').filter((w) => !ignored.includes(w))
  const [kind, name] = words
  if (kind === 'struct' || kind === 'mapping' || kind === 'function') {
    return undefined
  }
  if (kind === 'contract' || kind === 'enum') {
    const suffix = name?.includes('[') ? name.slice(name.indexOf('[')) : ''
    return (kind === 'contract' ? 'address' : 'uint8') + suffix
  }
  return words.join(' ')
}

function memberOffset(ast: SolcAst, access: ExpressionNode): number {
  const [byteStart, byteLength] = sourceRange(access)
  const memberLength = Buffer.byteLength(access.memberName ?? '')
  return ast.character(byteStart + byteLength - memberLength)
}

function isCallable(node: SolcNode | undefined): node is SolcNode {
  return (
    node?.nodeType === 'FunctionDefinition' ||
    node?.nodeType === 'VariableDeclaration'
  )
}

export function unwrapOptions(expression: ExpressionNode): ExpressionNode {
  if (expression.nodeType === 'FunctionCallOptions' && expression.expression) {
    return expression.expression
  }
  return expression
}

function known(source: CompiledSource, nodes: SolcNode[]): Truth {
  return { kind: 'known', targets: nodes.map((n) => toTarget(source, n)) }
}

function toTarget(source: CompiledSource, node: SolcNode): TruthTarget {
  const [start, end] = source.ast.characterRange(node)
  return { path: source.path, start, end }
}

export function unknown(reason: string): Truth {
  return { kind: 'unknown', reason }
}
