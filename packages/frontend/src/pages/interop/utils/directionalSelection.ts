export const NO_CHAINS_MARKER = '_none'

function uniquePreservingOrder(values: string[]) {
  return [...new Set(values)]
}

function resolveFallbackSelection(
  allChainIds: string[],
  fallback: 'all' | 'empty',
) {
  return fallback === 'all' ? [...allChainIds] : []
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
  fallback: 'all' | 'empty' = 'all',
): string[] {
  if (value === null) {
    return resolveFallbackSelection(allChainIds, fallback)
  }

  if (value === NO_CHAINS_MARKER) {
    return []
  }

  return normalizeDirectionalSelection(value.split(','), allChainIds, fallback)
}

export function parseDirectionalSelectionFromQueryArray(
  value: string[] | undefined,
  allChainIds: string[],
  fallback: 'all' | 'empty' = 'all',
): string[] {
  if (!value) {
    return resolveFallbackSelection(allChainIds, fallback)
  }

  if (value.length === 1 && value[0] === NO_CHAINS_MARKER) {
    return []
  }

  return normalizeDirectionalSelection(value, allChainIds, fallback)
}

export function serializeDirectionalSelectionToQueryValue(
  selection: string[],
  allChainIds: string[],
  defaultSelection: string[],
): string | undefined {
  const normalized = normalizeDirectionalSelection(
    selection,
    allChainIds,
    'empty',
  )

  const normalizedDefault = normalizeDirectionalSelection(
    defaultSelection,
    allChainIds,
    'empty',
  )

  if (
    normalized.length === normalizedDefault.length &&
    normalized.every((value, index) => value === normalizedDefault[index])
  ) {
    return undefined
  }

  if (normalized.length === 0) {
    return NO_CHAINS_MARKER
  }

  return normalized.join(',')
}
