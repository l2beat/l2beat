import {
  Bytes,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import type { FlatEntry } from '../FlatWorkspace'
import {
  type CompiledSource,
  deployedContract,
  type Oracle,
  selectorOf,
  type Truth,
  unknown,
  unwrapOptions,
} from './oracle'
import type {
  ContractNode,
  ExpressionNode,
  FunctionNode,
  VariableNode,
} from './SolcAst'
import type { SolcNode } from './solc'

export interface EvaluationContext {
  oracle: Oracle
  entry: FlatEntry
  source: CompiledSource
  caller: ContractNode
  call: ExpressionNode
}

type Evaluated =
  | { kind: 'address'; address: ChainSpecificAddress }
  | Exclude<Truth, { kind: 'known' } | { kind: 'outside' }>

type Unwound =
  | { next: ExpressionNode; getter?: string }
  | { base: 'self'; getter?: string }
  | { base: 'storage'; variable: VariableNode }
  | { base: 'literal'; address: ChainSpecificAddress }
  | { stop: Evaluated }

const STEPS_MAX = 64

// Unwinds to something the chain can answer, then replays the getters back up.
export async function evaluateAddress(
  context: EvaluationContext,
  expression: ExpressionNode,
): Promise<Evaluated> {
  const getters: string[] = []
  let current = expression
  for (let i = 0; i < STEPS_MAX; i++) {
    const unwound = unwind(context, current)
    if ('stop' in unwound) {
      return unwound.stop
    }
    if ('getter' in unwound && unwound.getter !== undefined) {
      getters.push(unwound.getter)
    }
    if ('next' in unwound) {
      current = unwound.next
      continue
    }
    const base = await readBase(context, unwound)
    if (base.kind !== 'address') {
      return base
    }
    return await applyGetters(context, base.address, getters.reverse())
  }
  return unknown('expression too deep') as Evaluated
}

function unwind(
  context: EvaluationContext,
  expression: ExpressionNode,
): Unwound {
  const { ast } = context.source
  switch (expression.nodeType) {
    case 'FunctionCall':
      return unwindCall(context, expression)
    case 'Identifier': {
      if (expression.name === 'this') {
        return { base: 'self' }
      }
      const declaration = ast.node(expression.referencedDeclaration)
      if (declaration?.nodeType !== 'VariableDeclaration') {
        return { stop: stop('unknown', 'identifier') }
      }
      return unwindVariable(context, declaration as VariableNode)
    }
    case 'MemberAccess': {
      const constant = ast.node<VariableNode>(expression.referencedDeclaration)
      if (constant?.constant && constant.value) {
        return { next: constant.value }
      }
      return stopUnlessInput(context, expression, 'member access')
    }
    case 'Literal':
      return unwindLiteral(context, expression)
    case 'TupleExpression': {
      const only =
        expression.components?.length === 1 ? expression.components[0] : null
      return only ? { next: only } : { stop: stop('unknown', 'tuple') }
    }
    case 'IndexAccess':
      return stopUnlessInput(context, expression, 'index access')
    default:
      return stopUnlessInput(context, expression, expression.nodeType)
  }
}

function unwindCall(context: EvaluationContext, call: ExpressionNode): Unwound {
  const args = call.arguments ?? []
  const argument = args[0]
  if (call.kind === 'typeConversion' && argument !== undefined) {
    // bytes20(bytes32) keeps the high bytes, reading the slot takes the low.
    if (isFixedBytes(call) || isFixedBytes(argument)) {
      return { stop: stop('unknown', 'fixed bytes conversion') }
    }
    return { next: argument }
  }
  const callee = unwrapOptions(call.expression as ExpressionNode)
  const declaration = context.source.ast.node<FunctionNode | VariableNode>(
    callee.referencedDeclaration,
  )
  if (args.length > 0) {
    return stopUnlessInput(context, call, 'call with arguments')
  }
  if (callee.nodeType === 'MemberAccess' && callee.expression) {
    const getter = declaration ? selectorOf(declaration) : undefined
    return getter
      ? { next: callee.expression, getter }
      : { stop: stop('unknown', 'external call without selector') }
  }
  if (declaration?.nodeType !== 'FunctionDefinition') {
    return { stop: stop('unknown', 'call') }
  }
  const fn = declaration as FunctionNode
  // Called over RPC it would see another msg.sender than the real caller.
  if (fn.body && readsTransaction(context, fn.body)) {
    return { stop: stop('dynamic', 'reads msg or tx') }
  }
  const selector = selectorOf(fn)
  if (selector !== undefined) {
    return { base: 'self', getter: selector }
  }
  const statements = fn.body?.statements ?? []
  const only = statements.length === 1 ? statements[0] : undefined
  const returned = (only as { expression?: ExpressionNode } | undefined)
    ?.expression
  if (only?.nodeType === 'Return' && returned) {
    return { next: returned }
  }
  return stopUnlessInput(context, call, 'internal function')
}

// The oracle cannot evaluate this, but if it reads a parameter or msg.* then
// nobody can: the answer depends on the transaction.
function stopUnlessInput(
  context: EvaluationContext,
  expression: ExpressionNode,
  reason: string,
): Unwound {
  const { ast } = context.source
  const visited = new Set<number>()
  const stack: SolcNode[] = [expression]
  while (stack.length > 0) {
    const node = stack.pop() as ExpressionNode
    if (visited.has(node.id)) {
      continue
    }
    visited.add(node.id)
    if (node.nodeType === 'Identifier' && isInput(context, node)) {
      return { stop: stop('dynamic', reason) }
    }
    const local = ast.node<VariableNode>(node.referencedDeclaration)
    const declaredBy = local ? ast.parent(local) : undefined
    const initialValue = (declaredBy as { initialValue?: SolcNode } | undefined)
      ?.initialValue
    if (local?.stateVariable === false && initialValue) {
      stack.push(initialValue)
    }
    stack.push(...ast.children(node))
  }
  return { stop: stop('unknown', reason) }
}

function readsTransaction(context: EvaluationContext, body: SolcNode): boolean {
  const { ast } = context.source
  const stack: SolcNode[] = [body]
  while (stack.length > 0) {
    const node = stack.pop() as ExpressionNode
    if (
      node.nodeType === 'Identifier' &&
      (node.name === 'msg' || node.name === 'tx')
    ) {
      return true
    }
    stack.push(...ast.children(node))
  }
  return false
}

function isInput(
  context: EvaluationContext,
  identifier: ExpressionNode,
): boolean {
  if (identifier.name === 'msg' || identifier.name === 'tx') {
    return true
  }
  const { ast } = context.source
  const declaration = ast.node<VariableNode>(identifier.referencedDeclaration)
  if (
    declaration?.nodeType !== 'VariableDeclaration' ||
    declaration.stateVariable
  ) {
    return false
  }
  return (
    ast.parent(declaration)?.nodeType === 'ParameterList' ||
    ast.assigned.has(declaration.id)
  )
}

function unwindVariable(
  context: EvaluationContext,
  variable: VariableNode,
): Unwound {
  if (variable.stateVariable) {
    if (variable.constant || variable.mutability === 'constant') {
      return variable.value
        ? { next: variable.value }
        : { stop: stop('unknown', 'constant') }
    }
    if (variable.mutability === 'immutable') {
      const getter = selectorOf(variable) ?? returningGetter(context, variable)
      return getter
        ? { base: 'self', getter }
        : { stop: stop('unknown', 'private immutable') }
    }
    return { base: 'storage', variable }
  }
  const { ast } = context.source
  const parent = ast.parent(variable)
  if (parent?.nodeType === 'ParameterList') {
    return { stop: stop('dynamic', 'parameter') }
  }
  if (ast.assigned.has(variable.id)) {
    return { stop: stop('unknown', 'reassigned local') }
  }
  const statement = parent as
    | { declarations?: unknown[]; initialValue?: ExpressionNode | null }
    | undefined
  const initialValue = statement?.initialValue
  if (initialValue && statement.declarations?.length === 1) {
    return { next: initialValue }
  }
  return { stop: stop('dynamic', 'local') }
}

function unwindLiteral(
  context: EvaluationContext,
  literal: ExpressionNode,
): Unwound {
  if (literal.kind !== 'number' || typeof literal.value !== 'string') {
    return { stop: stop('unknown', 'literal') }
  }
  const hex = BigInt(literal.value).toString(16).padStart(40, '0')
  const chain = ChainSpecificAddress.chain(context.entry.address)
  const address = ChainSpecificAddress.tryParse(`${chain}:0x${hex}`)
  return address
    ? { base: 'literal', address }
    : { stop: stop('unknown', 'literal') }
}

async function readBase(
  context: EvaluationContext,
  base: Extract<Unwound, { base: string }>,
): Promise<Evaluated> {
  if (base.base === 'literal') {
    return { kind: 'address', address: base.address }
  }
  const deployed = deployedContract(context.source.ast, context.caller)
  if (deployed !== context.source.ast.mainContract) {
    return stop('unknown', 'code of another contract')
  }
  const self = context.entry.address
  if (base.base === 'self') {
    return { kind: 'address', address: self }
  }
  const slot = context.source.storage
    .get(deployed.name)
    ?.find((s) => s.astId === base.variable.id)
  if (slot === undefined) {
    return stop('unknown', 'storage slot')
  }
  const provider = await context.oracle.provider(self)
  const word = await provider.getStorage(self, BigInt(slot.slot))
  const end = 32 - slot.offset
  return toAddress(self, word.slice(end - 20, end))
}

async function applyGetters(
  context: EvaluationContext,
  address: ChainSpecificAddress,
  getters: string[],
): Promise<Evaluated> {
  let current = address
  for (const selector of getters) {
    const provider = await context.oracle.provider(current)
    let result: Bytes
    try {
      result = await provider.callUnbatched(current, Bytes.fromHex(selector))
    } catch {
      return stop('unknown', 'getter reverted')
    }
    if (result.length < 32) {
      return stop('unknown', 'getter returned nothing')
    }
    const next = toAddress(current, result.slice(12, 32))
    if (next.kind !== 'address') {
      return next
    }
    current = next.address
  }
  return { kind: 'address', address: current }
}

// Bytecode is out of reach, but a public `return VARIABLE;` reads the same value.
function returningGetter(
  context: EvaluationContext,
  variable: VariableNode,
): string | undefined {
  const { ast } = context.source
  for (const id of ast.mainContract?.linearizedBaseContracts ?? []) {
    for (const node of ast.node<ContractNode>(id)?.nodes ?? []) {
      const fn = node as FunctionNode
      const statements = fn.body?.statements ?? []
      const returned = (statements[0] as { expression?: ExpressionNode })
        ?.expression
      if (
        node.nodeType === 'FunctionDefinition' &&
        selectorOf(fn) !== undefined &&
        statements.length === 1 &&
        returned?.referencedDeclaration === variable.id
      ) {
        return selectorOf(fn)
      }
    }
  }
  return undefined
}

function toAddress(origin: ChainSpecificAddress, bytes: Bytes): Evaluated {
  const chain = ChainSpecificAddress.chain(origin)
  const address = ChainSpecificAddress.tryParse(`${chain}:${bytes.toString()}`)
  if (address === undefined) {
    return stop('unknown', 'not an address')
  }
  // Unset in this contract, e.g. an implementation whose clones carry the value.
  if (ChainSpecificAddress.address(address) === EthereumAddress.ZERO) {
    return stop('unknown', 'zero address')
  }
  return { kind: 'address', address }
}

function stop(kind: 'dynamic' | 'unknown', reason: string): Evaluated {
  return { kind, reason }
}

function isFixedBytes(expression: ExpressionNode): boolean {
  const type = expression.typeDescriptions?.typeIdentifier ?? ''
  const size = type.slice('t_bytes'.length, 't_bytes'.length + 1)
  return type.startsWith('t_bytes') && size >= '0' && size <= '9'
}
