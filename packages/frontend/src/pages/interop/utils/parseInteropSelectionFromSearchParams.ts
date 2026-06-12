import { getInitialInteropSelection } from './getInitialInteropSelection'
import type { InteropSelection } from './types'

export function parseInteropSelectionFromSearchParams({
  searchParams,
  interopChainsIds,
}: {
  searchParams: URLSearchParams
  interopChainsIds: string[]
}): InteropSelection {
  return getInitialInteropSelection({
    query: {
      from: parseQueryArray(searchParams.get('from')),
      to: parseQueryArray(searchParams.get('to')),
    },
    interopChainsIds,
  })
}

function parseQueryArray(value: string | null) {
  if (value === null) {
    return undefined
  }

  return value.split(',')
}
