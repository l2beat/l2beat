import type { ApiProjectEntry } from '../../api/types'

export function getVisibleDisplayName(
  entry: ApiProjectEntry,
): string | undefined {
  if (entry.displayName === undefined) {
    return undefined
  }
  if (toComparable(entry.displayName) === toComparable(entry.name)) {
    return undefined
  }
  return entry.displayName
}

function toComparable(name: string): string {
  let result = ''
  for (const char of name.toLowerCase()) {
    const isLetter = char >= 'a' && char <= 'z'
    const isDigit = char >= '0' && char <= '9'
    if (isLetter || isDigit) {
      result += char
    }
  }
  return result
}
