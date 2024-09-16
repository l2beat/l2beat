export function addIfDefined(
  a: number | undefined | null,
  b: number | undefined | null,
): number | undefined {
  if (a === null || a === undefined) {
    return b ?? undefined
  }

  if (b === null || b === undefined) {
    return a ?? undefined
  }

  return a + b
}
