import {
  BELT_SLOTS,
  PAST_PAGE_SLOTS,
} from '~/server/features/data-availability/live-blobs/liveBlobsSlots'

/** The day as the server knows it: back from `head`, `slots` long */
export interface KnownDay {
  head: number
  slots: number
}

/**
 * Slots the belt glides through at most on its way somewhere. From farther,
 * it starts this far off, so it passes only racks around where it lands,
 * rather than a day's worth of pages
 */
export const GLIDE_SLOTS = 32

/**
 * Where the belt may be taken back to, or undefined for live. From the head
 * on is live, as the live bay holds the head's block for most of its slot;
 * and it goes back no further than leaves the day's oldest block at its left
 * end, `before` racks left of the bay, so the belt never shows slots it
 * cannot fill
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

/** The furthest back the bay can go: the day's oldest block `before` racks left of it */
export function earliestView(day: KnownDay, before: number) {
  return day.head - day.slots + 1 + before
}

/**
 * The pages of the past the belt needs while looking back at `view`: its
 * racks with those it glides through to get there, from either side, and the
 * run-up to live it glides through on its way back. Only behind where the
 * live answers reach, as the page has those
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

/**
 * Whether `slot` is behind what the live answers carry. Only those slots are
 * filled from the past: where the live answers reach, theirs is the newer word
 */
export function isBehindLive(slot: number, head: number) {
  return slot <= head - BELT_SLOTS
}
