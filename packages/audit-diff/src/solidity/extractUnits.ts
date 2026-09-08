import { type ASTNode, parse } from '@mradomski/fast-solidity-parser'
import type { UnitKind } from '../contract/schema.js'

export interface ExtractedUnit {
  name: string
  kind: UnitKind
  startLine: number
  endLine: number
  /** Exact text of the unit's lines. */
  source: string
}

export const FILE_LEVEL_UNIT_NAME = '(file-level declarations)'

/**
 * Splits a Solidity file into top-level units. Contracts, abstract contracts,
 * interfaces and libraries become one unit each. All other top-level
 * declarations (free functions, structs, enums, constants, events, errors,
 * user defined types, `using` directives) are grouped into one synthetic
 * unit so that line totals add up. Pragmas and imports are ignored.
 */
export function extractUnits(source: string): ExtractedUnit[] {
  const ast = parse(source, { range: true })
  const lineStarts = computeLineStarts(source)
  const lines = source.split('\n')

  const units: ExtractedUnit[] = []
  const fileLevel: { startLine: number; endLine: number }[] = []

  for (const node of ast.children) {
    if (!node.range) continue
    if (node.type === 'PragmaDirective' || node.type === 'ImportDirective') {
      continue
    }
    const startLine = lineAt(lineStarts, node.range[0])
    const endLine = lineAt(lineStarts, node.range[1])
    if (node.type === 'ContractDefinition') {
      units.push({
        name: node.name,
        kind: toUnitKind(node.kind),
        startLine,
        endLine,
        source: lines.slice(startLine - 1, endLine).join('\n'),
      })
    } else {
      fileLevel.push({ startLine, endLine })
    }
  }

  if (fileLevel.length > 0) {
    const first = fileLevel[0]
    const last = fileLevel[fileLevel.length - 1]
    if (first && last) {
      units.push({
        name: FILE_LEVEL_UNIT_NAME,
        kind: 'file-level',
        startLine: first.startLine,
        endLine: last.endLine,
        source: fileLevel
          .map((r) => lines.slice(r.startLine - 1, r.endLine).join('\n'))
          .join('\n'),
      })
    }
  }

  return units
}

function toUnitKind(kind: string): UnitKind {
  switch (kind) {
    case 'interface':
      return 'interface'
    case 'library':
      return 'library'
    case 'abstract':
    case 'abstract contract':
      return 'abstract'
    default:
      return 'contract'
  }
}

/** Offsets at which each line starts, for offset → line number lookups. */
function computeLineStarts(source: string): number[] {
  const starts = [0]
  for (let i = 0; i < source.length; i++) {
    if (source[i] === '\n') starts.push(i + 1)
  }
  return starts
}

/** 1-based line containing the byte offset. */
function lineAt(lineStarts: number[], offset: number): number {
  let lo = 0
  let hi = lineStarts.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if ((lineStarts[mid] ?? 0) <= offset) lo = mid
    else hi = mid - 1
  }
  return lo + 1
}

// Re-exported so callers can narrow node types without importing the parser.
export type { ASTNode }
