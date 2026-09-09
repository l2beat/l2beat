export function addIfDefined(
  a: number | undefined | null,
  b: number | undefined | null,
): number | null {
  if (a === null || a === undefined) {
    return b ?? null
  }

  if (b === null || b === undefined) {
    return a ?? null
  }

  return a + b
}
