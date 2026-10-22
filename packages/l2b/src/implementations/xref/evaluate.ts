import type { ContractValue } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type {
  ArrayTypeName,
  BaseASTNode,
  ElementaryTypeName,
  Expression,
  FunctionCall,
  FunctionDefinition,
  Identifier,
  IndexAccess,
  Mapping,
  MemberAccess,
  NameValueExpression,
  NewExpression,
  StructDefinition,
  TupleExpression,
  TypeName,
  UserDefinedTypeName,
  VariableDeclaration,
} from '@mradomski/fast-solidity-parser'
import type { FlatEntry, FlatWorkspace } from './FlatWorkspace'
import {
  parametersOf,
  type SourceIndex,
  signatureOf,
  typeKey,
} from './SourceIndex'
import {
  boundFunctions,
  isWrittenDuring,
  lookupName,
  type Scope,
  visibleMembers,
} from './scope'

// What an expression is known to be: its static type, the address it holds,
// or a contract, library, enum or value type named directly (`Math.add`).
export interface Value {
  type: TypeName | undefined
  address: ChainSpecificAddress | undefined
  namespace: string | undefined
}

export interface EvaluationContext {
  workspace: FlatWorkspace
  scope: Scope
  entry: FlatEntry
}

type Step =
  | { kind: 'cast'; type: TypeName | undefined }
  | { kind: 'call'; member: string; call: FunctionCall }
  | { kind: 'index' }
  | { kind: 'member'; member: string }

type Unwound = { step?: Step; next: Expression } | { value: Value }

const UNKNOWN: Value = {
  type: undefined,
  address: undefined,
  namespace: undefined,
}
const STEPS_MAX = 64

// Walks down to the innermost known value, then applies the steps back up.
export function evaluate(
  context: EvaluationContext,
  expression: Expression,
): Value {
  const steps: Step[] = []
  let current = expression
  let value = UNKNOWN
  for (let i = 0; i < STEPS_MAX; i++) {
    const unwound = unwind(context, current)
    if ('value' in unwound) {
      value = unwound.value
      break
    }
    if (unwound.step !== undefined) {
      steps.push(unwound.step)
    }
    current = unwound.next
  }
  for (const step of steps.reverse()) {
    value = applyStep(context, value, step)
  }
  return value
}

function unwind(context: EvaluationContext, expression: Expression): Unwound {
  switch (expression.type) {
    case 'Identifier':
      return unwindIdentifier(context, expression as Identifier)
    case 'FunctionCall':
      return unwindCall(context, expression as FunctionCall)
    case 'MemberAccess': {
      const access = expression as MemberAccess
      const constant = namespacedConstant(context.scope, access)
      if (constant !== undefined) {
        return constant
      }
      const step: Step = { kind: 'member', member: access.memberName }
      return { step, next: access.expression }
    }
    case 'IndexAccess':
      return { step: { kind: 'index' }, next: (expression as IndexAccess).base }
    case 'TupleExpression': {
      const [only, ...rest] = (expression as TupleExpression).components
      return only && rest.length === 0
        ? { next: only as Expression }
        : { value: UNKNOWN }
    }
    case 'NumberLiteral': {
      const literal = (expression as unknown as { number: string }).number
      const chain = ChainSpecificAddress.chain(context.entry.address)
      const address = literalAddress(chain, literal)
      return {
        value: address ? { ...UNKNOWN, type: ADDRESS, address } : UNKNOWN,
      }
    }
    default:
      return { value: UNKNOWN }
  }
}

// `Predeploys.L2_BRIDGE`: a constant declared in a library or contract.
function namespacedConstant(
  scope: Scope,
  access: MemberAccess,
): Unwound | undefined {
  const owner = (access.expression as Identifier).name
  if (access.expression.type !== 'Identifier') {
    return undefined
  }
  const [binding] = lookupName(scope, owner)
  if (binding?.node.type !== 'ContractDefinition') {
    return undefined
  }
  const variable = scope.index.named(owner, access.memberName)[0]?.node as
    | VariableDeclaration
    | undefined
  const isFixed =
    variable?.isDeclaredConst ||
    (variable as { isImmutable?: boolean } | undefined)?.isImmutable
  if (
    variable?.type !== 'VariableDeclaration' ||
    !isFixed ||
    !variable.expression
  ) {
    return undefined
  }
  const type = qualifiedType(scope.index, variable.typeName, variable)
  return { step: { kind: 'cast', type }, next: variable.expression }
}

function unwindIdentifier(
  context: EvaluationContext,
  identifier: Identifier,
): Unwound {
  const { scope, entry } = context
  const { name } = identifier
  if (name === 'this') {
    const type = scope.contract ? userType(scope.contract) : undefined
    return { value: { ...UNKNOWN, type, address: entry.address } }
  }
  if (name === 'super') {
    return { value: { ...UNKNOWN, namespace: 'super' } }
  }
  const [binding] = lookupName(scope, name)
  if (binding === undefined) {
    return { value: UNKNOWN }
  }
  const { node } = binding
  if (NAMESPACES.includes(node.type)) {
    return { value: { ...UNKNOWN, namespace: name } }
  }
  const typeName = (node as { typeName?: TypeName | null }).typeName
  if (!VARIABLES.includes(node.type) || typeName === undefined) {
    return { value: UNKNOWN }
  }
  const type = qualifiedType(scope.index, typeName, node)
  // Within a call that writes it, the variable holds what it wrote.
  if (isWrittenDuring(scope, name)) {
    return { value: { ...UNKNOWN, type } }
  }
  const isState = (node as VariableDeclaration).isStateVar
  const address = isState ? discoveredAddress(entry.values, name) : undefined
  if (address !== undefined) {
    return { value: { ...UNKNOWN, type, address } }
  }
  if (binding.value !== null) {
    return { step: { kind: 'cast', type }, next: binding.value }
  }
  return { value: { ...UNKNOWN, type } }
}

const NAMESPACES = ['ContractDefinition', 'EnumDefinition', 'TypeDefinition']
const VARIABLES = ['VariableDeclaration', 'FileLevelConstant']

function unwindCall(context: EvaluationContext, call: FunctionCall): Unwound {
  const callee = unwrapCallOptions(call.expression)
  const [argument, ...rest] = call.arguments
  const single = rest.length === 0 ? argument : undefined
  if (callee.type === 'MemberAccess') {
    const access = callee as MemberAccess
    const step: Step = { kind: 'call', member: access.memberName, call }
    return { step, next: access.expression }
  }
  if (callee.type === 'NewExpression') {
    return { value: { ...UNKNOWN, type: (callee as NewExpression).typeName } }
  }
  const cast = castType(context.scope, call)
  if (cast !== undefined && single !== undefined) {
    return { step: { kind: 'cast', type: cast }, next: single }
  }
  if (callee.type !== 'Identifier') {
    return { value: UNKNOWN }
  }
  const name = (callee as Identifier).name
  const functions = lookupName(context.scope, name).map((b) => b.node)
  const address =
    call.arguments.length === 0
      ? discoveredAddress(context.entry.values, name)
      : undefined
  const type = callResultType(
    context,
    functions,
    shallowArguments(context.scope, call),
  )
  return { value: { ...UNKNOWN, type, address } }
}

// `address(x)`, `uint160(x)`, `IBridge(x)`: a conversion keeps the value.
function castType(scope: Scope, call: FunctionCall): TypeName | undefined {
  const callee = call.expression
  if (callee.type === 'ElementaryTypeName') {
    return callee as TypeName
  }
  if (callee.type !== 'Identifier') {
    return undefined
  }
  const name = (callee as Identifier).name
  if (name === 'address' || name === 'payable') {
    return ADDRESS
  }
  const [binding] = lookupName(scope, name)
  return binding?.node.type === 'ContractDefinition'
    ? userType(name)
    : undefined
}

function applyStep(
  context: EvaluationContext,
  value: Value,
  step: Step,
): Value {
  switch (step.kind) {
    case 'cast':
      return {
        ...UNKNOWN,
        type: step.type ?? value.type,
        address: value.address,
      }
    case 'call':
      return applyCall(context, value, step.member, step.call)
    case 'index':
      return { ...UNKNOWN, type: elementType(value.type) }
    case 'member':
      return applyMember(context, value, step.member)
  }
}

// `Constants.Status` names a type, `Predeploys.BRIDGE` a constant and
// `point.x` a struct field.
function applyMember(
  context: EvaluationContext,
  value: Value,
  member: string,
): Value {
  const { index, contract } = context.scope
  if (value.namespace !== undefined) {
    const node = index.findType(`${value.namespace}.${member}`, contract)
    if (node !== undefined && NAMESPACES.includes(node.type)) {
      return { ...UNKNOWN, namespace: `${value.namespace}.${member}` }
    }
    const variable = node as VariableDeclaration | undefined
    if (variable?.type !== 'VariableDeclaration') {
      return UNKNOWN
    }
    return {
      ...UNKNOWN,
      type: qualifiedType(index, variable.typeName, variable),
    }
  }
  const field = structField(context.scope, value.type, member)
  return {
    ...UNKNOWN,
    type: field && qualifiedType(index, field.typeName, field),
  }
}

function applyCall(
  context: EvaluationContext,
  value: Value,
  member: string,
  call: FunctionCall,
): Value {
  const { workspace, scope } = context
  const owner = value.namespace ?? contractName(value.type)
  if (member === 'wrap' && owner !== undefined) {
    const named = scope.index.findType(owner, scope.contract)
    if (named?.type === 'TypeDefinition') {
      return { ...UNKNOWN, type: userType(owner) }
    }
  }
  const args = shallowArguments(scope, call)
  const declared = owner
    ? visibleMembers(scope.index, owner, member, undefined).map((m) => m.node)
    : []
  const known =
    declared.length > 0
      ? { nodes: declared, args }
      : boundOn(scope, value, member, args)
  const target = value.address ? workspace.entryAt(value.address) : undefined
  const address =
    target && args.keys.length === 0
      ? discoveredAddress(target.values, member)
      : undefined
  const type =
    callResultType(context, known.nodes, known.args) ??
    (target ? resultTypeInEntry(context, target, member, args) : undefined)
  return { ...UNKNOWN, type, address }
}

function boundOn(
  scope: Scope,
  value: Value,
  member: string,
  args: CallArguments,
): { nodes: FunctionDefinition[]; args: CallArguments } {
  const receiver = typeKey(value.type)
  if (scope.contract === undefined || receiver === undefined) {
    return { nodes: [], args }
  }
  const nodes = boundFunctions(scope.index, scope.contract, receiver, member)
  return { nodes, args: { keys: [receiver, ...args.keys], names: args.names } }
}

function resultTypeInEntry(
  context: EvaluationContext,
  entry: FlatEntry,
  member: string,
  args: CallArguments,
): TypeName | undefined {
  for (const path of entry.sourcePaths) {
    const index = context.workspace.source(path)
    const main = index.mainContract?.node.name
    if (main === undefined) {
      continue
    }
    const nodes = visibleMembers(index, main, member, undefined).map(
      (m) => m.node,
    )
    const type = resultType(index, pickOverloads(nodes, args), args)
    if (type !== undefined) {
      return type
    }
  }
  return undefined
}

function callResultType(
  context: EvaluationContext,
  nodes: BaseASTNode[],
  args: CallArguments,
): TypeName | undefined {
  return resultType(context.scope.index, pickOverloads(nodes, args), args)
}

// Overloads that leave the result type ambiguous leave it unknown.
function resultType(
  index: SourceIndex,
  nodes: BaseASTNode[],
  args: CallArguments,
): TypeName | undefined {
  const types = nodes.map((node) => returnType(index, node, args.keys.length))
  const keys = new Set(types.map(typeKey))
  return keys.size === 1 ? types[0] : undefined
}

// A function returns its first result, a public getter its variable's type
// with one level of mapping or array per argument.
function returnType(
  index: SourceIndex,
  node: BaseASTNode,
  argumentCount: number,
): TypeName | undefined {
  if (node.type === 'FunctionDefinition') {
    const fn = node as FunctionDefinition
    return qualifiedType(index, fn.returnParameters?.[0]?.typeName, fn)
  }
  if (node.type !== 'VariableDeclaration') {
    return undefined
  }
  let type = (node as VariableDeclaration).typeName ?? undefined
  for (let i = 0; i < argumentCount; i++) {
    type = elementType(type)
  }
  return elementType(type) === undefined
    ? qualifiedType(index, type, node)
    : undefined
}

export const NUMBER_LITERAL = 'number literal'

// Named arguments are the last `names.length` ones: all of them, or all but
// the receiver of a bound library call.
export interface CallArguments {
  keys: (string | undefined)[]
  names: string[]
}

export function argumentsOf(
  call: FunctionCall,
  typeOf: (argument: Expression) => TypeName | undefined,
): CallArguments {
  const keys = call.arguments.map((argument) =>
    argument.type === 'NumberLiteral'
      ? NUMBER_LITERAL
      : typeKey(typeOf(argument)),
  )
  return { keys, names: call.identifiers.map((label) => label.name) }
}

// Inside a chain, argument types come from declarations and conversions only,
// so typing them never evaluates another call.
function shallowArguments(scope: Scope, call: FunctionCall): CallArguments {
  return argumentsOf(call, (argument) =>
    argument.type === 'FunctionCall'
      ? castType(scope, argument as FunctionCall)
      : declaredType(scope, argument),
  )
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
  if (name === 'this') {
    return scope.contract ? userType(scope.contract) : undefined
  }
  const [binding] = lookupName(scope, name)
  const node = binding?.node as VariableDeclaration | undefined
  let type = node?.typeName
    ? qualifiedType(scope.index, node.typeName, node)
    : undefined
  for (const member of members) {
    const field = structField(scope, type, member)
    type = field && qualifiedType(scope.index, field.typeName, field)
  }
  return type
}

// A call fixes how many arguments there are. Their known types narrow the
// overloads further, unless none accepts them, then the guess is ours.
export function pickOverloads<T extends BaseASTNode>(
  nodes: T[],
  args: CallArguments | undefined,
): T[] {
  if (args === undefined) {
    return nodes
  }
  const counted = nodes.filter((node) => {
    const arity = arityOf(node)
    return arity === undefined || arity === args.keys.length
  })
  const typed = counted.filter((node) => acceptsTypes(node, args))
  return typed.length > 0 ? typed : counted
}

export function fits(node: BaseASTNode, args: CallArguments): boolean {
  const arity = arityOf(node)
  const counted = arity === undefined || arity === args.keys.length
  return counted && acceptsTypes(node, args)
}

function arityOf(node: BaseASTNode): number | undefined {
  if (node.type === 'VariableDeclaration') {
    const variable = node as VariableDeclaration
    const keys = signatureOf(node)
    return variable.isStateVar
      ? keys.split(',').length - Number(keys === '')
      : undefined
  }
  return PARAMETERIZED.includes(node.type)
    ? parametersOf(node).length
    : undefined
}

const PARAMETERIZED = [
  'FunctionDefinition',
  'EventDefinition',
  'CustomErrorDefinition',
]

function acceptsTypes(node: BaseASTNode, args: CallArguments): boolean {
  if (!PARAMETERIZED.includes(node.type)) {
    return true
  }
  const parameters = parametersOf(node)
  const positional = args.keys.length - args.names.length
  return parameters.every((p, i) => {
    const named = args.names.indexOf(p.name ?? '')
    if (i >= positional && named === -1) {
      return false
    }
    const key = i < positional ? args.keys[i] : args.keys[positional + named]
    const parameter = typeKey(p.typeName) ?? ''
    if (key === NUMBER_LITERAL) {
      return parameter.startsWith('uint') || parameter.startsWith('int')
    }
    return key === undefined || parameter === key || widens(key, parameter)
  })
}

// Integers convert implicitly to a wider integer of the same signedness.
function widens(from: string, to: string): boolean {
  for (const prefix of ['uint', 'int']) {
    if (from.startsWith(prefix) && to.startsWith(prefix)) {
      return bitsOf(from, prefix) <= bitsOf(to, prefix)
    }
  }
  return false
}

function bitsOf(type: string, prefix: string): number {
  const bits = type.slice(prefix.length)
  return bits === '' ? 256 : Number(bits)
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
    const address =
      typeof value === 'string'
        ? ChainSpecificAddress.tryParse(value)
        : undefined
    if (address !== undefined) {
      return address
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

// `f{value: x}()` and, before 0.7, `f.value(x)()` call `f`.
export function unwrapCallOptions(expression: Expression): Expression {
  let current = expression
  for (;;) {
    if (current.type === 'NameValueExpression') {
      current = (current as NameValueExpression).expression
    } else if (isLegacyCallOption(current)) {
      current = ((current as FunctionCall).expression as MemberAccess)
        .expression
    } else {
      return current
    }
  }
}

export function isLegacyCallOption(node: BaseASTNode): boolean {
  const call = node as FunctionCall
  if (node.type !== 'FunctionCall' || call.arguments.length !== 1) {
    return false
  }
  const callee = call.expression as MemberAccess
  return callee.type === 'MemberAccess' && isOptionName(callee.memberName)
}

export function isOptionName(name: string): boolean {
  return name === 'value' || name === 'gas'
}

// A bare type name means the type as seen from the declaring contract, also
// inside mappings and arrays: a library's `mapping(uint256 => Node)` is its Node.
export function qualifiedType(
  index: SourceIndex,
  type: TypeName | null | undefined,
  declaration: BaseASTNode,
): TypeName | undefined {
  const owner = index.contractOf(declaration)
  if (type === null || type === undefined || owner === undefined) {
    return type ?? undefined
  }
  const wrappers: TypeName[] = []
  let current: TypeName = type
  while (current.type === 'Mapping' || current.type === 'ArrayTypeName') {
    wrappers.push(current)
    current = elementType(current) as TypeName
  }
  const namePath = (current as UserDefinedTypeName).namePath
  let rebuilt: TypeName = current
  if (
    current.type === 'UserDefinedTypeName' &&
    !namePath.includes('.') &&
    index.named(owner, namePath).length > 0
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
