import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
} from '@l2beat/database'
import { unique } from '@l2beat/shared-pure'
import type { InteropSelectionInput } from '../types'

export type ResolvedInteropSelection =
  | {
      mode: 'empty'
      from: []
      to: []
      union: []
    }
  | {
      mode: 'pair'
      from: [string]
      to: [string]
      union: [string, string]
    }
  | {
      mode: 'directional'
      from: string[]
      to: string[]
      union: string[]
    }

export function resolveInteropSelection(
  input: InteropSelectionInput,
): ResolvedInteropSelection {
  const from = normalizeChainIds(input.from)
  const to = normalizeChainIds(input.to)

  if (from.length === 0 || to.length === 0) {
    return {
      mode: 'empty',
      from: [],
      to: [],
      union: [],
    }
  }

  if (from.length === 1 && to.length === 1) {
    const [first] = from
    const [second] = to
    if (!first || !second || first === second) {
      // Keep same-chain behavior consistent with production: exclude same-chain.
      return {
        mode: 'empty',
        from: [],
        to: [],
        union: [],
      }
    }

    return {
      mode: 'pair',
      from: [first],
      to: [second],
      union: [first, second],
    }
  }

  return {
    mode: 'directional',
    from,
    to,
    union: unique([...from, ...to]),
  }
}

function normalizeChainIds(chains: string[]) {
  return unique(chains.filter((chainId) => chainId.length > 0))
}

export function toLegacySelectedChainsTuple(
  chains: string[],
): [string, string] {
  // Existing DB repository methods currently accept a fixed tuple, but runtime SQL
  // supports arbitrary IN-lists; we keep repository contracts unchanged.
  return chains as unknown as [string, string]
}

export function filterDirectionalTransfers(
  transfers: AggregatedInteropTransferRecord[],
  from: string[],
  to: string[],
) {
  const fromSet = new Set(from)
  const toSet = new Set(to)

  return transfers.filter(
    (transfer) =>
      transfer.srcChain !== transfer.dstChain &&
      fromSet.has(transfer.srcChain) &&
      toSet.has(transfer.dstChain),
  )
}

export function filterDirectionalTokens(
  tokens: AggregatedInteropTokenRecord[],
  from: string[],
  to: string[],
) {
  const fromSet = new Set(from)
  const toSet = new Set(to)

  return tokens.filter(
    (token) =>
      token.srcChain !== token.dstChain &&
      fromSet.has(token.srcChain) &&
      toSet.has(token.dstChain),
  )
}
