import { parseTokens, type ClingoAST } from './clingo-parser/parser'
import { type Token, tokenize } from './clingo-parser/tokenizer'

export function parse(content: string): ClingoAST {
  const tokens = tokenize(content)
  const ast = parseTokens(tokens)
  return ast
}
