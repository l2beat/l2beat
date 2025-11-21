export function undefinedIfEmpty<T>(obj: T[]): T[] | undefined
export function undefinedIfEmpty<T>(
  obj: Record<string, T>,
): Record<string, T> | undefined
export function undefinedIfEmpty<T>(
  obj: T[] | Record<string, T>,
): T[] | Record<string, T> | undefined {
  if (Array.isArray(obj)) {
    return obj.length === 0 ? undefined : obj
  }

  return Object.keys(obj).length === 0 ||
    Object.values(obj).every((value) => value === undefined)
    ? undefined
    : obj
}

export function isEmpty(obj: Record<string, unknown>): boolean {
  return (
    Object.keys(obj).length === 0 ||
    Object.values(obj).every((value) => value === undefined)
  )
}
