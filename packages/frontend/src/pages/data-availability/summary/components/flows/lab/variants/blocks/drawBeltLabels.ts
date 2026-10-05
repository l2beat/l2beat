import { mixColors } from '../../color'
import { SLOT_SECONDS } from '../../model'
import { tileBounds } from './beltLayout'
import type { BeltPalette } from './beltPalette'
import {
  type BeltPosition,
  bayLight,
  presenceAtEnds,
  rackLeft,
} from './beltPosition'
import type { BeltFrame, BeltScene, Playback } from './beltScene'
import { nextBatchOf, readBatchKey, slotNumberOf } from './dayBlocks'
import { formatBlocksAway, formatSlot } from './format'
import { easeOutCubic, labelPresence, smoothstep } from './motion'

const FONT = 'Roboto, Arial, sans-serif'
const ROLL_TIME = 0.26
/** Labels fade out over the end of their block's slot, from this far into it */
const LABELS_LEAVE = 0.84
/** A batch coming later than this in its slot would only flash its label */
const LAST_LABEL_PHASE = 0.6

/**
 * Blob counts under the blocks, and every fifth block's slot number. Each
 * fades whole near the belt's ends, by its outer edge: a number with its
 * last digits faded out would read as a different number.
 */
export function drawBlockNumbers(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  belt: BeltPosition,
  frame: BeltFrame,
) {
  const { layout, palette, blocks } = scene
  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.font = `500 ${layout.compact ? 10 : 11}px ${FONT}`

  for (let block = belt.first; block <= belt.last; block++) {
    const middle = rackLeft(belt, layout, block) + layout.rackWidth / 2
    if (block <= belt.current) {
      const count = frame.landed[block - belt.first] ?? 0
      const light = bayLight(belt, block)
      ctx.globalAlpha = presenceAtEnds(layout, middle, middle)
      ctx.fillStyle =
        light > 0
          ? mixColors(palette.textSecondary, palette.text, light)
          : count === 0
            ? palette.textFaint
            : palette.textSecondary
      ctx.fillText(String(count), middle, layout.countY)
    }
    const slotNumber = slotNumberOf(blocks, block)
    if (slotNumber % 5 === 0) {
      const text = formatSlot(slotNumber)
      const half = ctx.measureText(text).width / 2
      ctx.globalAlpha = presenceAtEnds(layout, middle - half, middle + half)
      ctx.fillStyle = palette.textFaint
      ctx.fillText(text, middle, layout.slotNumberY)
    }
  }
  ctx.restore()
}

/**
 * "+5 Base Chain" where a batch is about to land in the bay, as its tiles
 * start to drop, rising as it fades. A label rides with its block and is gone
 * before the block leaves the bay: left behind, it would seem to name what
 * the next block got, and riding on it would cover the next rack. A batch
 * coming too late in its slot to be read goes unnamed. A newer label at the
 * same height takes over from an older one.
 */
export function drawArrivalLabels(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  playback: Playback,
  belt: BeltPosition,
  now: number,
) {
  const { layout, batches, blocks, posters, highlighted } = scene
  const placed: { y: number; alpha: number }[] = []
  // newest first, so the older ones know what to step aside for
  const arrivals = [...playback.arrivals].reverse()
  for (const [key, arrivedAt] of arrivals) {
    const { block, batchIndex } = readBatchKey(blocks, key)
    const batch = batches[batchIndex]
    const poster = batch && posters[batch.posterIndex]
    if (!batch || !poster) continue
    if (highlighted !== undefined && highlighted !== batch.posterIndex) continue
    if (block !== belt.current) continue

    const below = blocks.blobsBelow[batchIndex] ?? 0
    const lowest = tileBounds(layout, below, 0, 1)
    const highest = tileBounds(layout, below + batch.blobs - 1, 0, 1)
    const sinceArrival = now - arrivedAt
    // a phase lasts a second, so this is where in its slot the batch came
    if (belt.phase - sinceArrival > LAST_LABEL_PHASE) continue
    const { alpha, rise } = labelPresence(sinceArrival)
    if (alpha <= 0) continue

    const y = (highest.top + lowest.bottom) / 2 - rise
    const leaving = smoothstep((belt.phase - LABELS_LEAVE) / (1 - LABELS_LEAVE))
    let shown = alpha * (1 - leaving)
    for (const newer of placed) {
      if (Math.abs(newer.y - y) < 15) shown *= 1 - newer.alpha
    }
    placed.push({ y, alpha })
    if (shown > 0.02) {
      const x = rackLeft(belt, layout, block) + layout.rackWidth + 6
      drawArrivalLabel(ctx, scene, batch.blobs, poster.name, x, y, shown)
    }
  }
}

function drawArrivalLabel(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  blobs: number,
  name: string,
  x: number,
  y: number,
  alpha: number,
) {
  const { layout, palette } = scene
  const amount = `+${blobs}`
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'

  const size = layout.compact ? 11 : 12
  ctx.font = `700 ${size}px ${FONT}`
  const amountWidth = ctx.measureText(amount).width
  fillTextOnSurface(ctx, palette, amount, x, y, palette.text)

  ctx.font = `500 ${size}px ${FONT}`
  const nameX = x + amountWidth + 4
  const shortName = fitText(ctx, name, layout.width - nameX - 2)
  fillTextOnSurface(ctx, palette, shortName, nameX, y, palette.textSecondary)
  ctx.restore()
}

/** "Building slot 15,354,012" above the bay; changed digits roll up like an odometer */
export function drawBayCaption(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  playback: Playback,
  belt: BeltPosition,
  now: number,
) {
  const { layout, palette, blocks } = scene
  const word = 'Building slot '
  const number = formatSlot(slotNumberOf(blocks, belt.current))
  const previous = formatSlot(slotNumberOf(blocks, belt.current - 1))
  const wordFont = `500 12px ${FONT}`
  const numberFont = `600 12px ${FONT}`

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.font = wordFont
  const wordWidth = ctx.measureText(word).width
  ctx.font = numberFont
  const numberWidth = ctx.measureText(number).width
  const x = Math.round(layout.bayX - (wordWidth + numberWidth) / 2)
  const y = layout.bayCaptionY

  ctx.font = wordFont
  ctx.fillStyle = palette.textSecondary
  ctx.fillText(word, x, y)

  ctx.font = numberFont
  ctx.fillStyle = palette.text
  const roll = easeOutCubic(
    Math.min(1, (now - playback.bayChangedAt) / ROLL_TIME),
  )
  if (roll >= 1 || number.length !== previous.length) {
    ctx.fillText(number, x + wordWidth, y)
    return
  }
  let kept = 0
  while (kept < number.length && number[kept] === previous[kept]) kept++
  const keptText = number.slice(0, kept)
  const changedX = x + wordWidth + ctx.measureText(keptText).width
  ctx.fillText(keptText, x + wordWidth, y)

  ctx.save()
  ctx.beginPath()
  ctx.rect(changedX - 1, y - 13, numberWidth, 17)
  ctx.clip()
  const lift = 13 * roll
  ctx.globalAlpha = 1 - roll
  ctx.fillText(previous.slice(kept), changedX, y - lift)
  ctx.globalAlpha = roll
  ctx.fillText(number.slice(kept), changedX, y + 13 - lift)
  ctx.restore()
}

/** "Max 21" atop the fee band, "Target 14" on its line, and what the band means */
export function drawLimitLabels(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
) {
  const { layout, palette } = scene
  const right = layout.width - 2
  drawRuleLabel(ctx, scene, 'Max', scene.maxBlobs, right, layout.maxY + 13)
  drawRuleLabel(
    ctx,
    scene,
    'Target',
    scene.targetBlobs,
    right,
    layout.targetY - 5,
  )

  // what the hatching between them means
  ctx.save()
  ctx.font = `500 11px ${FONT}`
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  const middle = (layout.maxY + layout.targetY) / 2
  fillTextOnSurface(
    ctx,
    palette,
    'Blob fee rises',
    right,
    middle,
    palette.textFaint,
  )
  ctx.restore()
}

function drawRuleLabel(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  word: string,
  value: number,
  right: number,
  y: number,
) {
  const { palette } = scene
  const valueText = String(value)
  ctx.save()
  ctx.textAlign = 'right'
  ctx.textBaseline = 'alphabetic'

  ctx.font = `700 11px ${FONT}`
  const valueWidth = ctx.measureText(valueText).width
  fillTextOnSurface(ctx, palette, valueText, right, y, palette.text)

  ctx.font = `500 11px ${FONT}`
  const wordRight = right - valueWidth - 3
  fillTextOnSurface(ctx, palette, word, wordRight, y, palette.textSecondary)
  ctx.restore()
}

/**
 * A highlighted poster that posts rarely can be missing from the belt for
 * hours, which would look like nothing was highlighted. This says how far off
 * its next batch is, counted in blocks, the belt's own unit.
 */
export function drawNextBatchNote(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  playback: Playback,
  belt: BeltPosition,
  frame: BeltFrame,
) {
  const { highlighted, posters, blocks, layout, palette } = scene
  if (highlighted === undefined || frame.highlightedInView > 0) return
  const poster = posters[highlighted]
  const next = nextBatchOf(blocks, highlighted, playback.time)
  if (!poster || next === undefined) return
  const blocksAway = Math.floor(next / SLOT_SECONDS) - belt.current

  const x = layout.fadeLeft
  const y = (layout.maxY + layout.targetY) / 2
  const room = layout.bayX - layout.blockPitch - x
  ctx.save()
  ctx.font = `500 ${layout.compact ? 11 : 12}px ${FONT}`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  const due =
    blocksAway < 1 ? 'due in this block' : `in ${formatBlocksAway(blocksAway)}`
  // short of room the name goes, never the count: a cut number misleads
  const named = `Next ${poster.name} batch ${due}`
  const text =
    ctx.measureText(named).width <= room ? named : `Next batch ${due}`
  fillTextOnSurface(ctx, palette, text, x, y, palette.textSecondary)
  ctx.restore()
}

/** Text with a rim of the card's color, so it reads over racks and hatching */
function fillTextOnSurface(
  ctx: CanvasRenderingContext2D,
  palette: BeltPalette,
  text: string,
  x: number,
  y: number,
  color: string,
) {
  ctx.lineJoin = 'round'
  ctx.lineWidth = 3
  ctx.strokeStyle = palette.surface
  ctx.strokeText(text, x, y)
  ctx.fillStyle = color
  ctx.fillText(text, x, y)
}

/** `text`, cut short with an ellipsis where it would run past `room` */
function fitText(ctx: CanvasRenderingContext2D, text: string, room: number) {
  if (ctx.measureText(text).width <= room) return text
  let end = text.length
  while (end > 1 && ctx.measureText(`${text.slice(0, end)}…`).width > room) {
    end--
  }
  return `${text.slice(0, end).trimEnd()}…`
}
