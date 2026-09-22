/**
 * Compiler observations, as flat relations, from one source unit's AST.
 *
 * Everything here is what the compiler said, nothing is inferred: which
 * node is inside which, which identifier refers to which declaration, which
 * expression is written, which event a statement emits, which function a
 * call names. Inference (transitive writers, entry points, guards) is the
 * Datalog program's job, so that the reasoning is a page of rules that can
 * be read and changed, not a walker with special cases. Same division as
 * the repository's `queryable-facts`.
 *
 * Node ids are the compiler's, unique within one compilation. A prepared
 * contract has one compilation per source (proxy, implementations), so the
 * assembler offsets ids per source before the relations are merged.
 */
import type { SolcNode } from './solc'

export interface AstRelations {
  /** (id, name, kind: contract|interface|library|abstract) */
  contract: [number, string, string][]
  /** (contract, base) for every contract in the linearisation, self included. */
  inherits: [number, number][]
  /** (id, name, typeString, contract, visibility, mutability: mutable|immutable|constant) */
  stateVariable: [number, string, string, number, string, string][]
  /** (id, name, contract, kind: function|constructor|fallback|receive, visibility) */
  functionDefinition: [number, string, number, string, string][]
  /** (id, name, contract) */
  modifierDefinition: [number, string, number][]
  /** (id, name, signature, contract) */
  eventDefinition: [number, string, string, number][]
  /** (function, modifier) for each `modifierInvocation` that names a modifier. */
  modifierInvocation: [number, number][]
  /** (parent, child) direct AST nesting. */
  child: [number, number][]
  /** (node, declaration) for identifiers and member accesses that resolve. */
  reference: [number, number][]
  /** (node, declaration) for the base declaration of an assigned, incremented, deleted, pushed or popped expression. */
  writes: [number, number][]
  /** (node, event) for emit statements. */
  emits: [number, number][]
  /** (call, function) for calls that resolve to a function with a body, called internally or as a library. */
  internalCall: [number, number][]
  /** (local storage pointer, state variable) when the pointer's initial value or an assignment aliases state. */
  storagePointer: [number, number][]
}

export function emptyRelations(): AstRelations {
  return {
    contract: [],
    inherits: [],
    stateVariable: [],
    functionDefinition: [],
    modifierDefinition: [],
    eventDefinition: [],
    modifierInvocation: [],
    child: [],
    reference: [],
    writes: [],
    emits: [],
    internalCall: [],
    storagePointer: [],
  }
}

export function extractRelations(sourceUnit: SolcNode): AstRelations {
  const relations = emptyRelations()
  const declarations = indexDeclarations(sourceUnit)
  const walk = (
    node: SolcNode,
    parent: number | undefined,
    contract: number,
  ) => {
    const id = node.id
    if (typeof id !== 'number') {
      return
    }
    if (parent !== undefined) {
      relations.child.push([parent, id])
    }
    const scope = node.nodeType === 'ContractDefinition' ? id : contract
    readNode(node, scope, declarations, relations)
    for (const value of Object.values(node)) {
      for (const childNode of childNodes(value)) {
        walk(childNode, id, scope)
      }
    }
  }
  walk(sourceUnit, undefined, -1)
  return relations
}

type Declarations = Map<number, SolcNode>

function indexDeclarations(root: SolcNode): Declarations {
  const index: Declarations = new Map()
  const visit = (value: unknown) => {
    if (!isNode(value)) {
      if (Array.isArray(value)) value.forEach(visit)
      return
    }
    if (typeof value.id === 'number' && typeof value.nodeType === 'string') {
      index.set(value.id, value)
    }
    Object.values(value).forEach(visit)
  }
  visit(root)
  return index
}

function readNode(
  node: SolcNode,
  contract: number,
  declarations: Declarations,
  out: AstRelations,
): void {
  const id = node.id as number
  switch (node.nodeType) {
    case 'ContractDefinition':
      out.contract.push([
        id,
        str(node.name),
        node.abstract === true ? 'abstract' : str(node.contractKind),
      ])
      for (const base of numbers(node.linearizedBaseContracts)) {
        out.inherits.push([id, base])
      }
      return
    case 'VariableDeclaration':
      if (node.stateVariable === true) {
        out.stateVariable.push([
          id,
          str(node.name),
          typeString(node),
          contract,
          str(node.visibility),
          node.constant === true
            ? 'constant'
            : node.mutability === 'immutable'
              ? 'immutable'
              : 'mutable',
        ])
      }
      return
    case 'VariableDeclarationStatement':
      // `Entry storage e = entries[k];` makes writes through `e` writes of `entries`.
      for (const declared of childNodes(node.declarations)) {
        if (declared.storageLocation !== 'storage') continue
        const target = baseDeclaration(node.initialValue, declarations)
        if (target !== undefined && typeof declared.id === 'number') {
          out.storagePointer.push([declared.id, target])
        }
      }
      return
    case 'FunctionDefinition':
      out.functionDefinition.push([
        id,
        str(node.name),
        contract,
        str(node.kind ?? 'function'),
        str(node.visibility),
      ])
      for (const invocation of childNodes(node.modifiers)) {
        const modifier = referenced(invocation.modifierName)
        if (
          modifier !== undefined &&
          declarations.get(modifier)?.nodeType === 'ModifierDefinition'
        ) {
          out.modifierInvocation.push([id, modifier])
        }
      }
      return
    case 'ModifierDefinition':
      out.modifierDefinition.push([id, str(node.name), contract])
      return
    case 'EventDefinition':
      out.eventDefinition.push([
        id,
        str(node.name),
        eventSignature(node),
        contract,
      ])
      return
    case 'Identifier':
    case 'MemberAccess':
    case 'IdentifierPath': {
      const declaration = referenced(node)
      if (declaration !== undefined) out.reference.push([id, declaration])
      return
    }
    case 'Assignment':
      for (const target of assignedComponents(node.leftHandSide)) {
        const declaration = baseDeclaration(target, declarations)
        if (declaration !== undefined) {
          out.writes.push([id, declaration])
          aliasStoragePointer(target, node.rightHandSide, declarations, out)
        }
      }
      return
    case 'UnaryOperation':
      if (['++', '--', 'delete'].includes(str(node.operator))) {
        const declaration = baseDeclaration(node.subExpression, declarations)
        if (declaration !== undefined) out.writes.push([id, declaration])
      }
      return
    case 'EmitStatement': {
      const call = node.eventCall
      const event = isNode(call) ? referenced(call.expression) : undefined
      if (event !== undefined) out.emits.push([id, event])
      return
    }
    case 'FunctionCall': {
      if (node.kind !== 'functionCall') return
      const expression = node.expression
      if (!isNode(expression)) return
      if (
        expression.nodeType === 'MemberAccess' &&
        ['push', 'pop'].includes(str(expression.memberName))
      ) {
        const declaration = baseDeclaration(expression.expression, declarations)
        if (declaration !== undefined) out.writes.push([id, declaration])
        return
      }
      const callee = referenced(expression)
      const target = callee === undefined ? undefined : declarations.get(callee)
      if (
        callee !== undefined &&
        target?.nodeType === 'FunctionDefinition' &&
        target.implemented !== false &&
        isInternalCallType(expression)
      ) {
        out.internalCall.push([id, callee])
      }
      return
    }
  }
}

/**
 * `s = map[k]` on a local storage pointer makes later writes through `s`
 * writes of `map`; recorded when both sides resolve.
 */
function aliasStoragePointer(
  target: SolcNode,
  value: unknown,
  declarations: Declarations,
  out: AstRelations,
): void {
  if (target.nodeType !== 'Identifier') return
  const local = referenced(target)
  if (local === undefined) return
  if (declarations.get(local)?.storageLocation !== 'storage') return
  const state = baseDeclaration(value, declarations)
  if (state !== undefined) out.storagePointer.push([local, state])
}

/** `(a, b) = f()` writes both; a plain target writes itself. */
function assignedComponents(target: unknown): SolcNode[] {
  if (!isNode(target)) return []
  if (target.nodeType === 'TupleExpression') {
    return childNodes(target.components).flatMap(assignedComponents)
  }
  return [target]
}

/**
 * `a.b[c].d` → the declaration of `a`, through index and member accesses;
 * for a member access on a struct or contract the base is what is stored.
 */
function baseDeclaration(
  expression: unknown,
  declarations: Declarations,
): number | undefined {
  let current = expression
  while (isNode(current)) {
    switch (current.nodeType) {
      case 'IndexAccess':
        current = current.baseExpression
        continue
      case 'IndexRangeAccess':
        current = current.baseExpression
        continue
      case 'MemberAccess':
        current = current.expression
        continue
      case 'FunctionCall':
        // `map[k].push(x)` hangs off a member access; other calls do not name storage.
        return undefined
      case 'Identifier': {
        const declaration = referenced(current)
        if (declaration === undefined) return undefined
        const node = declarations.get(declaration)
        return node?.nodeType === 'VariableDeclaration'
          ? declaration
          : undefined
      }
      default:
        return undefined
    }
  }
  return undefined
}

function isInternalCallType(expression: SolcNode): boolean {
  const descriptions = expression.typeDescriptions
  const identifier = isNode(descriptions)
    ? str(descriptions.typeIdentifier)
    : ''
  return (
    identifier.startsWith('t_function_internal') ||
    identifier.startsWith('t_function_delegatecall')
  )
}

function referenced(node: unknown): number | undefined {
  if (!isNode(node)) return undefined
  const declaration = node.referencedDeclaration
  return typeof declaration === 'number' && declaration >= 0
    ? declaration
    : undefined
}

function eventSignature(event: SolcNode): string {
  const parameters = isNode(event.parameters)
    ? childNodes(event.parameters.parameters)
    : []
  return `${str(event.name)}(${parameters.map(canonicalType).join(',')})`
}

/** `contract IFoo` → `address`, `struct S memory` → its tuple, as the ABI spells them. */
function canonicalType(parameter: SolcNode): string {
  const type = typeString(parameter)
  return type
    .replace(/^(contract|enum) \S+/, (_, kind) =>
      kind === 'contract' ? 'address' : 'uint8',
    )
    .replace(/ (memory|storage|calldata)( pointer)?$/, '')
    .replace(/^struct \S+/, 'tuple')
    .replace(/address payable/, 'address')
}

function typeString(node: SolcNode): string {
  const descriptions = node.typeDescriptions
  return isNode(descriptions) ? str(descriptions.typeString) : ''
}

function childNodes(value: unknown): SolcNode[] {
  if (isNode(value)) return [value]
  if (Array.isArray(value)) return value.filter(isNode)
  return []
}

function numbers(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((v): v is number => typeof v === 'number')
    : []
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function isNode(value: unknown): value is SolcNode {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
