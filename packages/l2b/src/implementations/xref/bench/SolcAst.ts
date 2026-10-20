import { assert } from '@l2beat/shared-pure'
import type { SolcNode } from './solc'

export interface ContractNode extends SolcNode {
  name: string
  contractKind: 'contract' | 'interface' | 'library'
  linearizedBaseContracts: number[]
  nodes: SolcNode[]
}

export interface FunctionNode extends SolcNode {
  name: string
  kind: string
  implemented: boolean
  baseFunctions?: number[]
  functionSelector?: string
  visibility: string
  parameters: { parameters: VariableNode[] }
  body?: { statements: SolcNode[] } | null
}

export interface VariableNode extends SolcNode {
  name: string
  stateVariable: boolean
  constant: boolean
  mutability?: string
  visibility: string
  functionSelector?: string
  value?: ExpressionNode | null
  typeDescriptions: TypeDescriptions
}

export interface TypeDescriptions {
  typeIdentifier?: string
  typeString?: string
}

export interface ExpressionNode extends SolcNode {
  typeDescriptions?: TypeDescriptions
  referencedDeclaration?: number | null
  name?: string
  memberName?: string
  kind?: string
  expression?: ExpressionNode
  arguments?: ExpressionNode[]
  components?: (ExpressionNode | null)[]
  value?: string | null
  leftHandSide?: ExpressionNode
  operator?: string
  subExpression?: ExpressionNode
}

// Positions in solc are UTF-8 byte offsets; the editor works in UTF-16.
export class SolcAst {
  private readonly nodes = new Map<number, SolcNode>()
  private readonly parents = new Map<number, number>()
  private readonly characterAtByte: number[] | undefined
  readonly contracts: ContractNode[] = []
  readonly assigned = new Set<number>()
  readonly mainContract: ContractNode | undefined

  constructor(
    readonly root: SolcNode,
    text: string,
  ) {
    const stack: SolcNode[] = [root]
    while (stack.length > 0) {
      const node = stack.pop()
      assert(node !== undefined)
      this.nodes.set(node.id, node)
      if (node.nodeType === 'ContractDefinition') {
        this.contracts.push(node as ContractNode)
      }
      if (
        node.nodeType === 'Assignment' ||
        node.nodeType === 'UnaryOperation'
      ) {
        for (const id of assignedIdentifiers(node as ExpressionNode)) {
          this.assigned.add(id)
        }
      }
      for (const child of this.children(node)) {
        this.parents.set(child.id, node.id)
        stack.push(child)
      }
    }
    this.contracts.sort((a, b) => start(a) - start(b))
    this.mainContract = this.contracts[this.contracts.length - 1]
    this.characterAtByte =
      Buffer.byteLength(text) === text.length
        ? undefined
        : mapBytesToCharacters(text)
  }

  node<T extends SolcNode>(id: number | null | undefined): T | undefined {
    return id === null || id === undefined
      ? undefined
      : (this.nodes.get(id) as T | undefined)
  }

  children(node: SolcNode): SolcNode[] {
    return childNodes(node)
  }

  parent(node: SolcNode): SolcNode | undefined {
    return this.node(this.parents.get(node.id))
  }

  enclosing<T extends SolcNode>(
    node: SolcNode,
    nodeType: string,
  ): T | undefined {
    let current = this.parent(node)
    while (current !== undefined && current.nodeType !== nodeType) {
      current = this.parent(current)
    }
    return current as T | undefined
  }

  all(nodeType: string): SolcNode[] {
    return [...this.nodes.values()].filter((n) => n.nodeType === nodeType)
  }

  characterRange(node: SolcNode): [number, number] {
    const [byteStart, byteLength] = sourceRange(node)
    return [this.character(byteStart), this.character(byteStart + byteLength)]
  }

  character(byteOffset: number): number {
    if (this.characterAtByte === undefined) {
      return byteOffset
    }
    const character = this.characterAtByte[byteOffset]
    assert(character !== undefined, 'Byte offset out of range')
    return character
  }
}

export function sourceRange(node: SolcNode): [number, number] {
  const [byteStart, byteLength] = node.src.split(':').map(Number)
  assert(byteStart !== undefined && byteLength !== undefined)
  return [byteStart, byteLength]
}

function assignedIdentifiers(assignment: ExpressionNode): number[] {
  if (assignment.nodeType === 'UnaryOperation') {
    const { operator, subExpression } = assignment
    const changes = operator === '++' || operator === '--'
    const id = subExpression?.referencedDeclaration
    return changes && typeof id === 'number' ? [id] : []
  }
  const left = assignment.leftHandSide
  const targets =
    left?.nodeType === 'TupleExpression' ? left.components : [left]
  return (targets ?? [])
    .map((target) => target?.referencedDeclaration)
    .filter((id): id is number => typeof id === 'number')
}

function start(node: SolcNode): number {
  return sourceRange(node)[0]
}

function childNodes(node: SolcNode): SolcNode[] {
  const children: SolcNode[] = []
  for (const value of Object.values(node)) {
    const items: unknown[] = Array.isArray(value) ? value : [value]
    for (const item of items) {
      if (isSolcNode(item)) {
        children.push(item)
      }
    }
  }
  return children
}

function isSolcNode(value: unknown): value is SolcNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    'nodeType' in value &&
    'id' in value
  )
}

function mapBytesToCharacters(text: string): number[] {
  const characterAtByte: number[] = []
  let character = 0
  for (const symbol of text) {
    const bytes = Buffer.byteLength(symbol)
    for (let i = 0; i < bytes; i++) {
      characterAtByte.push(character)
    }
    character += symbol.length
  }
  characterAtByte.push(character)
  return characterAtByte
}
