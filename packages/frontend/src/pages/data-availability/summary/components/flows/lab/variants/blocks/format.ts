import { pluralize } from '@l2beat/shared-pure'

// formatInteger shortens to "15.35 M"; a slot number is read whole
const WHOLE = new Intl.NumberFormat('en-US')

/** 15,354,012 */
export function formatSlot(slot: number): string {
  return WHOLE.format(slot)
}

/** One decimal below 10, as 3.8 blobs per block; whole above */
export function formatAverage(value: number): string {
  return value >= 10 ? String(Math.round(value)) : value.toFixed(1)
}

export function formatBlobCount(blobs: number): string {
  return `${blobs} ${pluralize(blobs, 'blob')}`
}

/** 1,105 blocks */
export function formatBlocksAway(blocks: number): string {
  return `${WHOLE.format(blocks)} ${pluralize(blocks, 'block')}`
}
