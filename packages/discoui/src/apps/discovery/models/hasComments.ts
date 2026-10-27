export function hasCommentsRecursive(obj: unknown): boolean {
  if (obj === null || obj === undefined) {
    return false
  }

  if (typeof obj !== 'object') {
    return false
  }

  // Pretty lame but we always call this function with what we get from parser, so it's fine
  // Yes, each comment is a symbol.
  const symbols = Object.getOwnPropertySymbols(obj)
  if (symbols.length > 0) {
    return true
  }

  for (const value of Object.values(obj)) {
    if (hasCommentsRecursive(value)) {
      return true
    }
  }

  return false
}
