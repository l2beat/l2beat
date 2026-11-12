import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { formatBlockNumber, formatInteger } from '../format'
import { useEthereumHead } from '../live/EthereumHeadContext'
import type { EthereumHead, HeadBlock, Reorg } from '../live/types'

/**
 * The block the reader is looking at: the head while live, or whichever block
 * they picked on the chain strip. The strip and the block panel read it;
 * the rest of the page stays on the head.
 */
export interface Anchor {
  head: EthereumHead
  /** The block every per-block number shows; undefined while connecting */
  block: HeadBlock | undefined
  /** Undefined while following the head */
  selectedSlot: number | undefined
  isLive: boolean
  /** Slots between the anchored block and the head */
  slotsBehind: number
  /** Undefined goes back to the head */
  select: (slot: number | undefined) => void
  /** Why the page went back to the head on its own, if it did */
  notice: string | undefined
  dismissNotice: () => void
  /**
   * Set when a reorg rewrote the slot the reader was anchored to. The page
   * keeps showing the block they picked, now on the losing branch, until
   * they choose to see what replaced it
   */
  orphaned: Orphaned | undefined
  viewReplacement: () => void
}

export interface Orphaned {
  reorg: Reorg
  /** The slot on the winning branch: a block, or a missed slot */
  replacement: HeadBlock | undefined
}

const AnchorContext = createContext<Anchor | undefined>(undefined)

const HASH_KEY = 'slot'

export function AnchorProvider({ children }: { children: ReactNode }) {
  const head = useEthereumHead()
  const [selectedSlot, setSelectedSlot] = useState<number>()
  const [requestedSlot, setRequestedSlot] = useState<number>()
  const [notice, setNotice] = useState<string>()
  const [orphan, setOrphan] = useState<{ reorg: Reorg; block: HeadBlock }>()
  const [seenReorg, setSeenReorg] = useState(head.lastReorg)
  const selectedNumber = useRef<number>(undefined)

  // in render, so the page never shows the replacement for a frame before
  // it switches back to the block the reader was looking at
  if (head.lastReorg !== seenReorg) {
    setSeenReorg(head.lastReorg)
    const reorg = head.lastReorg
    const was = reorg?.replaced.find((b) => b.slot === selectedSlot)
    // a second reorg of the same slot leaves the block the reader picked alone
    if (reorg && was && orphan?.block.slot !== selectedSlot) {
      setOrphan({ reorg, block: was })
    }
  }

  const select = useCallback((slot: number | undefined) => {
    setSelectedSlot(slot)
    setOrphan(undefined)
    setNotice(undefined)
    writeHash(slot)
  }, [])

  // after hydration only: the server has no hash, and the HTML must match it
  useEffect(() => {
    const read = () => setRequestedSlot(readHash())
    read()
    window.addEventListener('hashchange', read)
    return () => window.removeEventListener('hashchange', read)
  }, [])

  // a linked slot can only be resolved once blocks have arrived
  useEffect(() => {
    if (requestedSlot === undefined || head.blocks.length === 0) return
    setRequestedSlot(undefined)
    const block = head.blocks.find((b) => b.slot === requestedSlot)
    if (block?.status === 'proposed' && block.slot !== head.head?.slot) {
      setSelectedSlot(block.slot)
      return
    }
    if (block?.slot === head.head?.slot) return
    writeHash(undefined)
    setNotice(
      block
        ? `Slot ${formatInteger(requestedSlot)} was missed, so there is no block to show. Showing the head.`
        : `Slot ${formatInteger(requestedSlot)} is older than the last 64 slots this page keeps. Showing the head.`,
    )
  }, [requestedSlot, head.blocks, head.head?.slot])

  const onChain =
    selectedSlot === undefined
      ? head.head
      : head.blocks.find((b) => b.slot === selectedSlot)
  const block = orphan?.block ?? onChain
  if (block?.number !== undefined) selectedNumber.current = block.number

  // a pinned block falls out of the window after 64 slots, about 13 minutes
  useEffect(() => {
    if (selectedSlot === undefined || head.blocks.length === 0) return
    if (head.blocks.some((b) => b.slot === selectedSlot)) return
    const number = selectedNumber.current
    setSelectedSlot(undefined)
    setOrphan(undefined)
    writeHash(undefined)
    setNotice(
      `Block ${number !== undefined ? formatBlockNumber(number) : ''} left the last 64 slots, so the page went back to the head.`,
    )
  }, [selectedSlot, head.blocks])

  const value = useMemo((): Anchor => {
    const anchored = block ?? head.head
    const isLive = anchored === head.head && !orphan
    return {
      head,
      block: anchored,
      selectedSlot: isLive ? undefined : selectedSlot,
      isLive,
      slotsBehind: anchored && head.head ? head.head.slot - anchored.slot : 0,
      select,
      notice,
      dismissNotice: () => setNotice(undefined),
      orphaned: orphan && { reorg: orphan.reorg, replacement: onChain },
      viewReplacement: () => {
        if (onChain?.status === 'proposed') setOrphan(undefined)
        else select(undefined)
      },
    }
  }, [head, block, onChain, orphan, selectedSlot, select, notice])

  return <AnchorContext value={value}>{children}</AnchorContext>
}

export function useAnchor(): Anchor {
  const anchor = use(AnchorContext)
  if (!anchor) throw new Error('Missing AnchorProvider')
  return anchor
}

function readHash(): number | undefined {
  const match = window.location.hash.match(new RegExp(`${HASH_KEY}=(\\d+)`))
  return match?.[1] ? Number(match[1]) : undefined
}

/** Replaces rather than pushes: a scrub would otherwise fill the history */
function writeHash(slot: number | undefined) {
  const { pathname, search } = window.location
  const hash = slot === undefined ? '' : `#${HASH_KEY}=${slot}`
  window.history.replaceState(
    window.history.state,
    '',
    pathname + search + hash,
  )
}
