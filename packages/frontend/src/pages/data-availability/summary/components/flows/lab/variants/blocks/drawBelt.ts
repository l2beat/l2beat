import { type BeltLayers, GLOW_REACH, traceRackBody } from './beltLayers'
import { type BeltLayout, tileBounds } from './beltLayout'
import type { PosterInk } from './beltPalette'
import {
  type BeltPosition,
  beltAt,
  presenceAtEnds,
  rackLeft,
} from './beltPosition'
import type { BeltFrame, BeltScene, Playback } from './beltScene'
import { batchKey, dayOffsetOf, daySlotOf, readBatchKey } from './dayBlocks'
import {
  drawArrivalLabels,
  drawBayCaption,
  drawBlockNumbers,
  drawLimitLabels,
  drawNextBatchNote,
} from './drawBeltLabels'
import {
  DROP_STAGGER,
  fallDuration,
  moveTile,
  restingMotion,
  type TileMotion,
} from './motion'

/**
 * Paints one frame. The belt moves at a constant speed, one block a second;
 * the block in the loading bay takes the batches whose time has come, the
 * ones left of it are sealed and the ones right of it are still to come.
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
  const belt = beltAt(playback, layout, ctx.getTransform().a, now)

  // Pass 1: the rules every block keeps to, under the belt
  drawRules(ctx, layout, scene.layers)

  // Pass 2: what rides the belt, each block fading out towards the ends
  drawRacks(ctx, scene, belt, landingPulse(scene, playback, belt, now))
  drawTiles(ctx, scene, playback, belt, now, frame)
  drawBlockNumbers(ctx, scene, belt, frame)

  // Pass 3: what stays put, on top
  drawHoverRing(ctx, scene, frame, hovered)
  drawArrivalLabels(ctx, scene, playback, belt, now)
  drawBayCaption(ctx, scene, playback, belt, now)
  drawLimitLabels(ctx, scene)
  drawNextBatchNote(ctx, scene, playback, belt, frame)
}

/** Opacity of other posters' tiles while one poster is highlighted */
const DIMMED = 0.15
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
  const { layout, batches, blocks } = scene
  let pulse = 0
  for (const [key, arrivedAt] of playback.arrivals) {
    const { block, batchIndex } = readBatchKey(blocks, key)
    const batch = batches[batchIndex]
    if (block !== belt.current || !batch) continue
    const below = blocks.blobsBelow[batchIndex] ?? 0
    const { top } = tileBounds(layout, below, 0, 1)
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
  pulse: number,
) {
  const { layout, layers } = scene
  const { rackTop, rackWidth, rackHeight } = layout

  // The two at the bay are drawn on their own, as they change look
  const sealedEnd = belt.current - 1
  for (let block = belt.first; block < sealedEnd; block++) {
    const left = rackLeft(belt, layout, block)
    ctx.globalAlpha = presenceAtEnds(layout, left, left + rackWidth)
    ctx.drawImage(layers.sealedRack, left, rackTop, rackWidth, rackHeight)
  }
  for (let block = belt.current + 1; block <= belt.last; block++) {
    const left = rackLeft(belt, layout, block)
    ctx.globalAlpha = presenceAtEnds(layout, left, left + rackWidth)
    ctx.drawImage(layers.futureRack, left, rackTop, rackWidth, rackHeight)
  }
  ctx.globalAlpha = 1

  drawBayRack(
    ctx,
    scene,
    rackLeft(belt, layout, belt.current - 1),
    1 - belt.handover,
    'sealed',
    0,
  )
  drawBayRack(
    ctx,
    scene,
    rackLeft(belt, layout, belt.current),
    belt.handover,
    'future',
    pulse,
  )
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
 * The rack in the bay, lit by `light` (0–1). At handover the block leaving
 * dims into a sealed rack and the one arriving lights up out of a future
 * one, so no rack changes look in a single frame.
 */
function drawBayRack(
  ctx: CanvasRenderingContext2D,
  scene: BeltScene,
  left: number,
  light: number,
  unlit: 'sealed' | 'future',
  pulse: number,
) {
  const { layout, palette, layers } = scene
  const { rackTop, rackWidth, rackHeight } = layout
  ctx.save()
  ctx.globalAlpha = unlit === 'sealed' ? 1 : 1 - light
  const unlitRack = unlit === 'sealed' ? layers.sealedRack : layers.futureRack
  ctx.drawImage(unlitRack, left, rackTop, rackWidth, rackHeight)
  if (light > 0) {
    ctx.globalAlpha = light
    drawChute(ctx, scene, left)
    // the room it has fades in as it takes the bay
    if (unlit === 'future') {
      ctx.drawImage(layers.sealedRack, left, rackTop, rackWidth, rackHeight)
    }
    ctx.beginPath()
    traceRackBody(ctx, layout, left)
    ctx.fillStyle = palette.bayFill
    ctx.fill()
    drawLitOutline(ctx, layout, layers, left)
    if (pulse > 0.02) {
      // a second pass doubles the glow at its peak
      ctx.globalAlpha = light * pulse
      drawLitOutline(ctx, layout, layers, left)
    }
  }
  ctx.restore()
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
) {
  const { layout, palette, batches, blocks, highlighted } = scene
  frame.hits.length = 0
  frame.landed.length = 0
  frame.highlightedInView = 0
  const clearOfFade = layout.fadeLeft / 2

  for (let block = belt.first; block <= belt.current; block++) {
    const daySlot = daySlotOf(block)
    const dayOffset = dayOffsetOf(block)
    const from = blocks.firstBatch[daySlot] ?? 0
    const to = blocks.firstBatch[daySlot + 1] ?? from
    const left = rackLeft(belt, layout, block) + layout.rackPadding
    const presence = presenceAtEnds(layout, left, left + layout.tileSize)
    const inView = left >= clearOfFade
    let landed = 0

    for (let index = from; index < to; index++) {
      const batch = batches[index]
      // a block's batches are in time order, so the rest are still to come
      if (!batch || dayOffset + batch.time >= playback.time) break
      const ink = palette.posters[batch.posterIndex]
      if (!ink) continue
      const key = batchKey(block, index - from)
      const arrivedAt = playback.arrivals.get(key)
      const below = blocks.blobsBelow[index] ?? 0
      const isHighlighted = highlighted === batch.posterIndex
      if (isHighlighted && inView) frame.highlightedInView += batch.blobs
      ctx.globalAlpha =
        presence * (highlighted === undefined || isHighlighted ? 1 : DIMMED)

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
