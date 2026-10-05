import type { Box, Frame } from './drawing'
import { type Orrery, toScreen } from './orrery'

export interface ScaleMark {
  text: string
  /** Where the mark is on the axis */
  x: number
  y: number
  /** Where its text goes, under the mark */
  box: Box
}

const FONT = '500 11px Roboto, Arial, sans-serif'
const TEXT_HEIGHT = 11
/** From the axis to the top of a mark's text */
const TEXT_OFFSET = 6

/** The marks of the cadence scale, along the plane's long axis left of Ethereum */
export function placeScaleMarks(
  ctx: CanvasRenderingContext2D,
  orrery: Orrery,
): ScaleMark[] {
  ctx.font = FONT
  const below = getAcross(orrery)
  return orrery.ticks.map((tick) => {
    const at = toScreen(orrery, -tick.orbit, 0)
    const text = formatTick(tick.interval)
    const width = ctx.measureText(text).width
    const middle = at.x + below.x * TEXT_OFFSET
    const top = at.y + below.y * TEXT_OFFSET
    return {
      text,
      x: at.x,
      y: at.y,
      box: {
        left: middle - width / 2,
        right: middle + width / 2,
        top,
        bottom: top + TEXT_HEIGHT,
      },
    }
  })
}

/**
 * Orbits are spaced by how often their posters send a batch, on a log
 * scale. The scale is marked along the plane, so it is not left to guess:
 * a dotted axis out from Ethereum, ticked at round cadences.
 */
export function drawScale(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  marks: ScaleMark[],
) {
  const { orrery, paint, focus } = frame
  if (marks.length === 0) return
  const across = getAcross(orrery)
  const from = toScreen(orrery, -(orrery.sun.radius + 12), 0)
  const to = toScreen(orrery, -orrery.outerOrbit, 0)

  ctx.globalAlpha = focus.highlighted !== undefined ? 0.45 : 1
  ctx.strokeStyle = paint.orbitNear
  ctx.lineWidth = 1
  ctx.setLineDash([1, 3])
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.font = FONT
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.lineJoin = 'round'
  for (const mark of marks) {
    ctx.lineWidth = 1
    ctx.strokeStyle = paint.tokens.secondary
    ctx.beginPath()
    ctx.moveTo(mark.x - across.x * 2.5, mark.y - across.y * 2.5)
    ctx.lineTo(mark.x + across.x * 2.5, mark.y + across.y * 2.5)
    ctx.stroke()

    const x = (mark.box.left + mark.box.right) / 2
    ctx.lineWidth = 3
    ctx.strokeStyle = paint.tokens.surface
    ctx.strokeText(mark.text, x, mark.box.top)
    ctx.fillStyle = paint.tokens.secondary
    ctx.fillText(mark.text, x, mark.box.top)
  }
  ctx.globalAlpha = 1
}

/** Across the axis on screen, towards the viewer's side */
function getAcross(orrery: Orrery) {
  return { x: -Math.sin(orrery.tilt), y: Math.cos(orrery.tilt) }
}

/** "30 s", "5 min", "1 h": a scale reads better in words than as 5m, which could be millions */
function formatTick(seconds: number) {
  if (seconds < 60) return `${seconds} s`
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`
  return `${Math.round(seconds / 3600)} h`
}
