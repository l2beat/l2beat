/**
 * Where everything on the belt goes, in CSS pixels. Tiles are sized from the
 * height there is: a rack has to hold a full block, 21 blobs, and still leave
 * room for the caption above it and the numbers under it.
 */
export interface BeltLayout {
  width: number
  height: number
  /** A phone: smaller tiles, no icons on them */
  compact: boolean

  /** Height of a row in a rack, one blob's place */
  rowHeight: number
  /** A lone blob's tile is a square this wide */
  tileSize: number
  tileRadius: number
  /** Where blobs of one batch meet, their corners are tighter */
  seamRadius: number
  /** Batches sit this far apart in a rack, the blobs of one batch closer */
  batchGap: number
  blobGap: number

  rackWidth: number
  rackHeight: number
  rackPadding: number
  rackRadius: number
  rackTop: number
  /** Bottom edge of the lowest tile in a rack */
  floorY: number
  /** From one block to the next, along the belt */
  blockPitch: number

  /** The middle of the loading bay, where the block being built passes */
  bayX: number
  bayCaptionY: number
  /** Tiles appear here and fall into the rack */
  dropFromY: number
  /**
   * The waiting lane: a row of tiles above the racks right of the bay, where
   * batches wait in the mempool for a block. Its tiles fall from `laneTop`
   */
  laneTop: number
  laneLeft: number
  laneRight: number

  targetY: number
  maxY: number
  countY: number
  slotNumberY: number
  /** How far in from each end blocks fade out: into the past, out of the future */
  fadeLeft: number
  fadeRight: number
  /** 0 when tiles are too small to carry an icon */
  iconSize: number
}

const COMPACT_BELOW = 560
/** The lane clears the racks under it by this much */
const LANE_LIFT = 3
/** And the bay's chute, so it reads as feeding it rather than being it */
const LANE_GAP = 10
const ICONS_FROM_TILE = 14
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
    laneTop: rackTop - LANE_LIFT - tileSize,
    laneLeft: bayX + rackWidth / 2 + LANE_GAP,
    laneRight: width - 2,
    targetY: fillLine(targetBlobs),
    maxY: fillLine(maxBlobs),
    countY: rackTop + rackHeight + (compact ? 14 : 16),
    slotNumberY: rackTop + rackHeight + (compact ? 29 : 33),
    fadeLeft: Math.round(width * (compact ? 0.2 : 0.17)),
    fadeRight: Math.round(Math.min(56, width * 0.07)),
    iconSize: tileSize >= ICONS_FROM_TILE ? tileSize - 4 : 0,
  }
}

/** Top and bottom of the tile in `row` (0 at the bottom), by where it sits in its batch */
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
