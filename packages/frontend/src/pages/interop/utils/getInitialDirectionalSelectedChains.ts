import { parseDirectionalSelectionFromQueryArray } from './directionalSelection'

export interface DirectionalSelectedChains {
  from: string[]
  to: string[]
}

export function getInitialDirectionalSelectedChains(
  query: {
    from?: string[]
    to?: string[]
  },
  interopChainsIds: string[],
): DirectionalSelectedChains {
  return {
    from: parseDirectionalSelectionFromQueryArray(query.from, interopChainsIds),
    to: parseDirectionalSelectionFromQueryArray(query.to, interopChainsIds),
  }
}
