import { parseDirectionalSelectionFromQueryArray } from './directionalSelection'

export interface InteropSelection {
  from: string[]
  to: string[]
}

interface GetInitialInteropSelectionOptions {
  query: {
    selectedChains?: string[]
    from?: string[]
    to?: string[]
  }
  interopChainsIds: string[]
  fallback: 'all' | 'empty'
}

export function getInitialInteropSelection({
  query,
  interopChainsIds,
  fallback,
}: GetInitialInteropSelectionOptions): InteropSelection {
  const hasDirectionalQuery = query.from !== undefined || query.to !== undefined
  if (hasDirectionalQuery) {
    return {
      from: parseDirectionalSelectionFromQueryArray(
        query.from,
        interopChainsIds,
        fallback,
      ),
      to: parseDirectionalSelectionFromQueryArray(
        query.to,
        interopChainsIds,
        fallback,
      ),
    }
  }

  const legacySelection = parseLegacyPairSelection(
    query.selectedChains,
    interopChainsIds,
  )
  if (legacySelection) {
    return legacySelection
  }

  if (fallback === 'all') {
    return {
      from: [...interopChainsIds],
      to: [...interopChainsIds],
    }
  }

  return {
    from: [],
    to: [],
  }
}

function parseLegacyPairSelection(
  selectedChains: string[] | undefined,
  interopChainsIds: string[],
): InteropSelection | undefined {
  if (!selectedChains) {
    return undefined
  }

  const [first, second, ...rest] = selectedChains
  if (!first || !second || rest.length > 0 || first === second) {
    return undefined
  }

  if (!interopChainsIds.includes(first) || !interopChainsIds.includes(second)) {
    return undefined
  }

  return {
    from: [first],
    to: [second],
  }
}
