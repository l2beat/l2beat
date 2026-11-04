import {
  BELT_SLOTS,
  PAST_PAGE_SLOTS,
} from '~/server/features/data-availability/live-blobs/liveBlobsSlots'

export interface KnownDay {
  head: number
  slots: number
}

/** A longer jump starts this far off, so it loads only pages around where it lands */
export const GLIDE_SLOTS = 32

/**
 * Undefined for live: from the head on is live, as the live bay holds the
 * head's block for most of its slot. Stops at `earliestView`, so the belt never
 * shows slots it cannot fill
 */
export function clampView(
  slot: number | undefined,
  day: KnownDay | undefined,
  before: number,
): number | undefined {
  if (slot === undefined || day === undefined || slot >= day.head) {
    return undefined
  }
  const earliest = earliestView(day, before)
  if (earliest >= day.head) return undefined
  return Math.max(Math.round(slot), earliest)
}

/** Leaves the day's oldest block at the belt's left end */
export function earliestView(day: KnownDay, before: number) {
  return day.head - day.slots + 1 + before
}

/**
 * The racks around `view` with the glide to them from either side, and the
 * glide back to live. Only behind what the live answers carry
 */
export function pastPagesFor(
  view: number,
  head: number,
  { before, after }: { before: number; after: number },
) {
  const last = head - BELT_SLOTS
  const ranges: [number, number][] = [
    // one rack more on the left, which slides in as the belt moves on
    [view - GLIDE_SLOTS - before - 1, view + GLIDE_SLOTS + after],
    [head - GLIDE_SLOTS - before - 1, last],
  ]
  const pages = new Set<number>()
  for (const [from, to] of ranges) {
    const lastPage = Math.floor(Math.min(to, last) / PAST_PAGE_SLOTS)
    for (let p = Math.floor(from / PAST_PAGE_SLOTS); p <= lastPage; p++) {
      pages.add(p)
    }
  }
  return [...pages].sort((a, b) => a - b)
}

/** Only these are filled from the past: where the live answers reach, theirs is newer */
export function isBehindLive(slot: number, head: number) {
  return slot <= head - BELT_SLOTS
}
