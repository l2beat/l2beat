import { useEffect, useRef, useState } from 'react'
import type { EthereumHead, HeadBlock, Reorg } from '../../live/types'
import { epochOf } from './derive'

/**
 * The stages of a replayed reorg, in order. The tape scrolls back past the
 * replaced slot, the orphan rolls back into view and is struck out, it is
 * ejected, the replacement drops into its place, and the tape runs forward
 * to the head again
 */
export type RewindPhase = 'rewind' | 'strike' | 'eject' | 'drop' | 'forward'

const TIMELINE: [RewindPhase, number][] = [
  ['rewind', 0],
  ['strike', 700],
  ['eject', 1550],
  ['drop', 1950],
  ['forward', 2650],
]
const DONE_AT = 3300

export interface Rewind {
  reorg: Reorg
  phase: RewindPhase
  /** The tape as it was when the reorg arrived, newest first */
  snapshot: HeadBlock[]
}

/** Replays each new reorg once; with reduced motion the tape just updates and the log says what happened */
export function useRewind(
  head: EthereumHead,
  reducedMotion: boolean,
): Rewind | undefined {
  const [rewind, setRewind] = useState<Rewind>()
  const seen = useRef<number | undefined>(undefined)
  const { lastReorg, blocks } = head
  const blocksRef = useRef(blocks)
  blocksRef.current = blocks

  useEffect(() => {
    if (!lastReorg || lastReorg.seenAt === seen.current) return
    seen.current = lastReorg.seenAt
    if (reducedMotion) return
    const snapshot = [...blocksRef.current].reverse()
    const timers = TIMELINE.map(([phase, at]) =>
      setTimeout(() => setRewind({ reorg: lastReorg, phase, snapshot }), at),
    )
    timers.push(setTimeout(() => setRewind(undefined), DONE_AT))
    return () => {
      for (const timer of timers) clearTimeout(timer)
      setRewind(undefined)
    }
  }, [lastReorg, reducedMotion])

  // The render that brings the reorg already shows the rewind's first stage,
  // so the replacement never flashes onto the tape before the replay starts
  const arriving =
    !reducedMotion && lastReorg && lastReorg.seenAt !== seen.current
  if (arriving && rewind?.reorg !== lastReorg) {
    return {
      reorg: lastReorg,
      phase: 'rewind',
      snapshot: [...blocks].reverse(),
    }
  }
  return rewind
}

export interface LogLine {
  id: string
  timestamp: number
  kind: 'live' | 'reorg' | 'missed' | 'final' | 'epoch'
  text: string
}

const LOG_LENGTH = 40

/** A terminal's event log: only what a researcher would want to see scroll by, not every block */
export function useChainLog(head: EthereumHead): LogLine[] {
  const [lines, setLines] = useState<LogLine[]>([])
  const last = useRef<{
    slot?: number
    finalizedSlot?: number
    reorgAt?: number
  }>({})

  useEffect(() => {
    const block = head.head
    if (!block) return
    const previous = last.current
    const added: LogLine[] = []
    if (previous.slot === undefined) {
      added.push({
        id: `connected-${block.slot}`,
        timestamp: block.timestamp,
        kind: 'live',
        text: `following the head at slot ${block.slot.toLocaleString('en-US')}, epoch ${epochOf(block.slot).toLocaleString('en-US')}${head.finalizedSlot === undefined ? '' : `; finalized up to slot ${head.finalizedSlot.toLocaleString('en-US')}`}`,
      })
    }
    if (head.lastReorg && head.lastReorg.seenAt !== previous.reorgAt) {
      const r = head.lastReorg
      added.push({
        id: `reorg-${r.seenAt}`,
        timestamp: r.by.timestamp,
        kind: 'reorg',
        text: `slot ${r.slot.toLocaleString('en-US')} depth ${r.depth} · #${r.replaced.number?.toLocaleString('en-US') ?? '?'} ${r.replaced.hash?.slice(0, 10) ?? ''} replaced by ${r.by.hash?.slice(0, 10) ?? ''}`,
      })
    }
    if (previous.slot !== undefined && block.slot !== previous.slot) {
      if (block.status === 'missed') {
        added.push({
          id: `missed-${block.slot}`,
          timestamp: block.timestamp,
          kind: 'missed',
          text: `slot ${block.slot.toLocaleString('en-US')} · validator ${block.proposerIndex.toLocaleString('en-US')} proposed no block`,
        })
      }
      if (epochOf(block.slot) !== epochOf(previous.slot)) {
        added.push({
          id: `epoch-${block.slot}`,
          timestamp: block.timestamp,
          kind: 'epoch',
          text: `epoch ${epochOf(block.slot).toLocaleString('en-US')} began at slot ${block.slot.toLocaleString('en-US')}`,
        })
      }
    }
    if (
      head.finalizedSlot !== undefined &&
      previous.finalizedSlot !== undefined &&
      head.finalizedSlot !== previous.finalizedSlot
    ) {
      added.push({
        id: `final-${head.finalizedSlot}`,
        timestamp: block.timestamp,
        kind: 'final',
        text: `epoch ${epochOf(head.finalizedSlot).toLocaleString('en-US')} finalized · slot ${head.finalizedSlot.toLocaleString('en-US')} can no longer be reorged`,
      })
    }
    last.current = {
      slot: block.slot,
      finalizedSlot: head.finalizedSlot,
      reorgAt: head.lastReorg?.seenAt,
    }
    if (added.length > 0) {
      setLines((current) =>
        [...added.reverse(), ...current].slice(0, LOG_LENGTH),
      )
    }
  }, [head.head, head.finalizedSlot, head.lastReorg])

  return lines
}

/** Prices move by the minute, not by the block: hold each one for a minute so the cadence badge tells the truth */
export function usePerMinute(value: number | undefined) {
  const [held, setHeld] = useState(value)
  const at = useRef(0)
  useEffect(() => {
    if (value === undefined) return
    const now = Date.now()
    if (held === undefined || now - at.current >= 60_000) {
      at.current = now
      setHeld(value)
    }
  }, [value, held])
  return held
}

/** Lets a reader freeze the tape to read it; P toggles it from anywhere on the page */
export function usePauseKey(onToggle: () => void) {
  const callback = useRef(onToggle)
  callback.current = onToggle
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'p' && event.key !== 'P') return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]'))
        return
      callback.current()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
