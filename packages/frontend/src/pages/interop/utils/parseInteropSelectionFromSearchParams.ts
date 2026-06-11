import { getInitialInteropSelection } from './getInitialInteropSelection'
import type { InteropSelection } from './types'

export function parseInteropSelectionFromSearchParams({
  searchParams,
  interopChainsIds,
  defaultSelection,
}: {
  searchParams: URLSearchParams
  interopChainsIds: string[]
  defaultSelection?: InteropSelection
}): InteropSelection {
  return getInitialInteropSelection({
    query: {
      from: parseQueryArray(searchParams.get('from')) ?? defaultSelection?.from,
      to: parseQueryArray(searchParams.get('to')) ?? defaultSelection?.to,
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
