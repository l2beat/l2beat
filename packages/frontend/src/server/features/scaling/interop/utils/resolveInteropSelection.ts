import { unique } from '@l2beat/shared-pure'
import type { InteropSelectionInput } from '../types'

export interface NormalizedInteropSelection {
  from: string[]
  to: string[]
}

export function normalizeInteropSelection(
  input: InteropSelectionInput,
): NormalizedInteropSelection | undefined {
  const from = normalizeChainIds(input.from)
  const to = normalizeChainIds(input.to)

  if (from.length === 0 || to.length === 0) {
    return undefined
  }

  // I know it's ugly but for the sake of simplicity and not passing any `mode: 'mutli-chain' | 'pair'` to trpc calls
  // we will assume that if there is only one chain in from and one in to, it's a pair selection
  if (from.length === 1 && to.length === 1) {
    return {
      // biome-ignore lint/style/noNonNullAssertion: temp fix
      from: [from[0]!, to[0]!],
      // biome-ignore lint/style/noNonNullAssertion: temp fix
      to: [to[0]!, from[0]!],
    }
  }

  return {
    from,
    to,
  }
}

function normalizeChainIds(chains: string[]) {
  return unique(chains.filter((chainId) => chainId.length > 0))
}
