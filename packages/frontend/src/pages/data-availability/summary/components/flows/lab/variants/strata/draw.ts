import { readableColor, toRgba } from '../../color'
import type { ThemeTokens } from '../../hooks'
import type { Focus } from './grainColors'
import { HOUR_SECONDS } from './pour'
import type { Sand } from './sand'
import { type Label, type Scene, TICK_EVERY_HOURS } from './scene'
import { halfWidth, levelOf, type Point } from './vessel'

export const LABEL_FONT = '500 12px Roboto, Arial, sans-serif'
export const VALUE_FONT = '400 12px Roboto, Arial, sans-serif'

const TRAIL_CELLS = 6
/** How long a time on the ruler takes to fade in once the pour reaches it */
const LABEL_FADE_SECONDS = 0.4

/** What changes between frames, beside the sand itself */
export interface FrameState {
  focus: Focus
  /** Index into the posters, -1 for none */
  pickedPoster: number
  hoveredGrain: number
  hoveredHour: number
  /** 0 to 1, how far the end of the pour has faded in */
  ending: number
  /** Below 1 while the last pile fades out, to pour again */
  sandOpacity: number
}

/**
 * Paints the sand one pixel a cell, to be scaled up without smoothing, so
 * every grain stays a crisp square
 */
export class SandImage {
  readonly canvas: HTMLCanvasElement
  private readonly image: ImageData
  private readonly pixels: Uint32Array

  constructor(
    private readonly columns: number,
    rows: number,
  ) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = columns
    this.canvas.height = rows
    this.image = new ImageData(columns, rows)
    this.pixels = new Uint32Array(this.image.data.buffer)
  }

  paint(sand: Sand, keys: Uint32Array, colors: Uint32Array) {
    const { cells } = sand
    const { pixels, columns } = this
    for (let i = 0; i < cells.length; i++) {
      const grain = cells[i] ?? -1
      pixels[i] = grain < 0 ? 0 : (colors[keys[grain] ?? 0] ?? 0)
    }
    // a falling grain leaves a fading streak as long as it falls in a frame,
    // so the stream reads as a stream rather than as dots
    sand.forEachFlying((grain, cell, speed) => {
      const color = (colors[keys[grain] ?? 0] ?? 0) & 0xffffff
      const length = Math.min(Math.floor(speed / 60), TRAIL_CELLS)
      for (let step = 1; step <= length; step++) {
        const above = cell - step * columns
        if (above < 0 || (cells[above] ?? -1) >= 0 || pixels[above] !== 0) break
        const alpha = Math.round(200 * (1 - step / (length + 1)))
        pixels[above] = ((alpha << 24) | color) >>> 0
      }
    })
    this.canvas.getContext('2d')?.putImageData(this.image, 0, 0)
  }
}

export function drawScene(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  sand: Sand,
  image: SandImage,
  tokens: ThemeTokens,
  frame: FrameState,
) {
  const { vessel } = scene
  const ink = tokens.primary

  drawGlass(ctx, scene, tokens)

  ctx.save()
  tracePath(ctx, vessel.outline, true)
  ctx.clip()
  ctx.imageSmoothingEnabled = false
  ctx.globalAlpha = frame.sandOpacity
  ctx.drawImage(
    image.canvas,
    vessel.gridX,
    vessel.gridY,
    vessel.columns * vessel.cell,
    vessel.rows * vessel.cell,
  )
  ctx.restore()

  drawGlint(ctx, scene, tokens)
  const { labels } = scene
  const quiet = toRgba(ink, tokens.isDark ? 0.55 : 0.5)
  drawLevel(ctx, scene, labels.maximum, quiet, ink, tokens)
  drawLevel(ctx, scene, labels.target, quiet, ink, tokens)
  if (frame.ending > 0) {
    ctx.globalAlpha = frame.ending
    drawLevel(ctx, scene, labels.day, tokens.brand, tokens.brand, tokens)
    ctx.globalAlpha = 1
  }

  ctx.lineJoin = 'round'
  ctx.lineWidth = 1.5
  ctx.strokeStyle = toRgba(ink, tokens.isDark ? 0.42 : 0.45)
  tracePath(ctx, vessel.outline, true)
  ctx.stroke()

  ctx.globalAlpha = frame.sandOpacity
  drawHourRuler(ctx, scene, sand, tokens, frame)
  ctx.globalAlpha = 1
  if (frame.hoveredGrain >= 0) drawGrainRing(ctx, scene, sand, frame, tokens)
}

function drawGlass(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  tokens: ThemeTokens,
) {
  const { vessel } = scene
  // shaded like the logo: light faces left, dark ones right, so the glass
  // reads as Ethereum's crystal even before a grain is in
  for (const face of vessel.faces) {
    ctx.fillStyle = tokens.isDark
      ? toRgba('#ffffff', 0.012 + face.light * 0.05)
      : toRgba(tokens.primary, Math.max(0.004, 0.052 - face.light * 0.038))
    tracePath(ctx, face.points, true)
    ctx.fill()
  }

  ctx.lineWidth = 1
  ctx.strokeStyle = toRgba(tokens.primary, tokens.isDark ? 0.09 : 0.08)
  for (const facet of vessel.facets) {
    tracePath(ctx, facet, false)
    ctx.stroke()
  }
}

/** A streak of light down the upper left face, as on a glass */
function drawGlint(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  tokens: ThemeTokens,
) {
  const [top, , , , , left] = scene.vessel.outline
  if (!top || !left) return
  const dx = left.x - top.x
  const dy = left.y - top.y
  const length = Math.hypot(dx, dy)
  const inset = Math.min(12, length * 0.04)
  // stepped in along the normal that points into the glass
  const along = (t: number): Point => ({
    x: top.x + dx * t + (dy / length) * inset,
    y: top.y + dy * t - (dx / length) * inset,
  })
  const from = along(0.2)
  const to = along(0.58)
  const shine = (alpha: number) => {
    const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y)
    gradient.addColorStop(0, toRgba('#ffffff', 0))
    gradient.addColorStop(0.4, toRgba('#ffffff', alpha))
    gradient.addColorStop(1, toRgba('#ffffff', 0))
    return gradient
  }
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.strokeStyle = shine(tokens.isDark ? 0.035 : 0.6)
  ctx.lineWidth = 7
  ctx.stroke()
  ctx.strokeStyle = shine(tokens.isDark ? 0.11 : 0.9)
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.lineCap = 'butt'
}

/**
 * A dashed line from a label across the vessel, at the height where the
 * vessel holds what the label says
 */
function drawLevel(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  label: Label,
  lineColor: string,
  nameColor: string,
  tokens: ThemeTokens,
) {
  const { vessel } = scene
  const half = Math.max(0, halfWidth(vessel.height, label.y - vessel.apexY))
  const y = crisp(label.y)
  ctx.strokeStyle = lineColor
  ctx.lineWidth = 1
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(label.lineFrom, y)
  ctx.lineTo(vessel.apexX + half, y)
  ctx.stroke()
  ctx.setLineDash([])
  drawLabel(ctx, label, tokens, nameColor)
}

/**
 * The hours as a ruler beside the sand: a tick where each hour's sand ends,
 * so the ticks crowd where the vessel widens, and the time every six hours
 */
function drawHourRuler(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  sand: Sand,
  tokens: ThemeTokens,
  frame: FrameState,
) {
  const { ruler, hourLevels, vessel, plan } = scene
  const poured = sand.poured
  if (poured === 0) return
  const opacity = ctx.globalAlpha
  const x = Math.round(ruler.x) + 0.5
  const top = levelOf(vessel, poured)
  const isPoured = (hour: number) => poured >= (plan.pouredBefore[hour] ?? 0)

  ctx.strokeStyle = toRgba(tokens.primary, 0.3)
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x, hourLevels[0] ?? 0)
  ctx.lineTo(x, top)
  for (let hour = 0; hour <= plan.hours && isPoured(hour); hour++) {
    const y = crisp(hourLevels[hour] ?? 0)
    ctx.moveTo(x, y)
    ctx.lineTo(x + (hour % TICK_EVERY_HOURS === 0 ? 6 : 3), y)
  }
  ctx.stroke()

  drawPickedHours(ctx, scene, poured, x, tokens, frame)

  const hoveredGrainHour =
    frame.hoveredGrain >= 0 ? (plan.hour[frame.hoveredGrain] ?? -1) : -1
  const marked = frame.hoveredHour >= 0 ? frame.hoveredHour : hoveredGrainHour
  if (marked >= 0) {
    const from = hourLevels[marked] ?? 0
    const to = hourLevels[marked + 1] ?? 0
    ctx.fillStyle = tokens.brand
    ctx.fillRect(x - 2.5, to, 4, Math.max(from - to, 1.5))
  }

  ctx.font = VALUE_FONT
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillStyle = tokens.secondary
  for (const tick of scene.ticks) {
    const since = sand.time - tick.hour * HOUR_SECONDS
    if (!tick.label || since < 0) continue
    ctx.globalAlpha = opacity * Math.min(1, since / LABEL_FADE_SECONDS)
    ctx.fillText(tick.label, ruler.labelX, tick.y)
  }

  // where the sand stands now, handing over to the day's level at the end
  ctx.globalAlpha = opacity * (1 - frame.ending)
  if (ctx.globalAlpha > 0) {
    ctx.fillStyle = tokens.brand
    ctx.beginPath()
    ctx.moveTo(x - 2, top)
    ctx.lineTo(x - 7, top - 3.5)
    ctx.lineTo(x - 7, top + 3.5)
    ctx.closePath()
    ctx.fill()
  }
  ctx.globalAlpha = opacity
}

/**
 * The picked poster's blobs in each hour, as a strip along the ruler that is
 * the brighter the more it posted, so when it posted reads beside its sand
 */
function drawPickedHours(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  poured: number,
  x: number,
  tokens: ThemeTokens,
  frame: FrameState,
) {
  const { posterPicked } = frame.focus
  const picked = posterPicked.findIndex((amount) => amount > 0)
  const poster = scene.posters[picked]
  if (!poster) return
  const { hourLevels, plan } = scene
  const most = Math.max(...poster.blobsHourly)
  if (most <= 0) return
  const color = readableColor(poster.color, tokens.surface)
  const shown = posterPicked[picked] ?? 0
  for (let hour = 0; hour < plan.hours; hour++) {
    if (poured <= (plan.pouredBefore[hour] ?? 0)) break
    const blobs = poster.blobsHourly[hour] ?? 0
    if (blobs <= 0) continue
    const bottom = hourLevels[hour] ?? 0
    const top = hourLevels[hour + 1] ?? 0
    ctx.fillStyle = toRgba(color, shown * (0.15 + 0.85 * (blobs / most)))
    ctx.fillRect(x - 6.5, top, 4, Math.max(bottom - top, 1))
  }
}

function drawGrainRing(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  sand: Sand,
  frame: FrameState,
  tokens: ThemeTokens,
) {
  const { vessel } = scene
  const cell = sand.grainCell[frame.hoveredGrain] ?? -1
  if (cell < 0) return
  const x = vessel.gridX + ((cell % vessel.columns) + 0.5) * vessel.cell
  const y =
    vessel.gridY + (Math.floor(cell / vessel.columns) + 0.5) * vessel.cell
  ctx.strokeStyle = tokens.primary
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(x, y, 5, 0, Math.PI * 2)
  ctx.stroke()
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  label: Label,
  tokens: ThemeTokens,
  nameColor = tokens.primary,
) {
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  if (label.stacked) {
    ctx.font = LABEL_FONT
    ctx.fillStyle = nameColor
    ctx.fillText(label.name, label.x, label.y - 7.5)
    ctx.font = VALUE_FONT
    ctx.fillStyle = tokens.secondary
    ctx.fillText(label.value, label.x, label.y + 7.5)
    return
  }
  ctx.font = VALUE_FONT
  ctx.fillStyle = tokens.secondary
  ctx.fillText(label.value, label.x, label.y)
  const valueWidth = ctx.measureText(label.value).width
  ctx.font = LABEL_FONT
  ctx.fillStyle = nameColor
  ctx.fillText(`${label.name}, `, label.x - valueWidth, label.y)
}

function tracePath(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  closed: boolean,
) {
  ctx.beginPath()
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y)
    else ctx.lineTo(p.x, p.y)
  })
  if (closed) ctx.closePath()
}

/** A 1px line on a half pixel, so it covers one row of pixels sharply */
function crisp(y: number): number {
  return Math.round(y) + 0.5
}
