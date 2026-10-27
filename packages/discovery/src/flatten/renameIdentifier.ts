import { assert } from '@l2beat/shared-pure'
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
  const structMembers = findStructMemberStarts(ast)

  getASTIdentifiers(ast, (node) => {
    if (!node.range) return
    const [start, end] = [node.range[0], node.range[1] + 1]

    if (node.type === 'Identifier') {
      const ident = node as AST.Identifier
      const to = pairMap.get(ident.name)
      if (to !== undefined) {
        replacements.push({ start, end, newName: to })
      }
    } else if (node.type === 'UsingForDeclaration') {
      const usingDecl = node as AST.UsingForDeclaration
      const name = usingDecl.libraryName
      if (name !== null) {
        const newName = pairMap.get(name)
        if (newName !== undefined) {
          const libStart = findUsingLibraryNameStart(source, start)
          replacements.push({
            start: libStart,
            end: libStart + name.length,
            newName,
          })
        }
      }
      const functions = usingDecl.functions ?? []
      const needsRename = functions.some(
        (path) =>
          pairMap.has(path) || pairMap.has(path.split('.')[0] as string),
      )
      if (needsRename) {
        const functionStarts = findUsingFunctionStarts(source, start, functions)
        for (const [i, path] of functions.entries()) {
          const pathStart = functionStarts[i] as number
          const head = path.split('.')[0] as string
          const pathName = pairMap.get(path)
          const headName = pairMap.get(head)
          if (pathName !== undefined) {
            replacements.push({
              start: pathStart,
              end: pathStart + path.length,
              newName: pathName,
            })
          } else if (headName !== undefined) {
            replacements.push({
              start: pathStart,
              end: pathStart + head.length,
              newName: headName,
            })
          }
        }
      }
    } else if (node.type === 'MemberAccess') {
      const access = node as AST.MemberAccess
      if (access.expression.type === 'Identifier') {
        const path = `${access.expression.name}.${access.memberName}`
        const to = pairMap.get(path)
        if (to !== undefined) {
          replacements.push({ start, end, newName: to })
        }
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
      if (
        decl.identifier?.name &&
        decl.identifier.range &&
        !structMembers.has(decl.identifier.range[0])
      ) {
        const [idStart, idEnd] = [
          decl.identifier.range[0],
          decl.identifier.range[1] + 1,
        ]
        const to = pairMap.get(decl.identifier.name)
        if (to !== undefined) {
          replacements.push({ start: idStart, end: idEnd, newName: to })
        }
      }
    } else if (node.type === 'FileLevelConstant') {
      const constant = node as AST.FileLevelConstant
      const to = pairMap.get(constant.name)
      if (to !== undefined) {
        const nameStart = findConstantNameStart(source, constant)
        replacements.push({
          start: nameStart,
          end: nameStart + constant.name.length,
          newName: to,
        })
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

// Struct members are read as `s.member`, which is never renamed, so their
// declarations must keep their names too
function findStructMemberStarts(ast: AST.BaseASTNode): Set<number> {
  const starts = new Set<number>()
  getASTIdentifiers(ast, (node) => {
    if (node.type !== 'StructDefinition') return
    for (const member of (node as AST.StructDefinition).members) {
      if (member.identifier?.range) starts.add(member.identifier.range[0])
    }
  })
  return starts
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
  let start = source.indexOf(name, rangeStart)
  while (start !== -1) {
    const before = source[start - 1]
    const after = source[start + name.length]
    if (!isIdentifierChar(before) && !isIdentifierChar(after)) {
      return { start, end: start + name.length }
    }
    start = source.indexOf(name, start + 1)
  }
  return undefined
}

function isIdentifierChar(c: string | undefined): boolean {
  if (c === undefined) return false
  return (
    (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z') ||
    (c >= '0' && c <= '9') ||
    c === '_' ||
    c === '$'
  )
}

function findConstantNameStart(
  source: string,
  constant: AST.FileLevelConstant,
): number {
  assert(constant.typeName.range !== undefined, 'Constant type has no range')
  const keyword = source.indexOf('constant', constant.typeName.range[1] + 1)
  assert(keyword !== -1, 'Constant keyword not found')
  const nameStart = source.indexOf(constant.name, keyword + 'constant'.length)
  assert(nameStart !== -1, 'Constant name not found')
  return nameStart
}

// The parser gives `using { a, L.b as + }` entries without ranges
function findUsingFunctionStarts(
  source: string,
  rangeStart: number,
  functions: string[],
): number[] {
  const starts: number[] = []
  let index = source.indexOf('{', rangeStart) + 1
  for (const path of functions) {
    index = skipWhitespaceAndComments(source, index)
    assert(source.startsWith(path, index), 'Using function not found')
    starts.push(index)
    index = skipPastEntry(source, index + path.length)
  }
  return starts
}

function skipPastEntry(source: string, index: number): number {
  while (index < source.length) {
    if (source[index] === ',' || source[index] === '}') return index + 1
    const next = skipWhitespaceAndComments(source, index)
    index = next === index ? index + 1 : next
  }
  return index
}

function skipWhitespaceAndComments(source: string, index: number): number {
  while (true) {
    const next = skipWhitespace(source, index)
    if (source.startsWith('//', next)) {
      const lineEnd = source.indexOf('\n', next)
      index = lineEnd === -1 ? source.length : lineEnd
    } else if (source.startsWith('/*', next)) {
      const commentEnd = source.indexOf('*/', next + 2)
      assert(commentEnd !== -1, 'Unterminated comment')
      index = commentEnd + 2
    } else {
      return next
    }
  }
}

function findUsingLibraryNameStart(source: string, rangeStart: number): number {
  const usingEnd = rangeStart + 'using'.length
  return skipWhitespace(source, usingEnd)
}

function skipWhitespace(source: string, index: number): number {
  while (
    source[index] === ' ' ||
    source[index] === '\n' ||
    source[index] === '\r' ||
    source[index] === '\t'
  ) {
    index++
  }
  return index
}
