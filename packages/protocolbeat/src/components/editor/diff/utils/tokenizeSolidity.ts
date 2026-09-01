export type TokenType = 'comment' | 'structural'

export interface Token {
  type: TokenType
  content: string
  startLine: number
  endLine: number
}

export function tokenizeSolidity(source: string): Token[] {
  const tokens: Token[] = []
  const len = source.length
  let i = 0
  let line = 1

  while (i < len) {
    const c = source[i] as string
    const next = source[i + 1] ?? ''

    if (c === '\n') {
      line++
      i++
      continue
    }
    if (c === ' ' || c === '\t' || c === '\r') {
      i++
      continue
    }

    if (c === '/' && next === '/') {
      const startLine = line
      const start = i
      i += 2
      while (i < len && source[i] !== '\n') {
        i++
      }
      tokens.push(comment(source.slice(start, i), startLine, line))
      continue
    }

    if (c === '/' && next === '*') {
      const startLine = line
      const start = i
      i += 2
      while (i < len) {
        if (source[i] === '*' && source[i + 1] === '/') {
          i += 2
          break
        }
        if (source[i] === '\n') {
          line++
        }
        i++
      }
      tokens.push(comment(source.slice(start, i), startLine, line))
      continue
    }

    if (c === '"' || c === "'") {
      const quote = c
      const startLine = line
      const start = i
      i++
      while (i < len) {
        const sc = source[i]
        if (sc === '\\' && i + 1 < len) {
          if (source[i + 1] === '\n') {
            line++
          }
          i += 2
          continue
        }
        if (sc === quote) {
          i++
          break
        }
        if (sc === '\n') {
          line++
        }
        i++
      }

      tokens.push(structural(source.slice(start, i), startLine, line))
      continue
    }

    if (isIdentChar(c)) {
      const startLine = line
      const start = i
      while (i < len && isIdentChar(source[i] as string)) {
        i++
      }

      tokens.push(structural(source.slice(start, i), startLine, startLine))
      continue
    }

    tokens.push(structural(c, line, line))
    i++
  }

  return tokens
}

function comment(content: string, start: number, end: number): Token {
  return { type: 'comment', content, startLine: start, endLine: end }
}

function structural(content: string, start: number, end: number): Token {
  return { type: 'structural', content, startLine: start, endLine: end }
}

function isIdentChar(c: string): boolean {
  return (
    (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z') ||
    (c >= '0' && c <= '9') ||
    c === '_' ||
    c === '$'
  )
}
