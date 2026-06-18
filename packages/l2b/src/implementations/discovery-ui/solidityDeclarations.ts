import { findLeadingCommentStart } from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import { type ASTNode, parse } from '@mradomski/fast-solidity-parser'

// A flattened source is split into a contiguous, gap-free list of segments that
// covers the whole file: concatenating every `content` in order reproduces the
// input byte-for-byte. Named segments are the selectable top-level declarations
// (contracts, libraries, free functions, ...). Unnamed segments (`name === null`)
// hold the preamble (license/pragma/imports) and any text between declarations.
//
// The byte-exact property matters: the frontend rebuilds the editor view by
// joining these segments, and code-search offsets are computed against the same
// original text, so the two must not drift.
export interface SoliditySegment {
  name: string | null
  content: string
}

export function splitSolidityDeclarations(flat: string): SoliditySegment[] {
  const ast = parse(flat, { range: true })

  const segments: SoliditySegment[] = []
  let cursor = 0
  for (const child of ast.children) {
    const name = getASTTopLevelChildName(child)
    if (name === undefined) {
      continue
    }
    assert(child.range !== undefined)

    const start = findLeadingCommentStart(flat, child.range[0])
    const end = child.range[1] + 1
    assert(start >= cursor && end >= start)

    if (start > cursor) {
      segments.push({ name: null, content: flat.slice(cursor, start) })
    }
    segments.push({ name, content: flat.slice(start, end) })
    cursor = end
  }

  if (cursor < flat.length) {
    segments.push({ name: null, content: flat.slice(cursor) })
  }
  if (segments.length === 0) {
    segments.push({ name: null, content: flat })
  }

  return segments
}

// NOTE(radomski): This function needs to handle all nodes listed in
// https://docs.soliditylang.org/en/latest/grammar.html#a4.SolidityParser
export function getASTTopLevelChildName(child: ASTNode): string | undefined {
  switch (child.type) {
    case 'UsingForDeclaration':
      assert(child.libraryName !== null)
      return child.libraryName
    case 'ContractDefinition':
      return child.name
    case 'FunctionDefinition':
      assert(child.name !== null)
      return child.name
    case 'VariableDeclaration':
      assert(child.name !== null)
      return child.name
    case 'StructDefinition':
      return child.name
    case 'EnumDefinition':
      return child.name
    case 'UserDefinedTypeName':
      return child.namePath
    case 'CustomErrorDefinition':
      return child.name
    case 'EventDefinition':
      return child.name
    case 'PragmaDirective':
    case 'ImportDirective':
      return undefined
    case 'TypeDefinition':
      return child.name
    case 'FileLevelConstant':
      return child.name
    default: {
      assert(false, `Unhandled child type: ${child.type}`)
    }
  }
}
