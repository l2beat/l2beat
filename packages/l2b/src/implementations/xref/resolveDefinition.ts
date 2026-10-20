import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import type {
  ArrayTypeName,
  BaseASTNode,
  EnumDefinition,
  FunctionCall,
  FunctionDefinition,
  Identifier,
  Mapping,
  MemberAccess,
  ModifierInvocation,
  TypeName,
  UserDefinedTypeName,
  UsingForDeclaration,
  VariableDeclaration,
} from '@mradomski/fast-solidity-parser'
import { abiHasFunction, parseAbiFunction } from './abi'
import {
  type FlatEntry,
  type FlatWorkspace,
  isProxySource,
} from './FlatWorkspace'
import {
  contractName,
  evaluateReceiver,
  type Receiver,
  type ReceiverContext,
  structField,
  unwrapCallOptions,
} from './receiver'
import {
  acceptsArguments,
  declarationName,
  NUMBER_LITERAL,
  parameterSignature,
  type SourceIndex,
  type TextPosition,
  typeKey,
} from './SourceIndex'
import { type Declaration, resolveName, scopeAt } from './scope'

export type Resolution = 'discovered-value' | 'abi-match' | 'in-file'

export interface Definition {
  path: string
  position: TextPosition
  label: string
  resolution: Resolution
  // Every contract that runs this exact code, e.g. many proxies of one kind.
  entries: FlatEntry[]
  declaration: BaseASTNode
  // Identical declarations folded into this one, e.g. the same library code
  // in each implementation file of a proxy.
  copies: DeclarationLocation[]
}

export interface DeclarationLocation {
  path: string
  start: number
}

export interface DefinitionResult {
  symbol: string
  receiver: Receiver | undefined
  definitions: Definition[]
}

export function resolveDefinition(
  workspace: FlatWorkspace,
  path: string,
  offset: number,
): DefinitionResult {
  const index = workspace.source(path)
  const declaration = declarationAt(index, offset)
  if (declaration !== undefined) {
    const definitions = [declaration]
    return { symbol: declaration.label, receiver: undefined, definitions }
  }
  const ancestors = index.pathAt(offset)
  const node = ancestors[ancestors.length - 1]
  const parent = ancestors[ancestors.length - 2]
  if (isNamedArgument(parent, node)) {
    return resolveNamedArgument(workspace, path, parent as FunctionCall, node)
  }
  return resolveNode(workspace, path, offset)
}

// The cursor on a declaration's own name.
export function declarationAt(
  index: SourceIndex,
  offset: number,
): Definition | undefined {
  const ancestors = index.pathAt(offset)
  const node = ancestors[ancestors.length - 1]
  const parent = ancestors[ancestors.length - 2]
  if (node === undefined) {
    return undefined
  }
  const variable = parent as VariableDeclaration | undefined
  if (parent?.type === 'VariableDeclaration' && variable?.identifier === node) {
    return inFileDefinition(index, parent, variable.name ?? '')
  }
  const name =
    node.type === 'EnumValue'
      ? (node as unknown as { name: string }).name
      : declarationName(node)
  if (name === undefined) {
    return undefined
  }
  const definition = inFileDefinition(index, node, name)
  const start = index.offsetOf(definition.position)
  if (offset < start || offset >= start + name.length) {
    return undefined
  }
  return definition
}

function resolveNode(
  workspace: FlatWorkspace,
  path: string,
  offset: number,
): DefinitionResult {
  const index = workspace.source(path)
  const entry = workspace.entryOfPath(path)
  assert(entry !== undefined, 'Flat file is not part of the discovery')
  const ancestors = index.pathAt(offset)
  const node = ancestors[ancestors.length - 1]
  assert(node !== undefined)
  const context = { workspace, scope: scopeAt(index, ancestors, offset), entry }

  const call = callOf(ancestors)
  if (node.type === 'MemberAccess') {
    const selector = isSelectorOf(ancestors[ancestors.length - 2], node)
      ? resolveSelector(context, node as MemberAccess)
      : undefined
    return selector ?? resolveMember(context, node as MemberAccess, call)
  }
  if (node.type === 'Identifier') {
    const name = (node as Identifier).name
    const declaration = resolveName(context.scope, name, call?.arguments.length)
    const result = inFileResult(index, name, declaration)
    const keys = call ? argumentTypes(context, call) : undefined
    return { ...result, definitions: pickOverloads(result.definitions, keys) }
  }
  if (node.type === 'UserDefinedTypeName') {
    return resolveTypeName(context, node as UserDefinedTypeName, offset)
  }
  if (node.type === 'ModifierInvocation') {
    const name = (node as ModifierInvocation).name
    return inFileResult(
      index,
      name,
      resolveName(context.scope, name, undefined),
    )
  }
  // The parser keeps `using Lib for T`'s library as a string without a range.
  const library = (node as UsingForDeclaration).libraryName
  if (node.type === 'UsingForDeclaration' && library) {
    return inFileResult(
      index,
      library,
      resolveName(context.scope, library, undefined),
    )
  }
  return { symbol: '', receiver: undefined, definitions: [] }
}

function isSelectorOf(
  parent: BaseASTNode | undefined,
  node: BaseASTNode,
): boolean {
  const access = parent as MemberAccess | undefined
  return (
    access?.type === 'MemberAccess' &&
    access.memberName === 'selector' &&
    access.expression === node
  )
}

// `token.transfer.selector` calls nothing, it names the function of the type.
function resolveSelector(
  context: ReceiverContext,
  access: MemberAccess,
): DefinitionResult | undefined {
  const { index } = context.scope
  const receiver = evaluateReceiver(context, access.expression)
  const typeName = receiver.staticContract ?? contractName(receiver.type)
  if (typeName === undefined || !index.contracts.has(typeName)) {
    return undefined
  }
  return {
    symbol: `${sourceText(index, access.expression)}.${access.memberName}`,
    receiver,
    definitions: memberDefinitions(
      index,
      typeName,
      access.memberName,
      undefined,
    ),
  }
}

// `f({ amount: x })`: the label names a parameter of whatever `f` resolves to,
// or a field when `f` is a struct, or an event or error parameter.
function resolveNamedArgument(
  workspace: FlatWorkspace,
  path: string,
  call: FunctionCall,
  label: Identifier,
): DefinitionResult {
  const offset = calleeOffset(call)
  const callee =
    offset === undefined
      ? { symbol: '', receiver: undefined, definitions: [] }
      : resolveNode(workspace, path, offset)
  const definitions = callee.definitions.flatMap((definition) => {
    const parameter = namedParameter(definition.declaration, label.name)
    if (parameter === undefined) {
      return []
    }
    const index = workspace.source(definition.path)
    return [
      {
        ...definition,
        ...inFileDefinition(index, parameter, label.name),
        label: `${definition.label}.${label.name}`,
        resolution: definition.resolution,
        entries: definition.entries,
      },
    ]
  })
  return { ...callee, symbol: `${callee.symbol}.${label.name}`, definitions }
}

function isNamedArgument(
  parent: BaseASTNode | undefined,
  node: BaseASTNode | undefined,
): node is Identifier {
  if (parent?.type !== 'FunctionCall' || node?.type !== 'Identifier') {
    return false
  }
  return (parent as FunctionCall).identifiers.includes(node as Identifier)
}

function namedParameter(
  declaration: BaseASTNode,
  name: string,
): BaseASTNode | undefined {
  const holder = declaration as {
    parameters?: VariableDeclaration[] | null
    members?: VariableDeclaration[]
  }
  const candidates =
    declaration.type === 'StructDefinition' ? holder.members : holder.parameters
  return candidates?.find((p) => p.name === name)
}

export function calleeOffset(call: FunctionCall): number | undefined {
  const callee = unwrapCallOptions(call.expression)
  if (callee.range === undefined) {
    return undefined
  }
  if (callee.type === 'MemberAccess') {
    return callee.range[1] - (callee as MemberAccess).memberName.length + 1
  }
  if (callee.type === 'Identifier') {
    return callee.range[0]
  }
  return undefined
}

function resolveTypeName(
  context: ReceiverContext,
  type: UserDefinedTypeName,
  offset: number,
): DefinitionResult {
  const { index, contract } = context.scope
  const path = type.namePath
  const dot = path.indexOf('.')
  assert(type.range !== undefined)
  if (dot === -1 || offset < type.range[0] + dot) {
    const name = dot === -1 ? path : path.slice(0, dot)
    return inFileResult(
      index,
      name,
      resolveName(context.scope, name, undefined),
    )
  }
  const node = index.findType(path, contract)
  const name = path.slice(path.lastIndexOf('.') + 1)
  const definitions = node
    ? [{ ...inFileDefinition(index, node, name), label: path }]
    : []
  return { symbol: path, receiver: undefined, definitions }
}

function resolveMember(
  context: ReceiverContext,
  access: MemberAccess,
  call: FunctionCall | undefined,
): DefinitionResult {
  const { workspace, scope } = context
  const member = access.memberName
  const arity = call?.arguments.length
  const receiver = evaluateReceiver(context, access.expression)
  const symbol = `${sourceText(scope.index, access.expression)}.${member}`
  const keys = call ? argumentTypes(context, call) : undefined
  const result = (definitions: Definition[]) => ({
    symbol,
    receiver,
    definitions: pickOverloads(definitions, keys),
  })

  if (receiver.staticContract !== undefined) {
    return result(
      staticDefinitions(context, receiver.staticContract, member, arity),
    )
  }
  const field = structField(scope, receiver.type, member)
  if (field !== undefined && call === undefined) {
    const struct = contractName(receiver.type)
    const definition = inFileDefinition(scope.index, field, member)
    return result([{ ...definition, label: `${struct}.${member}` }])
  }
  const typeName = contractName(receiver.type)
  const declaredOnType =
    typeName !== undefined && declaresMember(scope.index, typeName, member)
  if (!declaredOnType) {
    const library = libraryDefinitions(context, member, call, receiver)
    if (library.length > 0) {
      return { symbol, receiver, definitions: library }
    }
  }
  const target = receiver.address
    ? workspace.entryAt(receiver.address)
    : undefined
  if (target !== undefined) {
    const found = definitionsInEntry(
      workspace,
      target,
      member,
      arity,
      'discovered-value',
    )
    if (found.length > 0) {
      return result(found)
    }
  }
  if (typeName === undefined) {
    return result([])
  }
  // A known address that is not in the project is not a hint to guess by ABI.
  if (receiver.address === undefined) {
    const matched = abiMatchDefinitions(context, typeName, member, arity)
    if (matched.length > 0) {
      return result(matched)
    }
  }
  return result(memberDefinitions(scope.index, typeName, member, arity))
}

export function definitionsInEntry(
  workspace: FlatWorkspace,
  entry: FlatEntry,
  member: string,
  arity: number | undefined,
  resolution: Resolution,
  reach: 'external' | 'all' = 'external',
): Definition[] {
  const lookup = reach === 'external' ? externalMembers : memberDefinitions
  const definitions: Definition[] = []
  for (const path of entry.sourcePaths) {
    if (isProxySource(path) && definitions.length > 0) {
      break
    }
    const index = workspace.source(path)
    const main = index.mainContract?.node.name
    if (main === undefined) {
      continue
    }
    for (const definition of lookup(index, main, member, arity)) {
      definitions.push({ ...definition, resolution, entries: [entry] })
    }
  }
  return mergeIdentical(workspace, definitions)
}

function mergeIdentical(
  workspace: FlatWorkspace,
  definitions: Definition[],
): Definition[] {
  const byCode = new Map<string, Definition>()
  for (const definition of definitions) {
    const index = workspace.source(definition.path)
    const key = `${definition.label}\n${nodeText(index, definition.declaration)}`
    const existing = byCode.get(key)
    if (existing === undefined) {
      byCode.set(key, {
        ...definition,
        entries: [...definition.entries],
        copies: [...definition.copies],
      })
      continue
    }
    const start = definition.declaration.range?.[0]
    assert(start !== undefined)
    existing.copies.push({ path: definition.path, start }, ...definition.copies)
    for (const entry of definition.entries) {
      if (!existing.entries.includes(entry)) {
        existing.entries.push(entry)
      }
    }
  }
  return [...byCode.values()]
}

function abiMatchDefinitions(
  context: ReceiverContext,
  typeName: string,
  member: string,
  arity: number | undefined,
): Definition[] {
  const { workspace, scope } = context
  const interfaceFunctions = scope.index
    .members(typeName)
    .filter((node): node is FunctionDefinition => {
      const name = (node as FunctionDefinition).name
      // Optimism interfaces declare their constructor as a function.
      return (
        node.type === 'FunctionDefinition' &&
        name !== null &&
        name !== '' &&
        name !== '__constructor__'
      )
    })
    .map((fn) => ({ name: fn.name ?? '', arity: fn.parameters.length }))
  let scoreMax = 0
  let candidates: FlatEntry[] = []
  // A contract can only call contracts on its own chain.
  const chain = ChainSpecificAddress.chain(context.entry.address)
  for (const entry of workspace.entries) {
    if (
      entry.type !== 'Contract' ||
      entry.sourcePaths.length === 0 ||
      ChainSpecificAddress.chain(entry.address) !== chain
    ) {
      continue
    }
    const functions = entry.abi.flatMap((s) => parseAbiFunction(s) ?? [])
    if (!abiHasFunction(functions, member, arity)) {
      continue
    }
    const shared = interfaceFunctions.filter((f) =>
      abiHasFunction(functions, f.name, f.arity),
    )
    const nominal = inheritsFrom(workspace, entry, typeName)
    // The flattener prunes interfaces to used members, so a structural match
    // has to expose all of them. Declaring the interface outranks both.
    if (!nominal && shared.length < interfaceFunctions.length) {
      continue
    }
    const score = (nominal ? NOMINAL_SCORE : 0) + shared.length
    if (score > scoreMax) {
      scoreMax = score
      candidates = []
    }
    if (score === scoreMax) {
      candidates.push(entry)
    }
  }
  const definitions = candidates.flatMap((entry) =>
    definitionsInEntry(workspace, entry, member, arity, 'abi-match'),
  )
  return mergeIdentical(workspace, definitions)
}

const NOMINAL_SCORE = 1_000_000

function inheritsFrom(
  workspace: FlatWorkspace,
  entry: FlatEntry,
  typeName: string,
): boolean {
  return entry.sourcePaths.some((path) =>
    workspace.source(path).mainContract?.linearization.includes(typeName),
  )
}

function staticDefinitions(
  context: ReceiverContext,
  staticContract: string,
  member: string,
  arity: number | undefined,
): Definition[] {
  const { index, contract } = context.scope
  if (staticContract !== 'super') {
    const found = memberDefinitions(index, staticContract, member, arity)
    if (found.length > 0) {
      return found
    }
    // By name, internal constants and enum values are reachable too, not
    // only what has a public getter.
    const named =
      index.findStateVariable(staticContract, member) ??
      enumValue(index.findType(staticContract, contract), member)
    if (named === undefined) {
      return []
    }
    const label = `${staticContract}.${member}`
    return [{ ...inFileDefinition(index, named, member), label }]
  }
  if (contract === undefined) {
    return []
  }
  const lineage =
    index.contracts.get(index.dispatchContract(contract))?.linearization ?? []
  // Per overload, the nearest base implementing it.
  const bySignature = new Map<string, FunctionDefinition>()
  for (const base of lineage.slice(lineage.indexOf(contract) + 1)) {
    for (const node of index.contracts.get(base)?.node.subNodes ?? []) {
      if (!isImplementation(node, member, arity)) {
        continue
      }
      const fn = node as FunctionDefinition
      const signature = parameterSignature(fn)
      if (!bySignature.has(signature)) {
        bySignature.set(signature, fn)
      }
    }
  }
  return [...bySignature.values()].map((fn) =>
    inFileDefinition(index, fn, member),
  )
}

function enumValue(
  type: BaseASTNode | undefined,
  member: string,
): BaseASTNode | undefined {
  if (type?.type !== 'EnumDefinition') {
    return undefined
  }
  return (type as EnumDefinition).members.find((value) => value.name === member)
}

function isImplementation(
  node: BaseASTNode,
  member: string,
  arity: number | undefined,
): boolean {
  if (node.type !== 'FunctionDefinition') {
    return false
  }
  const fn = node as FunctionDefinition
  if (fn.name !== member || fn.body === null) {
    return false
  }
  return arity === undefined || fn.parameters.length === arity
}

function libraryDefinitions(
  context: ReceiverContext,
  member: string,
  call: FunctionCall | undefined,
  receiver: Receiver,
): Definition[] {
  const { index, contract } = context.scope
  if (contract === undefined) {
    return []
  }
  const receiverKey = typeKey(receiver.type)
  const candidates = index
    .boundFunctions(contract, receiverKey, member, call?.arguments.length)
    .map((fn) => inFileDefinition(index, fn, member))
  if (call === undefined) {
    return candidates
  }
  return pickOverloads(candidates, [
    receiverKey,
    ...argumentTypes(context, call),
  ])
}

// Same-arity overloads: keep the ones whose parameters match every argument
// type we know. If none match, the guess is ours to make, so keep them all.
function pickOverloads(
  definitions: Definition[],
  argumentKeys: (string | undefined)[] | undefined,
): Definition[] {
  if (argumentKeys === undefined || definitions.length < 2) {
    return definitions
  }
  const compatible = definitions.filter((d) =>
    acceptsArguments(d.declaration, argumentKeys),
  )
  return compatible.length > 0 ? compatible : definitions
}

function argumentTypes(
  context: ReceiverContext,
  call: FunctionCall,
): (string | undefined)[] {
  return call.arguments.map((argument) =>
    argument.type === 'NumberLiteral'
      ? NUMBER_LITERAL
      : typeKey(evaluateReceiver(context, argument).type),
  )
}

// What an external call can reach: public and external functions, getters.
function externalMembers(
  index: SourceIndex,
  contract: string,
  member: string,
  arity: number | undefined,
): Definition[] {
  return memberDefinitions(index, contract, member, arity).filter((d) => {
    const visibility = (d.declaration as FunctionDefinition).visibility
    return visibility !== 'internal' && visibility !== 'private'
  })
}

function memberDefinitions(
  index: SourceIndex,
  contract: string,
  member: string,
  arity: number | undefined,
): Definition[] {
  const declared = index.findFunctions(contract, member, arity)
  const variable = index.findStateVariable(contract, member)
  const getter =
    variable?.visibility === 'public' &&
    (arity === undefined || getterArity(variable.typeName) === arity)
      ? [variable]
      : []
  const implemented = declared.filter((fn) => fn.body !== null)
  const hasImplementation = implemented.length > 0 || getter.length > 0
  const functions = hasImplementation ? implemented : declared
  const other = index.findMember(contract, member)
  const nodes: BaseASTNode[] = [...functions, ...getter]
  if (nodes.length === 0 && other !== undefined) {
    nodes.push(other)
  }
  return nodes.map((node) => inFileDefinition(index, node, member))
}

// A public mapping or array getter takes one argument per key or index.
function getterArity(type: TypeName | null): number {
  let arity = 0
  let current = type
  while (current?.type === 'Mapping' || current?.type === 'ArrayTypeName') {
    arity++
    current =
      current.type === 'Mapping'
        ? (current as Mapping).valueType
        : (current as ArrayTypeName).baseTypeName
  }
  return arity
}

function declaresMember(
  index: SourceIndex,
  contract: string,
  member: string,
): boolean {
  return (
    index.findFunctions(contract, member, undefined).length > 0 ||
    index.findStateVariable(contract, member) !== undefined
  )
}

function inFileResult(
  index: SourceIndex,
  name: string,
  declaration: Declaration | undefined,
): DefinitionResult {
  const nodes = declarationNodes(declaration)
  return {
    symbol: name,
    receiver: undefined,
    definitions: nodes.map((node) => inFileDefinition(index, node, name)),
  }
}

function declarationNodes(declaration: Declaration | undefined): BaseASTNode[] {
  if (declaration === undefined) {
    return []
  }
  if (declaration.kind === 'functions') {
    return declaration.nodes
  }
  return [declaration.node]
}

export function inFileDefinition(
  index: SourceIndex,
  node: BaseASTNode,
  name: string,
): Definition {
  const owner = index.contractOf(node)
  return {
    path: index.path,
    position: index.positionOf(nameOffset(index, node, name)),
    label: owner ? `${owner}.${name}` : name,
    resolution: 'in-file',
    entries: [],
    copies: [],
    declaration: node,
  }
}

function nameOffset(
  index: SourceIndex,
  node: BaseASTNode,
  name: string,
): number {
  const identifier = (node as VariableDeclaration).identifier
  if (node.type === 'VariableDeclaration' && identifier?.range) {
    return identifier.range[0]
  }
  return index.nameOffset(node, name)
}

export function callOf(ancestors: BaseASTNode[]): FunctionCall | undefined {
  const callee = ancestors[ancestors.length - 1]
  const parent = ancestors[ancestors.length - 2]
  const call =
    parent?.type === 'NameValueExpression'
      ? ancestors[ancestors.length - 3]
      : parent
  if (call?.type !== 'FunctionCall') {
    return undefined
  }
  const functionCall = call as FunctionCall
  return unwrapCallOptions(functionCall.expression) === callee
    ? functionCall
    : undefined
}

function nodeText(index: SourceIndex, node: BaseASTNode): string {
  assert(node.range !== undefined)
  return index.text.slice(node.range[0], node.range[1] + 1)
}

function sourceText(index: SourceIndex, node: BaseASTNode): string {
  return nodeText(index, node)
    .split('\n')
    .map((line) => line.trim())
    .join('')
}

export function describeAddress(
  workspace: FlatWorkspace,
  address: ChainSpecificAddress,
): string {
  const entry = workspace.entryAt(address)
  if (entry === undefined) {
    return `${address} (not in discovery)`
  }
  return `${entry.name} ${address}${entry.type === 'EOA' ? ' (EOA)' : ''}`
}
