import { SLOT_SECONDS } from '@l2beat/shared-pure'
import { useQueries } from '@tanstack/react-query'
import { useMemo, useRef } from 'react'
import type { PastBlobs } from '~/server/features/data-availability/live-blobs/LiveBlobsFeed'
import { useTRPC } from '~/trpc/React'
import { isBehindLive, pastPagesFor } from '../lookBack'
import {
  type ChainBlock,
  type PosterIndexOf,
  toChainBlock,
} from './beaconChain'

interface Options {
  /** The slot in the bay, looking back; undefined while live */
  view: number | undefined
  head: number | undefined
  /** Racks the belt shows left of the bay, and right of it */
  before: number
  after: number
  /** The day's oldest slot: blocks before it are let go of */
  oldest: number | undefined
  posterIndexOf: PosterIndexOf
}

/**
 * The blocks of the day the live answers no longer carry, for the belt to
 * show while looking back: a page at a time, around the view and on the way
 * back to live, so the belt passes no empty racks. Each page is kept once the
 * server says nothing more will come of it. `loaded` says every page asked
 * for has answered, or failed to
 */
export function usePastBlocks({
  view,
  head,
  before,
  after,
  oldest,
  posterIndexOf,
}: Options) {
  const trpc = useTRPC()
  const lookingBack = view !== undefined && head !== undefined
  const pages = lookingBack ? pastPagesFor(view, head, { before, after }) : []
  const { answers, loaded } = useQueries({
    queries: pages.map((page) => ({
      ...trpc.da.pastBlobs.queryOptions({ page }),
      staleTime: (query: { state: { data?: PastBlobs } }) =>
        query.state.data?.complete ? Number.POSITIVE_INFINITY : 0,
      // a page the server is still filling, or that reaches the head
      refetchInterval: (query: { state: { data?: PastBlobs } }) =>
        query.state.data?.complete ? false : SLOT_SECONDS * 1000,
    })),
    combine: answersOf,
  })

  // Pages the belt has left are kept, as it glides on from them: to a later
  // slot, or back to live. Fresher answers replace what was kept, and what
  // left the day goes
  const kept = useRef<ReadonlyMap<number, ChainBlock>>(new Map())
  const blocks = useMemo(() => {
    const found = new Map<number, ChainBlock>()
    for (const [slot, block] of kept.current) {
      if (oldest === undefined || slot >= oldest) found.set(slot, block)
    }
    for (const answer of answers) {
      for (const block of answer?.blocks ?? []) {
        found.set(block.slot, toChainBlock(block, posterIndexOf))
      }
    }
    kept.current = found
    return found
  }, [answers, oldest, posterIndexOf])
  return { blocks, loaded }
}

// kept stable, so the answers come back the same while none of them changed
function answersOf<T>(results: { data: T; isPending: boolean }[]) {
  return {
    answers: results.map((result) => result.data),
    loaded: results.every((result) => !result.isPending),
  }
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
