import { parseMultiChainSelectionFromQueryArray } from './multiChainSelection'

export interface InteropSelection {
  from: string[]
  to: string[]
}

interface GetInitialInteropSelectionOptions {
  query: {
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
  return {
    from: parseMultiChainSelectionFromQueryArray(
      query.from,
      interopChainsIds,
      fallback,
    ),
    to: parseMultiChainSelectionFromQueryArray(
      query.to,
      interopChainsIds,
      fallback,
    ),
  }
}
