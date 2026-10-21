import { assert } from '@l2beat/shared-pure'
import {
  type ArrayTypeName,
  type BaseASTNode,
  type ContractDefinition,
  type ElementaryTypeName,
  type Mapping,
  parse,
  type StateVariableDeclaration,
  type TypeName,
  type UserDefinedTypeName,
  type VariableDeclaration,
} from '@mradomski/fast-solidity-parser'

export interface TextPosition {
  line: number
  column: number
}

export interface Member {
  node: BaseASTNode
  owner: string
}

export interface ContractInfo {
  node: ContractDefinition
  linearization: string[]
  own: Map<string, BaseASTNode[]>
}

export class SourceIndex {
  readonly root: BaseASTNode
  readonly contracts = new Map<string, ContractInfo>()
  readonly topLevel = new Map<string, BaseASTNode[]>()
  readonly mainContract: ContractInfo | undefined
  private readonly lineStarts: number[]

  constructor(
    readonly path: string,
    readonly text: string,
  ) {
    const unit = parse(text, { range: true })
    this.root = unit
    let main: ContractInfo | undefined
    for (const child of unit.children) {
      addNamed(this.topLevel, child)
      if (child.type !== 'ContractDefinition') {
        continue
      }
      const node = child as ContractDefinition
      const bases = node.baseContracts.map((b) => b.baseName.namePath)
      const own = new Map<string, BaseASTNode[]>()
      for (const member of node.subNodes) {
        addNamed(own, member)
      }
      const linearization = linearize(node.name, bases, this.contracts)
      main = { node, linearization, own }
      this.contracts.set(node.name, main)
    }
    // The flattener emits the deployed contract after everything it uses.
    this.mainContract = main
    this.lineStarts = computeLineStarts(text)
  }

  // Every member with this name, most derived first.
  named(contract: string, name: string): Member[] {
    const linearization = this.contracts.get(contract)?.linearization ?? []
    return linearization.flatMap((owner) =>
      (this.contracts.get(owner)?.own.get(name) ?? []).map((node) => ({
        node,
        owner,
      })),
    )
  }

  // Inside a base contract, virtual calls land in the deployed contract.
  dispatchContract(contract: string): string {
    const main = this.mainContract
    return main?.linearization.includes(contract) ? main.node.name : contract
  }

  findType(namePath: string, contract: string | undefined) {
    const dot = namePath.lastIndexOf('.')
    if (dot !== -1) {
      return this.named(namePath.slice(0, dot), namePath.slice(dot + 1))[0]
        ?.node
    }
    const seen = contract ? this.named(contract, namePath)[0]?.node : undefined
    return (
      seen ??
      this.topLevel.get(namePath)?.[0] ??
      [...this.contracts.values()]
        .map((info) => info.own.get(namePath)?.[0])
        .find((node) => node !== undefined)
    )
  }

  contractOf(node: BaseASTNode): string | undefined {
    const start = node.range?.[0] ?? -1
    for (const [name, contract] of this.contracts) {
      const range = contract.node.range
      if (contract.node !== node && range && range[0] <= start) {
        if (start <= range[1]) {
          return name
        }
      }
    }
    return undefined
  }

  pathAt(offset: number): BaseASTNode[] {
    const path = [this.root]
    let node: BaseASTNode | undefined = this.root
    while (node !== undefined) {
      node = childContaining(node, offset)
      if (node !== undefined) {
        path.push(node)
      }
    }
    return path
  }

  positionOf(offset: number): TextPosition {
    assert(offset >= 0 && offset <= this.text.length, 'Offset out of range')
    let low = 0
    let high = this.lineStarts.length - 1
    while (low < high) {
      const middle = Math.ceil((low + high) / 2)
      const start = this.lineStarts[middle]
      assert(start !== undefined)
      if (start <= offset) {
        low = middle
      } else {
        high = middle - 1
      }
    }
    const lineStart = this.lineStarts[low]
    assert(lineStart !== undefined)
    return { line: low + 1, column: offset - lineStart + 1 }
  }

  offsetOf(position: TextPosition): number {
    const lineStart = this.lineStarts[position.line - 1]
    assert(lineStart !== undefined, 'Line out of range')
    const nextLineStart = this.lineStarts[position.line] ?? this.text.length + 1
    const offset = lineStart + position.column - 1
    assert(offset < nextLineStart, 'Column out of range')
    return offset
  }

  // Where the declared name is, whatever whitespace follows the keyword.
  nameOffset(node: BaseASTNode, name: string): number {
    const identifier = (node as VariableDeclaration).identifier
    if (node.type === 'VariableDeclaration' && identifier?.range) {
      return identifier.range[0]
    }
    assert(node.range !== undefined)
    const text = this.text.slice(node.range[0], node.range[1] + 1)
    const [first] = wordOccurrences(text, name)
    return node.range[0] + (first ?? 0)
  }
}

function addNamed(map: Map<string, BaseASTNode[]>, node: BaseASTNode) {
  const named =
    node.type === 'StateVariableDeclaration'
      ? (node as StateVariableDeclaration).variables
      : [node]
  for (const declaration of named) {
    const name =
      declaration.type === 'VariableDeclaration'
        ? (declaration as VariableDeclaration).name
        : declarationName(declaration)
    if (name) {
      map.set(name, [...(map.get(name) ?? []), declaration])
    }
  }
}

export function declarationName(node: BaseASTNode): string | undefined {
  if (!NAMED_DECLARATIONS.includes(node.type)) {
    return undefined
  }
  return (node as unknown as { name: string | null }).name ?? undefined
}

const NAMED_DECLARATIONS = [
  'ContractDefinition',
  'FunctionDefinition',
  'ModifierDefinition',
  'EventDefinition',
  'CustomErrorDefinition',
  'StructDefinition',
  'EnumDefinition',
  'EnumValue',
  'TypeDefinition',
  'FileLevelConstant',
]

export function typeKey(type: TypeName | null | undefined): string | undefined {
  switch (type?.type) {
    case 'ElementaryTypeName': {
      const name = (type as ElementaryTypeName).name
      return ELEMENTARY_ALIASES[name] ?? name
    }
    case 'UserDefinedTypeName': {
      const path = (type as UserDefinedTypeName).namePath
      return path.slice(path.lastIndexOf('.') + 1)
    }
    case 'ArrayTypeName': {
      const array = type as ArrayTypeName
      const base = typeKey(array.baseTypeName)
      const length = array.length as { type?: string; number?: string } | null
      const size = length?.type === 'NumberLiteral' ? length.number : ''
      return base === undefined ? undefined : `${base}[${size}]`
    }
    case 'Mapping':
      return 'mapping'
    default:
      return undefined
  }
}

const ELEMENTARY_ALIASES: Record<string, string> = {
  uint: 'uint256',
  int: 'int256',
  byte: 'bytes1',
}

export function parametersOf(node: BaseASTNode): VariableDeclaration[] {
  return (
    (node as { parameters?: VariableDeclaration[] | null }).parameters ?? []
  )
}

// A state variable's getter takes one key per mapping and one index per array.
export function signatureOf(node: BaseASTNode): string {
  const variable = node as VariableDeclaration
  if (node.type !== 'VariableDeclaration' || !variable.isStateVar) {
    return parametersOf(node)
      .map((p) => typeKey(p.typeName))
      .join()
  }
  const keys: (string | undefined)[] = []
  let type = variable.typeName
  while (type?.type === 'Mapping' || type?.type === 'ArrayTypeName') {
    const mapping = type as Mapping
    keys.push(type.type === 'Mapping' ? typeKey(mapping.keyType) : 'uint256')
    type =
      type.type === 'Mapping'
        ? mapping.valueType
        : (type as ArrayTypeName).baseTypeName
  }
  return keys.join()
}

export function childrenOf(node: BaseASTNode): BaseASTNode[] {
  const children: BaseASTNode[] = []
  for (const [key, value] of Object.entries(node)) {
    if (key === 'range' || key === 'loc' || key === 'comments') {
      continue
    }
    for (const item of Array.isArray(value) ? value : [value]) {
      if (typeof item === 'object' && item !== null && 'type' in item) {
        children.push(item)
      }
    }
  }
  return children
}

// Some nodes carry no range (e.g. a `for` loop's update statement), so the
// search looks through them to their children.
function childContaining(
  node: BaseASTNode,
  offset: number,
): BaseASTNode | undefined {
  const pending = childrenOf(node)
  // The iterator also visits children appended while looping.
  for (const child of pending) {
    if (child.range === undefined) {
      pending.push(...childrenOf(child))
    } else if (child.range[0] <= offset && offset <= child.range[1]) {
      return child
    }
  }
  return undefined
}

// C3, the order Solidity uses to resolve overrides and `super`. Bases listed
// last are the most derived, so they are merged first.
export function linearize(
  name: string,
  bases: string[],
  known: Map<string, { linearization: string[] }>,
): string[] {
  const reversedBases = [...bases].reverse()
  const sequences = [
    ...reversedBases.map((base) => [
      ...(known.get(base)?.linearization ?? [base]),
    ]),
    reversedBases,
  ]
  const result = [name]
  while (true) {
    const remaining = sequences.filter((sequence) => sequence.length > 0)
    if (remaining.length === 0) {
      return result
    }
    const head = remaining
      .map((sequence) => sequence[0])
      .find((candidate) =>
        remaining.every((sequence) => sequence.indexOf(candidate ?? '') <= 0),
      )
    if (head === undefined) {
      return [...new Set([name, ...sequences.flat()])]
    }
    result.push(head)
    for (const sequence of remaining) {
      if (sequence[0] === head) {
        sequence.shift()
      }
    }
  }
}

function computeLineStarts(text: string): number[] {
  const starts = [0]
  let index = text.indexOf('\n')
  while (index !== -1) {
    starts.push(index + 1)
    index = text.indexOf('\n', index + 1)
  }
  return starts
}

export function wordOccurrences(text: string, word: string): number[] {
  const offsets: number[] = []
  let at = text.indexOf(word)
  while (at !== -1) {
    const before = text[at - 1]
    const after = text[at + word.length]
    if (!isIdentifierCharacter(before) && !isIdentifierCharacter(after)) {
      offsets.push(at)
    }
    at = text.indexOf(word, at + word.length)
  }
  return offsets
}

function isIdentifierCharacter(character: string | undefined): boolean {
  if (character === undefined) {
    return false
  }
  return (
    (character >= 'a' && character <= 'z') ||
    (character >= 'A' && character <= 'Z') ||
    (character >= '0' && character <= '9') ||
    character === '_' ||
    character === '$'
  )
}
