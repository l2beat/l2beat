/**
 * Parses the `highlight` query param value into row ids to highlight,
 * e.g. `sp1hypercube,risc0`.
 */
export function parseHighlightedIds(value: string): string[] {
  return value.split(',').filter((id) => id.length > 0)
}
