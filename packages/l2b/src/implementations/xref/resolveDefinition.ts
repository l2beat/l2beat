import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import type {
  BaseASTNode,
  EnumDefinition,
  FunctionCall,
  FunctionDefinition,
  Identifier,
  MemberAccess,
  ModifierInvocation,
  UserDefinedTypeName,
  UsingForDeclaration,
  VariableDeclaration,
} from '@mradomski/fast-solidity-parser'
import { abiHasFunction, parseAbiFunction } from './abi'
import {
  argumentsOf,
  type CallArguments,
  contractName,
  type EvaluationContext,
  evaluate,
  fits,
  isLegacyCallOption,
  isOptionName,
  pickOverloads,
  structField,
  unwrapCallOptions,
  type Value,
} from './evaluate'
import {
  type FlatEntry,
  type FlatWorkspace,
  isProxySource,
} from './FlatWorkspace'
import {
  declarationName,
  parametersOf,
  type SourceIndex,
  signatureOf,
  type TextPosition,
  typeKey,
} from './SourceIndex'
import {
  boundFunctions,
  lacksBody,
  lookupName,
  scopeAt,
  visibleMembers,
} from './scope'

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
  receiver: Value | undefined
  definitions: Definition[]
}

const NOTHING: DefinitionResult = {
  symbol: '',
  receiver: undefined,
  definitions: [],
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
  const entry = workspace.entryOfPath(path)
  assert(entry !== undefined, 'Flat file is not part of the discovery')
  const ancestors = index.pathAt(offset)
  const node = ancestors[ancestors.length - 1]
  assert(node !== undefined)
  const scope = scopeAt(index, ancestors, offset)
  const context = { workspace, scope, entry }
  const parent = ancestors[ancestors.length - 2] as FunctionCall | undefined
  if (
    parent?.type === 'FunctionCall' &&
    parent.identifiers.includes(node as Identifier)
  ) {
    return resolveNamedArgument(workspace, path, parent, node as Identifier)
  }
  const call = callOf(ancestors)
  const args = call && argumentsOf(call, (e) => evaluate(context, e).type)
  switch (node.type) {
    case 'MemberAccess':
      return resolveMember(context, node as MemberAccess, args, ancestors)
    case 'Identifier':
      return resolveName(index, scope, (node as Identifier).name, args)
    case 'ModifierInvocation':
      return resolveName(index, scope, (node as ModifierInvocation).name)
    case 'UserDefinedTypeName':
      return resolveTypeName(context, node as UserDefinedTypeName, offset)
    case 'UsingForDeclaration': {
      // The parser keeps the library as a string without a range.
      const library = (node as UsingForDeclaration).libraryName
      return library ? resolveName(index, scope, library) : NOTHING
    }
    default:
      return NOTHING
  }
}

// The cursor on a declaration's own name.
export function declarationAt(
  index: SourceIndex,
  offset: number,
): Definition | undefined {
  const ancestors = index.pathAt(offset)
  const node = ancestors[ancestors.length - 1]
  const parent = ancestors[ancestors.length - 2] as
    | VariableDeclaration
    | undefined
  if (node === undefined) {
    return undefined
  }
  if (parent?.type === 'VariableDeclaration' && parent.identifier === node) {
    return inFileDefinition(index, parent, parent.name ?? '')
  }
  const name = declarationName(node)
  if (name === undefined) {
    return undefined
  }
  const start = index.nameOffset(node, name)
  if (offset < start || offset >= start + name.length) {
    return undefined
  }
  return inFileDefinition(index, node, name)
}

function resolveName(
  index: SourceIndex,
  scope: ReturnType<typeof scopeAt>,
  name: string,
  args?: CallArguments,
): DefinitionResult {
  const nodes = lookupName(scope, name).map((binding) => binding.node)
  const definitions = pickOverloads(nodes, args).map((node) =>
    inFileDefinition(index, node, name),
  )
  return { symbol: name, receiver: undefined, definitions }
}

// `f({ amount: x })`: the label names a parameter of whatever `f` resolves to,
// or a field when `f` is a struct.
function resolveNamedArgument(
  workspace: FlatWorkspace,
  path: string,
  call: FunctionCall,
  label: Identifier,
): DefinitionResult {
  const offset = calleeOffset(call)
  const callee =
    offset === undefined ? NOTHING : resolveDefinition(workspace, path, offset)
  const definitions = callee.definitions.flatMap((definition) => {
    const fields =
      definition.declaration.type === 'StructDefinition'
        ? (
            definition.declaration as unknown as {
              members: VariableDeclaration[]
            }
          ).members
        : parametersOf(definition.declaration)
    const field = fields.find((p) => p.name === label.name)
    if (field === undefined) {
      return []
    }
    const index = workspace.source(definition.path)
    return [
      {
        ...definition,
        ...inFileDefinition(index, field, label.name),
        label: `${definition.label}.${label.name}`,
        resolution: definition.resolution,
        entries: definition.entries,
      },
    ]
  })
  return { ...callee, symbol: `${callee.symbol}.${label.name}`, definitions }
}

export function calleeOffset(call: FunctionCall): number | undefined {
  const callee = unwrapCallOptions(call.expression)
  if (callee.range === undefined) {
    return undefined
  }
  if (callee.type === 'MemberAccess') {
    return callee.range[1] - (callee as MemberAccess).memberName.length + 1
  }
  return callee.type === 'Identifier' ? callee.range[0] : undefined
}

function resolveTypeName(
  context: EvaluationContext,
  type: UserDefinedTypeName,
  offset: number,
): DefinitionResult {
  const { index, contract } = context.scope
  const path = type.namePath
  const dot = path.indexOf('.')
  assert(type.range !== undefined)
  if (dot === -1 || offset < type.range[0] + dot) {
    const head = dot === -1 ? path : path.slice(0, dot)
    return resolveName(index, context.scope, head)
  }
  const node = index.findType(path, contract)
  const name = path.slice(path.lastIndexOf('.') + 1)
  const definitions = node
    ? [{ ...inFileDefinition(index, node, name), label: path }]
    : []
  return { symbol: path, receiver: undefined, definitions }
}

function resolveMember(
  context: EvaluationContext,
  access: MemberAccess,
  args: CallArguments | undefined,
  ancestors: BaseASTNode[],
): DefinitionResult {
  const { index } = context.scope
  const member = access.memberName
  const receiver = evaluate(context, access.expression)
  const symbol = `${sourceText(index, access.expression)}.${member}`
  const parent = ancestors[ancestors.length - 2] as MemberAccess | undefined
  // `token.transfer.selector` calls nothing, it names the function of the type.
  const isSelector =
    parent?.type === 'MemberAccess' &&
    parent.memberName === 'selector' &&
    parent.expression === access
  const owner = receiver.namespace ?? contractName(receiver.type)
  if (isSelector && owner !== undefined && index.contracts.has(owner)) {
    return { symbol, receiver, definitions: typeMembers(index, owner, member) }
  }
  const definitions = memberDefinitions(context, receiver, member, args)
  return { symbol, receiver, definitions }
}

function memberDefinitions(
  context: EvaluationContext,
  receiver: Value,
  member: string,
  args: CallArguments | undefined,
): Definition[] {
  const { workspace, scope } = context
  const { index } = scope
  if (receiver.namespace !== undefined) {
    return pick(namespaceMembers(context, receiver.namespace, member), args)
  }
  const typeName = contractName(receiver.type)
  const field = structField(scope, receiver.type, member)
  if (field !== undefined && args === undefined) {
    return [
      {
        ...inFileDefinition(index, field, member),
        label: `${typeName}.${member}`,
      },
    ]
  }
  const onType =
    typeName !== undefined && index.named(typeName, member).length > 0
  const bound = onType ? [] : boundDefinitions(context, receiver, member, args)
  if (bound.length > 0) {
    return bound
  }
  const target = receiver.address
    ? workspace.entryAt(receiver.address)
    : undefined
  const reached = target
    ? definitionsInEntry(
        workspace,
        target,
        member,
        'discovered-value',
        'external',
        args,
      )
    : []
  if (reached.length > 0 || typeName === undefined) {
    return reached
  }
  // A known address outside the project is no reason to guess by ABI.
  const matched = receiver.address
    ? []
    : abiMatchDefinitions(context, typeName, member, args)
  if (matched.length > 0) {
    return matched
  }
  return pick(typeMembers(index, typeName, member), args)
}

// `super.f()` runs, per overload, the nearest base implementing it.
function namespaceMembers(
  context: EvaluationContext,
  namespace: string,
  member: string,
): Definition[] {
  const { index, contract } = context.scope
  if (namespace !== 'super') {
    const found = visibleMembers(index, namespace, member, contract)
    const value = enumValue(index.findType(namespace, contract), member)
    const label = `${namespace}.${member}`
    return found.length > 0
      ? found.map((m) => inFileDefinition(index, m.node, member))
      : value
        ? [{ ...inFileDefinition(index, value, member), label }]
        : []
  }
  const lineage =
    index.contracts.get(index.dispatchContract(contract ?? ''))
      ?.linearization ?? []
  const bySignature = new Map<string, BaseASTNode>()
  for (const base of lineage.slice(lineage.indexOf(contract ?? '') + 1)) {
    for (const { node } of index
      .named(base, member)
      .filter((m) => m.owner === base)) {
      const isImplementation =
        node.type === 'FunctionDefinition' && !lacksBody(node)
      if (isImplementation && !bySignature.has(signatureOf(node))) {
        bySignature.set(signatureOf(node), node)
      }
    }
  }
  return [...bySignature.values()].map((node) =>
    inFileDefinition(index, node, member),
  )
}

function enumValue(type: BaseASTNode | undefined, member: string) {
  return type?.type === 'EnumDefinition'
    ? (type as EnumDefinition).members.find((value) => value.name === member)
    : undefined
}

function boundDefinitions(
  context: EvaluationContext,
  receiver: Value,
  member: string,
  args: CallArguments | undefined,
): Definition[] {
  const { index, contract } = context.scope
  if (contract === undefined) {
    return []
  }
  const receiverKey = typeKey(receiver.type)
  const nodes = boundFunctions(index, contract, receiverKey, member)
  const withReceiver = args && {
    keys: [receiverKey, ...args.keys],
    names: args.names,
  }
  return pickOverloads(nodes, withReceiver).map((node) =>
    inFileDefinition(index, node, member),
  )
}

// What a contract type answers to: implemented functions and public getters,
// else its bodyless declarations, else any member of that name.
function typeMembers(
  index: SourceIndex,
  contract: string,
  member: string,
): Definition[] {
  const nodes = visibleMembers(index, contract, member, undefined).map(
    (m) => m.node,
  )
  const callable = nodes.filter(
    (node) =>
      node.type === 'FunctionDefinition' ||
      (node as VariableDeclaration).visibility === 'public',
  )
  const implemented = callable.filter((node) => !lacksBody(node))
  const chosen =
    implemented.length > 0
      ? implemented
      : callable.length > 0
        ? callable
        : nodes
  return chosen.map((node) => inFileDefinition(index, node, member))
}

export function definitionsInEntry(
  workspace: FlatWorkspace,
  entry: FlatEntry,
  member: string,
  resolution: Resolution,
  reach: 'external' | 'all',
  args?: CallArguments,
): Definition[] {
  const definitions: Definition[] = []
  for (const path of entry.sourcePaths) {
    // The proxy's own function answers only what the implementation cannot.
    const answered = definitions.some((d) => !args || fits(d.declaration, args))
    if (isProxySource(path) && answered) {
      break
    }
    const index = workspace.source(path)
    const main = index.mainContract?.node.name
    const found = main ? typeMembers(index, main, member) : []
    for (const definition of found) {
      const visibility = (definition.declaration as FunctionDefinition)
        .visibility
      if (
        reach === 'all' ||
        (visibility !== 'internal' && visibility !== 'private')
      ) {
        definitions.push({ ...definition, resolution, entries: [entry] })
      }
    }
  }
  return mergeIdentical(workspace, pick(definitions, args))
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
      const { entries, copies } = definition
      byCode.set(key, {
        ...definition,
        entries: [...entries],
        copies: [...copies],
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

// The candidates are the contracts on the caller's chain that declare the
// interface or, as the flattener prunes interfaces to used members, expose
// all of its functions. Declaring it outranks exposing more of them.
function abiMatchDefinitions(
  context: EvaluationContext,
  typeName: string,
  member: string,
  args: CallArguments | undefined,
): Definition[] {
  const { workspace, scope } = context
  const lineage = scope.index.contracts.get(typeName)?.linearization ?? []
  const required = lineage
    .flatMap((name) => scope.index.contracts.get(name)?.node.subNodes ?? [])
    .filter((node): node is FunctionDefinition => {
      const name = (node as FunctionDefinition).name
      // Optimism interfaces declare their constructor as a function.
      return (
        node.type === 'FunctionDefinition' &&
        !!name &&
        name !== '__constructor__'
      )
    })
    .map((fn) => ({ name: fn.name ?? '', arity: fn.parameters.length }))
  const chain = ChainSpecificAddress.chain(context.entry.address)
  let scoreMax = 0
  let candidates: FlatEntry[] = []
  for (const entry of workspace.entries) {
    if (entry.type !== 'Contract' || entry.sourcePaths.length === 0) {
      continue
    }
    const functions = entry.abi.flatMap((s) => parseAbiFunction(s) ?? [])
    const sameChain = ChainSpecificAddress.chain(entry.address) === chain
    if (!sameChain || !abiHasFunction(functions, member, args?.keys.length)) {
      continue
    }
    const shared = required.filter((f) =>
      abiHasFunction(functions, f.name, f.arity),
    )
    const nominal = entry.sourcePaths.some((path) =>
      workspace.source(path).mainContract?.linearization.includes(typeName),
    )
    if (!nominal && shared.length < required.length) {
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
    definitionsInEntry(workspace, entry, member, 'abi-match', 'external', args),
  )
  return mergeIdentical(workspace, definitions)
}

const NOMINAL_SCORE = 1_000_000

function pick(definitions: Definition[], args: CallArguments | undefined) {
  const kept = new Set(
    pickOverloads(
      definitions.map((d) => d.declaration),
      args,
    ),
  )
  return definitions.filter((d) => kept.has(d.declaration))
}

export function inFileDefinition(
  index: SourceIndex,
  node: BaseASTNode,
  name: string,
): Definition {
  const owner = index.contractOf(node)
  return {
    path: index.path,
    position: index.positionOf(index.nameOffset(node, name)),
    label: owner ? `${owner}.${name}` : name,
    resolution: 'in-file',
    entries: [],
    copies: [],
    declaration: node,
  }
}

// The call whose callee is the last node, looking past call options.
export function callOf(ancestors: BaseASTNode[]): FunctionCall | undefined {
  const callee = ancestors[ancestors.length - 1]
  for (let i = ancestors.length - 2; i >= 0; i--) {
    const node = ancestors[i]
    assert(node !== undefined)
    const call = node as FunctionCall
    if (
      node.type === 'FunctionCall' &&
      unwrapCallOptions(call.expression) === callee
    ) {
      return call
    }
    const isOption =
      node.type === 'NameValueExpression' ||
      isLegacyCallOption(node) ||
      (node.type === 'MemberAccess' &&
        isOptionName((node as MemberAccess).memberName))
    if (!isOption) {
      return undefined
    }
  }
  return undefined
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
