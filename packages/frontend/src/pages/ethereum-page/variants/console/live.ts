import { useEffect, useRef, useState } from 'react'
import type { EthereumHead, HeadBlock, Reorg } from '../../live/types'
import { epochOf } from './derive'
import { fmtNumber } from './format'

/**
 * The stages of a replayed reorg, in order. The tape scrolls back to the fork
 * point, the orphaned rows roll back into view and are struck out, they are
 * ejected, the winning rows drop in one by one, oldest first, and the tape
 * runs forward to the head again
 */
export type RewindPhase = 'rewind' | 'strike' | 'eject' | 'drop' | 'forward'

export interface Rewind {
  reorg: Reorg
  phase: RewindPhase
  /** Winning rows already dropped in, during `drop` */
  dropped: number
  /** The tape as it was when the reorg arrived, newest first */
  snapshot: HeadBlock[]
}

/** Each orphan is struck and ejected a beat after the one above it, so a deep reorg reads row by row */
export const REWIND_STAGGER_MS = 70
const SCROLL_MS = 700
const STRIKE_MS = 650
const EJECT_MS = 420
const DROP_EACH_MS = 280
const FORWARD_MS = 650

/** Every step of the replay with its start time; the stages stretch with depth so six rows stay readable */
function timeline(depth: number) {
  const stagger = (depth - 1) * REWIND_STAGGER_MS
  const strike = SCROLL_MS
  const eject = strike + STRIKE_MS + stagger
  const drop = eject + EJECT_MS + stagger
  const steps: { phase: RewindPhase; dropped: number; at: number }[] = [
    { phase: 'rewind', dropped: 0, at: 0 },
    { phase: 'strike', dropped: 0, at: strike },
    { phase: 'eject', dropped: 0, at: eject },
  ]
  for (let i = 1; i <= depth; i++) {
    steps.push({ phase: 'drop', dropped: i, at: drop + (i - 1) * DROP_EACH_MS })
  }
  const forward = drop + depth * DROP_EACH_MS + 250
  steps.push({ phase: 'forward', dropped: depth, at: forward })
  return { steps, doneAt: forward + FORWARD_MS }
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
    const { steps, doneAt } = timeline(lastReorg.by.length)
    const timers = steps.map(({ phase, dropped, at }) =>
      setTimeout(
        () => setRewind({ reorg: lastReorg, phase, dropped, snapshot }),
        at,
      ),
    )
    timers.push(setTimeout(() => setRewind(undefined), doneAt))
    return () => {
      for (const timer of timers) clearTimeout(timer)
      setRewind(undefined)
    }
  }, [lastReorg, reducedMotion])

  // The render that brings the reorg already shows the rewind's first stage,
  // so the winning rows never flash onto the tape before the replay starts
  const arriving =
    !reducedMotion && lastReorg && lastReorg.seenAt !== seen.current
  if (arriving && rewind?.reorg !== lastReorg) {
    return {
      reorg: lastReorg,
      phase: 'rewind',
      dropped: 0,
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
        timestamp: r.by.at(-1)?.timestamp ?? block.timestamp,
        kind: 'reorg',
        text: describeReorg(r),
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

/** "depth 3 · slots 101–103 · fork at 100 · 3 blocks orphaned, 2 won" */
export function describeReorg(r: Reorg) {
  const first = r.by[0]?.slot ?? r.forkSlot + 1
  const last = r.by.at(-1)?.slot ?? first
  const range =
    first === last
      ? `slot ${fmtNumber(first)}`
      : `slots ${fmtNumber(first)}–${fmtNumber(last)}`
  const orphaned = r.replaced.filter((b) => b.status === 'proposed').length
  const won = r.by.filter((b) => b.status === 'proposed').length
  return `depth ${r.depth} · ${range} · fork at ${fmtNumber(r.forkSlot)} · ${orphaned} ${orphaned === 1 ? 'block' : 'blocks'} orphaned, ${won} won`
}
