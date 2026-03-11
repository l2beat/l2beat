import { getInitialInteropSelection } from './getInitialInteropSelection'
import type { InteropMode, InteropSelection } from './types'

export function parseInteropSelectionFromSearchParams({
  searchParams,
  interopChainsIds,
  mode,
}: {
  searchParams: URLSearchParams
  interopChainsIds: string[]
  mode: InteropMode
}): InteropSelection {
  return getInitialInteropSelection({
    query: {
      from: parseQueryArray(searchParams.get('from')),
      to: parseQueryArray(searchParams.get('to')),
      selectedChains: parseQueryArray(searchParams.get('selectedChains')),
    },
    interopChainsIds,
    mode,
  })
}

function parseQueryArray(value: string | null) {
  if (value === null) {
    return undefined
  }

  return value.split(',')
}
