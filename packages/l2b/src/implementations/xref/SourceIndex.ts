import { assert } from '@l2beat/shared-pure'
import {
  type ArrayTypeName,
  type BaseASTNode,
  type ContractDefinition,
  type ElementaryTypeName,
  type FunctionDefinition,
  parse,
  type StateVariableDeclarationVariable,
  type TypeName,
  type UserDefinedTypeName,
  type UsingForDeclaration,
} from '@mradomski/fast-solidity-parser'

export interface TextPosition {
  line: number
  column: number
}

export interface ContractInfo {
  node: ContractDefinition
  linearization: string[]
}

export class SourceIndex {
  readonly root: BaseASTNode
  readonly contracts = new Map<string, ContractInfo>()
  readonly topLevel: BaseASTNode[]
  readonly mainContract: ContractInfo | undefined
  private readonly lineStarts: number[]

  constructor(
    readonly path: string,
    readonly text: string,
  ) {
    const unit = parse(text, { range: true })
    this.root = unit
    this.topLevel = unit.children
    for (const child of unit.children) {
      if (child.type !== 'ContractDefinition') {
        continue
      }
      const bases = child.baseContracts.map((b) => b.baseName.namePath)
      const linearization = linearize(child.name, bases, this.contracts)
      this.contracts.set(child.name, { node: child, linearization })
    }
    this.mainContract = findMainContract(unit.children, this.contracts)
    this.lineStarts = computeLineStarts(text)
  }

  members(contractName: string): BaseASTNode[] {
    const contract = this.contracts.get(contractName)
    if (contract === undefined) {
      return []
    }
    return contract.linearization.flatMap(
      (name) => this.contracts.get(name)?.node.subNodes ?? [],
    )
  }

  findFunctions(
    contractName: string,
    name: string,
    arity: number | undefined,
  ): FunctionDefinition[] {
    // Most derived first, so overrides hide what they override, and an
    // implementation hides a bodyless declaration listed before it.
    const bySignature = new Map<string, FunctionDefinition>()
    for (const member of this.members(contractName)) {
      if (member.type !== 'FunctionDefinition') {
        continue
      }
      const fn = member as FunctionDefinition
      const fnArity = fn.parameters.length
      if (fn.name !== name || (arity !== undefined && fnArity !== arity)) {
        continue
      }
      const signature = fn.parameters.map((p) => typeKey(p.typeName)).join()
      const found = bySignature.get(signature)
      if (found === undefined || (found.body === null && fn.body !== null)) {
        bySignature.set(signature, fn)
      }
    }
    return [...bySignature.values()]
  }

  // Inside a base contract, virtual calls land in the deployed contract.
  dispatchContract(contractName: string): string {
    const main = this.mainContract
    if (main?.linearization.includes(contractName)) {
      return main.node.name
    }
    return contractName
  }

  findStateVariable(
    contractName: string,
    name: string,
  ): StateVariableDeclarationVariable | undefined {
    for (const member of this.members(contractName)) {
      if (member.type !== 'StateVariableDeclaration') {
        continue
      }
      const declaration = member as unknown as {
        variables: StateVariableDeclarationVariable[]
      }
      const variable = declaration.variables.find((v) => v.name === name)
      if (variable !== undefined) {
        return variable
      }
    }
    return undefined
  }

  findMember(
    contractName: string,
    name: string,
    arity?: number,
  ): BaseASTNode | undefined {
    for (const member of this.members(contractName)) {
      if (declarationName(member) !== name) {
        continue
      }
      const parameters = (member as { parameters?: unknown[] }).parameters
      if (arity === undefined || parameters?.length === arity) {
        return member
      }
    }
    return undefined
  }

  contractOf(node: BaseASTNode): string | undefined {
    const start = node.range?.[0] ?? -1
    for (const [name, contract] of this.contracts) {
      const range = contract.node.range
      if (
        contract.node !== node &&
        range &&
        range[0] <= start &&
        start <= range[1]
      ) {
        return name
      }
    }
    return undefined
  }

  findTopLevel(name: string): BaseASTNode | undefined {
    return this.topLevel.find((child) => declarationName(child) === name)
  }

  findType(namePath: string, contract: string | undefined) {
    const dot = namePath.lastIndexOf('.')
    if (dot !== -1) {
      return this.findMember(namePath.slice(0, dot), namePath.slice(dot + 1))
    }
    return (
      (contract ? this.findMember(contract, namePath) : undefined) ??
      this.findTopLevel(namePath) ??
      [...this.contracts.keys()]
        .map((name) => this.findMember(name, namePath))
        .find((node) => node !== undefined)
    )
  }

  usingForBindings(contractName: string): UsingFor[] {
    const declarations = [
      ...this.topLevel,
      ...this.members(contractName),
    ].filter((node) => node.type === 'UsingForDeclaration')
    return declarations.map((node) => {
      const declaration = node as UsingForDeclaration
      return {
        library: declaration.libraryName ?? undefined,
        functions: declaration.functions,
        type: typeKey(declaration.typeName),
      }
    })
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

  boundFunctions(
    contractName: string,
    receiverType: string | undefined,
    name: string,
    arity: number | undefined,
  ): FunctionDefinition[] {
    const bindings = this.usingForBindings(contractName).filter(
      (b) =>
        b.type === undefined ||
        receiverType === undefined ||
        b.type === receiverType,
    )
    const boundArity = arity === undefined ? undefined : arity + 1
    const found = new Set<FunctionDefinition>()
    for (const binding of bindings) {
      const fromLibrary = binding.library
        ? this.findFunctions(binding.library, name, boundArity)
        : []
      const listed = binding.functions.flatMap((path) => {
        const dot = path.lastIndexOf('.')
        if (path.slice(dot + 1) !== name) {
          return []
        }
        return dot === -1
          ? this.findFreeFunctions(name, boundArity)
          : this.findFunctions(path.slice(0, dot), name, boundArity)
      })
      for (const fn of [...fromLibrary, ...listed]) {
        found.add(fn)
      }
    }
    return [...found]
  }

  findFreeFunctions(
    name: string,
    arity: number | undefined,
  ): FunctionDefinition[] {
    return this.topLevel.filter((node): node is FunctionDefinition => {
      const fn = node as FunctionDefinition
      return (
        node.type === 'FunctionDefinition' &&
        fn.name === name &&
        (arity === undefined || fn.parameters.length === arity)
      )
    })
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
    const offset = lineStart + position.column - 1
    assert(offset <= this.text.length, 'Column out of range')
    return offset
  }

  nameOffset(node: BaseASTNode, name: string): number {
    assert(node.range !== undefined)
    const offset = this.text.indexOf(` ${name}`, node.range[0]) + 1
    if (offset <= 0 || offset > node.range[1]) {
      return node.range[0]
    }
    return offset
  }
}

export interface UsingFor {
  library: string | undefined
  // `using {L.f, g} for T` binds single functions instead of a library.
  functions: string[]
  // Undefined for `using L for *`.
  type: string | undefined
}

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

export const NUMBER_LITERAL = 'number literal'

export function acceptsArguments(
  node: BaseASTNode,
  argumentKeys: (string | undefined)[],
): boolean {
  if (node.type !== 'FunctionDefinition') {
    return true
  }
  const parameters = (node as FunctionDefinition).parameters
  return (
    parameters.length === argumentKeys.length &&
    parameters.every((p, i) => {
      const key = argumentKeys[i]
      const parameter = typeKey(p.typeName) ?? ''
      if (key === NUMBER_LITERAL) {
        return parameter.startsWith('uint') || parameter.startsWith('int')
      }
      return key === undefined || parameter === key || widens(key, parameter)
    })
  )
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

export function declarationName(node: BaseASTNode): string | undefined {
  switch (node.type) {
    case 'ContractDefinition':
    case 'FunctionDefinition':
    case 'ModifierDefinition':
    case 'EventDefinition':
    case 'CustomErrorDefinition':
    case 'StructDefinition':
    case 'EnumDefinition':
    case 'TypeDefinition':
    case 'FileLevelConstant':
      return (node as unknown as { name: string | null }).name ?? undefined
    default:
      return undefined
  }
}

export function childrenOf(node: BaseASTNode): BaseASTNode[] {
  const children: BaseASTNode[] = []
  for (const [key, value] of Object.entries(node)) {
    if (key === 'range' || key === 'loc' || key === 'comments') {
      continue
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (isNode(item)) {
          children.push(item)
        }
      }
    } else if (isNode(value)) {
      children.push(value)
    }
  }
  return children
}

function isNode(value: unknown): value is BaseASTNode {
  return typeof value === 'object' && value !== null && 'type' in value
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
    } else if (contains(child, offset)) {
      return child
    }
  }
  return undefined
}

function contains(node: BaseASTNode, offset: number): boolean {
  if (node.range === undefined) {
    return false
  }
  return node.range[0] <= offset && offset <= node.range[1]
}

// C3, the order Solidity uses to resolve overrides and `super`. Bases listed
// last are the most derived, so they are merged first.
export function linearize(
  name: string,
  bases: string[],
  known: Map<string, ContractInfo>,
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

// The flattener emits the deployed contract after everything it depends on.
function findMainContract(
  children: BaseASTNode[],
  contracts: Map<string, ContractInfo>,
): ContractInfo | undefined {
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i]
    if (child?.type === 'ContractDefinition') {
      return contracts.get((child as ContractDefinition).name)
    }
  }
  return undefined
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
