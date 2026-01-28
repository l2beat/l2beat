export function sortObjectByKeys<T>(obj: Record<string, T>): Record<string, T> {
  return Object.fromEntries(
    Object.keys(obj).sort().map(key => [key, obj[key]])
  )
}
