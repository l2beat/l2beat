import { useEffect, useRef, useState } from 'react'
import type {
  LiveBlobs,
  PendingBatch,
} from '~/server/features/data-availability/live-blobs/LiveBlobsFeed'
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

interface Options {
  live: LiveBlobs | undefined
  posterIndexOf: PosterIndexOf
  /** Not called for blocks from the past */
  onFreshBlock: (block: ChainBlock) => void
  /** A batch just heard of in the mempool */
  onFreshPending: (batch: PendingBlobBatch) => void
}

/**
 * Takes in reorgs too. Paused (hidden tab), it catches up on return, as far
 * back as the server keeps. `pending` is changed in place, without a render:
 * the belt looks at it every frame
 */
export function useBeaconChain({
  live,
  posterIndexOf,
  onFreshBlock,
  onFreshPending,
}: Options) {
  const clock = useChainClock()
  const [blocks, setBlocks] = useState<ReadonlyMap<number, ChainBlock>>(
    () => new Map(),
  )
  const [pending] = useState(() => new Map<string, PendingBlobBatch>())
  const onFresh = useRef({ block: onFreshBlock, pending: onFreshPending })
  onFresh.current = { block: onFreshBlock, pending: onFreshPending }
  const head = useRef<number>(undefined)

  // runs again on its own update, finding nothing new
  useEffect(() => {
    if (!live) return
    const headMoved = live.head !== head.current
    head.current = live.head
    const current = Math.floor(clock.progressNow())
    // blocks first, so a batch leaving the mempool for one is still where it waited
    const changed = live.blocks.filter(
      (b) => !isSameBlock(blocks.get(b.slot), b),
    )
    const next = keepRecent(blocks, live.head)
    if (changed.length > 0 || next.size !== blocks.size) {
      for (const block of changed) {
        const kept = toChainBlock(block, posterIndexOf)
        next.set(block.slot, kept)
        // one that replaces a dropped block is a correction, not an arrival
        const isNew = !blocks.has(block.slot)
        if (isNew && arrivesNow(block.slot, live.head, headMoved, current)) {
          onFresh.current.block(kept)
        }
      }
      setBlocks(next)
    }
    updatePending(pending, live.pending, posterIndexOf, (batch) => {
      if (heardNow(batch.firstSeenAt, clock.now())) {
        onFresh.current.pending(batch)
      }
    })
  }, [live, blocks, pending, clock, posterIndexOf])

  return { blocks, pending }
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

/** Blocks above the head were dropped as the chain moved its head back */
function keepRecent(blocks: ReadonlyMap<number, ChainBlock>, head: number) {
  const kept = new Map<number, ChainBlock>()
  for (const [slot, block] of blocks) {
    if (slot > head - 2 * RECENT_BLOCKS && slot <= head) kept.set(slot, block)
  }
  return kept
}
