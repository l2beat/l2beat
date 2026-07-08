import type { ProjectId } from '@l2beat/shared-pure'
import type { ProtocolEntry } from '~/server/features/scaling/interop/types'

export type ActiveCounts = {
  chains: number
  tokens: number
}

export function getActiveCounts(
  entries: ProtocolEntry[],
): Map<ProjectId, ActiveCounts> {
  return new Map(
    entries.map((entry) => [
      entry.id,
      {
        chains: entry.chains.items.length + entry.chains.remainingCount,
        tokens: entry.tokens.items.length + entry.tokens.remainingCount,
      },
    ]),
  )
}
