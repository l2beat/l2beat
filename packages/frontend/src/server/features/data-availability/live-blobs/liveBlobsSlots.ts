import { assert } from '@l2beat/shared-pure'

/**
 * How far back each part of the live view reaches, in slots. Free of server
 * imports, so the page can word its copy from the same numbers.
 */

/** Enough to fill the belt left of the bay */
export const BELT_SLOTS = 32
/** Slots in one page of the day, served to a page looking back through it */
export const PAST_PAGE_SLOTS = 32
/** Who posted: 24 hours */
export const WINDOW_SLOTS = 7200
/** Each bar of a poster's activity: 30 minutes */
export const BUCKET_SLOTS = 150
export const BUCKETS = WINDOW_SLOTS / BUCKET_SLOTS
// bars that do not tile the day would leave a fraction of one at its edge
assert(Number.isInteger(BUCKETS), 'BUCKET_SLOTS must divide WINDOW_SLOTS')
/** Each bar of the day under the belt: 5 minutes */
export const PULSE_BUCKET_SLOTS = 25
export const PULSE_BUCKETS = WINDOW_SLOTS / PULSE_BUCKET_SLOTS
assert(
  Number.isInteger(PULSE_BUCKETS),
  'PULSE_BUCKET_SLOTS must divide WINDOW_SLOTS',
)
