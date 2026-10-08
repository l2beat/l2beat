import type * as AST from '@mradomski/fast-solidity-parser'

// A rule rewrites a node in place before it is compared. Two programs are equal
// under a set of rules when their rewritten trees are equal.
export type Rule = (node: AST.ASTNode) => void

export const canonicalIntegerTypes: Rule = (node) => {
  if (node.type === 'ElementaryTypeName') {
    if (node.name === 'uint' || node.name === 'int') {
      node.name = `${node.name}256`
    }
  }
}

// The parser keeps escapes as written, so 'it\'s' and "it's" differ.
export const canonicalStringQuotes: Rule = (node) => {
  if (node.type === 'StringLiteral') {
    node.value = unescapeQuotes(node.value)
  }
}

// Only the text of a message. A custom error is a different revert, and a
// computed reason runs even when the condition holds.
export const ignoreRevertReasons: Rule = (node) => {
  if (node.type === 'FunctionCall' && node.expression.type === 'Identifier') {
    blankMessage(node.arguments[reasonIndex(node.expression.name)])
  }
  // `revert("x")` parses as a RevertStatement over a tuple, not as a call.
  if (node.type === 'RevertStatement') {
    const call = node.revertCall as AST.ASTNode
    if (call.type === 'TupleExpression') {
      blankMessage(call.components[0])
    }
  }
}

export const ignoreSolidityVersionPragma: Rule = (node) => {
  if (node.type === 'PragmaDirective' && node.name === 'solidity') {
    node.value = ''
  }
}

export const bracedBodies: Rule = (node) => {
  if (node.type === 'IfStatement') {
    node.trueBody = asBlock(node.trueBody)
    node.falseBody = node.falseBody && asBlock(node.falseBody)
  }
  if (
    node.type === 'ForStatement' ||
    node.type === 'WhileStatement' ||
    node.type === 'DoWhileStatement'
  ) {
    node.body = asBlock(node.body)
  }
}

export const ALL_RULES: Rule[] = [
  canonicalIntegerTypes,
  canonicalStringQuotes,
  ignoreRevertReasons,
  ignoreSolidityVersionPragma,
  bracedBodies,
]

function reasonIndex(callee: string): number {
  if (callee === 'require') return 1
  if (callee === 'revert') return 0
  return -1
}

function blankMessage(node: AST.BaseASTNode | null | undefined): void {
  if (node?.type === 'StringLiteral') {
    const literal = node as AST.StringLiteral
    literal.value = '<revert reason>'
    literal.isUnicode = []
  }
}

function asBlock(statement: AST.Statement): AST.Statement {
  if (statement.type === 'Block') {
    return statement
  }
  return { type: 'Block', statements: [statement], range: statement.range }
}

// An escape is two characters, so `\\'` is an escaped backslash and a quote.
function unescapeQuotes(value: string): string {
  let result = ''
  for (let i = 0; i < value.length; i++) {
    const c = value[i] as string
    if (c !== '\\') {
      result += c
      continue
    }
    const next = value[i + 1] ?? ''
    result += next === '"' || next === "'" ? next : c + next
    i++
  }
  return result
}
