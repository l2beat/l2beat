import type { ThemeTokens } from '~/hooks/useThemeTokens'
import { alpha } from './canvasColor'

/**
 * A turning drum that tumbles the pool's coins, like a washing machine. The
 * physics works in drum units: the centre is (0, 0) and the wall is at 1.
 */

/** Radians a second; positive turns clockwise on screen. */
const SPIN = 1.8
/** Drum radii a second squared. */
const GRAVITY = 7.5
const COIN_RADIUS = 0.05
const WALL_BOUNCE = 0.35
const COIN_BOUNCE = 0.6
/** How much of the wall's speed a touching coin picks up each substep. */
const GRIP = 0.3
const SUBSTEPS = 3

export interface DrumCoin {
  x: number
  y: number
  vx: number
  vy: number
}

export interface DrumShape {
  x: number
  y: number
  r: number
}

/** A coin dropped in near the top of the drum. */
export function dropCoin(): DrumCoin {
  return {
    x: (Math.random() - 0.5) * 0.2,
    y: -0.75,
    vx: (Math.random() - 0.5) * 0.6,
    vy: 0,
  }
}

export function tumble(coins: DrumCoin[], dt: number) {
  const h = dt / SUBSTEPS
  const limit = 1 - COIN_RADIUS - 0.04
  for (let step = 0; step < SUBSTEPS; step++) {
    for (const c of coins) {
      c.vy += GRAVITY * h
      c.x += c.vx * h
      c.y += c.vy * h
      const d = Math.hypot(c.x, c.y)
      if (d <= limit) continue
      const nx = c.x / d
      const ny = c.y / d
      c.x = nx * limit
      c.y = ny * limit
      const out = c.vx * nx + c.vy * ny
      if (out > 0) {
        c.vx -= (1 + WALL_BOUNCE) * out * nx
        c.vy -= (1 + WALL_BOUNCE) * out * ny
      }
      // The wall drags the coin round, up the side until it falls off.
      const slip = SPIN - (c.vx * -ny + c.vy * nx)
      c.vx += slip * GRIP * -ny
      c.vy += slip * GRIP * nx
    }
    for (const [i, a] of coins.entries()) {
      for (const b of coins.slice(i + 1)) collide(a, b)
    }
  }
}

function collide(a: DrumCoin, b: DrumCoin) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const d = Math.hypot(dx, dy)
  if (d === 0 || d >= COIN_RADIUS * 2) return
  const nx = dx / d
  const ny = dy / d
  const overlap = (COIN_RADIUS * 2 - d) / 2
  a.x -= nx * overlap
  a.y -= ny * overlap
  b.x += nx * overlap
  b.y += ny * overlap
  const closing = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
  if (closing >= 0) return
  const push = (-(1 + COIN_BOUNCE) * closing) / 2
  a.vx -= push * nx
  a.vy -= push * ny
  b.vx += push * nx
  b.vy += push * ny
}

export function drumPoint(shape: DrumShape, coin: DrumCoin) {
  return { x: shape.x + coin.x * shape.r, y: shape.y + coin.y * shape.r }
}

/** The drum's body, behind the coins; `time` turns its holes and paddles. */
export function drawDrum(
  ctx: CanvasRenderingContext2D,
  shape: DrumShape,
  time: number,
  tokens: ThemeTokens,
) {
  const { x, y, r } = shape
  const turn = time * SPIN
  const at = (radius: number, angle: number) => ({
    x: x + Math.cos(angle) * radius,
    y: y + Math.sin(angle) * radius,
  })
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = alpha(tokens.secondary, tokens.isDark ? 0.12 : 0.07)
  ctx.fill()
  ctx.lineWidth = 5
  ctx.strokeStyle = tokens.divider
  ctx.stroke()

  ctx.fillStyle = alpha(tokens.secondary, 0.3)
  for (let i = 0; i < 28; i++) {
    const hole = at(r - 7, turn + (i * Math.PI * 2) / 28)
    ctx.beginPath()
    ctx.arc(hole.x, hole.y, 1.3, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.fillStyle = alpha(tokens.secondary, 0.2)
  const halfWidth = 9 / r
  for (let k = 0; k < 3; k++) {
    const angle = turn + (k * Math.PI * 2) / 3
    const corners = [
      at(r - 2, angle - halfWidth),
      at(r - 16, angle),
      at(r - 2, angle + halfWidth),
    ]
    ctx.beginPath()
    for (const p of corners) ctx.lineTo(p.x, p.y)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
}

/** A glint on the drum's glass, in front of the coins. */
export function drawDrumGlare(
  ctx: CanvasRenderingContext2D,
  shape: DrumShape,
  tokens: ThemeTokens,
) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(shape.x, shape.y, shape.r - 10, Math.PI * 1.05, Math.PI * 1.45)
  ctx.strokeStyle = alpha('#ffffff', tokens.isDark ? 0.12 : 0.8)
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.stroke()
  ctx.restore()
}
