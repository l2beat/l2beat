import { getValidInteropChains } from './getValidInteropChains'
import type { InteropMode, InteropSelection } from './types'

export interface InteropSelectionQuery {
  from?: string[]
  to?: string[]
  selectedChains?: string[]
}

interface GetInitialInteropSelectionOptions {
  query: InteropSelectionQuery | undefined
  interopChainsIds: string[]
  mode: InteropMode
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
  query: InteropSelectionQuery | undefined,
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
  query: InteropSelectionQuery | undefined,
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
