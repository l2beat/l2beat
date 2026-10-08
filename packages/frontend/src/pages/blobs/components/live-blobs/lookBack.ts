import {
  PAST_PAGE_SLOTS,
  RECENT_SLOTS,
} from '~/server/features/data-availability/live-blobs/slots'

/** The hour as the server knows it: back from `head`, `slots` long */
export interface KnownHour {
  head: number
  slots: number
}

/**
 * Where the belt may be taken back to, or undefined for live. Past the head
 * is live, as the live bay holds the slot after it; and it goes back no
 * further than leaves the hour's oldest block at its left end, `before` racks
 * left of the bay, so the belt never shows slots it cannot fill
 */
export function clampView(
  slot: number | undefined,
  hour: KnownHour | undefined,
  before: number,
): number | undefined {
  if (slot === undefined || hour === undefined || slot > hour.head) {
    return undefined
  }
  const earliest = hour.head - hour.slots + 1 + before
  if (earliest > hour.head) return undefined
  return Math.max(Math.round(slot), earliest)
}

/**
 * The pages of the past to fetch from `from` on: up to where the live answers
 * reach, as the page has those, and the belt passes all the rest on its way
 * back to live
 */
export function pastPagesFor(from: number, head: number) {
  const last = head - RECENT_SLOTS
  if (from > last) return []
  const first = Math.floor(from / PAST_PAGE_SLOTS)
  const count = Math.floor(last / PAST_PAGE_SLOTS) - first + 1
  return Array.from({ length: count }, (_, i) => first + i)
}

/**
 * Whether `slot` is behind what the live answers carry. Only those slots are
 * filled from the past: where the live answers reach, theirs is the newer word
 */
export function isBehindLive(slot: number, head: number) {
  return slot <= head - RECENT_SLOTS
}
