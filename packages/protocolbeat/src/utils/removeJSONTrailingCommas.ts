// NOTE(radomski): Forked from https://github.com/sindresorhus/strip-json-comments
export function removeJSONTrailingCommas(value: string): string {
  let offset = 0
  let buffer = ''
  let result = ''
  let commaIndex = -1
  let isInsideString = false

  for (let index = 0; index < value.length; index++) {
    const currentCharacter = value[index]

    if (currentCharacter === '"') {
      // Enter or exit string
      const escaped = isEscaped(value, index)
      if (!escaped) {
        isInsideString = !isInsideString
      }
    }

    if (isInsideString) {
      continue
    }

    if (commaIndex !== -1) {
      if (currentCharacter === '}' || currentCharacter === ']') {
        // Strip trailing comma
        buffer += value.slice(offset, index)
        result += buffer.slice(1)
        buffer = ''
        offset = index
        commaIndex = -1
      } else if (
        currentCharacter !== ' ' &&
        currentCharacter !== '\t' &&
        currentCharacter !== '\r' &&
        currentCharacter !== '\n'
      ) {
        // Hit non-whitespace following a comma; comma is not trailing
        buffer += value.slice(offset, index)
        offset = index
        commaIndex = -1
      }
    } else if (currentCharacter === ',') {
      // Flush buffer prior to this point, and save new comma index
      result += buffer + value.slice(offset, index)
      buffer = ''
      offset = index
      commaIndex = index
    }
  }

  return result + buffer + value.slice(offset)
}

function isEscaped(jsonString: string, quotePosition: number): boolean {
  let index = quotePosition - 1
  let backslashCount = 0

  while (jsonString[index] === '\\') {
    index -= 1
    backslashCount += 1
  }

  return Boolean(backslashCount % 2)
}
