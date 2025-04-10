export function undefinedIfEmpty<T>(array: T[]): T[] | undefined {
  if (array.length === 0) {
    return undefined
  }

  return array
}
