import { type BeltLayout, tileBounds } from './beltLayout'
import type { BeltPalette } from './beltPalette'

/**
 * What the belt draws the same on every frame, painted once per size and
 * theme and then only copied: stroking the fee band's hatching and blurring
 * the bay's glow anew each frame cost more than the rest of the belt.
 */
export interface BeltLayers {
  /** A sealed rack: faint body, the room it had up to the target, outline */
  sealedRack: HTMLCanvasElement
  /** A rack still to come: only a dashed outline */
  futureRack: HTMLCanvasElement
  /** The fee band's hatching and the dashed target line, at screen density */
  rules: HTMLCanvasElement
  /** The bay's outline with its glow, reaching `GLOW_REACH` past the rack */
  litRack: HTMLCanvasElement
}

const HATCH_SPACING = 6
const TARGET_DASH = [4, 3]
const FUTURE_DASH = [3, 3]
const GLOW_BLUR = 14
/** How far the bay's glow reaches past its rack on every side */
export const GLOW_REACH = 24

export function paintLayers(
  layout: BeltLayout,
  palette: BeltPalette,
  targetBlobs: number,
): BeltLayers | undefined {
  // as prepareCanvas: past 2 the eye cannot tell
  const density = Math.min(window.devicePixelRatio || 1, 2)
  const sealedRack = paintRack(layout, density, 0, (ctx) => {
    ctx.beginPath()
    traceRackBody(ctx, layout, 0)
    ctx.fillStyle = palette.rackFill
    ctx.fill()
    ctx.beginPath()
    traceRoomToTarget(ctx, layout, targetBlobs)
    ctx.fillStyle = palette.emptySlot
    ctx.fill()
    ctx.beginPath()
    traceRackOutline(ctx, layout, 0)
    ctx.strokeStyle = palette.rackStroke
    ctx.stroke()
  })
  const futureRack = paintRack(layout, density, 0, (ctx) => {
    ctx.setLineDash(FUTURE_DASH)
    ctx.beginPath()
    traceRackOutline(ctx, layout, 0)
    ctx.strokeStyle = palette.futureStroke
    ctx.stroke()
  })
  const litRack = paintRack(layout, density, GLOW_REACH, (ctx) => {
    ctx.shadowColor = palette.glow
    ctx.shadowBlur = GLOW_BLUR
    ctx.strokeStyle = palette.brand
    ctx.lineWidth = 1.5
    ctx.beginPath()
    traceRackOutline(ctx, layout, 0)
    ctx.stroke()
  })
  const rules = paintRules(layout, palette, density)
  if (!sealedRack || !futureRack || !litRack || !rules) return undefined
  return { sealedRack, futureRack, rules, litRack }
}

/** A rack on a canvas of its own size, plus `margin` around it */
function paintRack(
  layout: BeltLayout,
  density: number,
  margin: number,
  paint: (ctx: CanvasRenderingContext2D) => void,
) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round((layout.rackWidth + 2 * margin) * density)
  canvas.height = Math.round((layout.rackHeight + 2 * margin) * density)
  const ctx = canvas.getContext('2d')
  if (!ctx) return undefined
  ctx.scale(density, density)
  ctx.translate(margin, margin - layout.rackTop)
  ctx.lineWidth = 1
  paint(ctx)
  return canvas
}

export function traceRackBody(
  ctx: CanvasRenderingContext2D,
  layout: BeltLayout,
  left: number,
) {
  ctx.roundRect(
    left,
    layout.rackTop,
    layout.rackWidth,
    layout.rackHeight,
    layout.rackRadius,
  )
}

/** On half pixels, so a 1 px line covers whole pixels and stays crisp */
function traceRackOutline(
  ctx: CanvasRenderingContext2D,
  layout: BeltLayout,
  left: number,
) {
  ctx.roundRect(
    left + 0.5,
    layout.rackTop + 0.5,
    layout.rackWidth - 1,
    layout.rackHeight - 1,
    layout.rackRadius,
  )
}

/**
 * The room a block has up to its target, row by row. Above the target the
 * fee band's hatching shows the rest, so the two never draw over each other
 */
function traceRoomToTarget(
  ctx: CanvasRenderingContext2D,
  layout: BeltLayout,
  targetBlobs: number,
) {
  for (let row = 0; row < targetBlobs; row++) {
    const { top } = tileBounds(layout, row, 0, 1)
    ctx.roundRect(
      layout.rackPadding,
      top,
      layout.tileSize,
      layout.tileSize,
      layout.tileRadius,
    )
  }
}

/** The band where the blob fee rises, hatched, and the target line under it */
function paintRules(layout: BeltLayout, palette: BeltPalette, density: number) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(layout.width * density)
  canvas.height = Math.round(layout.height * density)
  const ctx = canvas.getContext('2d')
  if (!ctx) return undefined
  ctx.scale(density, density)

  const top = layout.maxY
  const height = layout.targetY - top
  ctx.save()
  ctx.beginPath()
  ctx.rect(0, top, layout.width, height)
  ctx.clip()
  ctx.beginPath()
  for (let x = -height; x < layout.width; x += HATCH_SPACING) {
    ctx.moveTo(x, top + height)
    ctx.lineTo(x + height, top)
  }
  ctx.strokeStyle = palette.hatch
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()

  // on a half pixel, so the 1 px line covers whole pixels
  const lineY = Math.floor(layout.targetY) + 0.5
  ctx.setLineDash(TARGET_DASH)
  ctx.strokeStyle = palette.targetLine
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, lineY)
  ctx.lineTo(layout.width, lineY)
  ctx.stroke()
  return canvas
}
