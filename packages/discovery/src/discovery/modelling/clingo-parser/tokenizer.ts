import { assert } from '@l2beat/shared-pure'
import chalk from 'chalk'

export type TokenType =
  | 'identifier'
  | 'not-keyword'
  | 'open-paren'
  | 'close-paren'
  | 'open-brace'
  | 'close-brace'
  | 'comma'
  | 'walrus'
  | 'dot'
  | 'pound'
  | 'string'
  | 'number'
  | 'equal'
  | 'equal-equal'
  | 'not-equal'
  | 'open-tick'
  | 'close-tick'
  | 'less-equal'
  | 'greater-equal'
  | 'plus'
  | 'minus'
  | 'star'
  | 'slash'
  | 'percent'
  | 'caret'
  | 'ampersand'
  | 'pipe'
  | 'EOF'

export interface Token {
  type: TokenType
  content: string
  offset: number
}

class ByteConsumer {
  private head: number = 0

  constructor(private readonly content: string) {}

  peekByte(): string {
    return this.content[this.head] as string
  }

  get offset(): number {
    return this.head
  }

  consumeByte(): string {
    assert(this.canEatByte())
    return this.content[this.head++] as string
  }

  canEatByte(): boolean {
    return this.head < this.content.length
  }
}

function isWhitespace(byte: string): boolean {
  return byte === ' ' || byte === '\n' || byte === '\t'
}

function isAlphabet(byte: string): boolean {
  const lower = byte.toLowerCase()
  return lower >= 'a' && lower <= 'z'
}

function isDigit(byte: string): boolean {
  return byte >= '0' && byte <= '9'
}

const KEYWORDS: Record<string, TokenType> = {
  not: 'not-keyword',
}

export function tokenize(content: string): Token[] {
  const tokens: Token[] = []
  const consumer = new ByteConsumer(content)

  while (consumer.canEatByte()) {
    const byte = consumer.consumeByte()
    if (isWhitespace(byte)) {
      continue
    }

    if (byte === '%') {
      while (consumer.consumeByte() !== '\n') {}
    } else if (isAlphabet(byte) || byte === '_' || byte === '$') {
      let content = byte

      while (consumer.canEatByte()) {
        const byte = consumer.peekByte()
        if (isAlphabet(byte) || isDigit(byte) || byte === '_' || byte === '$') {
          content += consumer.consumeByte()
        } else {
          break
        }
      }

      const type = KEYWORDS[content] ?? 'identifier'
      tokens.push({ type, content, offset: consumer.offset })
    } else if (byte === '"') {
      let content = ''
      while (consumer.canEatByte()) {
        const byte = consumer.consumeByte()
        if (byte === '"') {
          break
        }
        content += byte
      }
      tokens.push({ type: 'string', content, offset: consumer.offset })
    } else if (isDigit(byte)) {
      let content = byte
      while (consumer.canEatByte()) {
        const byte = consumer.peekByte()
        if (isDigit(byte)) {
          content += consumer.consumeByte()
        } else {
          break
        }
      }
      tokens.push({ type: 'number', content, offset: consumer.offset })
    } else if (byte === '(') {
      tokens.push({ type: 'open-paren', content: byte, offset: consumer.offset })
    } else if (byte === ')') {
      tokens.push({ type: 'close-paren', content: byte, offset: consumer.offset })
    } else if (byte === '{') {
      tokens.push({ type: 'open-brace', content: byte, offset: consumer.offset })
    } else if (byte === '}') {
      tokens.push({ type: 'close-brace', content: byte, offset: consumer.offset })
    } else if (byte === ',') {
      tokens.push({ type: 'comma', content: byte, offset: consumer.offset })
    } else if (byte === '.') {
      tokens.push({ type: 'dot', content: byte, offset: consumer.offset })
    } else if (byte === '#') {
      tokens.push({ type: 'pound', content: byte, offset: consumer.offset })
    } else if (byte === '+') {
      tokens.push({ type: 'plus', content: byte, offset: consumer.offset })
    } else if (byte === '-') {
      tokens.push({ type: 'minus', content: byte, offset: consumer.offset })
    } else if (byte === '*') {
      tokens.push({ type: 'star', content: byte, offset: consumer.offset })
    } else if (byte === '/') {
      tokens.push({ type: 'slash', content: byte, offset: consumer.offset })
    } else if (byte === '\\') {
      tokens.push({ type: 'percent', content: byte, offset: consumer.offset })
    } else if (byte === '^') {
      tokens.push({ type: 'caret', content: byte, offset: consumer.offset })
    } else if (byte === '&') {
      tokens.push({ type: 'ampersand', content: byte, offset: consumer.offset })
    } else if (byte === '|') {
      tokens.push({ type: 'pipe', content: byte, offset: consumer.offset })
    } else if (byte === '!') {
      let content = byte
      assert(consumer.peekByte() === '=')
      content += consumer.consumeByte()
      tokens.push({ type: 'not-equal', content, offset: consumer.offset })
    } else if (byte === '<') {
      let content = byte
      if (consumer.peekByte() === '=') {
        content += consumer.consumeByte()
        tokens.push({ type: 'less-equal', content, offset: consumer.offset })
      } else {
        tokens.push({ type: 'open-tick', content, offset: consumer.offset })
      }
    } else if (byte === '>') {
      let content = byte
      if (consumer.peekByte() === '=') {
        content += consumer.consumeByte()
        tokens.push({ type: 'greater-equal', content, offset: consumer.offset })
      } else {
        tokens.push({ type: 'close-tick', content, offset: consumer.offset })
      }
    } else if (byte === '=') {
      let content = byte
      if (consumer.peekByte() === '=') {
        content += consumer.consumeByte()
        tokens.push({ type: 'equal-equal', content, offset: consumer.offset })
      } else {
        tokens.push({ type: 'equal', content, offset: consumer.offset })
      }
    } else if (byte === ':') {
      if (consumer.peekByte() === '-') {
        const content = byte + consumer.consumeByte()
        tokens.push({ type: 'walrus', content, offset: consumer.offset })
      }
    } else {
      console.log(`Unhandled byte: ${chalk.red(byte)}`)
    }
  }

  tokens.push({ type: 'EOF', content: '', offset: consumer.offset })

  return tokens
}
