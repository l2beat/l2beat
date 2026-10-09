import { assert } from '@l2beat/shared-pure'
import { type ASTNode, parse } from '@mradomski/fast-solidity-parser'

export type DeclarationKind =
  | 'contract'
  | 'abstract'
  | 'library'
  | 'interface'
  | 'function'

export interface LineSpan {
  first: number
  last: number
}

export interface Declaration {
  kind: DeclarationKind
  body: string
  lines: LineSpan
}

export interface SplitSource {
  declarations: Map<string, Declaration>
  aliases: Map<string, string>
}

export function splitSource(source: string): SplitSource {
  const lineStarts = lineStartOffsets(source)
  const declarations = new Map<string, Declaration>()
  const aliases = new Map<string, string>()
  for (const node of parse(source, { range: true }).children) {
    if (node.type === 'ImportDirective') {
      for (const [name, alias] of node.symbolAliases ?? []) {
        if (alias !== null && alias !== name) {
          aliases.set(alias, name)
        }
      }
      continue
    }
    const unit = unitOf(node)
    if (unit === undefined || declarations.has(unit.name)) {
      continue
    }
    assert(node.range !== undefined)
    const [start, end] = node.range
    declarations.set(unit.name, {
      kind: unit.kind,
      body: source.slice(start, end + 1),
      lines: {
        first: lineNumberOf(lineStarts, start),
        last: lineNumberOf(lineStarts, end),
      },
    })
  }
  return { declarations, aliases }
}

function unitOf(
  node: ASTNode,
): { name: string; kind: DeclarationKind } | undefined {
  if (node.type === 'ContractDefinition') {
    return { name: node.name, kind: node.kind as DeclarationKind }
  }
  if (node.type === 'FunctionDefinition') {
    assert(node.name !== null, 'Unnamed free function')
    return { name: node.name, kind: 'function' }
  }
  return undefined
}

function lineStartOffsets(source: string): number[] {
  const starts = [0]
  for (let i = 0; i < source.length; i++) {
    if (source[i] === '\n') {
      starts.push(i + 1)
    }
  }
  return starts
}

function lineNumberOf(lineStarts: number[], offset: number): number {
  let low = 0
  let high = lineStarts.length - 1
  while (low < high) {
    const middle = Math.ceil((low + high) / 2)
    if ((lineStarts[middle] as number) <= offset) {
      low = middle
    } else {
      high = middle - 1
    }
  }
  return low + 1
}
