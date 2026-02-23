import type { InteropQuery } from '../InteropRouter'
import { getValidInteropChains } from './getValidInteropChains'

export interface InteropSelection {
  from: string[]
  to: string[]
}

type InteropSelectionMode = 'public' | 'internal'

interface GetInitialInteropSelectionOptions {
  query: InteropQuery
  interopChainsIds: string[]
  mode: InteropSelectionMode
}

export function getInitialInteropSelection({
  query,
  interopChainsIds,
  mode,
}: GetInitialInteropSelectionOptions): InteropSelection {
  if (mode === 'public') {
    return getPublicInitialSelection(query, interopChainsIds)
  }

  return getInternalInitialSelection(query, interopChainsIds)
}

function getPublicInitialSelection(
  query: InteropQuery,
  interopChainsIds: string[],
): InteropSelection {
  const selectedChains = query?.selectedChains
  if (selectedChains) {
    const [from, to] = selectedChains
    if (from && to && from !== to) {
      const validFrom = getValidInteropChains([from], interopChainsIds)
      const validTo = getValidInteropChains([to], interopChainsIds)

      if (validFrom.length === 1 && validTo.length === 1) {
        return {
          from: validFrom,
          to: validTo,
        }
      }
    }
  }

  return {
    from: [],
    to: [],
  }
}

function getInternalInitialSelection(
  query: InteropQuery,
  interopChainsIds: string[],
): InteropSelection {
  const from =
    query?.from !== undefined
      ? getValidInteropChains(query.from, interopChainsIds)
      : [...interopChainsIds]

  const to =
    query?.to !== undefined
      ? getValidInteropChains(query.to, interopChainsIds)
      : [...interopChainsIds]

  return { from, to }
}
