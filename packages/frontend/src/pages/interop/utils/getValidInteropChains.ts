export function getValidInteropChains(
  values: string[],
  allChainIds: string[],
): string[] {
  const selected = new Set(values.filter((value) => value.length > 0))
  return allChainIds.filter((id) => selected.has(id))
}
