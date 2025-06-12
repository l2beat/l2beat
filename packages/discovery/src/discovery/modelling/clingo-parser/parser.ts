import { assert } from '@l2beat/shared-pure'
import type { Token, TokenType } from './tokenizer'

export type ClingoAST =
  | { type: 'root'; children: ClingoAST[] }
  | { type: 'rule'; head: ClingoAST; body: ClingoAST[] }
  | { type: 'fact'; head: ClingoAST }
  | { type: 'constraint'; body: ClingoAST[] }
  | { type: 'literal'; child: ClingoAST }
  | { type: 'negated-literal'; child: ClingoAST }
  | { type: 'predicate'; name: string; args: ClingoAST[] }
  | { type: 'comparison'; left: ClingoAST; op: string; right: ClingoAST }
  | { type: 'function'; name: string; args: ClingoAST[] }
  | { type: 'binary'; left: ClingoAST; op: string; right: ClingoAST }
  | { type: 'var'; name: string }
  | { type: 'string'; content: string }
  | { type: 'number'; value: number }

function isLowerCase(c: string): boolean {
  return c.toLowerCase() === c
}

function isUpperCase(c: string): boolean {
  return c.toUpperCase() === c
}

class TokenConsumer {
  private head: number = 0

  constructor(private readonly tokens: Token[]) {}

  canEatToken(): boolean {
    return this.head < this.tokens.length
  }

  peekTokenType(): TokenType {
    assert(this.canEatToken())
    return this.tokens[this.head]?.type as TokenType
  }

  peekTokenString(): string {
    assert(this.canEatToken())
    return this.tokens[this.head]?.content as TokenType
  }

  lastTokenString(): string {
    assert(this.head !== 0)
    return this.tokens[this.head - 1]?.content as TokenType
  }

  acceptToken(type: TokenType): boolean {
    if (this.peekTokenType() === type) {
      this.head++
      return true
    }
    return false
  }

  acceptPredicate(): boolean {
    if (
      this.peekTokenType() === 'identifier' &&
      isLowerCase(this.peekTokenString().slice(0, 1))
    ) {
      this.head++
      return true
    }
    return false
  }

  acceptVar(): boolean {
    if (
      this.peekTokenType() === 'identifier' &&
      isUpperCase(this.peekTokenString().slice(0, 1))
    ) {
      this.head++
      return true
    }
    return false
  }

  nextToken(): Token {
    assert(this.canEatToken())
    return this.tokens[this.head] as Token
  }

  expectToken(type: TokenType): string {
    assert(
      this.acceptToken(type),
      `Expected a ${type} but found ${JSON.stringify(this.nextToken())}`,
    )

    return this.lastTokenString()
  }

  expectOneOfTokens(types: TokenType[]): string {
    for (const type of types) {
      if (this.acceptToken(type)) {
        return this.lastTokenString()
      }
    }
    throw new Error(
      `Expected one of ${types.join(', ')} @ ${JSON.stringify(this.nextToken())}`,
    )
  }
}

function parseTerm(consumer: TokenConsumer): ClingoAST {
  if (consumer.acceptVar()) {
    const left: ClingoAST = { type: 'var', name: consumer.lastTokenString() }
    if (consumer.acceptToken('plus')) {
      const op = consumer.lastTokenString()
      const right = parseTerm(consumer)
      return { type: 'binary', left, op, right }
    } else {
      return left
    }
  } else if (consumer.acceptToken('number')) {
    return { type: 'number', value: parseInt(consumer.lastTokenString()) }
  } else if (consumer.acceptToken('string')) {
    return { type: 'string', content: consumer.lastTokenString() }
  } else if (consumer.acceptToken('open-paren')) {
    const result = parseTerm(consumer)
    consumer.expectToken('close-paren')
    return result
  } else if (consumer.acceptPredicate()) {
    const args = []
    if (consumer.acceptToken('open-paren')) {
      args.push(...parseTermList(consumer))
      consumer.expectToken('close-paren')
    }

    return {
      type: 'function',
      name: consumer.lastTokenString(),
      args,
    }
  } else {
    console.log(consumer.nextToken())
    throw new Error('Not implemented')
  }
}

function parseTermList(consumer: TokenConsumer): ClingoAST[] {
  const result: ClingoAST[] = []
  result.push(parseTerm(consumer))
  while (consumer.acceptToken('comma')) {
    result.push(parseTerm(consumer))
  }
  return result
}

function parseOperator(consumer: TokenConsumer): string {
  return consumer.expectOneOfTokens([
    'equal',
    'equal-equal',
    'not-equal',
    'open-tick',
    'close-tick',
    'less-equal',
    'greater-equal',
  ])
}

function parseLiteral(consumer: TokenConsumer): ClingoAST {
  if (consumer.acceptToken('not-keyword')) {
    return { type: 'negated-literal', child: parseLiteral(consumer) }
  } else {
    if (consumer.acceptPredicate()) {
      const name = consumer.lastTokenString()
      consumer.expectToken('open-paren')
      const args = parseTermList(consumer)
      consumer.expectToken('close-paren')
      return { type: 'predicate', name, args }
    } else if (consumer.acceptToken('ampersand')) {
      console.log(consumer.nextToken())
      throw new Error('Not implemented')
    } else {
      const left = parseTerm(consumer)
      const op = parseOperator(consumer)
      const right = parseTerm(consumer)
      return { type: 'comparison', left, op, right }
    }
  }
}

function parseBody(consumer: TokenConsumer): ClingoAST[] {
  const list = []

  do {
    list.push(parseLiteral(consumer))
  } while (consumer.acceptToken('comma'))

  return list
}

function parseHead(consumer: TokenConsumer): ClingoAST {
  if (consumer.acceptToken('pound')) {
    const name = consumer.expectToken('identifier')
    console.log(name)
    throw new Error('Not implemented')
  } else {
    return parseLiteral(consumer)
  }
}

function parseRule(consumer: TokenConsumer): ClingoAST {
  let result: ClingoAST
  if (consumer.acceptToken('walrus')) {
    const body = parseBody(consumer)
    result = { type: 'constraint', body }
  } else {
    const head = parseHead(consumer)
    if (consumer.acceptToken('walrus')) {
      const body = parseBody(consumer)
      result = { type: 'rule', head, body }
    } else {
      result = { type: 'fact', head }
    }
  }

  consumer.expectToken('dot')
  return result
}

export function parseTokens(tokens: Token[]): ClingoAST {
  const consumer = new TokenConsumer(tokens)
  const ast: ClingoAST = {
    type: 'root',
    children: [],
  }

  while (!consumer.acceptToken('EOF')) {
    if (consumer.acceptToken('pound')) {
      const name = consumer.expectToken('identifier')
      console.log(name)
      throw new Error('Not implemented')
    } else {
      ast.children.push(parseRule(consumer))
    }
  }

  return ast
}
