import { HEAD_WINDOW } from '../live/simulatedHead'

/** The window's blocks plus one column for the slot being built */
export const COLUMNS = HEAD_WINDOW + 1

/**
 * Sizes of the track's rows, set as CSS variables on it so overlays, tiles
 * and the JS that measures them agree. Phones get a shorter, scrolling strip.
 */
export const TRACK_VARS =
  '[--gap:2px] [--lane-h:24px] [--tile-h:44px] [--rail-h:22px] md:[--gap:3px] md:[--lane-h:28px] md:[--tile-h:64px] md:[--rail-h:24px]'

/** On phones each column is fixed and the strip scrolls; wider, they share the width */
export const TRACK_WIDTH = 'w-[calc(65*11px+64*2px)] md:w-full'

const COLUMN = `((100% - ${COLUMNS - 1} * var(--gap)) / ${COLUMNS})`

/** Left edge of column `i`, inside the track */
export function columnLeft(i: number) {
  return `calc(${i} * (${COLUMN} + var(--gap)))`
}

/** Centre of column `i` */
export function columnCenter(i: number) {
  return `calc(${i} * (${COLUMN} + var(--gap)) + ${COLUMN} / 2)`
}

/** The middle of the gap after column `i`: where a boundary between slots is drawn */
export function boundaryAfter(i: number) {
  return `calc(${i + 1} * (${COLUMN} + var(--gap)) - var(--gap) / 2)`
}

export function columnsWidth(n: number) {
  return `calc(${n} * ${COLUMN} + ${n - 1} * var(--gap))`
}

/** Pixel distance between neighbouring columns, for animations that need numbers */
export function columnStep(track: HTMLElement) {
  const gap =
    Number.parseFloat(getComputedStyle(track).getPropertyValue('--gap')) || 0
  return (track.getBoundingClientRect().width + gap) / COLUMNS
}

export function columnAt(track: HTMLElement, clientX: number) {
  const rect = track.getBoundingClientRect()
  const i = Math.floor(((clientX - rect.left) / rect.width) * COLUMNS)
  return Math.min(COLUMNS - 1, Math.max(0, i))
}
