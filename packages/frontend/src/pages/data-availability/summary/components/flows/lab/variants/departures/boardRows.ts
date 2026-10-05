import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { Departure } from './timetable'

/** A departure where the board puts it */
export interface BoardRow {
  departure: Departure
  /** Row of the board it sits in. Off the board while it leaves */
  slot: number
  leaving: boolean
  /** How long its tiles wait before turning in, so a board fills row by row */
  enterDelay: number
}

/** A row that went off the board, kept a moment so it can be seen leaving */
interface LeavingRow {
  departure: Departure
  slot: number
  since: number
}

const LEAVE_MS = 900
// rows there at the start fill in one after another, top to bottom
const FILL_STAGGER_MS = 90
const FILL_MS = 1500
const ENTER_DELAY_MS = 260

/**
 * The board's rows: the ones shown, each in its slot, and the ones that just
 * went off, on their way out over the edge they are nearest to.
 */
export function useBoardRows(shown: Departure[], rowCount: number): BoardRow[] {
  const [mountedAt] = useState(() => performance.now())
  const [leaving, setLeaving] = useState<LeavingRow[]>([])
  const previous = useRef<Departure[]>([])

  useLayoutEffect(() => {
    const ids = new Set(shown.map((d) => d.poster.id))
    const before = previous.current
    previous.current = shown
    const now = performance.now()
    setLeaving((current) => {
      const kept = current.filter(
        (row) =>
          !ids.has(row.departure.poster.id) && now - row.since < LEAVE_MS,
      )
      const keptIds = new Set(kept.map((row) => row.departure.poster.id))
      const gone = before.flatMap((departure, slot) =>
        ids.has(departure.poster.id) || keptIds.has(departure.poster.id)
          ? []
          : [
              {
                departure,
                slot: slot < rowCount / 2 ? -1 : rowCount,
                since: now,
              },
            ],
      )
      if (gone.length === 0 && kept.length === current.length) return current
      return [...kept, ...gone]
    })
  }, [shown, rowCount])

  return useMemo(() => {
    const isFilling = performance.now() - mountedAt < FILL_MS
    const shownIds = new Set(shown.map((d) => d.poster.id))
    return [
      ...shown.map((departure, slot) => ({
        departure,
        slot,
        leaving: false,
        enterDelay: isFilling ? slot * FILL_STAGGER_MS : ENTER_DELAY_MS,
      })),
      ...leaving
        .filter((row) => !shownIds.has(row.departure.poster.id))
        .map((row) => ({
          departure: row.departure,
          slot: row.slot,
          leaving: true,
          enterDelay: 0,
        })),
    ]
  }, [shown, leaving, mountedAt])
}
