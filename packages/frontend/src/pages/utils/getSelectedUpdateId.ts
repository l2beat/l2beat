export function getSelectedUpdateId(query: unknown): string | undefined {
  if (typeof query !== 'object' || query === null) {
    return undefined
  }

  const values = query as Record<string, unknown>
  return typeof values.update === 'string' ? values.update : undefined
}
