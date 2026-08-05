/**
 * Parses the `highlight` search params into row ids to highlight.
 * Supports both comma-separated values (`?highlight=a,b`) and repeated
 * params (`?highlight=a&highlight=b`).
 */
export function parseHighlightedIds(search: string): string[] {
  return new URLSearchParams(search)
    .getAll('highlight')
    .flatMap((value) => value.split(','))
    .filter((id) => id.length > 0)
}
