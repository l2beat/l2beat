import { toRgba } from '../../color'
import { mulberry32 } from '../../schedule'
import { drawComets, drawRipples } from './drawComets'
import {
  easeOutCubic,
  type Frame,
  fillDisc,
  isDimmed,
  type Star,
  strokeOrbit,
} from './drawing'
import { drawNames } from './names'
import { isInsideOrbit, type Orrery, type PlacedPlanet, TAU } from './orrery'
import { drawScale, placeScaleMarks } from './scale'
import { FLASH_DURATION } from './simulation'

const DIMMED_ALPHA = 0.2
/** The far side of an orbit is this much hazier, so the plane reads as one */
const FAR_HAZE = 0.32

/**
 * Draws a frame back to front, as seen from above the plane: the orbits,
 * planets behind Ethereum, the comets falling in, Ethereum, then the planets
 * in front of it and last their names.
 */
export function drawOrrery(ctx: CanvasRenderingContext2D, frame: Frame) {
  const { orrery, paint, placed, isMoving } = frame
  ctx.clearRect(0, 0, orrery.width, orrery.height)
  if (paint.tokens.isDark) drawNightSky(ctx, frame)
  drawOrbits(ctx, frame)
  const scaleMarks = placeScaleMarks(ctx, orrery)
  drawScale(ctx, frame, scaleMarks)
  if (isMoving) drawTrails(ctx, frame)

  const byNearness = placed.toSorted((a, b) => a.nearness - b.nearness)
  for (const planet of byNearness) {
    if (planet.nearness < 0) drawPlanet(ctx, frame, planet)
  }
  if (isMoving) {
    drawComets(ctx, frame)
    drawRipples(ctx, frame, 'far')
  }
  drawSun(ctx, frame)
  if (isMoving) drawRipples(ctx, frame, 'near')
  for (const planet of byNearness) {
    if (planet.nearness >= 0) drawPlanet(ctx, frame, planet)
  }
  drawNames(ctx, frame, scaleMarks)
}

/** A few faint stars in the dark, kept off the orbits, where a star could pass for a planet */
export function scatterStars(orrery: Orrery, count = 28): Star[] {
  const random = mulberry32(1559)
  const stars: Star[] = []
  for (let tries = 0; stars.length < count && tries < count * 30; tries++) {
    const x = random() * orrery.width
    const y = random() * orrery.height
    const radius = 0.5 + random() * 0.55
    const alpha = 0.12 + random() * 0.26
    if (isInsideOrbit(orrery, x, y, orrery.outerOrbit + 24)) continue
    stars.push({ x, y, radius, alpha })
  }
  return stars
}

function drawNightSky(ctx: CanvasRenderingContext2D, frame: Frame) {
  const { orrery, paint, stars } = frame
  // an ellipse filling the drawing, clear at its edges, so no box shows
  ctx.save()
  ctx.translate(orrery.sun.x, orrery.sun.y)
  ctx.scale(orrery.width / 2, orrery.height / 2)
  const light = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
  light.addColorStop(0, toRgba(paint.sunColor, 0.075))
  light.addColorStop(0.55, toRgba(paint.sunColor, 0.025))
  light.addColorStop(1, toRgba(paint.sunColor, 0))
  ctx.fillStyle = light
  ctx.fillRect(-1, -1, 2, 2)
  ctx.restore()

  ctx.fillStyle = paint.tokens.primary
  for (const star of stars) {
    ctx.globalAlpha = star.alpha
    fillDisc(ctx, star.x, star.y, star.radius)
  }
  ctx.globalAlpha = 1
}

/** Fine lines, lighter on the far side; the orbit of the poster in focus in its color */
function drawOrbits(ctx: CanvasRenderingContext2D, frame: Frame) {
  const { orrery, paint, focus } = frame
  ctx.lineWidth = 1
  ctx.globalAlpha = focus.highlighted !== undefined ? 0.45 : 1
  for (const lane of orrery.lanes) {
    ctx.strokeStyle = lane.isNamed ? paint.orbitFar : paint.tailOrbitFar
    strokeOrbit(ctx, orrery, lane.orbit, Math.PI, TAU)
    ctx.strokeStyle = lane.isNamed ? paint.orbitNear : paint.tailOrbitNear
    strokeOrbit(ctx, orrery, lane.orbit, 0, Math.PI)
  }

  for (const index of new Set([focus.highlighted, focus.hovered])) {
    const planet = index !== undefined ? orrery.planets[index] : undefined
    const color = index !== undefined ? paint.colors[index] : undefined
    if (!planet || !color) continue
    ctx.lineWidth = 1.25
    ctx.strokeStyle = color
    ctx.globalAlpha = 0.5
    strokeOrbit(ctx, orrery, planet.orbit, Math.PI, TAU)
    ctx.globalAlpha = 0.95
    strokeOrbit(ctx, orrery, planet.orbit, 0, Math.PI)
  }
  ctx.globalAlpha = 1
}

/** Playback seconds a trail looks back */
const TRAIL_SECONDS = 0.5
const TRAIL_MAX_SWEEP = Math.PI * 0.75
const TRAIL_STEPS = 12

/**
 * A fading arc behind each planet, where it was a moment ago, as on a long
 * exposure. Its length is the planet's speed, so the trails alone tell the
 * busy posters from the slow ones.
 */
function drawTrails(ctx: CanvasRenderingContext2D, frame: Frame) {
  const { orrery, sim, paint, placed, focus } = frame
  ctx.lineCap = 'butt'
  for (const placedPlanet of placed) {
    const planet = orrery.planets[placedPlanet.index]
    const color = paint.colors[placedPlanet.index]
    if (!planet || !color || isDimmed(focus, placedPlanet.index)) continue
    const sweep = Math.min(
      TRAIL_MAX_SWEEP,
      (TAU * TRAIL_SECONDS * sim.speed) / planet.poster.cadence.interval,
    )
    if (sweep * planet.orbit < 4) continue

    ctx.strokeStyle = color
    ctx.lineWidth = Math.min(2.5, Math.max(1, planet.radius * 0.28))
    const step = sweep / TRAIL_STEPS
    for (let i = 0; i < TRAIL_STEPS; i++) {
      const fade = 1 - i / TRAIL_STEPS
      ctx.globalAlpha = 0.55 * fade * fade
      const start = placedPlanet.angle + i * step
      strokeOrbit(ctx, orrery, planet.orbit, start, start + step)
    }
  }
  ctx.globalAlpha = 1
}

function drawPlanet(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  placed: PlacedPlanet,
) {
  const { orrery, paint, sim, focus } = frame
  const planet = orrery.planets[placed.index]
  const color = paint.colors[placed.index]
  if (!planet || !color) return
  const { x, y, radius } = placed
  const icon = planet.showsIcon ? paint.icons[placed.index] : undefined
  ctx.globalAlpha = isDimmed(focus, placed.index) ? DIMMED_ALPHA : 1

  // a rim of the card's color, so orbit lines stop short of the planet
  ctx.fillStyle = paint.tokens.surface
  fillDisc(ctx, x, y, radius + 1)
  if (icon) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, TAU)
    ctx.clip()
    ctx.fillStyle = paint.iconBackdrop
    ctx.fill()
    ctx.drawImage(icon, x - radius, y - radius, radius * 2, radius * 2)
    ctx.restore()
    ctx.strokeStyle = toRgba(color, 0.45)
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(x, y, radius - 0.5, 0, TAU)
    ctx.stroke()
  } else {
    ctx.fillStyle = color
    fillDisc(ctx, x, y, radius)
  }

  const haze = ((1 - placed.depth) / 2) * FAR_HAZE + (icon ? paint.iconHaze : 0)
  if (haze > 0.01) {
    ctx.fillStyle = toRgba(paint.tokens.surface, haze)
    fillDisc(ctx, x, y, radius + 0.5)
  }

  if (focus.hovered === placed.index || focus.highlighted === placed.index) {
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(x, y, radius + 3.5, 0, TAU)
    ctx.stroke()
  }

  // a ring goes out from a planet as it sends a batch
  const sinceFired =
    (sim.time - (sim.firedAt[placed.index] ?? 0)) / FLASH_DURATION
  if (frame.isMoving && sinceFired >= 0 && sinceFired < 1) {
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.globalAlpha *= 0.6 * (1 - sinceFired)
    ctx.beginPath()
    ctx.arc(x, y, radius + 2 + 7 * easeOutCubic(sinceFired), 0, TAU)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

/** Ethereum, lit from within, its glow brightening with every blob that lands */
function drawSun(ctx: CanvasRenderingContext2D, frame: Frame) {
  const { orrery, paint, sim } = frame
  const { x, y, radius } = orrery.sun
  const isDark = paint.tokens.isDark
  const reach = radius * (3 + 0.9 * sim.glow)
  const halo = ctx.createRadialGradient(x, y, radius * 0.8, x, y, reach)
  halo.addColorStop(
    0,
    toRgba(paint.sunColor, (isDark ? 0.42 : 0.24) + 0.24 * sim.glow),
  )
  halo.addColorStop(
    0.4,
    toRgba(paint.sunColor, (isDark ? 0.12 : 0.08) + 0.08 * sim.glow),
  )
  halo.addColorStop(1, toRgba(paint.sunColor, 0))
  ctx.fillStyle = halo
  fillDisc(ctx, x, y, reach)

  const disc = ctx.createRadialGradient(
    x - radius * 0.25,
    y - radius * 0.3,
    0,
    x,
    y,
    radius,
  )
  disc.addColorStop(0, paint.sunCore)
  disc.addColorStop(1, paint.sunRim)
  ctx.fillStyle = disc
  fillDisc(ctx, x, y, radius)
  ctx.strokeStyle = toRgba(paint.sunColor, 0.6)
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(x, y, radius - 0.5, 0, TAU)
  ctx.stroke()
  if (paint.sunIcon) {
    const size = radius * 1.3
    ctx.drawImage(paint.sunIcon, x - size / 2, y - size / 2, size, size)
  }
}
