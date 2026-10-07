/** Pull on a falling tile, in px/s². A fall through a whole rack takes under 0.4 s */
const GRAVITY = 4200
/** Tiles leave the chute already moving, so their first frames do not crawl */
const LAUNCH_SPEED = 220
/** The blobs of one batch drop one after another, this many seconds apart */
export const DROP_STAGGER = 0.03
/**
 * A block comes in whole, but its batches drop one after another, this many
 * seconds apart, so each can be seen landing and named
 */
export const BATCH_STAGGER = 0.18
/** About how long a tile takes from the chute to the rack */
export const LAND_AFTER = 0.35
const APPEAR_TIME = 0.06
const SQUASH_TIME = 0.12
const SQUASH = 0.15

/** How long a batch's "+5 Base Chain" stays up, from when it starts to drop */
const LABEL_LIFE = 3.5
const LABEL_IN = 0.16
const LABEL_OUT = 0.5
const LABEL_RISE = 10

/**
 * How long a batch moves from when it starts to drop: its tiles land and the
 * bay's glow settles well within the life of its label
 */
export const BATCH_MOTION_TIME = LABEL_LIFE

/** Long enough for any batch to drop, land and have its label fade */
export const SETTLE_TIME = 8

/** Opacity of other posters' tiles while one poster is highlighted */
const DIMMED = 0.15
/**
 * Seconds tiles take to dim or light up two thirds of the way as a poster is
 * picked. Eased frame by frame, so a pick midway carries on from where they are
 */
const EMPHASIS_TIME = 0.06
/** Close enough to rest on, so the belt can stop painting */
const EMPHASIS_REST = 0.002
/** Seconds the first blocks take to fade in, rather than pop up */
const REVEAL_TIME = 0.4

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

/**
 * Moves every poster's emphasis `dt` seconds toward what the highlight asks:
 * full for the highlighted poster, or for all when none is. An infinite `dt`
 * puts them there at once.
 */
export function easeEmphasis(
  emphasis: number[],
  posterCount: number,
  highlighted: number | undefined,
  dt: number,
) {
  const step = 1 - Math.exp(-dt / EMPHASIS_TIME)
  emphasis.length = posterCount
  for (let i = 0; i < posterCount; i++) {
    const target = emphasisFor(i, highlighted)
    const next = (emphasis[i] ?? target) * (1 - step) + target * step
    emphasis[i] = Math.abs(target - next) < EMPHASIS_REST ? target : next
  }
}

/** Whether every poster's emphasis is where the highlight asks */
export function isEmphasisSettled(
  emphasis: number[],
  highlighted: number | undefined,
) {
  return emphasis.every((value, i) => value === emphasisFor(i, highlighted))
}

function emphasisFor(posterIndex: number, highlighted: number | undefined) {
  return highlighted === undefined || highlighted === posterIndex ? 1 : DIMMED
}

/** How far a poster's labels show, 0 once its tiles are dimmed */
export function labelEmphasis(emphasis: number) {
  return Math.max(0, (emphasis - DIMMED) / (1 - DIMMED))
}

/** How far the first blocks have faded in, at `now`; all the way before any come */
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
