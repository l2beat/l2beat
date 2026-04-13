import type * as AST from '@mradomski/fast-solidity-parser'
import { getASTIdentifiers } from './getASTIdentifiers'

interface Range {
  start: number
  end: number
}

export function renameIdentifier(
  source: string,
  baseNode: AST.BaseASTNode | null,
  prevName: string,
  newName: string,
): string {
  if (baseNode === null || prevName === newName) {
    return source
  }

  const ranges: Range[] = []

  getASTIdentifiers(baseNode, (node) => {
    if (!node.range) return

    if (node.type === 'Identifier') {
      const ident = node as AST.Identifier
      if (ident.name === prevName) {
        ranges.push({ start: node.range[0], end: node.range[1] + 1 })
      }
    } else if (node.type === 'UserDefinedTypeName') {
      const udt = node as AST.UserDefinedTypeName
      if (udt.namePath === prevName) {
        ranges.push({ start: node.range[0], end: node.range[1] + 1 })
      } else if (udt.namePath.startsWith(prevName + '.')) {
        ranges.push({
          start: node.range[0],
          end: node.range[0] + prevName.length,
        })
      }
    } else if (node.type === 'VariableDeclaration') {
      const decl = node as AST.VariableDeclaration
      if (decl.identifier?.name === prevName && decl.identifier.range) {
        ranges.push({
          start: decl.identifier.range[0],
          end: decl.identifier.range[1] + 1,
        })
      }
    } else if (node.type === 'FunctionCall') {
      const call = node as AST.FunctionCall
      for (const ident of call.identifiers) {
        if (ident.name === prevName && ident.range) {
          ranges.push({ start: ident.range[0], end: ident.range[1] + 1 })
        }
      }
    }
  })

  ranges.sort((a, b) => b.start - a.start)

  let result = source
  for (const { start, end } of ranges) {
    result =
      result.slice(0, start) + newName + result.slice(end)
  }

  return result
}
