import {
  easeOutCubic,
  type Frame,
  fillDisc,
  isDimmed,
  strokeOrbit,
} from './drawing'
import { type Orrery, TAU, toScreen } from './orrery'
import { DOT_STAGGER, RIPPLE_DURATION, travelTime } from './simulation'

const TAIL_SAMPLES = 4
/** Seconds between the points of a tail, which looks back that far times the samples */
const TAIL_STEP = 0.016

/**
 * Every batch leaves its planet as a string of dots, one per blob, and falls
 * into Ethereum. Each blob leaves where the planet is at the time, at its
 * speed, and is pulled in faster and faster: fast inner planets fling theirs
 * in wide arcs, slow outer ones drop theirs nearly straight in.
 */
export function drawComets(ctx: CanvasRenderingContext2D, frame: Frame) {
  const { orrery, sim, paint, focus } = frame
  const dotRadius = orrery.compact ? 1.7 : 2.2
  // on the dark card a blob gives off a little light; on the light one it would only blur
  const glows = paint.tokens.isDark
  ctx.lineCap = 'round'
  for (const comet of sim.comets) {
    const planet = orrery.planets[comet.posterIndex]
    const color = paint.colors[comet.posterIndex]
    if (!planet || !color || isDimmed(focus, comet.posterIndex)) continue
    const flight = travelTime(orrery, planet.orbit)
    ctx.strokeStyle = color
    ctx.fillStyle = color

    for (let i = comet.landed; i < comet.blobs; i++) {
      const age = sim.time - comet.firedAt - i * DOT_STAGGER
      if (age <= 0) continue
      const path = getCometPath(
        planet.orbit,
        comet.angle + i * comet.angleStep,
        comet.bend,
      )
      const head = pointOnPath(orrery, path, Math.min(1, age / flight))
      let previous = head
      for (let k = 1; k <= TAIL_SAMPLES; k++) {
        const fade = 1 - k / (TAIL_SAMPLES + 1)
        const point = pointOnPath(
          orrery,
          path,
          Math.max(0, age - k * TAIL_STEP) / flight,
        )
        ctx.globalAlpha = 0.4 * fade
        ctx.lineWidth = dotRadius * 1.6 * fade
        ctx.beginPath()
        ctx.moveTo(previous.x, previous.y)
        ctx.lineTo(point.x, point.y)
        ctx.stroke()
        previous = point
      }
      if (glows) {
        ctx.globalAlpha = 0.16
        fillDisc(ctx, head.x, head.y, dotRadius * 2.6)
      }
      ctx.globalAlpha = 1
      fillDisc(ctx, head.x, head.y, dotRadius)
    }
  }
  ctx.globalAlpha = 1
}

/**
 * A ring spreading over the plane where a batch lands. Its far half goes
 * behind Ethereum and its near half in front, so it is drawn in two.
 */
export function drawRipples(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  half: 'far' | 'near',
) {
  const { orrery, sim, paint, focus } = frame
  const growth = orrery.compact ? 26 : 42
  const [from, to] = half === 'far' ? [Math.PI, TAU] : [0, Math.PI]
  ctx.lineWidth = 1.25
  for (const ripple of sim.ripples) {
    const color = paint.colors[ripple.posterIndex]
    if (!color || isDimmed(focus, ripple.posterIndex)) continue
    const progress = (sim.time - ripple.startedAt) / RIPPLE_DURATION
    if (progress < 0 || progress >= 1) continue
    // a larger batch lands harder
    const strength = Math.min(1, 0.35 + 0.13 * ripple.blobs)
    ctx.globalAlpha = 0.38 * strength * (1 - progress) * (1 - progress)
    ctx.strokeStyle = color
    strokeOrbit(
      ctx,
      orrery,
      orrery.sun.radius * 1.05 + growth * easeOutCubic(progress),
      from,
      to,
    )
  }
  ctx.globalAlpha = 1
}

/** A quadratic curve on the plane, from the planet through a bend to Ethereum */
interface CometPath {
  fromU: number
  fromV: number
  bendU: number
  bendV: number
}

function getCometPath(orbit: number, angle: number, bend: number): CometPath {
  const fromU = orbit * Math.cos(angle)
  const fromV = orbit * Math.sin(angle)
  // the way the planet was going, as its angle falls over time
  const aheadU = Math.sin(angle)
  const aheadV = -Math.cos(angle)
  return {
    fromU,
    fromV,
    bendU: fromU + aheadU * orbit * bend,
    bendV: fromV + aheadV * orbit * bend,
  }
}

/**
 * Ethereum is the curve's end, at 0, 0 on the plane. Gone through at an even
 * pace, the curve speeds up towards its end by itself, as a fall would.
 */
function pointOnPath(orrery: Orrery, path: CometPath, s: number) {
  const fromWeight = (1 - s) * (1 - s)
  const bendWeight = 2 * (1 - s) * s
  return toScreen(
    orrery,
    fromWeight * path.fromU + bendWeight * path.bendU,
    fromWeight * path.fromV + bendWeight * path.bendV,
  )
}
