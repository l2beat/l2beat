/** px/s². A fall through a whole rack takes under 0.4 s */
const GRAVITY = 4200
/** Tiles leave the chute already moving, so their first frames do not crawl */
const LAUNCH_SPEED = 220
/** Seconds between the blobs of one batch */
export const DROP_STAGGER = 0.03
/** Seconds between batches, so each can be seen landing and named */
export const BATCH_STAGGER = 0.18
/** Seconds, roughly, from the chute to the rack */
export const LAND_AFTER = 0.35
const APPEAR_TIME = 0.06
const SQUASH_TIME = 0.12
const SQUASH = 0.15

const LABEL_LIFE = 3.5
const LABEL_IN = 0.16
const LABEL_OUT = 0.5
const LABEL_RISE = 10

/** Its tiles land and the bay's glow settles well within the life of its label */
export const BATCH_MOTION_TIME = LABEL_LIFE

/** Long enough for any batch to drop, land and have its label fade */
export const SETTLE_TIME = 8

const REVEAL_TIME = 0.4

/** Relative to where the tile comes to rest */
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

/** Writes into a reused object, as this runs for every moving tile on every frame */
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

export function fallDuration(distance: number): number {
  const d = Math.max(0, distance)
  return (
    (-LAUNCH_SPEED + Math.sqrt(LAUNCH_SPEED ** 2 + 2 * GRAVITY * d)) / GRAVITY
  )
}

export function labelPresence(age: number): { alpha: number; rise: number } {
  if (age < 0 || age > LABEL_LIFE) return { alpha: 0, rise: 0 }
  const fadeIn = easeOutCubic(Math.min(1, age / LABEL_IN))
  const fadeOut = Math.min(1, (LABEL_LIFE - age) / LABEL_OUT)
  return {
    alpha: fadeIn * fadeOut,
    rise: LABEL_RISE * easeOutCubic(age / LABEL_LIFE),
  }
}

/** 1 (fully in) before any blocks come */
export function revealed(revealedAt: number | undefined, now: number) {
  if (revealedAt === undefined) return 1
  return easeOutCubic(Math.min(1, Math.max(0, now - revealedAt) / REVEAL_TIME))
}

export function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2
}

export function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}
