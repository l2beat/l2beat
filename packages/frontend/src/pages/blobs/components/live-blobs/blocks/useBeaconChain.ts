import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import type { PendingBatch } from '~/server/features/data-availability/live-blobs/LiveBlobsFeed'
import { useTRPC, useTRPCClient } from '~/trpc/React'
import { useChainClock } from '../chainClock'
import {
  arrivesNow,
  type ChainBlock,
  heardNow,
  isSameBlock,
  type PendingBlobBatch,
  type PosterIndexOf,
  toChainBlock,
  toPendingBlobBatch,
} from './beaconChain'

/** Blocks the screen reader's summary averages over */
export const RECENT_BLOCKS = 32
/**
 * The server holds each ask open until a new block or a change in the
 * mempool comes, so the next one goes out as soon as an answer is in
 */
const ASK_AGAIN_AFTER = 0.25
const RETRY_DELAY = 2
const MAX_RETRY_DELAY = 30

export interface BeaconChain {
  /** Recent blocks by slot. Changed in place; `version` says when */
  blocks: Map<number, ChainBlock>
  /** Batches waiting in the mempool by key, oldest first. Changed in place, without a new `version`: the belt looks at them every frame */
  pending: Map<string, PendingBlobBatch>
  /** Slots since genesis on the chain's clock, with how far into the current one */
  progressNow: () => number
}

interface Options {
  posterIndexOf: PosterIndexOf
  /** Asks the server only while true, as when the belt is on screen */
  enabled: boolean
  /** A block came in while it is still the newest, rather than from the past */
  onFreshBlock: (block: ChainBlock) => void
  /** A batch was heard of in the mempool just now */
  onFreshPending: (batch: PendingBlobBatch) => void
}

/**
 * Follows Ethereum as it makes blocks, through our server: the recent ones
 * once, then every new one the moment the server has it, and any the chain
 * has since dropped or swapped, with the batches waiting in the mempool for
 * the next. Paused, as in a hidden tab, it catches up on return, as far back
 * as the server keeps.
 */
export function useBeaconChain({
  posterIndexOf,
  enabled,
  onFreshBlock,
  onFreshPending,
}: Options) {
  const clock = useChainClock()
  const [chain] = useState<BeaconChain>(() => ({
    blocks: new Map(),
    pending: new Map(),
    progressNow: clock.progressNow,
  }))
  const [version, setVersion] = useState(0)
  const onFresh = useRef({ block: onFreshBlock, pending: onFreshPending })
  onFresh.current = { block: onFreshBlock, pending: onFreshPending }
  /** The newest slot in hand, which the server waits to pass before it answers */
  const head = useRef<number>(undefined)
  /** The mempool in hand, which the server waits to change before it answers */
  const pendingMark = useRef<string>(undefined)

  const trpc = useTRPC()
  const trpcClient = useTRPCClient()
  const query = useQuery({
    // the same key with no slot in it, which the stats and the table read
    ...trpc.da.liveBlobs.queryOptions({}),
    queryFn: ({ signal }) =>
      trpcClient.da.liveBlobs.query(
        { after: head.current, pendingAfter: pendingMark.current },
        { signal },
      ),
    enabled,
    // a poll that fails backs off by itself, rather than retrying at once
    retry: false,
    // what was fetched before the belt left the screen is old on its return
    staleTime: 0,
    refetchInterval: (q) => 1000 * askAgainIn(q.state.fetchFailureCount),
  })

  const live = query.data
  useEffect(() => {
    if (!live) return
    clock.correct(live.head)
    const headMoved = live.head !== head.current
    head.current = live.head
    pendingMark.current = live.pendingMark
    const current = Math.floor(chain.progressNow())
    // blocks first, so a batch leaving the mempool for one is still where it waited
    const changed = live.blocks.filter(
      (b) => !isSameBlock(chain.blocks.get(b.slot), b),
    )
    for (const block of changed) {
      // one that replaces a dropped block is a correction, not an arrival
      const isNew = !chain.blocks.has(block.slot)
      const kept = toChainBlock(block, posterIndexOf)
      chain.blocks.set(block.slot, kept)
      if (isNew && arrivesNow(block.slot, live.head, headMoved, current)) {
        onFresh.current.block(kept)
      }
    }
    const rolledBack = forgetOld(chain.blocks, live.head)
    updatePending(chain.pending, live.pending, posterIndexOf, (batch) => {
      if (heardNow(batch.firstSeenAt, clock.now())) {
        onFresh.current.pending(batch)
      }
    })
    if (changed.length > 0 || rolledBack) setVersion((v) => v + 1)
  }, [live, chain, clock, posterIndexOf])

  return { chain, version }
}

/** Puts what the server says waits in place of what did, telling of each batch not had before */
function updatePending(
  pending: Map<string, PendingBlobBatch>,
  served: PendingBatch[],
  posterIndexOf: PosterIndexOf,
  onNew: (batch: PendingBlobBatch) => void,
) {
  const batches = served.map((b) => toPendingBlobBatch(b, posterIndexOf))
  const added = batches.filter((batch) => !pending.has(batch.key))
  pending.clear()
  for (const batch of batches) pending.set(batch.key, batch)
  for (const batch of added) onNew(batch)
}

/**
 * Lets go of blocks too old to show, and of any above the head, which the
 * chain dropped as it moved its head back. Says whether it had any such
 */
function forgetOld(blocks: Map<number, ChainBlock>, head: number) {
  let rolledBack = false
  for (const slot of blocks.keys()) {
    if (slot <= head - 2 * RECENT_BLOCKS) blocks.delete(slot)
    if (slot > head) {
      blocks.delete(slot)
      rolledBack = true
    }
  }
  return rolledBack
}

/** Seconds until the server is asked again */
function askAgainIn(failures: number) {
  if (failures === 0) return ASK_AGAIN_AFTER
  return Math.min(MAX_RETRY_DELAY, RETRY_DELAY * 2 ** failures)
}
