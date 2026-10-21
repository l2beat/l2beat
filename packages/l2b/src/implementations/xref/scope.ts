import { assert } from '@l2beat/shared-pure'
import type {
  BaseASTNode,
  BinaryOperation,
  Block,
  ContractDefinition,
  Expression,
  FileLevelConstant,
  ForStatement,
  FunctionCall,
  FunctionDefinition,
  Identifier,
  MemberAccess,
  ModifierDefinition,
  ModifierInvocation,
  StateVariableDeclarationVariable,
  TupleExpression,
  UnaryOperation,
  UsingForDeclaration,
  VariableDeclaration,
  VariableDeclarationStatement,
} from '@mradomski/fast-solidity-parser'
import {
  childrenOf,
  declarationName,
  type Member,
  type SourceIndex,
  signatureOf,
  typeKey,
} from './SourceIndex'

export interface Scope {
  index: SourceIndex
  ancestors: BaseASTNode[]
  contract: string | undefined
  callable: FunctionDefinition | ModifierDefinition | undefined
  offset: number
}

// What a name stands for, and for a variable the expression it is known to
// hold, if any.
export interface Binding {
  node: BaseASTNode
  value: Expression | null
}

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
    if (
      node.type === 'FunctionDefinition' ||
      node.type === 'ModifierDefinition'
    ) {
      callable = node as FunctionDefinition | ModifierDefinition
    }
  }
  return { index, ancestors, contract, callable, offset }
}

export function lookupName(scope: Scope, name: string): Binding[] {
  const local = findLocal(scope, name)
  if (local !== undefined) {
    return [local]
  }
  const { index, contract } = scope
  if (contract !== undefined) {
    const members = visibleMembers(index, contract, name, contract)
    if (members.length > 0) {
      return members.map((member) => ({
        node: dispatched(index, contract, member),
        value: constantValue(member.node),
      }))
    }
  }
  return (index.topLevel.get(name) ?? []).map((node) => ({
    node,
    value: constantValue(node),
  }))
}

// An override or redeclaration hides what it replaces, an implementation
// hides a bodyless declaration, and a private member is seen only by the
// contract declaring it.
export function visibleMembers(
  index: SourceIndex,
  contract: string,
  name: string,
  from: string | undefined,
): Member[] {
  const bySignature = new Map<string, Member>()
  for (const member of index.named(contract, name)) {
    if (isPrivate(member.node) && member.owner !== from) {
      continue
    }
    const key = `${kindOf(member.node)} ${signatureOf(member.node)}`
    const found = bySignature.get(key)
    if (
      found === undefined ||
      (lacksBody(found.node) && !lacksBody(member.node))
    ) {
      bySignature.set(key, member)
    }
  }
  return [...bySignature.values()]
}

// A public state variable's getter implements a function of an interface.
function kindOf(node: BaseASTNode): string {
  const isState = (node as VariableDeclaration).isStateVar
  return node.type === 'VariableDeclaration' && isState
    ? 'FunctionDefinition'
    : node.type
}

export function lacksBody(node: BaseASTNode): boolean {
  return (node as { body?: unknown }).body === null
}

function isPrivate(node: BaseASTNode): boolean {
  return (node as { visibility?: string }).visibility === 'private'
}

// Private functions bind statically, everything else virtual runs the
// override of the deployed contract.
function dispatched(
  index: SourceIndex,
  contract: string,
  member: Member,
): BaseASTNode {
  const { node } = member
  const main = index.dispatchContract(contract)
  const isVirtual =
    node.type === 'FunctionDefinition' || node.type === 'ModifierDefinition'
  if (!isVirtual || isPrivate(node) || main === contract) {
    return node
  }
  const signature = signatureOf(node)
  const override = visibleMembers(
    index,
    main,
    declarationName(node) ?? '',
    main,
  )
    .map((m) => m.node)
    .find((m) => kindOf(m) === kindOf(node) && signatureOf(m) === signature)
  return override ?? node
}

// Only constants and immutables keep the value they are declared with.
function constantValue(node: BaseASTNode): Expression | null {
  if (node.type === 'FileLevelConstant') {
    return (node as FileLevelConstant).initialValue
  }
  const variable = node as StateVariableDeclarationVariable
  if (node.type === 'VariableDeclaration' && variable.isStateVar) {
    const fixed = variable.isDeclaredConst || variable.isImmutable
    return fixed ? variable.expression : null
  }
  return null
}

// Since 0.7 a contract does not inherit using directives, before it did.
// Code that compiles finds the function among its own directives first.
export function boundFunctions(
  index: SourceIndex,
  contract: string,
  receiverType: string | undefined,
  name: string,
): FunctionDefinition[] {
  const linearization = index.contracts.get(contract)?.linearization ?? []
  const subNodes = (owner: string) =>
    index.contracts.get(owner)?.node.subNodes ?? []
  const own = [...childrenOf(index.root), ...subNodes(contract)]
  for (const nodes of [own, linearization.flatMap(subNodes)]) {
    const found = nodes.flatMap((node) =>
      functionsBoundBy(index, node, receiverType, name),
    )
    if (found.length > 0) {
      return [...new Set(found)]
    }
  }
  return []
}

function functionsBoundBy(
  index: SourceIndex,
  node: BaseASTNode,
  receiverType: string | undefined,
  name: string,
): FunctionDefinition[] {
  if (node.type !== 'UsingForDeclaration') {
    return []
  }
  const using = node as UsingForDeclaration
  const type = typeKey(using.typeName)
  if (
    type !== undefined &&
    receiverType !== undefined &&
    type !== receiverType
  ) {
    return []
  }
  // `using {L.f, g} for T` binds single functions instead of a library.
  const paths = using.libraryName
    ? [`${using.libraryName}.${name}`]
    : using.functions
  return paths.flatMap((path) => {
    const dot = path.lastIndexOf('.')
    if (path.slice(dot + 1) !== name) {
      return []
    }
    const nodes =
      dot === -1
        ? (index.topLevel.get(name) ?? [])
        : visibleMembers(index, path.slice(0, dot), name, undefined).map(
            (m) => m.node,
          )
    return nodes.filter(
      (n): n is FunctionDefinition => n.type === 'FunctionDefinition',
    )
  })
}

// Walking out from the cursor, the nearest declaration wins: an earlier
// statement of an enclosing block, a for loop's initializer, the variables of
// the try or catch clause the cursor is in, then the parameters.
function findLocal(scope: Scope, name: string): Binding | undefined {
  const { ancestors, callable } = scope
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const node = ancestors[i]
    assert(node !== undefined)
    const found = localIn(scope, node, name)
    if (found !== undefined || node === callable) {
      return found
    }
  }
  return undefined
}

function localIn(
  scope: Scope,
  node: BaseASTNode,
  name: string,
): Binding | undefined {
  let variables: (VariableDeclaration | null)[] | null | undefined
  switch (node.type) {
    case 'Block': {
      let found: Binding | undefined
      for (const statement of (node as Block).statements) {
        if ((statement.range?.[0] ?? 0) < scope.offset) {
          found = declaredBy(scope, statement, name) ?? found
        }
      }
      return found
    }
    case 'ForStatement':
      return declaredBy(scope, (node as ForStatement).initExpression, name)
    case 'TryStatement':
    case 'CatchClause': {
      const clause = node as unknown as {
        body: BaseASTNode
        returnParameters?: VariableDeclaration[] | null
        parameters?: VariableDeclaration[] | null
      }
      const range = clause.body.range
      const inBody =
        range && range[0] <= scope.offset && scope.offset <= range[1]
      variables = inBody ? (clause.returnParameters ?? clause.parameters) : null
      break
    }
    case 'FunctionDefinition':
    case 'ModifierDefinition': {
      const callable = node as FunctionDefinition
      variables = [
        ...(callable.parameters ?? []),
        ...(callable.returnParameters ?? []),
      ]
      break
    }
  }
  const variable = variables?.find((v) => v?.name === name)
  return variable ? { node: variable, value: null } : undefined
}

function declaredBy(
  scope: Scope,
  statement: BaseASTNode | null,
  name: string,
): Binding | undefined {
  if (statement?.type !== 'VariableDeclarationStatement') {
    return undefined
  }
  const declaration = statement as VariableDeclarationStatement
  const variables = declaration.variables as (VariableDeclaration | null)[]
  const variable = variables.find((v) => v?.name === name)
  if (!variable) {
    return undefined
  }
  // A later write may reach the use instead of the initializer.
  const single = variables.length === 1 && !isWrittenDuring(scope, name)
  return { node: variable, value: single ? declaration.initialValue : null }
}

const writtenCache = new WeakMap<BaseASTNode, Set<string>>()

// Within one call, what the callable, its modifiers and whatever they call
// write may change a value before it is read. Callees are matched by name,
// which can only make the answer more cautious.
export function isWrittenDuring(scope: Scope, name: string): boolean {
  const { index, contract, callable } = scope
  if (callable === undefined) {
    return false
  }
  let names = writtenCache.get(callable)
  if (names === undefined) {
    names = namesWritten(index, contract, callable)
    writtenCache.set(callable, names)
  }
  return names.has(name)
}

function namesWritten(
  index: SourceIndex,
  contract: string | undefined,
  callable: BaseASTNode,
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
    const nodes = [current]
    while (nodes.length > 0) {
      const node = nodes.pop()
      assert(node !== undefined)
      for (const written of writtenNames(node)) {
        names.add(written)
      }
      const callee = calleeName(node)
      if (callee !== undefined) {
        callables.push(...callablesNamed(index, contract, callee))
      }
      nodes.push(...childrenOf(node))
    }
  }
  return names
}

function calleeName(node: BaseASTNode): string | undefined {
  if (node.type === 'ModifierInvocation') {
    return (node as ModifierInvocation).name
  }
  if (node.type !== 'FunctionCall') {
    return undefined
  }
  const callee = (node as FunctionCall).expression
  if (callee.type === 'Identifier') {
    return (callee as Identifier).name
  }
  const access = callee as MemberAccess
  const base = access.expression as Identifier | undefined
  const isSelf = base?.name === 'this' || base?.name === 'super'
  return callee.type === 'MemberAccess' && isSelf
    ? access.memberName
    : undefined
}

function callablesNamed(
  index: SourceIndex,
  contract: string | undefined,
  name: string,
): BaseASTNode[] {
  const members = contract
    ? index.named(index.dispatchContract(contract), name).map((m) => m.node)
    : []
  return [...members, ...(index.topLevel.get(name) ?? [])].filter(
    (node) =>
      node.type === 'FunctionDefinition' || node.type === 'ModifierDefinition',
  )
}

function writtenNames(node: BaseASTNode): string[] {
  let target: BaseASTNode | undefined
  if (node.type === 'BinaryOperation') {
    const operation = node as BinaryOperation
    target = operation.operator === '=' ? operation.left : undefined
  }
  if (node.type === 'UnaryOperation') {
    const operation = node as UnaryOperation
    target =
      operation.operator === 'delete' ? operation.subExpression : undefined
  }
  const targets =
    target?.type === 'TupleExpression'
      ? (target as TupleExpression).components
      : [target]
  return targets.flatMap((t) =>
    t?.type === 'Identifier' ? [(t as Identifier).name] : [],
  )
}
