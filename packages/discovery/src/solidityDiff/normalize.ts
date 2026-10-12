import { assert } from '@l2beat/shared-pure'
import type * as AST from '@mradomski/fast-solidity-parser'
import { parse } from '@mradomski/fast-solidity-parser'
import type { Rule } from './rules'

// Fields that repeat information already present in a scalar next to them.
const DROPPED_FIELDS = [
  'identifier',
  'identifiers',
  'pathLiteral',
  'unitAliasIdentifier',
  'symbolAliasesIdentifiers',
  'parts',
]

// Prepares a tree for the shared `diff`, which compares enumerable fields:
// `range` is hidden so layout does not count but rendering can still read
// it.
export function normalize(source: string, rules: Rule[]): AST.ASTNode {
  const root = parse(source, { range: true }) as AST.ASTNode
  const work: AST.ASTNode[] = [root]
  while (work.length > 0) {
    const node = work.pop() as AST.ASTNode
    for (const rule of rules) {
      rule(node)
    }
    repairParserOutput(node)
    hideRange(node)
    const fields = node as unknown as Record<string, unknown>
    for (const field in fields) {
      const value = fields[field]
      if (Array.isArray(value)) {
        for (const child of value) {
          if (isNode(child)) work.push(child)
        }
      } else if (isNode(value)) {
        work.push(value)
      }
    }
  }
  return root
}

export function isNode(value: unknown): value is AST.ASTNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { type?: unknown }).type === 'string'
  )
}

// Every node has one, `normalize` asserts it.
export function rangeOf(node: AST.ASTNode): [number, number] {
  return node.range as [number, number]
}

function repairParserOutput(node: AST.ASTNode): void {
  const fields = node as unknown as Record<string, unknown>
  for (const field of DROPPED_FIELDS) {
    if (field in fields) delete fields[field]
  }
  // The parser puts a state variable's initializer under both the
  // declaration and the variable.
  if (node.type === 'StateVariableDeclaration') {
    for (const variable of node.variables) {
      variable.expression = null
    }
  }
  // It also wraps a for loop's update in a statement without a range, even
  // when there is no update.
  if (node.type === 'ForStatement') {
    fields.loopExpression = node.loopExpression.expression
  }
}

function hideRange(node: AST.ASTNode): void {
  assert(node.range !== undefined, `${node.type} has a range`)
  Object.defineProperty(node, 'range', { enumerable: false, value: node.range })
}
