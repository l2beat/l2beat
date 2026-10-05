import { mixColors, toRgba } from '../../color'
import type { ThemeTokens } from '../../hooks'
import { SLOT_SECONDS } from '../../model'
import type { LabBatch } from '../../schedule'
import { getStepHits, type Hit, type Sequence } from './sequence'

const RULER_HEIGHT = 24
// everyone else is a different kind of row, so it sits a little apart
const EVERYONE_ELSE_GAP = 8
const BOTTOM_PADDING = 2
// far enough in for the past to be seen leaving, while most of the row is to come
const PLAYHEAD_AT = 0.28
/** Rows are bands this far in from their edges, so neighbors stay apart */
export const TRACK_INSET = 2
// Shades of the bands, the same as the gutter labels they continue
const TRACK_FILL = 0.035
const TRACK_FILL_STRONG = 0.07
const NOTE_GAP = 2
const STACK_GAP = 2
const RIGHT_FADE = 36
const RIPPLE_SECONDS = 0.42
const HEAD_WIDTH = 8
const MINUTE_STEPS = 60 / SLOT_SECONDS
const LABEL_FONT = '500 11px Roboto, Arial, sans-serif'

export interface SequencerLayout {
  width: number
  height: number
  rowHeight: number
  /** Top of each row, by track */
  rowTops: number[]
  /** One block, 12 seconds */
  colWidth: number
  playheadX: number
}

/** What the pointer is over: a row, and the note on it if there is one */
export interface HoverTarget {
  track: number
  step?: number
  /** Index into the batches of the row's hit in that step */
  batch?: number
}

/** Where every note is now: enough to find what is under the pointer */
export interface SequencerView {
  layout: SequencerLayout
  sequence: Sequence
  /** Seconds of playback at the playhead */
  clock: number
}

/** Everything a frame is drawn from */
export interface Scene extends SequencerView {
  /** Seconds on the page's clock, to age the notes that fired */
  now: number
  /** When each block that fired lately did, by step */
  firedAt: ReadonlyMap<number, number>
  /** Note colors by poster index, made readable on the card */
  colors: string[]
  /** For the notes of everyone else */
  neutral: string
  tokens: ThemeTokens
  /** Poster index picked, or -1 */
  highlighted: number
  hovered: HoverTarget | undefined
  /** The clock time at a time of playback, for the ruler */
  formatTime: (seconds: number) => string
  pixelRatio: number
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export function getSequencerLayout(
  width: number,
  height: number,
  trackCount: number,
  hasEveryoneElse: boolean,
  visibleBlocks: number,
): SequencerLayout {
  const gap = hasEveryoneElse ? EVERYONE_ELSE_GAP : 0
  // whole pixels, so the edges of the rows stay crisp
  const rowHeight = Math.max(
    0,
    Math.floor(
      (height - RULER_HEIGHT - gap - BOTTOM_PADDING) / Math.max(trackCount, 1),
    ),
  )
  const rowTops = Array.from(
    { length: trackCount },
    (_, i) =>
      RULER_HEIGHT +
      i * rowHeight +
      (hasEveryoneElse && i === trackCount - 1 ? gap : 0),
  )
  return {
    width,
    height,
    rowHeight,
    rowTops,
    colWidth: clamp(width / visibleBlocks, 18, 24),
    playheadX: Math.round(width * PLAYHEAD_AT),
  }
}

/** How tall the sequencer is where nothing gives it a height */
export function getSequencerHeight(
  trackCount: number,
  hasEveryoneElse: boolean,
  rowHeight: number,
): number {
  const gap = hasEveryoneElse ? EVERYONE_ELSE_GAP : 0
  return RULER_HEIGHT + trackCount * rowHeight + gap + BOTTOM_PADDING
}

export function drawSequencer(ctx: CanvasRenderingContext2D, scene: Scene) {
  const { width, height } = scene.layout
  ctx.clearRect(0, 0, width, height)
  drawTracks(ctx, scene)
  drawGrid(ctx, scene)
  drawNotes(ctx, scene)
  drawHovered(ctx, scene)
  drawPlayhead(ctx, scene)
}

/** What is under the pointer: a note, or else the row */
export function hitTest(
  view: SequencerView,
  x: number,
  y: number,
): HoverTarget | undefined {
  const { layout } = view
  const track = layout.rowTops.findIndex(
    (top) => y >= top && y < top + layout.rowHeight,
  )
  if (track < 0 || x < 0 || x > layout.width) return undefined

  const step = Math.floor(timeAt(view, x) / SLOT_SECONDS)
  const left = xAt(view, step * SLOT_SECONDS)
  // what has faded away is gone, even if a trace of it is left
  if (presence(layout, left + layout.colWidth / 2) < 0.3) return { track }
  const hit = getStepHits(view.sequence, step).find((h) => h.track === track)
  if (!hit) return { track }

  const rects = getNoteRects(layout, hit, left)
  let batch = 0
  let nearest = Number.POSITIVE_INFINITY
  rects.forEach((rect, i) => {
    const distance = Math.max(rect.y - y, y - rect.y - rect.height, 0)
    if (distance < nearest) {
      nearest = distance
      batch = i
    }
  })
  return { track, step, batch }
}

export function getHoverKey(target: HoverTarget | undefined): string {
  return target ? `${target.track}:${target.step}:${target.batch}` : ''
}

/** 1 blob takes 40% of the row, 6 blobs 90%; the rare larger batch tops out */
function noteFraction(blobs: number): number {
  return Math.min(0.4 + 0.1 * (blobs - 1), 0.95)
}

// The bands go on from the gutter's labels, so only their far ends are round
function drawTracks(ctx: CanvasRenderingContext2D, scene: Scene) {
  const { layout, tokens, hovered, highlighted, sequence } = scene
  const picked = highlighted < 0 ? -1 : sequence.trackOfPoster[highlighted]
  layout.rowTops.forEach((top, track) => {
    const strong = track === picked || track === hovered?.track
    ctx.fillStyle = toRgba(
      tokens.primary,
      strong ? TRACK_FILL_STRONG : TRACK_FILL,
    )
    ctx.beginPath()
    ctx.roundRect(
      0,
      top + TRACK_INSET,
      layout.width,
      layout.rowHeight - 2 * TRACK_INSET,
      [0, 6, 6, 0],
    )
    ctx.fill()
  })
}

// A line for every block, a stronger one every minute, the minutes named
// on the ruler above. All fade with the notes they mark
function drawGrid(ctx: CanvasRenderingContext2D, scene: Scene) {
  const { layout, tokens, pixelRatio } = scene
  const lanesBottom = layout.height - BOTTOM_PADDING
  const [first, last] = getVisibleSteps(scene)
  ctx.font = LABEL_FONT
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  for (let step = first; step <= last; step++) {
    const x = snap(xAt(scene, step * SLOT_SECONDS), pixelRatio)
    const seen = presence(layout, x)
    if (seen <= 0) continue
    const isMinute = mod(step, MINUTE_STEPS) === 0
    if (isMinute) {
      ctx.fillStyle = toRgba(tokens.primary, 0.14 * seen)
      ctx.fillRect(x, 5, 1, lanesBottom - 5)
      const label = scene.formatTime(step * SLOT_SECONDS)
      const labelLeft = x + 5
      const labelRight = labelLeft + ctx.measureText(label).width
      // a label fades by its far end, so the edge never cuts one in half,
      // and gives way to the playhead's head before it would touch it
      const shown = Math.min(seen, presence(layout, labelRight))
      const gap = Math.max(
        labelLeft - (layout.playheadX + HEAD_WIDTH / 2),
        layout.playheadX - HEAD_WIDTH / 2 - labelRight,
      )
      const clear = clamp((gap - 2) / 10, 0, 1)
      ctx.fillStyle = toRgba(tokens.secondary, shown * clear)
      ctx.fillText(label, labelLeft, 14)
    } else {
      ctx.fillStyle = toRgba(tokens.primary, 0.055 * seen)
      ctx.fillRect(x, RULER_HEIGHT - 5, 1, lanesBottom - RULER_HEIGHT + 5)
    }
  }
}

function drawNotes(ctx: CanvasRenderingContext2D, scene: Scene) {
  const { layout } = scene
  const [first, last] = getVisibleSteps(scene)
  for (let step = first; step <= last; step++) {
    const hits = getStepHits(scene.sequence, step)
    if (hits.length === 0) continue
    const left = xAt(scene, step * SLOT_SECONDS)
    const center = left + layout.colWidth / 2
    const seen = presence(layout, center)
    if (seen <= 0) continue
    const firedAt = scene.firedAt.get(step)
    const age =
      firedAt === undefined ? Number.POSITIVE_INFINITY : scene.now - firedAt
    // played notes step back, the one sounding now at full strength
    const played = center < layout.playheadX ? 0.7 + 0.3 * getBloom(age) : 1
    for (const hit of hits) {
      const rects = getNoteRects(layout, hit, left)
      hit.batches.forEach((batch, i) => {
        const rect = rects[i]
        if (!rect) return
        const vivid =
          scene.highlighted < 0 || batch.posterIndex === scene.highlighted
        const color = getNoteColor(scene, hit, batch)
        const alpha = seen * played * (vivid ? 1 : 0.16)
        const sounded = vivid ? age : Number.POSITIVE_INFINITY
        drawNote(ctx, scene, rect, color, alpha, sounded)
        drawRipple(ctx, layout, rect, color, alpha, sounded)
      })
    }
  }
  ctx.globalAlpha = 1
}

/** `age`: seconds since the note sounded */
function drawNote(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  rect: Rect,
  color: string,
  alpha: number,
  age: number,
) {
  const bloom = getBloom(age)
  const scale = 1 + 0.18 * bloom
  const width = rect.width * scale
  const height = rect.height * scale
  const x = rect.x + (rect.width - width) / 2
  const y = rect.y + (rect.height - height) / 2
  ctx.globalAlpha = alpha
  if (bloom > 0.01) {
    // a tight glow and a white-hot core: a soft, wide one reads as a blur.
    // Shadows ignore the canvas transform, so they are in device pixels
    ctx.shadowColor = toRgba(color, 0.75)
    ctx.shadowBlur = 9 * bloom * scene.pixelRatio
    ctx.fillStyle = mixColors(
      color,
      '#ffffff',
      (scene.tokens.isDark ? 0.5 : 0.3) * bloom,
    )
  } else {
    ctx.fillStyle = color
  }
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, Math.min(width, height) / 2)
  ctx.fill()
  if (bloom > 0.01) {
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
  }
}

// A ring leaves a note as it sounds, like the one around its project's
// icon: rings are sound here. It spreads within the row, never into the next
function drawRipple(
  ctx: CanvasRenderingContext2D,
  layout: SequencerLayout,
  rect: Rect,
  color: string,
  alpha: number,
  age: number,
) {
  const progress = age / RIPPLE_SECONDS
  if (!(progress >= 0 && progress < 1)) return
  const spread = 1 - (1 - progress) ** 3
  const across = 2 + 9 * spread
  const room = (layout.rowHeight - rect.height) / 2 - TRACK_INSET
  const along = Math.min(across, Math.max(room, 2))
  const width = rect.width + across * 2
  const height = rect.height + along * 2
  ctx.globalAlpha = alpha * 0.85 * (1 - progress) ** 2
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(
    rect.x - across,
    rect.y - along,
    width,
    height,
    Math.min(width, height) / 2,
  )
  ctx.stroke()
}

function drawHovered(ctx: CanvasRenderingContext2D, scene: Scene) {
  const { hovered, layout, tokens } = scene
  if (hovered?.step === undefined || hovered.batch === undefined) return
  const hit = getStepHits(scene.sequence, hovered.step).find(
    (h) => h.track === hovered.track,
  )
  if (!hit) return
  const rect = getNoteRects(
    layout,
    hit,
    xAt(scene, hovered.step * SLOT_SECONDS),
  )[hovered.batch]
  if (!rect) return
  const ring = 2.5
  ctx.strokeStyle = tokens.primary
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(
    rect.x - ring,
    rect.y - ring,
    rect.width + ring * 2,
    rect.height + ring * 2,
    Math.min(rect.width, rect.height) / 2 + ring,
  )
  ctx.stroke()
}

function drawPlayhead(ctx: CanvasRenderingContext2D, scene: Scene) {
  const { layout, tokens } = scene
  const x = layout.playheadX
  const bottom = layout.height - BOTTOM_PADDING
  const glow = ctx.createLinearGradient(x - 10, 0, x + 10, 0)
  glow.addColorStop(0, toRgba(tokens.brand, 0))
  glow.addColorStop(0.5, toRgba(tokens.brand, tokens.isDark ? 0.24 : 0.16))
  glow.addColorStop(1, toRgba(tokens.brand, 0))
  ctx.fillStyle = glow
  ctx.fillRect(x - 10, RULER_HEIGHT, 20, bottom - RULER_HEIGHT)

  ctx.fillStyle = tokens.brand
  ctx.fillRect(x - 1, 8, 2, bottom - 8)
  // the head, a small rounded tab on the ruler
  ctx.beginPath()
  ctx.roundRect(x - HEAD_WIDTH / 2, 2, HEAD_WIDTH, 12, HEAD_WIDTH / 2)
  ctx.fill()
}

function getNoteRects(layout: SequencerLayout, hit: Hit, left: number) {
  const top = (layout.rowTops[hit.track] ?? 0) + TRACK_INSET
  const room = layout.rowHeight - 2 * TRACK_INSET
  const heights = hit.batches.map((batch) =>
    Math.min(noteFraction(batch.blobs) * layout.rowHeight, room),
  )
  const gaps = STACK_GAP * (heights.length - 1)
  const total = heights.reduce((sum, h) => sum + h, 0) + gaps
  // two batches in a block stack up, squeezed to fit the row if need be
  const squeeze = total > room ? (room - gaps) / (total - gaps) : 1
  const stacked = heights.map((h) => h * squeeze)
  let y = top + (room - (stacked.reduce((s, h) => s + h, 0) + gaps)) / 2
  // no wider than a blob is tall, so one blob is always a dot and more of
  // them always a taller capsule, however wide the blocks are drawn
  const width = Math.min(
    layout.colWidth - NOTE_GAP,
    noteFraction(1) * layout.rowHeight,
  )
  return stacked.map((height): Rect => {
    const rect = { x: left + (layout.colWidth - width) / 2, y, width, height }
    y += height + STACK_GAP
    return rect
  })
}

function getNoteColor(scene: Scene, hit: Hit, batch: LabBatch): string {
  const track = scene.sequence.tracks[hit.track]
  // everyone else is gray, but a project picked from it shows its own color
  if (track?.isEveryoneElse && batch.posterIndex !== scene.highlighted) {
    return scene.neutral
  }
  return scene.colors[batch.posterIndex] ?? scene.neutral
}

/** A note pops as it sounds: up in a blink, then it settles, fast first and softly last */
function getBloom(age: number): number {
  const rise = 0.035
  const settle = 0.26
  if (age < 0 || age >= rise + settle) return 0
  if (age < rise) return 1 - (1 - age / rise) ** 3
  return (1 - (age - rise) / settle) ** 3
}

/** How much of a mark shows at `x`: the past dissolves leftwards, the future eases in */
function presence(layout: SequencerLayout, x: number): number {
  if (x < layout.playheadX) {
    const t = clamp(x / layout.playheadX, 0, 1)
    return t * t * (3 - 2 * t)
  }
  return clamp((layout.width - x) / RIGHT_FADE, 0, 1)
}

function getVisibleSteps(view: SequencerView): [number, number] {
  return [
    Math.floor(timeAt(view, 0) / SLOT_SECONDS) - 1,
    Math.ceil(timeAt(view, view.layout.width) / SLOT_SECONDS),
  ]
}

function xAt({ layout, clock }: SequencerView, time: number): number {
  return layout.playheadX + ((time - clock) / SLOT_SECONDS) * layout.colWidth
}

function timeAt({ layout, clock }: SequencerView, x: number): number {
  return clock + ((x - layout.playheadX) / layout.colWidth) * SLOT_SECONDS
}

/** Onto the device's pixel grid, so a 1px line stays one sharp pixel wide */
function snap(x: number, pixelRatio: number): number {
  return Math.round(x * pixelRatio) / pixelRatio
}

function mod(value: number, by: number): number {
  return ((value % by) + by) % by
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
