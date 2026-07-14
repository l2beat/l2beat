export function toggleSelection(
  selection: string[],
  id: string,
  allIds: string[],
): string[] {
  const next = new Set(selection)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }

  return allIds.filter((candidate) => next.has(candidate))
}
