import { useQueries } from '@tanstack/react-query'
import { useMemo, useRef } from 'react'
import type { PastBlobs } from '~/server/features/data-availability/live-blobs/LiveBlobsFeed'
import { useTRPC } from '~/trpc/React'
import { SLOT_SECONDS } from '~/utils/beaconSlots'
import { isBehindLive, pastPagesFor } from '../lookBack'
import {
  type ChainBlock,
  type PosterIndexOf,
  toChainBlock,
} from './beaconChain'

interface Options {
  /**
   * The belt's left end, looking back: every slot from it to the live answers
   * is fetched. Undefined while live
   */
  from: number | undefined
  head: number | undefined
  posterIndexOf: PosterIndexOf
}

/**
 * The blocks of the hour the live answers no longer carry, for the belt to
 * show while looking back: a page at a time, from the belt's left end up to
 * the live answers, so the belt passes no empty racks on its way back to
 * live. Each page is kept once the server says nothing more will come of it
 */
export function usePastBlocks({ from, head, posterIndexOf }: Options) {
  const trpc = useTRPC()
  const lookingBack = from !== undefined && head !== undefined
  const pages = lookingBack ? pastPagesFor(from, head) : []
  const answers = useQueries({
    queries: pages.map((page) => ({
      ...trpc.da.pastBlobs.queryOptions({ page }),
      staleTime: (query: { state: { data?: PastBlobs } }) =>
        query.state.data?.complete ? Number.POSITIVE_INFINITY : 0,
      // a page the server is still filling, or that reaches the head
      refetchInterval: (query: { state: { data?: PastBlobs } }) =>
        query.state.data?.complete ? false : SLOT_SECONDS * 1000,
    })),
    combine: dataOf,
  })

  // Pages the belt has left are kept, as it glides on from them: to a later
  // slot, or back to live. Fresher answers replace what was kept
  const kept = useRef<ReadonlyMap<number, ChainBlock>>(new Map())
  return useMemo(() => {
    const blocks = new Map(kept.current)
    for (const answer of answers) {
      for (const block of answer?.blocks ?? []) {
        blocks.set(block.slot, toChainBlock(block, posterIndexOf))
      }
    }
    kept.current = blocks
    return blocks
  }, [answers, posterIndexOf])
}

// kept stable, so the answers come back the same while none of them changed
function dataOf<T>(results: { data: T }[]): T[] {
  return results.map((result) => result.data)
}

/**
 * The live blocks with the past's behind them. The same map while there is
 * no past, as the live one changes in place and the belt follows it
 */
export function withPast(
  live: Map<number, ChainBlock>,
  past: ReadonlyMap<number, ChainBlock>,
  head: number | undefined,
): ReadonlyMap<number, ChainBlock> {
  if (past.size === 0 || head === undefined) return live
  const blocks = new Map(live)
  for (const [slot, block] of past) {
    if (isBehindLive(slot, head) && !blocks.has(slot)) blocks.set(slot, block)
  }
  return blocks
}
