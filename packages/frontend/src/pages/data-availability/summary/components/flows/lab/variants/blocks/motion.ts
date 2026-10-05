/** Pull on a falling tile, in px/s². A fall through a whole rack takes under 0.4 s */
const GRAVITY = 4200
/** Tiles leave the chute already moving, so their first frames do not crawl */
const LAUNCH_SPEED = 220
/** The blobs of one batch drop one after another, this many seconds apart */
export const DROP_STAGGER = 0.03
const APPEAR_TIME = 0.06
const SQUASH_TIME = 0.12
const SQUASH = 0.15

/** How long a batch's "+5 Base Chain" stays up, from when it starts to drop */
export const LABEL_LIFE = 1.5
const LABEL_IN = 0.16
const LABEL_OUT = 0.5
const LABEL_RISE = 10

/** Long enough for any batch to drop, land and have its label fade */
export const SETTLE_TIME = 3

/** Where a tile is in its drop, relative to where it comes to rest */
export interface TileMotion {
  visible: boolean
  landed: boolean
  offsetY: number
  scaleX: number
  scaleY: number
  alpha: number
}

export function restingMotion(): TileMotion {
  return {
    visible: true,
    landed: true,
    offsetY: 0,
    scaleX: 1,
    scaleY: 1,
    alpha: 1,
  }
}

/**
 * Fills `motion` for a tile `age` seconds after it was let go `fall` px above
 * its place: it falls under gravity, then lands with a small squash. Written
 * into a reused object, as this runs for every moving tile on every frame.
 */
export function moveTile(motion: TileMotion, age: number, fall: number) {
  motion.visible = age >= 0
  const landsAt = fallDuration(fall)
  if (age < landsAt) {
    motion.landed = false
    motion.offsetY = Math.min(
      0,
      -fall + LAUNCH_SPEED * Math.max(0, age) + (GRAVITY * age * age) / 2,
    )
    motion.scaleX = 1
    motion.scaleY = 1
    motion.alpha = Math.min(1, Math.max(0, age) / APPEAR_TIME)
    return
  }
  const squash = 1 - easeOutCubic(Math.min(1, (age - landsAt) / SQUASH_TIME))
  motion.landed = true
  motion.offsetY = 0
  motion.scaleX = 1 + (SQUASH / 2) * squash
  motion.scaleY = 1 - SQUASH * squash
  motion.alpha = 1
}

/** Seconds a tile takes to fall `distance` px from the chute */
export function fallDuration(distance: number): number {
  const d = Math.max(0, distance)
  return (
    (-LAUNCH_SPEED + Math.sqrt(LAUNCH_SPEED ** 2 + 2 * GRAVITY * d)) / GRAVITY
  )
}

/** How a batch's label shows `age` seconds after it came: opacity and rise */
export function labelPresence(age: number): { alpha: number; rise: number } {
  if (age < 0 || age > LABEL_LIFE) return { alpha: 0, rise: 0 }
  const fadeIn = easeOutCubic(Math.min(1, age / LABEL_IN))
  const fadeOut = Math.min(1, (LABEL_LIFE - age) / LABEL_OUT)
  return {
    alpha: fadeIn * fadeOut,
    rise: LABEL_RISE * easeOutCubic(age / LABEL_LIFE),
  }
}

/** Eases `current` towards `target`, quicker to stop than to start again */
export function approach(current: number, target: number, dt: number) {
  const rate = target < current ? 14 : 4
  return current + (target - current) * (1 - Math.exp(-rate * dt))
}

export function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

export function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}
