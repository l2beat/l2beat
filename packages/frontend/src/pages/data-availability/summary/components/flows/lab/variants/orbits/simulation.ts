import { forEachBatchBetween, type LabBatch } from '../../schedule'
import { type Orrery, planetAngle, TAU } from './orrery'

/**
 * Seconds between the blobs of one batch setting off: a string of beads far
 * enough apart to count, as each dot is a blob
 */
export const DOT_STAGGER = 0.075
export const RIPPLE_DURATION = 1.6
export const FLASH_DURATION = 0.5

/**
 * Playback seconds per second while a planet is under the pointer: time all
 * but stops, so the planet stays put to be read, yet still drifts
 */
const HOVER_SPEED = 0.5
/** Seconds to ease into a new speed or out of the hover slowdown */
const SPEED_EASING = 0.35
const SLOWDOWN_EASING = 0.12
/** How much each landed blob adds to Ethereum's glow, and how fast it fades */
const GLOW_PER_BLOB = 0.07
const GLOW_FADE = 0.9
/** Comets in flight at most, so a long stall cannot pile up thousands */
const MAX_COMETS = 240
/**
 * The furthest a comet's curve first heads out, in orbit radii. At high
 * speed the innermost planets would fling theirs off the drawing
 */
const MAX_BEND = 1.2

export interface Simulation {
  /** Playback clock: seconds into the replayed day, past its end once it loops */
  clock: number
  /** Seconds of animation. Slows down with the clock while a planet is hovered */
  time: number
  /** Playback seconds per second now, easing towards the speed picked */
  speed: number
  /** 1, or less while a planet is hovered */
  pace: number
  comets: Comet[]
  ripples: Ripple[]
  /** Extra glow of Ethereum from blobs that just landed, 0 to 1 */
  glow: number
  /** `time` each poster last sent a batch, to flash its planet */
  firedAt: Float64Array
}

/** A batch on its way in, one dot per blob */
export interface Comet {
  posterIndex: number
  blobs: number
  /** Where its planet was on its orbit as the first blob left */
  angle: number
  /** How much further on the planet is as each next blob leaves */
  angleStep: number
  /**
   * How far ahead the curve first heads, in orbit radii: half of what the
   * planet covers in the flight, so a blob leaves at the planet's own speed
   * and peels off its orbit, rather than lagging behind it
   */
  bend: number
  /** `time` the batch left */
  firedAt: number
  /** Blobs that reached Ethereum already */
  landed: number
}

/** A ring spreading on the plane from Ethereum where a batch landed */
export interface Ripple {
  posterIndex: number
  blobs: number
  startedAt: number
}

export function createSimulation(
  posterCount: number,
  clock: number,
  speed: number,
): Simulation {
  return {
    clock,
    time: 0,
    speed,
    pace: 1,
    comets: [],
    ripples: [],
    glow: 0,
    firedAt: new Float64Array(posterCount).fill(Number.NEGATIVE_INFINITY),
  }
}

/**
 * Moves everything on by `dt` seconds: the clock, the comets of the batches
 * sent meanwhile, and what is left of the ones that landed.
 */
export function advanceSimulation(
  sim: Simulation,
  dt: number,
  {
    batches,
    orrery,
    speed,
    isHovering,
  }: {
    batches: LabBatch[]
    orrery: Orrery
    speed: number
    isHovering: boolean
  },
) {
  if (dt <= 0) return
  sim.speed += (speed - sim.speed) * easeTowards(dt, SPEED_EASING)
  const pace = isHovering ? HOVER_SPEED / sim.speed : 1
  sim.pace += (pace - sim.pace) * easeTowards(dt, SLOWDOWN_EASING)

  const step = dt * sim.pace
  const from = sim.clock
  sim.clock += step * sim.speed
  sim.time += step
  launchBatchesSince(sim, from, batches, orrery)
  landComets(sim, orrery)
  sim.glow *= Math.exp(-step / GLOW_FADE)
}

/** A comet for every batch sent from `from` to now on the playback clock */
function launchBatchesSince(
  sim: Simulation,
  from: number,
  batches: LabBatch[],
  orrery: Orrery,
) {
  forEachBatchBetween(batches, from, sim.clock, (batch, at) => {
    const planet = orrery.planets[batch.posterIndex]
    if (!planet) return
    // sent part way through the frame, so already that far along
    const firedAt = sim.time - (sim.clock - at) / sim.speed
    const turnRate = (TAU * sim.speed) / planet.poster.cadence.interval
    sim.comets.push({
      posterIndex: batch.posterIndex,
      blobs: batch.blobs,
      angle: planetAngle(planet, at),
      angleStep: -turnRate * DOT_STAGGER,
      bend: Math.min(
        MAX_BEND,
        (turnRate * travelTime(orrery, planet.orbit)) / 2,
      ),
      firedAt,
      landed: 0,
    })
    sim.firedAt[batch.posterIndex] = firedAt
  })
  if (sim.comets.length > MAX_COMETS) {
    sim.comets.splice(0, sim.comets.length - MAX_COMETS)
  }
}

/**
 * Counts the blobs that reached Ethereum: the first of a batch sets off a
 * ripple, and each one makes Ethereum glow a little brighter
 */
function landComets(sim: Simulation, orrery: Orrery) {
  for (const comet of sim.comets) {
    const planet = orrery.planets[comet.posterIndex]
    if (!planet) continue
    const flight = travelTime(orrery, planet.orbit)
    const sinceFirstLanded = sim.time - comet.firedAt - flight
    const landed = Math.min(
      comet.blobs,
      Math.max(0, Math.floor(sinceFirstLanded / DOT_STAGGER) + 1),
    )
    if (landed === comet.landed) continue
    if (comet.landed === 0) {
      sim.ripples.push({
        posterIndex: comet.posterIndex,
        blobs: comet.blobs,
        startedAt: comet.firedAt + flight,
      })
    }
    sim.glow = Math.min(1, sim.glow + (landed - comet.landed) * GLOW_PER_BLOB)
    comet.landed = landed
  }
  sim.comets = sim.comets.filter((comet) => comet.landed < comet.blobs)
  sim.ripples = sim.ripples.filter(
    (ripple) => sim.time - ripple.startedAt < RIPPLE_DURATION,
  )
}

/** Seconds a blob takes to fall in: longer from farther out */
export function travelTime(orrery: Orrery, orbit: number): number {
  const span = orrery.outerOrbit - orrery.innerOrbit
  const reach = span > 0 ? (orbit - orrery.innerOrbit) / span : 0
  return 0.9 + 0.5 * reach
}

/** Share of the way to `target` to cover in `dt`, for an easing that takes about `seconds` */
function easeTowards(dt: number, seconds: number) {
  return 1 - Math.exp(-dt / (seconds / 3))
}
