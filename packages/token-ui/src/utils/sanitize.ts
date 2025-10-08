export function sanitize<T extends Record<string, unknown>>(value: T): T {
  // removes empty strings
  const emptyStringsStripped = Object.fromEntries(
    Object.entries(value).filter(([_, value]) => value !== ''),
  )

  // removes undefined
  return JSON.parse(JSON.stringify(emptyStringsStripped)) as T
}
