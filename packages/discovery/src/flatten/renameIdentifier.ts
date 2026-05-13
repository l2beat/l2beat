import type * as AST from '@mradomski/fast-solidity-parser'
import { parse } from '@mradomski/fast-solidity-parser'
import { getASTIdentifiers } from './getASTIdentifiers'

export interface RenamePair {
  from: string
  to: string
}

interface Replacement {
  start: number
  end: number
  newName: string
}

export function renameIdentifiers(source: string, pairs: RenamePair[]): string {
  const filtered = pairs.filter((p) => p.from !== p.to)
  if (filtered.length === 0) return source
  const ast = parse(source, { range: true })

  const pairMap = new Map(filtered.map((p) => [p.from, p.to]))
  const replacements: Replacement[] = []

  getASTIdentifiers(ast, (node) => {
    if (!node.range) return
    const [start, end] = [node.range[0], node.range[1] + 1]

    if (node.type === 'Identifier') {
      const ident = node as AST.Identifier
      const to = pairMap.get(ident.name)
      if (to !== undefined) {
        replacements.push({ start, end, newName: to })
      }
    } else if (node.type === 'UserDefinedTypeName') {
      const udt = node as AST.UserDefinedTypeName
      const to = pairMap.get(udt.namePath)
      if (to !== undefined) {
        replacements.push({ start, end, newName: to })
      } else {
        for (const [from, to] of pairMap) {
          if (udt.namePath.startsWith(from + '.')) {
            replacements.push({
              start,
              end: start + from.length,
              newName: to,
            })
            break
          }
        }
      }
    } else if (node.type === 'VariableDeclaration') {
      const decl = node as AST.VariableDeclaration
      if (decl.identifier?.name && decl.identifier.range) {
        const [idStart, idEnd] = [
          decl.identifier.range[0],
          decl.identifier.range[1] + 1,
        ]
        const to = pairMap.get(decl.identifier.name)
        if (to !== undefined) {
          replacements.push({ start: idStart, end: idEnd, newName: to })
        }
      }
    } else if (node.type === 'FunctionCall') {
      const call = node as AST.FunctionCall
      for (const ident of call.identifiers) {
        if (ident.range) {
          const [idStart, idEnd] = [ident.range[0], ident.range[1] + 1]
          const to = pairMap.get(ident.name)
          if (to !== undefined) {
            replacements.push({ start: idStart, end: idEnd, newName: to })
          }
        }
      }
    }

    const declName = getDeclName(node)
    if (declName !== undefined) {
      const to = pairMap.get(declName)
      if (to !== undefined) {
        const range = findDeclNameRange(source, node.range[0], declName)
        if (range !== undefined) {
          replacements.push({ ...range, newName: to })
        }
      }
    }
  })

  replacements.sort((a, b) => b.start - a.start)

  let result = source
  for (const { start, end, newName } of replacements) {
    result = result.slice(0, start) + newName + result.slice(end)
  }

  return result
}

function getDeclName(node: AST.BaseASTNode): string | undefined {
  const n = node as AST.ASTNode
  switch (n.type) {
    case 'ContractDefinition':
    case 'StructDefinition':
    case 'EnumDefinition':
    case 'EventDefinition':
    case 'CustomErrorDefinition':
    case 'TypeDefinition':
      return n.name
    case 'FunctionDefinition':
      return n.name ?? undefined
    default:
      return undefined
  }
}

function findDeclNameRange(
  source: string,
  rangeStart: number,
  name: string,
): { start: number; end: number } | undefined {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`\\b${escaped}\\b`)
  const match = regex.exec(source.slice(rangeStart))
  if (match !== null) {
    const start = rangeStart + match.index
    return { start, end: start + name.length }
  }
  return undefined
}
