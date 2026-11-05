import { assert } from '@l2beat/shared-pure'
import {
  type BaseASTNode,
  type ContractDefinition,
  type FunctionDefinition,
  type ModifierDefinition,
  parse,
} from '@mradomski/fast-solidity-parser'

export interface CodeSource {
  name: string
  code: string
}

export interface CodeMatch {
  sourceIndex: number
  offset: number
  // 1-based, in the text DiscoUI shows.
  line: number
  // The declaration the excerpt shows, end exclusive. Undefined when the
  // snippet is outside every declaration or the source does not parse.
  declaration: { start: number; end: number } | undefined
  isImplementation: boolean
}

export interface CodeAnchor {
  match: CodeMatch
  others: CodeMatch[]
}

// An agent quotes a function header to point at its implementation, and the
// same header is in every interface the contract imports, so a match inside a
// body wins over an earlier one in a declaration.
export function anchorSnippet(
  sources: readonly CodeSource[],
  find: string,
): CodeAnchor | undefined {
  assert(find.length > 0, 'Empty snippet')
  const matches: CodeMatch[] = []
  for (const [sourceIndex, source] of sources.entries()) {
    const offsets = findOffsets(source.code, find)
    if (offsets.length === 0) {
      continue
    }
    const declarations = parseDeclarations(source.code)
    for (const offset of offsets) {
      matches.push(matchIn(source.code, declarations, sourceIndex, offset))
    }
  }
  const match = matches.find((m) => m.isImplementation) ?? matches[0]
  if (match === undefined) {
    return undefined
  }
  return { match, others: matches.filter((m) => m !== match) }
}

// The place in a source the researcher has selected.
export function matchAt(
  source: CodeSource,
  sourceIndex: number,
  offset: number,
): CodeMatch {
  const declarations = parseDeclarations(source.code)
  return matchIn(source.code, declarations, sourceIndex, offset)
}

function matchIn(
  code: string,
  declarations: BaseASTNode[] | undefined,
  sourceIndex: number,
  offset: number,
): CodeMatch {
  const enclosing = declarations?.find((d) => contains(d, offset))
  return {
    sourceIndex,
    offset,
    line: lineAt(code, offset),
    declaration: enclosing && {
      start: rangeOf(enclosing)[0],
      end: rangeOf(enclosing)[1] + 1,
    },
    isImplementation: enclosing !== undefined && isImplementation(enclosing),
  }
}

function findOffsets(code: string, find: string): number[] {
  const offsets: number[] = []
  let offset = code.indexOf(find)
  while (offset !== -1) {
    offsets.push(offset)
    offset = code.indexOf(find, offset + find.length)
  }
  return offsets
}

// Solidity nests neither contracts nor functions, so a contract's members
// and the free top-level declarations are every declaration there is. A
// member comes before its contract, so the first one containing an offset
// is the innermost.
function parseDeclarations(code: string): BaseASTNode[] | undefined {
  let children: BaseASTNode[]
  try {
    children = parse(code, { range: true }).children
  } catch {
    // Not Solidity, like a Vyper source: matches get no declaration.
    return undefined
  }
  const declarations: BaseASTNode[] = []
  for (const child of children) {
    if (child.type === 'ContractDefinition') {
      declarations.push(...(child as ContractDefinition).subNodes)
    }
    declarations.push(child)
  }
  return declarations
}

function isImplementation(node: BaseASTNode): boolean {
  if (node.type === 'FunctionDefinition') {
    return (node as FunctionDefinition).body !== null
  }
  if (node.type === 'ModifierDefinition') {
    return (node as ModifierDefinition).body !== null
  }
  return false
}

function contains(node: BaseASTNode, offset: number): boolean {
  const [start, end] = rangeOf(node)
  return start <= offset && offset <= end
}

function rangeOf(node: BaseASTNode): [number, number] {
  assert(node.range !== undefined, 'Parsed without ranges')
  return node.range
}

export function lineAt(code: string, offset: number): number {
  assert(offset >= 0, 'Offset before the code')
  assert(offset <= code.length, 'Offset past the code')
  let line = 1
  let newline = code.indexOf('\n')
  while (newline !== -1 && newline < offset) {
    line++
    newline = code.indexOf('\n', newline + 1)
  }
  return line
}
