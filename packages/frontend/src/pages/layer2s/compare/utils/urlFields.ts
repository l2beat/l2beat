/** Tolerant parsers for URL field values: anything unrecognized falls back. */

export function parseOneOf<T extends string>(
  value: string | undefined,
  options: readonly T[],
  fallback: T,
): T {
  return options.find((option) => option === value) ?? fallback
}

export function parseBoolean(
  value: string | undefined,
  fallback: boolean,
): boolean {
  if (value === 'true') return true
  if (value === 'false') return false
  return fallback
}
