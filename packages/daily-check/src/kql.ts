/**
 * Converts the subset of KQL used by the Control Plane tiles into an
 * Elasticsearch query DSL clause: `field : "value"`, `field : value*`,
 * `field : *`, bare quoted phrases, and/or/not (case-insensitive) and
 * parentheses. Throws on anything it does not understand so the caller can
 * mark the tile as unsupported instead of silently mis-evaluating it.
 */
export function kqlToDsl(kql: string): Record<string, unknown> {
  const parser = new Parser(tokenize(kql))
  const query = parser.parseOr()
  parser.expectEnd()
  return query
}

type Token =
  | { kind: 'word'; value: string }
  | { kind: 'phrase'; value: string }
  | { kind: 'range'; operator: 'gte' | 'lte' | 'gt' | 'lt' }
  | { kind: ':' }
  | { kind: '(' }
  | { kind: ')' }

function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < input.length) {
    const char = input.charAt(i)
    if (/\s/.test(char)) {
      i++
    } else if (char === ':' || char === '(' || char === ')') {
      tokens.push({ kind: char })
      i++
    } else if (char === '>' || char === '<') {
      const withEquals = input.charAt(i + 1) === '='
      const operator =
        char === '>' ? (withEquals ? 'gte' : 'gt') : withEquals ? 'lte' : 'lt'
      tokens.push({ kind: 'range', operator })
      i += withEquals ? 2 : 1
    } else if (char === '"') {
      let value = ''
      i++
      while (i < input.length && input.charAt(i) !== '"') {
        if (input.charAt(i) === '\\' && i + 1 < input.length) {
          value += input.charAt(i + 1)
          i += 2
        } else {
          value += input.charAt(i)
          i++
        }
      }
      if (i >= input.length) {
        throw new Error('Unterminated quote in KQL')
      }
      i++
      tokens.push({ kind: 'phrase', value })
    } else {
      let value = ''
      while (i < input.length && !/[\s:()"<>]/.test(input.charAt(i))) {
        value += input.charAt(i)
        i++
      }
      tokens.push({ kind: 'word', value })
    }
  }
  return tokens
}

class Parser {
  private position = 0

  constructor(private readonly tokens: Token[]) {}

  private peek(): Token | undefined {
    return this.tokens[this.position]
  }

  private isKeyword(keyword: string): boolean {
    const token = this.peek()
    return token?.kind === 'word' && token.value.toLowerCase() === keyword
  }

  expectEnd(): void {
    if (this.position < this.tokens.length) {
      throw new Error(`Unexpected token in KQL near position ${this.position}`)
    }
  }

  parseOr(): Record<string, unknown> {
    const first = this.parseAnd()
    const clauses = [first]
    while (this.isKeyword('or')) {
      this.position++
      clauses.push(this.parseAnd())
    }
    if (clauses.length === 1) {
      return first
    }
    return { bool: { should: clauses, minimum_should_match: 1 } }
  }

  private parseAnd(): Record<string, unknown> {
    const first = this.parseNot()
    const clauses = [first]
    while (this.isKeyword('and')) {
      this.position++
      clauses.push(this.parseNot())
    }
    if (clauses.length === 1) {
      return first
    }
    return { bool: { filter: clauses } }
  }

  private parseNot(): Record<string, unknown> {
    if (this.isKeyword('not')) {
      this.position++
      return { bool: { must_not: [this.parseNot()] } }
    }
    return this.parsePrimary()
  }

  private parsePrimary(): Record<string, unknown> {
    const token = this.peek()
    if (!token) {
      throw new Error('Unexpected end of KQL')
    }

    if (token.kind === '(') {
      this.position++
      const inner = this.parseOr()
      if (this.peek()?.kind !== ')') {
        throw new Error('Missing closing parenthesis in KQL')
      }
      this.position++
      return inner
    }

    if (token.kind === 'phrase' || token.kind === 'word') {
      this.position++
      const next = this.peek()
      if (next?.kind === ':') {
        this.position++
        return this.parseFieldValue(token.value)
      }
      if (next?.kind === 'range') {
        this.position++
        return this.parseRange(token.value, next.operator)
      }
      // A bare term searches all fields, like Kibana's default-field query.
      if (token.kind === 'phrase') {
        return {
          multi_match: { type: 'phrase', query: token.value, lenient: true },
        }
      }
      return {
        multi_match: {
          type: 'best_fields',
          query: token.value,
          lenient: true,
        },
      }
    }

    throw new Error(`Unexpected "${token.kind}" in KQL`)
  }

  private parseRange(
    field: string,
    operator: 'gte' | 'lte' | 'gt' | 'lt',
  ): Record<string, unknown> {
    const token = this.peek()
    if (!token || (token.kind !== 'word' && token.kind !== 'phrase')) {
      throw new Error(`Missing range value for field "${field}" in KQL`)
    }
    this.position++
    const asNumber = Number(token.value)
    const value = Number.isNaN(asNumber) ? token.value : asNumber
    return { range: { [field]: { [operator]: value } } }
  }

  private parseFieldValue(field: string): Record<string, unknown> {
    const token = this.peek()
    if (!token || (token.kind !== 'word' && token.kind !== 'phrase')) {
      throw new Error(`Missing value for field "${field}" in KQL`)
    }
    this.position++

    if (token.kind === 'phrase') {
      return { match_phrase: { [field]: token.value } }
    }
    if (token.value === '*') {
      return { exists: { field } }
    }
    if (token.value.includes('*')) {
      return {
        query_string: {
          fields: [field],
          query: token.value,
          analyze_wildcard: true,
        },
      }
    }
    return { match: { [field]: token.value } }
  }
}
