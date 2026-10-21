import { assert } from '@l2beat/shared-pure'
import type {
  BaseASTNode,
  BinaryOperation,
  CatchClause,
  ContractDefinition,
  Expression,
  FunctionCall,
  FunctionDefinition,
  Identifier,
  ModifierDefinition,
  TryStatement,
  TupleExpression,
  UnaryOperation,
  VariableDeclaration,
  VariableDeclarationStatement,
} from '@mradomski/fast-solidity-parser'
import { childrenOf, parameterSignature, type SourceIndex } from './SourceIndex'

export interface Scope {
  index: SourceIndex
  contract: string | undefined
  callable: FunctionDefinition | ModifierDefinition | undefined
  offset: number
}

export type Declaration =
  | {
      kind: 'variable'
      node: VariableDeclaration
      isState: boolean
      initialValue: Expression | null
    }
  | { kind: 'functions'; nodes: FunctionDefinition[] }
  | { kind: 'contract'; node: ContractDefinition }
  // Same-arity overloads of an event or error.
  | { kind: 'overloads'; nodes: BaseASTNode[]; name: string }
  | { kind: 'other'; node: BaseASTNode; name: string }

export function scopeAt(
  index: SourceIndex,
  ancestors: BaseASTNode[],
  offset: number,
): Scope {
  let contract: string | undefined
  let callable: Scope['callable']
  for (const node of ancestors) {
    if (node.type === 'ContractDefinition') {
      contract = (node as ContractDefinition).name
    }
    if (node.type === 'FunctionDefinition') {
      callable = node as FunctionDefinition
    }
    if (node.type === 'ModifierDefinition') {
      callable = node as ModifierDefinition
    }
  }
  return { index, contract, callable, offset }
}

export function resolveName(
  scope: Scope,
  name: string,
  arity: number | undefined,
): Declaration | undefined {
  const local = findLocal(scope, name)
  if (local !== undefined) {
    return local
  }
  const { index, contract } = scope
  if (contract !== undefined) {
    const variable = index.findStateVariable(contract, name)
    if (variable !== undefined) {
      return {
        kind: 'variable',
        node: variable,
        isState: true,
        initialValue:
          variable.isDeclaredConst || variable.isImmutable
            ? variable.expression
            : null,
      }
    }
    const privateFunctions = ownPrivateFunctions(index, contract, name, arity)
    const privateSignatures = privateFunctions.map(parameterSignature)
    const dispatch = index.dispatchContract(contract)
    const functions = [
      ...privateFunctions,
      ...index
        .findFunctions(dispatch, name, arity)
        .filter((fn) => !privateSignatures.includes(parameterSignature(fn))),
    ]
    if (functions.length > 0) {
      return { kind: 'functions', nodes: functions }
    }
    const members = index.findMembers(contract, name, arity)
    if (members.length > 1) {
      return { kind: 'overloads', nodes: members, name }
    }
    const member = members[0] ?? index.findMember(contract, name)
    if (member !== undefined) {
      return { kind: 'other', node: member, name }
    }
  }
  const freeFunctions = index.findFreeFunctions(name, arity)
  if (freeFunctions.length > 0) {
    return { kind: 'functions', nodes: freeFunctions }
  }
  const topLevel = index.findTopLevel(name)
  if (topLevel?.type === 'ContractDefinition') {
    return { kind: 'contract', node: topLevel as ContractDefinition }
  }
  if (topLevel !== undefined) {
    return { kind: 'other', node: topLevel, name }
  }
  return undefined
}

// `try f() returns (bytes32 slot) { ... } catch Error(string memory reason) { ... }`
// declares variables that are visible only inside their own block.
function clauseParameter(
  node: BaseASTNode,
  name: string,
  offset: number,
): VariableDeclaration | undefined {
  if (node.type === 'TryStatement') {
    const statement = node as TryStatement
    if (encloses(statement.body, offset)) {
      return statement.returnParameters?.find((p) => p.name === name)
    }
  }
  if (node.type === 'CatchClause') {
    const clause = node as CatchClause
    if (encloses(clause.body, offset)) {
      return clause.parameters?.find((p) => p.name === name)
    }
  }
  return undefined
}

const BLOCKS = ['Block', 'ForStatement', 'UncheckedStatement']

function encloses(node: BaseASTNode, offset: number): boolean {
  const range = node.range
  return range !== undefined && range[0] <= offset && offset <= range[1]
}

function findLocal(scope: Scope, name: string): Declaration | undefined {
  const { callable, offset } = scope
  if (callable === undefined) {
    return undefined
  }
  let found: Declaration | undefined
  let foundStart = -1
  const stack: BaseASTNode[] = callable.body ? [callable.body] : []
  while (stack.length > 0) {
    const node = stack.pop()
    if (node === undefined || (node.range?.[0] ?? 0) > offset) {
      continue
    }
    // A block the cursor is not in has ended, and so have its locals.
    if (BLOCKS.includes(node.type) && !encloses(node, offset)) {
      continue
    }
    if (node.type === 'VariableDeclarationStatement') {
      const statement = node as VariableDeclarationStatement
      const variables = statement.variables as (VariableDeclaration | null)[]
      const variable = variables.find((v) => v?.name === name)
      const start = statement.range?.[0] ?? 0
      if (variable && start < offset && start > foundStart) {
        // A later write may reach the use instead of the initializer.
        const initialValue =
          variables.length === 1 && !isAssigned(callable, name)
            ? statement.initialValue
            : null
        found = {
          kind: 'variable',
          node: variable,
          isState: false,
          initialValue,
        }
        foundStart = start
      }
    }
    const clauseVariable = clauseParameter(node, name, offset)
    const start = node.range?.[0] ?? 0
    if (clauseVariable !== undefined && start > foundStart) {
      found = {
        kind: 'variable',
        node: clauseVariable,
        isState: false,
        initialValue: null,
      }
      foundStart = start
    }
    stack.push(...childrenOf(node))
  }
  if (found !== undefined) {
    return found
  }
  const parameters = [
    ...(callable.parameters ?? []),
    ...('returnParameters' in callable
      ? (callable.returnParameters ?? [])
      : []),
  ]
  const parameter = parameters.find((p) => p.name === name)
  if (parameter !== undefined) {
    return {
      kind: 'variable',
      node: parameter,
      isState: false,
      initialValue: null,
    }
  }
  return undefined
}

// Private functions are bound statically, a derived contract cannot override
// them.
function ownPrivateFunctions(
  index: SourceIndex,
  contract: string,
  name: string,
  arity: number | undefined,
): FunctionDefinition[] {
  const members = index.contracts.get(contract)?.node.subNodes ?? []
  return members.filter((node): node is FunctionDefinition => {
    const fn = node as FunctionDefinition
    return (
      node.type === 'FunctionDefinition' &&
      fn.name === name &&
      fn.visibility === 'private' &&
      (arity === undefined || fn.parameters.length === arity)
    )
  })
}

const writtenDuringCall = new WeakMap<BaseASTNode, Set<string>>()

// Applied modifiers and the internal functions it calls run in the same call,
// so their writes count too.
export function isWrittenInCall(scope: Scope, name: string): boolean {
  const callable = scope.callable
  if (callable === undefined) {
    return false
  }
  let names = writtenDuringCall.get(callable)
  if (names === undefined) {
    names = namesWrittenDuring(scope, callable)
    writtenDuringCall.set(callable, names)
  }
  return names.has(name)
}

function namesWrittenDuring(
  scope: Scope,
  callable: FunctionDefinition | ModifierDefinition,
): Set<string> {
  const names = new Set<string>()
  const visited = new Set<BaseASTNode>()
  const callables = [callable]
  while (callables.length > 0) {
    const current = callables.pop()
    assert(current !== undefined)
    if (visited.has(current)) {
      continue
    }
    visited.add(current)
    if (current.type === 'FunctionDefinition') {
      callables.push(...appliedModifiers(scope, current))
    }
    const nodes: BaseASTNode[] = current.body ? [current.body] : []
    while (nodes.length > 0) {
      const node = nodes.pop()
      assert(node !== undefined)
      for (const written of writtenNames(node)) {
        names.add(written)
      }
      if (node.type === 'FunctionCall') {
        callables.push(...internalCallees(scope, node as FunctionCall))
      }
      nodes.push(...childrenOf(node))
    }
  }
  return names
}

function internalCallees(
  scope: Scope,
  call: FunctionCall,
): FunctionDefinition[] {
  if (call.expression.type !== 'Identifier') {
    return []
  }
  const name = (call.expression as Identifier).name
  const declaration = resolveName(scope, name, call.arguments.length)
  return declaration?.kind === 'functions'
    ? declaration.nodes.filter((fn) => fn.body !== null)
    : []
}

function appliedModifiers(
  scope: Scope,
  fn: FunctionDefinition,
): ModifierDefinition[] {
  return fn.modifiers.flatMap((invocation) => {
    const declaration = resolveName(scope, invocation.name, undefined)
    return declaration?.kind === 'other' &&
      declaration.node.type === 'ModifierDefinition'
      ? [declaration.node as ModifierDefinition]
      : []
  })
}

function isAssigned(
  callable: FunctionDefinition | ModifierDefinition,
  name: string,
): boolean {
  const stack: BaseASTNode[] = callable.body ? [callable.body] : []
  while (stack.length > 0) {
    const node = stack.pop()
    assert(node !== undefined)
    if (writtenNames(node).includes(name)) {
      return true
    }
    stack.push(...childrenOf(node))
  }
  return false
}

function writtenNames(node: BaseASTNode): string[] {
  if (node.type === 'BinaryOperation') {
    const operation = node as BinaryOperation
    return operation.operator === '=' ? targetNames(operation.left) : []
  }
  if (node.type === 'UnaryOperation') {
    const operation = node as UnaryOperation
    return operation.operator === 'delete'
      ? targetNames(operation.subExpression)
      : []
  }
  return []
}

function targetNames(target: BaseASTNode): string[] {
  const targets =
    target.type === 'TupleExpression'
      ? (target as TupleExpression).components
      : [target]
  return targets.flatMap((t) =>
    t?.type === 'Identifier' ? [(t as Identifier).name] : [],
  )
}
