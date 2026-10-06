import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useTRPC, useTRPCClient } from '~/trpc/React'
import { useChainClock } from '../chainClock'
import {
  type ChainBlock,
  type PosterIndexOf,
  toChainBlock,
} from './beaconChain'

/** Blocks the screen reader's summary averages over */
export const RECENT_BLOCKS = 32
/**
 * The server holds each ask open until a new block comes, so the next one
 * goes out as soon as an answer is in
 */
const ASK_AGAIN_AFTER = 0.25
const RETRY_DELAY = 2
const MAX_RETRY_DELAY = 30

export interface BeaconChain {
  /** Recent blocks by slot. Changed in place; `version` says when */
  blocks: Map<number, ChainBlock>
  /** Slots since genesis on the chain's clock, with how far into the current one */
  progressNow: () => number
}

interface Options {
  posterIndexOf: PosterIndexOf
  /** Asks the server only while true, as when the belt is on screen */
  enabled: boolean
  /** A block came in while it is still the newest, rather than from the past */
  onFreshBlock: (block: ChainBlock) => void
}

/**
 * Follows Ethereum as it makes blocks, through our server: the recent ones
 * once, then every new one the moment the server has it. Paused, as in a
 * hidden tab, it catches up on return, as far back as the server keeps.
 */
export function useBeaconChain({
  posterIndexOf,
  enabled,
  onFreshBlock,
}: Options) {
  const clock = useChainClock()
  const [chain] = useState<BeaconChain>(() => ({
    blocks: new Map(),
    progressNow: clock.progressNow,
  }))
  const [version, setVersion] = useState(0)
  const onFresh = useRef(onFreshBlock)
  onFresh.current = onFreshBlock
  /** The newest slot in hand, which the server waits to pass before it answers */
  const head = useRef<number>(undefined)

  const trpc = useTRPC()
  const trpcClient = useTRPCClient()
  const query = useQuery({
    // the same key with no slot in it, which the stats and the table read
    ...trpc.da.liveBlobs.queryOptions({}),
    queryFn: ({ signal }) =>
      trpcClient.da.liveBlobs.query({ after: head.current }, { signal }),
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
    head.current = live.head
    const current = Math.floor(chain.progressNow())
    const fresh = live.blocks.filter((b) => !chain.blocks.has(b.slot))
    for (const block of fresh) {
      const kept = toChainBlock(block, posterIndexOf)
      chain.blocks.set(block.slot, kept)
      if (block.slot >= current - 1) onFresh.current(kept)
    }
    forgetOld(chain.blocks, live.head)
    if (fresh.length > 0) setVersion((v) => v + 1)
  }, [live, chain, clock, posterIndexOf])

  return { chain, version }
}

function forgetOld(blocks: Map<number, ChainBlock>, head: number) {
  for (const slot of blocks.keys()) {
    if (slot <= head - 2 * RECENT_BLOCKS) blocks.delete(slot)
  }
}

/** Seconds until the server is asked again */
function askAgainIn(failures: number) {
  if (failures === 0) return ASK_AGAIN_AFTER
  return Math.min(MAX_RETRY_DELAY, RETRY_DELAY * 2 ** failures)
}
