import { useEffect, useRef, useState } from 'react'
import type { LiveBlobs } from '~/server/features/data-availability/live-blobs/LiveBlobsFeed'
import { useChainClock } from '../chainClock'
import {
  arrivesNow,
  type ChainBlock,
  isSameBlock,
  type PosterIndexOf,
  toChainBlock,
} from './beaconChain'

/** Blocks the screen reader's summary averages over */
export const RECENT_BLOCKS = 32

interface Options {
  live: LiveBlobs | undefined
  posterIndexOf: PosterIndexOf
  /** Not called for blocks from the past */
  onFreshBlock: (block: ChainBlock) => void
}

/** Takes in reorgs too. Paused (hidden tab), it catches up on return, as far back as the server keeps */
export function useBeaconChain({ live, posterIndexOf, onFreshBlock }: Options) {
  const clock = useChainClock()
  const [blocks, setBlocks] = useState<ReadonlyMap<number, ChainBlock>>(
    () => new Map(),
  )
  const onFresh = useRef(onFreshBlock)
  onFresh.current = onFreshBlock
  const head = useRef<number>(undefined)

  // runs again on its own update, finding nothing new
  useEffect(() => {
    if (!live) return
    const headMoved = live.head !== head.current
    head.current = live.head
    const current = Math.floor(clock.progressNow())
    const changed = live.blocks.filter(
      (b) => !isSameBlock(blocks.get(b.slot), b),
    )
    const next = keepRecent(blocks, live.head)
    if (changed.length === 0 && next.size === blocks.size) return
    for (const block of changed) {
      const kept = toChainBlock(block, posterIndexOf)
      next.set(block.slot, kept)
      // one that replaces a dropped block is a correction, not an arrival
      const isNew = !blocks.has(block.slot)
      if (isNew && arrivesNow(block.slot, live.head, headMoved, current)) {
        onFresh.current(kept)
      }
    }
    setBlocks(next)
  }, [live, blocks, clock, posterIndexOf])

  return blocks
}

/** Blocks above the head were dropped as the chain moved its head back */
function keepRecent(blocks: ReadonlyMap<number, ChainBlock>, head: number) {
  const kept = new Map<number, ChainBlock>()
  for (const [slot, block] of blocks) {
    if (slot > head - 2 * RECENT_BLOCKS && slot <= head) kept.set(slot, block)
  }
  return kept
}
