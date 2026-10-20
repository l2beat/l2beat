import type { ContractValue } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type {
  ArrayTypeName,
  BaseASTNode,
  ElementaryTypeName,
  Expression,
  FileLevelConstant,
  FunctionCall,
  FunctionDefinition,
  Identifier,
  IndexAccess,
  Mapping,
  MemberAccess,
  NameValueExpression,
  NewExpression,
  StateVariableDeclarationVariable,
  StructDefinition,
  TupleExpression,
  TypeName,
  UserDefinedTypeName,
  VariableDeclaration,
} from '@mradomski/fast-solidity-parser'
import type { FlatEntry, FlatWorkspace } from './FlatWorkspace'
import {
  acceptsArguments,
  type CallArguments,
  type SourceIndex,
  typeKey,
} from './SourceIndex'
import { isWrittenInCall, resolveName, type Scope } from './scope'

export interface Receiver {
  type: TypeName | undefined
  address: ChainSpecificAddress | undefined
  // A contract or library named directly (`Math.add`), or `super`.
  staticContract: string | undefined
}

export interface ReceiverContext {
  workspace: FlatWorkspace
  scope: Scope
  entry: FlatEntry
}

type Step =
  | { kind: 'cast'; type: TypeName | undefined }
  | { kind: 'call'; member: string; call: FunctionCall }
  | { kind: 'index' }
  | { kind: 'field'; member: string }

type Unwound = { step?: Step; next: Expression } | { base: Receiver }

const UNKNOWN: Receiver = {
  type: undefined,
  address: undefined,
  staticContract: undefined,
}
const STEPS_MAX = 64

export function evaluateReceiver(
  context: ReceiverContext,
  expression: Expression,
): Receiver {
  const steps: Step[] = []
  let current = expression
  let base: Receiver = UNKNOWN
  for (let i = 0; i < STEPS_MAX; i++) {
    const unwound = unwind(context, current)
    if ('base' in unwound) {
      base = unwound.base
      break
    }
    if (unwound.step !== undefined) {
      steps.push(unwound.step)
    }
    current = unwound.next
  }
  let receiver = base
  for (const step of steps.reverse()) {
    receiver = applyStep(context, receiver, step)
  }
  return receiver
}

function unwind(context: ReceiverContext, expression: Expression): Unwound {
  switch (expression.type) {
    case 'Identifier':
      return unwindIdentifier(context, expression as Identifier)
    case 'FunctionCall':
      return unwindCall(context, expression as FunctionCall)
    case 'MemberAccess': {
      const access = expression as MemberAccess
      const constant = namespacedConstant(context, access)
      if (constant?.expression) {
        const step: Step = {
          kind: 'cast',
          type: qualifiedType(context.scope.index, constant.typeName, constant),
        }
        return { step, next: constant.expression }
      }
      const step: Step = { kind: 'field', member: access.memberName }
      return { step, next: access.expression }
    }
    case 'IndexAccess':
      return { step: { kind: 'index' }, next: (expression as IndexAccess).base }
    case 'TupleExpression': {
      const components = (expression as TupleExpression).components
      const only = components.length === 1 ? components[0] : undefined
      return only ? { next: only as Expression } : { base: UNKNOWN }
    }
    case 'NumberLiteral': {
      const literal = (expression as unknown as { number: string }).number
      const chain = ChainSpecificAddress.chain(context.entry.address)
      const address = literalAddress(chain, literal)
      if (address === undefined) {
        return { base: UNKNOWN }
      }
      return { base: { ...UNKNOWN, type: ADDRESS, address } }
    }
    default:
      return { base: UNKNOWN }
  }
}

function unwindIdentifier(
  context: ReceiverContext,
  identifier: Identifier,
): Unwound {
  const { scope, entry } = context
  if (identifier.name === 'this') {
    const type = scope.contract ? userType(scope.contract) : undefined
    return { base: { ...UNKNOWN, type, address: entry.address } }
  }
  if (identifier.name === 'super') {
    return { base: { ...UNKNOWN, staticContract: 'super' } }
  }
  const declaration = resolveName(scope, identifier.name, undefined)
  if (
    declaration?.kind === 'contract' ||
    (declaration?.kind === 'other' &&
      NAMED_TYPES.includes(declaration.node.type))
  ) {
    return { base: { ...UNKNOWN, staticContract: identifier.name } }
  }
  if (
    declaration?.kind === 'other' &&
    declaration.node.type === 'FileLevelConstant'
  ) {
    const constant = declaration.node as FileLevelConstant
    const step: Step = { kind: 'cast', type: constant.typeName }
    return { step, next: constant.initialValue }
  }
  if (declaration?.kind !== 'variable') {
    return { base: UNKNOWN }
  }
  const type = qualifiedType(
    context.scope.index,
    declaration.node.typeName,
    declaration.node,
  )
  // Within a function that writes it, the variable holds what it wrote.
  if (isWrittenInCall(context.scope, identifier.name)) {
    return { base: { ...UNKNOWN, type } }
  }
  if (declaration.isState) {
    const address = discoveredAddress(entry.values, identifier.name)
    if (address !== undefined) {
      return { base: { ...UNKNOWN, type, address } }
    }
  }
  if (declaration.initialValue !== null) {
    return { step: { kind: 'cast', type }, next: declaration.initialValue }
  }
  return { base: { ...UNKNOWN, type } }
}

function unwindCall(context: ReceiverContext, call: FunctionCall): Unwound {
  const callee = unwrapCallOptions(call.expression)
  const argument = call.arguments.length === 1 ? call.arguments[0] : undefined
  if (callee.type === 'MemberAccess') {
    const access = callee as MemberAccess
    const step: Step = { kind: 'call', member: access.memberName, call }
    return { step, next: access.expression }
  }
  if (callee.type === 'ElementaryTypeName' && argument !== undefined) {
    return { step: { kind: 'cast', type: callee as TypeName }, next: argument }
  }
  if (callee.type === 'NewExpression') {
    return { base: { ...UNKNOWN, type: (callee as NewExpression).typeName } }
  }
  if (callee.type !== 'Identifier') {
    return { base: UNKNOWN }
  }
  const name = (callee as Identifier).name
  if ((name === 'address' || name === 'payable') && argument !== undefined) {
    return { step: { kind: 'cast', type: ADDRESS }, next: argument }
  }
  const declaration = resolveName(context.scope, name, call.arguments.length)
  if (declaration?.kind === 'contract' && argument !== undefined) {
    return { step: { kind: 'cast', type: userType(name) }, next: argument }
  }
  if (declaration?.kind === 'functions') {
    const address =
      call.arguments.length === 0
        ? discoveredAddress(context.entry.values, name)
        : undefined
    const args = declaredArguments(context, call)
    const chosen = pickOverload(context, declaration.nodes, args)
    const type = returnType(context.scope.index, chosen)
    return { base: { ...UNKNOWN, type, address } }
  }
  return { base: UNKNOWN }
}

// `Predeploys.L2_STANDARD_BRIDGE`: a constant declared in a library or contract.
function namespacedConstant(
  context: ReceiverContext,
  access: MemberAccess,
): StateVariableDeclarationVariable | undefined {
  if (access.expression.type !== 'Identifier') {
    return undefined
  }
  const owner = (access.expression as Identifier).name
  if (resolveName(context.scope, owner, undefined)?.kind !== 'contract') {
    return undefined
  }
  return context.scope.index.findStateVariable(owner, access.memberName)
}

function applyStep(
  context: ReceiverContext,
  receiver: Receiver,
  step: Step,
): Receiver {
  switch (step.kind) {
    case 'cast':
      return { ...receiver, type: step.type ?? receiver.type }
    case 'call':
      return applyCall(context, receiver, step.member, step.call)
    case 'index':
      return { ...UNKNOWN, type: elementType(receiver.type) }
    case 'field':
      if (receiver.staticContract !== undefined) {
        return nestedType(context, receiver.staticContract, step.member)
      }
      return {
        ...UNKNOWN,
        type: fieldType(context, receiver.type, step.member),
      }
  }
}

const NAMED_TYPES = ['TypeDefinition', 'EnumDefinition']

function nestedType(
  context: ReceiverContext,
  owner: string,
  member: string,
): Receiver {
  const node = context.scope.index.findMember(owner, member)
  if (node === undefined || !NAMED_TYPES.includes(node.type)) {
    return UNKNOWN
  }
  return { ...UNKNOWN, staticContract: `${owner}.${member}` }
}

function applyCall(
  context: ReceiverContext,
  receiver: Receiver,
  member: string,
  call: FunctionCall,
): Receiver {
  const { workspace, scope } = context
  if (receiver.staticContract !== undefined && member === 'wrap') {
    return { ...UNKNOWN, type: userType(receiver.staticContract) }
  }
  const arity = call.arguments.length
  const owner = receiver.staticContract ?? contractName(receiver.type)
  const candidates = owner
    ? scope.index.findFunctions(owner, member, arity)
    : []
  const declared =
    pickOverload(context, candidates, declaredArguments(context, call)) ??
    boundFunction(scope, receiver, member, arity)
  const target = receiver.address
    ? workspace.entryAt(receiver.address)
    : undefined
  const address =
    target && arity === 0 ? discoveredAddress(target.values, member) : undefined
  const type =
    returnType(scope.index, declared) ??
    (target ? returnTypeInEntry(workspace, target, member, arity) : undefined)
  return { ...UNKNOWN, type, address }
}

function boundFunction(
  scope: Scope,
  receiver: Receiver,
  member: string,
  arity: number,
): FunctionDefinition | undefined {
  const receiverKey = typeKey(receiver.type)
  if (scope.contract === undefined || receiverKey === undefined) {
    return undefined
  }
  const bound = scope.index.boundFunctions(
    scope.contract,
    receiverKey,
    member,
    arity,
  )
  return bound.length === 1 ? bound[0] : undefined
}

function returnTypeInEntry(
  workspace: FlatWorkspace,
  entry: FlatEntry,
  member: string,
  arity: number,
): TypeName | undefined {
  for (const path of entry.sourcePaths) {
    const index = workspace.source(path)
    const main = index.mainContract?.node.name
    const declared = main
      ? index.findFunctions(main, member, arity)[0]
      : undefined
    if (declared !== undefined) {
      return returnType(index, declared)
    }
  }
  return undefined
}

function fieldType(
  context: ReceiverContext,
  type: TypeName | undefined,
  member: string,
): TypeName | undefined {
  const field = structField(context.scope, type, member)
  return field && qualifiedType(context.scope.index, field.typeName, field)
}

export function structField(
  scope: Scope,
  type: TypeName | undefined,
  member: string,
): VariableDeclaration | undefined {
  if (type?.type !== 'UserDefinedTypeName') {
    return undefined
  }
  const namePath = (type as UserDefinedTypeName).namePath
  const struct = scope.index.findType(namePath, scope.contract)
  if (struct?.type !== 'StructDefinition') {
    return undefined
  }
  return (struct as StructDefinition).members.find((m) => m.name === member)
}

export function discoveredAddress(
  values: Record<string, ContractValue | undefined>,
  name: string,
): ChainSpecificAddress | undefined {
  // Private storage and immutables are read through getters with plainer names.
  const trimmed = trimLeadingUnderscores(name)
  for (const key of [name, trimmed, screamingSnakeToCamel(trimmed)]) {
    const value = values[key]
    if (typeof value === 'string') {
      const address = ChainSpecificAddress.tryParse(value)
      if (address !== undefined) {
        return address
      }
    }
  }
  return undefined
}

export function contractName(type: TypeName | undefined): string | undefined {
  if (type?.type !== 'UserDefinedTypeName') {
    return undefined
  }
  const path = (type as UserDefinedTypeName).namePath
  return path.slice(path.lastIndexOf('.') + 1)
}

export function unwrapCallOptions(expression: Expression): Expression {
  if (expression.type === 'NameValueExpression') {
    return (expression as NameValueExpression).expression
  }
  return expression
}

function returnType(
  index: SourceIndex,
  fn: FunctionDefinition | undefined,
): TypeName | undefined {
  if (fn === undefined) {
    return undefined
  }
  return qualifiedType(index, fn.returnParameters?.[0]?.typeName, fn)
}

// A bare type name means the type as seen from the declaring contract, also
// inside mappings and arrays: a library's `mapping(uint256 => Node)` is its Node.
export function qualifiedType(
  index: SourceIndex,
  type: TypeName | null | undefined,
  declaration: BaseASTNode,
): TypeName | undefined {
  if (type === null || type === undefined) {
    return undefined
  }
  const owner = index.contractOf(declaration)
  if (owner === undefined) {
    return type
  }
  const wrappers: TypeName[] = []
  let current: TypeName = type
  while (current.type === 'Mapping' || current.type === 'ArrayTypeName') {
    wrappers.push(current)
    current =
      current.type === 'Mapping'
        ? (current as Mapping).valueType
        : (current as ArrayTypeName).baseTypeName
  }
  let rebuilt: TypeName = current
  const namePath = (current as UserDefinedTypeName).namePath
  if (
    current.type === 'UserDefinedTypeName' &&
    !namePath.includes('.') &&
    index.findMember(owner, namePath) !== undefined
  ) {
    rebuilt = userType(`${owner}.${namePath}`)
  }
  for (const wrapper of wrappers.reverse()) {
    rebuilt =
      wrapper.type === 'Mapping'
        ? { ...(wrapper as Mapping), valueType: rebuilt }
        : { ...(wrapper as ArrayTypeName), baseTypeName: rebuilt }
  }
  return rebuilt
}

// Overloads that differ only in parameter types: compare with the types the
// arguments are declared with. Deeper expressions count as unknown, and when
// they leave the return type ambiguous, so is the result.
function pickOverload(
  context: ReceiverContext,
  candidates: FunctionDefinition[],
  args: CallArguments,
): FunctionDefinition | undefined {
  if (candidates.length < 2) {
    return candidates[0]
  }
  const compatible = candidates.filter((fn) => acceptsArguments(fn, args))
  const returnTypes = new Set(
    compatible.map((fn) => typeKey(returnType(context.scope.index, fn))),
  )
  return returnTypes.size === 1 ? compatible[0] : undefined
}

function declaredArguments(
  context: ReceiverContext,
  call: FunctionCall,
): CallArguments {
  const keys = call.arguments.map((argument) =>
    typeKey(declaredType(context.scope, argument)),
  )
  return { keys, names: call.identifiers.map((label) => label.name) }
}

function declaredType(
  scope: Scope,
  expression: Expression,
): TypeName | undefined {
  const members: string[] = []
  let current = expression
  while (current.type === 'MemberAccess') {
    const access = current as MemberAccess
    members.unshift(access.memberName)
    current = access.expression
  }
  if (current.type !== 'Identifier') {
    return undefined
  }
  const name = (current as Identifier).name
  const declaration = resolveName(scope, name, undefined)
  let type =
    declaration?.kind === 'variable'
      ? qualifiedType(scope.index, declaration.node.typeName, declaration.node)
      : undefined
  for (const member of members) {
    const field = structField(scope, type, member)
    type = field && qualifiedType(scope.index, field.typeName, field)
  }
  return type
}

function elementType(type: TypeName | undefined): TypeName | undefined {
  if (type?.type === 'ArrayTypeName') {
    return (type as ArrayTypeName).baseTypeName
  }
  if (type?.type === 'Mapping') {
    return (type as Mapping).valueType
  }
  return undefined
}

function userType(name: string): UserDefinedTypeName {
  return { type: 'UserDefinedTypeName', namePath: name }
}

const ADDRESS: ElementaryTypeName = {
  type: 'ElementaryTypeName',
  name: 'address',
  stateMutability: null,
}

function screamingSnakeToCamel(name: string): string {
  if (name.toUpperCase() !== name) {
    return name
  }
  const words = name
    .toLowerCase()
    .split('_')
    .filter((word) => word !== '')
  return words
    .map((word, i) => (i === 0 ? word : word[0]?.toUpperCase() + word.slice(1)))
    .join('')
}

// Precompiles are usually written as small numbers: `ArbSys(address(100))`.
function literalAddress(
  chain: string,
  literal: string,
): ChainSpecificAddress | undefined {
  const isHex = literal.startsWith('0x')
  const digits = isHex ? literal.slice(2) : literal
  const allowed = isHex ? '0123456789abcdefABCDEF' : '0123456789'
  if (digits.length === 0 || [...digits].some((d) => !allowed.includes(d))) {
    return undefined
  }
  const hex = BigInt(literal).toString(16)
  if (hex.length > 40) {
    return undefined
  }
  return ChainSpecificAddress.tryParse(`${chain}:0x${hex.padStart(40, '0')}`)
}

function trimLeadingUnderscores(name: string): string {
  let start = 0
  while (name[start] === '_') {
    start++
  }
  return name.slice(start)
}
