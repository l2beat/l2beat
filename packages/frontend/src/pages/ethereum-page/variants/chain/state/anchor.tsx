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
import { useEthereumHead } from '../../../live/EthereumHeadContext'
import type { EthereumHead, HeadBlock, TodaySoFar } from '../../../live/types'
import { formatBlockNumber, formatInteger } from '../format'
import { supplyAsOf, todayAsOf } from '../metrics'

/**
 * The page is anchored to one block: the head while live, or whichever block
 * the reader picked on the timeline. Every per-block number reads from here,
 * so picking a block moves the whole page back in time.
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
  /** Today's running totals as they stood at the anchored block */
  today: TodaySoFar | undefined
  supplyEth: number | undefined
  /** Undefined goes back to the head */
  select: (slot: number | undefined) => void
  /** Why the page went back to the head on its own, if it did */
  notice: string | undefined
  dismissNotice: () => void
}

const AnchorContext = createContext<Anchor | undefined>(undefined)

const HASH_KEY = 'slot'

export function AnchorProvider({ children }: { children: ReactNode }) {
  const head = useEthereumHead()
  const [selectedSlot, setSelectedSlot] = useState<number>()
  const [requestedSlot, setRequestedSlot] = useState<number>()
  const [notice, setNotice] = useState<string>()
  const selectedNumber = useRef<number>(undefined)

  const select = useCallback((slot: number | undefined) => {
    setSelectedSlot(slot)
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

  const block =
    selectedSlot === undefined
      ? head.head
      : head.blocks.find((b) => b.slot === selectedSlot)
  if (block?.number !== undefined) selectedNumber.current = block.number

  // a pinned block falls out of the window after 64 slots, about 13 minutes
  useEffect(() => {
    if (selectedSlot === undefined || head.blocks.length === 0) return
    if (head.blocks.some((b) => b.slot === selectedSlot)) return
    const number = selectedNumber.current
    setSelectedSlot(undefined)
    writeHash(undefined)
    setNotice(
      `Block ${number !== undefined ? formatBlockNumber(number) : ''} left the last 64 slots, so the page went back to the head.`,
    )
  }, [selectedSlot, head.blocks])

  const value = useMemo((): Anchor => {
    const anchored = block ?? head.head
    const later = anchored
      ? head.blocks.filter((b) => b.slot > anchored.slot)
      : []
    return {
      head,
      block: anchored,
      selectedSlot: anchored === head.head ? undefined : selectedSlot,
      isLive: anchored === head.head,
      slotsBehind: anchored && head.head ? head.head.slot - anchored.slot : 0,
      today: todayAsOf(head.today, later),
      supplyEth: supplyAsOf(head.supplyEth, later),
      select,
      notice,
      dismissNotice: () => setNotice(undefined),
    }
  }, [head, block, selectedSlot, select, notice])

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
