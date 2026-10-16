import { clamp } from '@l2beat/shared-pure'
/**
 * CSS pixels. Tiles are sized from the height: a rack must hold a full block
 * and leave room for the caption above and the numbers under it.
 */
export interface BeltLayout {
  width: number
  height: number
  /** A phone: smaller tiles, icons closer to their edges */
  compact: boolean

  /** One blob's place */
  rowHeight: number
  tileSize: number
  tileRadius: number
  /** Tighter corners where blobs of one batch meet */
  seamRadius: number
  batchGap: number
  blobGap: number

  rackWidth: number
  rackHeight: number
  rackPadding: number
  rackRadius: number
  rackTop: number
  floorY: number
  blockPitch: number

  bayX: number
  bayCaptionY: number
  dropFromY: number

  targetY: number
  maxY: number
  countY: number
  slotNumberY: number
  fadeLeft: number
  fadeRight: number
  /** 0 when tiles are too small to carry an icon */
  iconSize: number
}

const COMPACT_BELOW = 560
/** Below this an icon is a smudge, not a logo */
const MIN_ICON = 8
/**
 * The belt moves a block a second, so this is also its speed: 30 px/s is one
 * device pixel per frame on a 60 Hz 2× screen, with no uneven steps
 */
const BLOCK_PITCH = 30

const ROOMY = {
  captionRoom: 38,
  captionGap: 12,
  labelsRoom: 40,
  minPitch: 12,
  maxPitch: 21,
  batchGap: 3,
  blobGap: 1,
  padding: 3,
  tileRadius: 3,
  iconInset: 2,
  bayAt: 0.7,
}

const COMPACT = {
  captionRoom: 32,
  captionGap: 10,
  labelsRoom: 36,
  minPitch: 8,
  maxPitch: 14,
  batchGap: 2,
  blobGap: 1,
  padding: 2,
  tileRadius: 2,
  iconInset: 1,
  bayAt: 0.64,
}

export function layoutBelt(
  width: number,
  height: number,
  maxBlobs: number,
  targetBlobs: number,
): BeltLayout {
  const compact = width < COMPACT_BELOW
  const fit = compact ? COMPACT : ROOMY

  const roomForRack =
    height - fit.captionRoom - fit.labelsRoom - 2 * fit.padding + fit.batchGap
  const rowHeight = clamp(
    Math.floor(roomForRack / maxBlobs),
    fit.minPitch,
    fit.maxPitch,
  )
  const tileSize = rowHeight - fit.batchGap
  const rackWidth = tileSize + 2 * fit.padding
  const rackHeight = maxBlobs * rowHeight - fit.batchGap + 2 * fit.padding
  const blockPitch = BLOCK_PITCH

  // Racks sit on their numbers, close to what is under them. The chute tiles
  // fall down from the caption is a row long at most, so the caption stays
  // with its rack; the belt is sized to leave little over
  const rackTop = Math.max(
    fit.captionRoom,
    height - fit.labelsRoom - rackHeight,
  )
  const chute = Math.min(rackTop - fit.captionRoom, rowHeight)
  const bayCaptionY = rackTop - fit.captionGap - chute
  const floorY = rackTop + rackHeight - fit.padding
  const fillLine = (blobs: number) =>
    floorY + fit.batchGap / 2 - blobs * rowHeight

  const bayX = Math.round(width * fit.bayAt)
  return {
    width,
    height,
    compact,
    rowHeight,
    tileSize,
    tileRadius: fit.tileRadius,
    seamRadius: 1,
    batchGap: fit.batchGap,
    blobGap: fit.blobGap,
    rackWidth,
    rackHeight,
    rackPadding: fit.padding,
    rackRadius: 4,
    rackTop,
    floorY,
    blockPitch,
    bayX,
    bayCaptionY,
    dropFromY: bayCaptionY + 8,
    targetY: fillLine(targetBlobs),
    maxY: fillLine(maxBlobs),
    countY: rackTop + rackHeight + (compact ? 14 : 16),
    slotNumberY: rackTop + rackHeight + (compact ? 29 : 33),
    fadeLeft: Math.round(width * (compact ? 0.2 : 0.17)),
    fadeRight: Math.round(Math.min(56, width * 0.07)),
    iconSize: fitIcon(tileSize, fit.iconInset),
  }
}

/** Racks shown whole or for the most part, each side of the bay */
export function racksAroundBay(layout: BeltLayout) {
  return {
    before: Math.floor(layout.bayX / layout.blockPitch),
    after: Math.floor((layout.width - layout.bayX) / layout.blockPitch),
  }
}

/** `row` 0 is at the bottom */
export function tileBounds(
  layout: BeltLayout,
  row: number,
  indexInBatch: number,
  batchBlobs: number,
): { top: number; bottom: number } {
  const rowBottom = layout.floorY + layout.batchGap / 2 - row * layout.rowHeight
  const below = indexInBatch === 0 ? layout.batchGap : layout.blobGap
  const above =
    indexInBatch === batchBlobs - 1 ? layout.batchGap : layout.blobGap
  return {
    top: rowBottom - layout.rowHeight + above / 2,
    bottom: rowBottom - below / 2,
  }
}

function fitIcon(tileSize: number, inset: number) {
  const size = tileSize - 2 * inset
  return size >= MIN_ICON ? size : 0
}
