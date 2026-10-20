import type {
  BaseASTNode,
  BinaryOperation,
  CatchClause,
  ContractDefinition,
  Expression,
  FunctionDefinition,
  Identifier,
  ModifierDefinition,
  TryStatement,
  TupleExpression,
  VariableDeclaration,
  VariableDeclarationStatement,
} from '@mradomski/fast-solidity-parser'
import { childrenOf, type SourceIndex } from './SourceIndex'

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
        initialValue: variable.expression,
      }
    }
    const privateFunctions = ownPrivateFunctions(index, contract, name, arity)
    if (privateFunctions.length > 0) {
      return { kind: 'functions', nodes: privateFunctions }
    }
    const dispatch = index.dispatchContract(contract)
    const functions = index.findFunctions(dispatch, name, arity)
    if (functions.length > 0) {
      return { kind: 'functions', nodes: functions }
    }
    const member =
      index.findMember(contract, name, arity) ??
      index.findMember(contract, name)
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

function isAssigned(
  callable: FunctionDefinition | ModifierDefinition,
  name: string,
): boolean {
  const stack: BaseASTNode[] = callable.body ? [callable.body] : []
  while (stack.length > 0) {
    const node = stack.pop()
    if (node === undefined) {
      continue
    }
    if (node.type === 'BinaryOperation') {
      const operation = node as BinaryOperation
      if (operation.operator === '=' && writesTo(operation.left, name)) {
        return true
      }
    }
    stack.push(...childrenOf(node))
  }
  return false
}

function writesTo(target: BaseASTNode, name: string): boolean {
  if (target.type === 'Identifier') {
    return (target as Identifier).name === name
  }
  if (target.type === 'TupleExpression') {
    return (target as TupleExpression).components.some(
      (component) =>
        component?.type === 'Identifier' &&
        (component as Identifier).name === name,
    )
  }
  return false
}
