import { SLOT_SECONDS } from '@l2beat/shared-pure'
import { mixColors } from '../color'
import { tileBounds } from './beltLayout'
import type { BeltPalette } from './beltPalette'
import {
  type BeltPosition,
  bayLight,
  presenceAtEnds,
  rackLeft,
} from './beltPosition'
import {
  type BeltFrame,
  type BeltScene,
  findBatch,
  type Playback,
} from './beltScene'
import { formatWhole } from './format'
import { labelPresence, smoothstep } from './motion'

const FONT = 'Roboto, Arial, sans-serif'
/** Labels fade out over the end of their block's slot, from this far into it */
const LABELS_LEAVE = 0.9

/**
 * Blob counts under the blocks, a dash under missed slots, and every fifth
 * slot's number. Each fades whole near the belt's ends, by its outer edge: a
 * number with its last digits faded out would read as a different number.
 * Counts fade in with the first blocks, by `reveal`.
 */
export function drawBlockNumbers(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  belt: BeltPosition,
  frame: BeltFrame,
  reveal: number,
) {
  const { layout, palette, blocks } = scene
  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.font = `500 ${layout.compact ? 10 : 11}px ${FONT}`

  for (let slot = belt.first; slot <= belt.last; slot++) {
    const middle = rackLeft(belt, layout, slot) + layout.rackWidth / 2
    // a block not yet in has no count, rather than a count of 0
    const status = blocks.get(slot)?.status
    if (status !== undefined) {
      const count = frame.landed[slot - belt.first] ?? 0
      const light = bayLight(belt, slot)
      ctx.globalAlpha = presenceAtEnds(layout, middle, middle) * reveal
      ctx.fillStyle =
        light > 0
          ? mixColors(palette.textSecondary, palette.text, light)
          : count === 0
            ? palette.textFaint
            : palette.textSecondary
      ctx.fillText(
        status === 'missed' ? '–' : String(count),
        middle,
        layout.countY,
      )
    }
    if (slot % 5 === 0) {
      const text = formatWhole(slot)
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
  const { layout, blocks, posters } = scene
  const placed: { y: number; alpha: number }[] = []
  // newest first, so the older ones know what to step aside for
  const arrivals = [...playback.arrivals].reverse()
  for (const [key, arrivedAt] of arrivals) {
    const found = findBatch(blocks, key)
    if (!found || found.slot !== belt.current) continue
    const { slot, batch } = found
    const poster = posters[batch.posterIndex]
    if (!poster) continue

    const below = batch.blobsBelow
    const lowest = tileBounds(layout, below, 0, 1)
    const highest = tileBounds(layout, below + batch.blobs - 1, 0, 1)
    const { alpha, rise } = labelPresence(now - arrivedAt)
    if (alpha <= 0) continue

    const y = (highest.top + lowest.bottom) / 2 - rise
    const phase = belt.intoSlot / SLOT_SECONDS
    const leaving = smoothstep((phase - LABELS_LEAVE) / (1 - LABELS_LEAVE))
    let shown = alpha * (1 - leaving)
    for (const newer of placed) {
      if (Math.abs(newer.y - y) < 15) shown *= 1 - newer.alpha
    }
    placed.push({ y, alpha })
    if (shown > 0.02) {
      const x = rackLeft(belt, layout, slot) + layout.rackWidth + 6
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

/**
 * "Building slot 15,354,012" above the bay, or "Slot 15,354,012" for a block
 * looked back at. Changed digits roll up like an odometer, in step with the
 * belt bringing that slot's rack in
 */
export function drawBayCaption(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  belt: BeltPosition,
) {
  const { layout, palette } = scene
  const word = belt.lookingBack ? 'Slot ' : 'Building slot '
  const number = formatWhole(belt.current)
  const previous = formatWhole(belt.current - 1)
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
  const roll = belt.handover
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
