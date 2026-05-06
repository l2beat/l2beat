const DOUBLE_QUOTE = code('"')
const BACKSLASH = code('\\')
const SLASH = code('/')
const ASTERISK = code('*')
const COMMA = code(',')
const LINE_FEED = code('\n')
const CARRIAGE_RETURN = code('\r')
const SPACE = code(' ')
const TAB = code('\t')
const OPEN_BRACKET = code('[')
const CLOSE_BRACKET = code(']')
const OPEN_BRACE = code('{')
const CLOSE_BRACE = code('}')
const COLON = code(':')

export function parseJsonc<T = unknown>(text: string): T {
  return JSON.parse(stripJsonc(text))
}

function stripJsonc(input: string): string {
  const chunks: string[] = []
  let hasChanges = false
  let lastEmit = 0
  let previousWasValue = false
  let pendingComma: PendingComma | undefined

  function emitUntil(end: number) {
    if (
      pendingComma !== undefined &&
      pendingComma.chunkIndex === -1 &&
      pendingComma.index >= lastEmit &&
      pendingComma.index < end
    ) {
      chunks.push(input.slice(lastEmit, pendingComma.index))
      chunks.push(',')
      pendingComma.chunkIndex = chunks.length - 1
      chunks.push(input.slice(pendingComma.index + 1, end))
    } else {
      chunks.push(input.slice(lastEmit, end))
    }

    lastEmit = end
  }

  function resolveComma(nextToken: number) {
    if (pendingComma === undefined) {
      return
    }

    const isTrailingComma =
      (nextToken === CLOSE_BRACKET || nextToken === CLOSE_BRACE) &&
      pendingComma.hadValueBefore

    if (isTrailingComma) {
      if (pendingComma.chunkIndex === -1) {
        chunks.push(input.slice(lastEmit, pendingComma.index))
        lastEmit = pendingComma.index + 1
      } else {
        chunks[pendingComma.chunkIndex] = ''
      }
      hasChanges = true
    }

    pendingComma = undefined
  }

  let index = 0
  while (index < input.length) {
    const char = input.charCodeAt(index)

    if (char === DOUBLE_QUOTE) {
      resolveComma(char)
      index = skipString(input, index)
      previousWasValue = true
      continue
    }

    if (char === SLASH) {
      const commentEnd = skipComment(input, index)

      if (commentEnd !== undefined) {
        emitUntil(index)
        chunks.push(' ')
        index = commentEnd
        lastEmit = index
        hasChanges = true
        continue
      }
    }

    if (char === COMMA) {
      resolveComma(char)
      pendingComma = { index, hadValueBefore: previousWasValue, chunkIndex: -1 }
      previousWasValue = false
      index++
      continue
    }

    if (!isJsonWhitespace(char)) {
      resolveComma(char)
      previousWasValue =
        char !== OPEN_BRACKET && char !== OPEN_BRACE && char !== COLON
    }

    index++
  }

  if (!hasChanges) {
    return input
  }

  chunks.push(input.slice(lastEmit))
  return chunks.join('')
}

interface PendingComma {
  index: number
  hadValueBefore: boolean
  chunkIndex: number
}

function skipString(input: string, start: number): number {
  let index = start + 1

  while (index < input.length) {
    const char = input.charCodeAt(index)

    if (char === BACKSLASH) {
      index += 2
      continue
    }

    if (char === DOUBLE_QUOTE) {
      return index + 1
    }

    index++
  }

  return input.length
}

function skipComment(input: string, start: number): number | undefined {
  const nextChar = input.charCodeAt(start + 1)

  if (nextChar === SLASH) {
    let index = start + 2

    while (index < input.length) {
      const char = input.charCodeAt(index)
      if (char === LINE_FEED || char === CARRIAGE_RETURN) {
        return index
      }
      index++
    }

    return input.length
  }

  if (nextChar === ASTERISK) {
    let index = start + 2

    while (index < input.length) {
      if (
        input.charCodeAt(index) === ASTERISK &&
        input.charCodeAt(index + 1) === SLASH
      ) {
        return index + 2
      }

      index++
    }

    return input.length
  }
}

function isJsonWhitespace(char: number): boolean {
  return (
    char === SPACE ||
    char === LINE_FEED ||
    char === CARRIAGE_RETURN ||
    char === TAB
  )
}

function code(character: string): number {
  return character.charCodeAt(0)
}
