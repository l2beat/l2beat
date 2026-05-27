import { getValidInteropChains } from './getValidInteropChains'
import type { InteropSelection } from './types'

export interface InteropSelectionQuery {
  from?: string[]
  to?: string[]
}

interface GetInitialInteropSelectionOptions {
  query: InteropSelectionQuery | undefined
  interopChainsIds: string[]
}

export function getInitialInteropSelection({
  query,
  interopChainsIds,
}: GetInitialInteropSelectionOptions): InteropSelection {
  const from =
    query?.from !== undefined
      ? getValidInteropChains(query.from, interopChainsIds)
      : []

  const to =
    query?.to !== undefined
      ? getValidInteropChains(query.to, interopChainsIds)
      : []

  return { from, to }
}
