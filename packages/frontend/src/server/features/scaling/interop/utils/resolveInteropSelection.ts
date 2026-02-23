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

  return {
    from,
    to,
  }
}

function normalizeChainIds(chains: string[]) {
  return unique(chains.filter((chainId) => chainId.length > 0))
}
