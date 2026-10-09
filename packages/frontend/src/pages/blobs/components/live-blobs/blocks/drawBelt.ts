import { type BeltLayers, GLOW_REACH, traceRackBody } from './beltLayers'
import { type BeltLayout, tileBounds } from './beltLayout'
import type { PosterInk } from './beltPalette'
import {
  type BeltPosition,
  beltAt,
  presenceAtEnds,
  rackLeft,
  sealedness,
} from './beltPosition'
import {
  type BeltFrame,
  type BeltScene,
  batchKey,
  findBatch,
  type Playback,
} from './beltScene'
import {
  drawArrivalLabels,
  drawBayCaption,
  drawBlockNumbers,
  drawLimitLabels,
  drawMissedLabels,
} from './drawBeltLabels'
import {
  DROP_STAGGER,
  fallDuration,
  moveTile,
  restingMotion,
  revealed,
  type TileMotion,
} from './motion'

/**
 * Paints one frame. The block in the loading bay is the one Ethereum is
 * making now and takes its batches once the block is out; the ones left of
 * it are sealed and the ones right of it are still to come.
 */
export function drawBelt(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  playback: Playback,
  now: number,
  frame: BeltFrame,
  hovered: number | undefined,
) {
  const { layout } = scene
  ctx.clearRect(0, 0, layout.width, layout.height)
  const belt = beltAt(playback, layout, ctx.getTransform().a)
  const reveal = revealed(playback.revealedAt, now)

  // Pass 1: the rules every block keeps to, under the belt
  drawRules(ctx, layout, scene.layers)

  // Pass 2: the belt, each block fading out towards the ends, and the bay's
  // light between the racks and the tiles in them
  drawRacks(ctx, scene, belt)
  drawMissedLabels(ctx, scene, belt, reveal)
  drawBay(ctx, scene, belt, landingPulse(scene, playback, belt, now))
  drawTiles(ctx, scene, playback, belt, now, frame, reveal)
  drawBayRing(ctx, scene, belt)
  drawBlockNumbers(ctx, scene, belt, frame, reveal)

  // Pass 3: what stays put, on top
  drawHoverRing(ctx, scene, frame, hovered)
  drawArrivalLabels(ctx, scene, playback, belt, now)
  drawBayCaption(ctx, scene, belt)
  drawLimitLabels(ctx, scene)
}

/** Seconds over which the bay's glow settles after a landing */
const PULSE_DECAY = 0.18

/**
 * 1 the moment a batch lands in the bay, fading within a few tenths of a
 * second: the bay's glow swells with it, so every delivery is acknowledged
 */
function landingPulse(
  scene: BeltScene,
  playback: Playback,
  belt: BeltPosition,
  now: number,
) {
  const { layout, blocks } = scene
  let pulse = 0
  for (const [key, arrivedAt] of playback.arrivals) {
    const found = findBatch(blocks, key)
    if (found?.slot !== belt.current) continue
    const { top } = tileBounds(layout, found.batch.blobsBelow, 0, 1)
    const sinceLanding = now - arrivedAt - fallDuration(top - layout.dropFromY)
    if (sinceLanding >= 0) {
      pulse = Math.max(pulse, Math.exp(-sinceLanding / PULSE_DECAY))
    }
  }
  return pulse
}

function drawRacks(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  belt: BeltPosition,
) {
  const { layout, layers, blocks } = scene
  const { rackTop, rackWidth, rackHeight } = layout

  for (let slot = belt.first; slot <= belt.last; slot++) {
    const sealedRack =
      blocks.get(slot)?.status === 'missed'
        ? layers.missedRack
        : layers.sealedRack
    const left = rackLeft(belt, layout, slot)
    const presence = presenceAtEnds(layout, left, left + rackWidth)
    // The rack of the slot being made shows the room it has as it comes, so
    // it does not change look in a single frame
    const sealed = sealedness(belt, slot)
    if (sealed < 1) {
      ctx.globalAlpha = presence * (1 - sealed)
      ctx.drawImage(layers.futureRack, left, rackTop, rackWidth, rackHeight)
    }
    if (sealed > 0) {
      ctx.globalAlpha = presence * sealed
      ctx.drawImage(sealedRack, left, rackTop, rackWidth, rackHeight)
    }
  }
  ctx.globalAlpha = 1
}

/**
 * The loading bay: its light, its tint and its lit outline. The bay is a
 * place, so it stays under the caption as the belt slides one rack out of it
 * and the next in, and there is only ever one of it on screen.
 */
function drawBay(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  belt: BeltPosition,
  pulse: number,
) {
  const { layout, palette, layers } = scene
  const left = belt.bayLeft
  drawChute(ctx, scene, left)
  ctx.beginPath()
  traceRackBody(ctx, layout, left)
  ctx.fillStyle = palette.bayFill
  ctx.fill()
  drawLitOutline(ctx, layout, layers, left)
  if (pulse > 0.02) {
    // a second pass doubles the glow at its peak
    ctx.globalAlpha = pulse
    drawLitOutline(ctx, layout, layers, left)
    ctx.globalAlpha = 1
  }
}

/**
 * Light falling from the caption into the rack being built: where tiles come
 * from, and what ties the slot number above to its rack
 */
function drawChute(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  left: number,
) {
  const { layout, palette } = scene
  const top = layout.dropFromY
  const gradient = ctx.createLinearGradient(0, top, 0, layout.rackTop)
  gradient.addColorStop(0, palette.chuteTop)
  gradient.addColorStop(1, palette.chuteBottom)
  ctx.fillStyle = gradient
  ctx.fillRect(
    left + layout.rackPadding,
    top,
    layout.tileSize,
    layout.rackTop - top,
  )
}

/**
 * The bay's outline again, over the tiles: at rest they sit inside it, but
 * racks sliding through the bay would cover it with theirs. The glow stays
 * under them, where it lights the gaps rather than tinting the tiles
 */
function drawBayRing(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  belt: BeltPosition,
) {
  const { layout, layers } = scene
  ctx.drawImage(
    layers.bayRing,
    belt.bayLeft,
    layout.rackTop,
    layout.rackWidth,
    layout.rackHeight,
  )
}

function drawLitOutline(
  ctx: CanvasRenderingContext2D,
  layout: BeltLayout,
  layers: BeltLayers,
  left: number,
) {
  ctx.drawImage(
    layers.litRack,
    left - GLOW_REACH,
    layout.rackTop - GLOW_REACH,
    layout.rackWidth + 2 * GLOW_REACH,
    layout.rackHeight + 2 * GLOW_REACH,
  )
}

// reused for every moving tile, as this runs for each of them every frame
const motion: TileMotion = restingMotion()
const AT_REST: TileMotion = restingMotion()

function drawTiles(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  playback: Playback,
  belt: BeltPosition,
  now: number,
  frame: BeltFrame,
  reveal: number,
) {
  const { layout, palette, blocks } = scene
  frame.hits.length = 0
  frame.landed.length = 0

  for (let slot = belt.first; slot <= belt.last; slot++) {
    const block = blocks.get(slot)
    const batches = block?.status === 'proposed' ? block.batches : []
    const left = rackLeft(belt, layout, slot) + layout.rackPadding
    const presence = presenceAtEnds(layout, left, left + layout.tileSize)
    let landed = 0

    for (const [index, batch] of batches.entries()) {
      const ink = palette.posters[batch.posterIndex]
      if (!ink) continue
      const key = batchKey(slot, index)
      const arrivedAt = playback.arrivals.get(key)
      const below = batch.blobsBelow
      ctx.globalAlpha =
        presence *
        // a batch dropping in has a fade of its own
        (arrivedAt === undefined ? reveal : 1)

      for (let i = 0; i < batch.blobs; i++) {
        const bounds = tileBounds(layout, below + i, i, batch.blobs)
        if (arrivedAt === undefined) Object.assign(motion, AT_REST)
        else {
          const age = now - arrivedAt - i * DROP_STAGGER
          moveTile(motion, age, bounds.top - layout.dropFromY)
        }
        if (!motion.visible) continue
        if (motion.landed) landed++
        drawTile(ctx, layout, ink, left, bounds, i, batch.blobs)
        if (i === 0) drawTileIcon(ctx, scene, batch.posterIndex, left, bounds)
      }

      const top = tileBounds(layout, below + batch.blobs - 1, 0, 1).top
      const bottom = tileBounds(layout, below, 0, 1).bottom
      frame.hits.push({
        key,
        left,
        top,
        right: left + layout.tileSize,
        bottom,
      })
    }
    frame.landed.push(landed)
  }
  ctx.globalAlpha = 1
}

function drawTile(
  ctx: CanvasRenderingContext2D,
  layout: BeltLayout,
  ink: PosterInk,
  left: number,
  bounds: { top: number; bottom: number },
  indexInBatch: number,
  batchBlobs: number,
) {
  const width = layout.tileSize * motion.scaleX
  const height = (bounds.bottom - bounds.top) * motion.scaleY
  const x = left + (layout.tileSize - width) / 2
  // squashed against where it lands, so it stays on its floor
  const y = bounds.bottom + motion.offsetY - height
  const top =
    indexInBatch === batchBlobs - 1 ? layout.tileRadius : layout.seamRadius
  const bottom = indexInBatch === 0 ? layout.tileRadius : layout.seamRadius

  const alpha = ctx.globalAlpha
  ctx.globalAlpha = alpha * motion.alpha
  ctx.fillStyle = ink.fill
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, [top, top, bottom, bottom])
  ctx.fill()
  ctx.fillStyle = ink.sheen
  ctx.fillRect(x + top, y, width - 2 * top, 1)
  ctx.globalAlpha = alpha
}

function drawTileIcon(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  posterIndex: number,
  left: number,
  bounds: { top: number; bottom: number },
) {
  const icon = scene.icons[posterIndex]
  const size = scene.layout.iconSize
  if (!icon || size === 0) return
  const height = (bounds.bottom - bounds.top) * motion.scaleY
  const middle = bounds.bottom + motion.offsetY - height / 2
  const alpha = ctx.globalAlpha
  ctx.globalAlpha = alpha * motion.alpha
  ctx.drawImage(
    icon,
    left + (scene.layout.tileSize - size) / 2,
    middle - (size * motion.scaleY) / 2,
    size,
    size * motion.scaleY,
  )
  ctx.globalAlpha = alpha
}

/**
 * The target line and, above it, the band where the blob fee rises, across
 * the whole width. They show through the empty racks and go under the tiles.
 */
function drawRules(
  ctx: CanvasRenderingContext2D,
  layout: BeltLayout,
  layers: BeltLayers,
) {
  const { rules } = layers
  const density = rules.width / layout.width
  // only the rows the band and the line are on
  const top = Math.floor(layout.maxY) - 1
  const height = Math.ceil(layout.targetY) + 2 - top
  ctx.drawImage(
    rules,
    0,
    top * density,
    rules.width,
    height * density,
    0,
    top,
    layout.width,
    height,
  )
}

function drawHoverRing(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  frame: BeltFrame,
  hovered: number | undefined,
) {
  if (hovered === undefined) return
  const hit = frame.hits.find((h) => h.key === hovered)
  if (!hit) return
  const { layout, palette } = scene
  ctx.strokeStyle = palette.text
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(
    hit.left - 2,
    hit.top - 2,
    hit.right - hit.left + 4,
    hit.bottom - hit.top + 4,
    layout.tileRadius + 2,
  )
  ctx.stroke()
}
