export function getDuplicatedNames(
  entries: { name?: string }[],
): ReadonlySet<string> {
  const seen = new Set<string>()
  const duplicated = new Set<string>()
  for (const entry of entries) {
    if (entry.name === undefined) {
      continue
    }
    if (seen.has(entry.name)) {
      duplicated.add(entry.name)
    }
    seen.add(entry.name)
  }
  return duplicated
}
