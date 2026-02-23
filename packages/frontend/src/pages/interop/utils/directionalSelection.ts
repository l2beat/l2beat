export const NO_CHAINS_MARKER = '_none'

function uniquePreservingOrder(values: string[]) {
  return [...new Set(values)]
}

export function normalizeDirectionalSelection(
  values: string[],
  allChainIds: string[],
  fallback: 'all' | 'empty',
): string[] {
  const uniqueValues = uniquePreservingOrder(values)
  const filtered = allChainIds.filter((id) => uniqueValues.includes(id))

  if (filtered.length === 0) {
    return fallback === 'all' ? [...allChainIds] : []
  }

  return filtered
}

export function parseDirectionalSelectionFromQueryValue(
  value: string | null,
  allChainIds: string[],
): string[] {
  if (value === null) {
    return [...allChainIds]
  }

  if (value === NO_CHAINS_MARKER) {
    return []
  }

  return normalizeDirectionalSelection(value.split(','), allChainIds, 'all')
}

export function parseDirectionalSelectionFromQueryArray(
  value: string[] | undefined,
  allChainIds: string[],
): string[] {
  if (!value) {
    return [...allChainIds]
  }

  if (value.length === 1 && value[0] === NO_CHAINS_MARKER) {
    return []
  }

  return normalizeDirectionalSelection(value, allChainIds, 'all')
}

export function serializeDirectionalSelectionToQueryValue(
  selection: string[],
  allChainIds: string[],
): string | undefined {
  const normalized = normalizeDirectionalSelection(
    selection,
    allChainIds,
    'empty',
  )

  if (normalized.length === allChainIds.length) {
    return undefined
  }

  if (normalized.length === 0) {
    return NO_CHAINS_MARKER
  }

  return normalized.join(',')
}
