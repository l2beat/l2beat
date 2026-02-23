import type { InteropSelection } from './types'

export function normalizeInteropSelection(
  selection: InteropSelection,
  allChainIds: string[],
): InteropSelection {
  return {
    from: getValidInteropChains(selection.from, allChainIds),
    to: getValidInteropChains(selection.to, allChainIds),
  }
}

function getValidInteropChains(
  values: string[],
  allChainIds: string[],
): string[] {
  const selected = new Set(values.filter((value) => value.length > 0))
  return allChainIds.filter((id) => selected.has(id))
}
