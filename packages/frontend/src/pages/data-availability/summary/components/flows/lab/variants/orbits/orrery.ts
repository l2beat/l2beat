import type { LabPoster } from '../../model'
import { mulberry32 } from '../../schedule'

export const TAU = Math.PI * 2

/**
 * Where everything sits in a drawing of a given size. Orbits are circles on a
 * plane seen from above at a slant, so on screen they are flat ellipses
 * around Ethereum.
 */
export interface Orrery {
  width: number
  height: number
  sun: { x: number; y: number; radius: number }
  /** Height of an orbit on screen over its width: how slanted the plane is */
  squash: number
  /** Turn of the plane on screen, in radians */
  tilt: number
  innerOrbit: number
  outerOrbit: number
  planets: Planet[]
  /** The orbits drawn. Posters with all but the same cadence share one */
  lanes: Lane[]
  /** Marks along the plane that tell how often a poster on that orbit sends a batch */
  ticks: Tick[]
  /** Laid out for a phone */
  compact: boolean
}

export interface Planet {
  poster: LabPoster
  /** Radius of its orbit on the plane */
  orbit: number
  /** On the near side of its orbit. Farther away it shrinks a little */
  radius: number
  /** Where on its orbit it is when the day starts, in radians */
  phase: number
  showsIcon: boolean
  /** Its name stays beside it, not only on hover */
  isNamed: boolean
}

export interface Lane {
  orbit: number
  /** One of the posters named on the drawing goes round it, so it is drawn darker */
  isNamed: boolean
}

export interface Tick {
  orbit: number
  /** Seconds between batches there */
  interval: number
}

/** A planet where it is now */
export interface PlacedPlanet {
  index: number
  x: number
  y: number
  /** On screen, after perspective */
  radius: number
  angle: number
  /** -1 on the far side of its orbit, 1 on the near side */
  depth: number
  /** How far towards the viewer it is on the plane. Nearer planets cover farther ones */
  nearness: number
}

interface Metrics {
  /** Height of an orbit on screen over its width */
  squash: number
  sunRadius: number
  planetMaxRadius: number
  planetMinRadius: number
  /** Planets at least this large show the project's icon */
  iconMinRadius: number
  namedCount: number
  /** Room around the outermost orbit, for its planets and their hover rings */
  margin: number
  /** The innermost orbit, in radii of Ethereum, so its planet clears Ethereum */
  innerOrbitInSuns: number
  /** Marks on the cadence scale come at least this far apart, or there are none */
  tickGap: number | undefined
}

const WIDE: Metrics = {
  // seen from about 35° above the plane: flat enough to read as depth
  squash: 0.56,
  sunRadius: 21,
  planetMaxRadius: 18,
  planetMinRadius: 3,
  iconMinRadius: 6,
  namedCount: 8,
  margin: 18,
  innerOrbitInSuns: 4,
  tickGap: 34,
}

// A phone is narrow, so the plane is seen from higher up to fill its height
const COMPACT: Metrics = {
  squash: 0.62,
  sunRadius: 16,
  planetMaxRadius: 12,
  planetMinRadius: 2.5,
  iconMinRadius: 6.5,
  namedCount: 4,
  margin: 12,
  innerOrbitInSuns: 3.2,
  tickGap: undefined,
}

/** Below this width the drawing is laid out for a phone */
const COMPACT_WIDTH = 600

/** The plane is turned, as an orrery is best seen from off its axis */
const TILT = (-10 * Math.PI) / 180

/**
 * The innermost orbit is at least this share of the outermost, so the
 * busiest posters have room to pass each other
 */
const INNER_ORBIT_SHARE = 0.22

/** Orbits closer than this would draw as one thick line, so they become one */
const LANE_GAP = 1.5

/** Whatever the size, the hover target of a planet is at least this large */
const MIN_HIT_RADIUS = 10

/** Cadences worth a mark on the scale, roundest first */
const TICK_INTERVALS = [60, 3600, 300, 1800, 18000, 600, 7200, 30, 120]

export function layoutOrrery(
  posters: LabPoster[],
  width: number,
  height: number,
): Orrery {
  const compact = width < COMPACT_WIDTH
  const metrics = compact ? COMPACT : WIDE
  const outerOrbit = fitOuterOrbit(width, height, metrics)
  const innerOrbit = Math.min(
    outerOrbit,
    Math.max(
      metrics.sunRadius * metrics.innerOrbitInSuns,
      outerOrbit * INNER_ORBIT_SHARE,
    ),
  )
  const cadence = getCadenceScale(posters, innerOrbit, outerOrbit)
  const maxPosted = Math.max(1, ...posters.map((p) => p.posted))

  const orbits = shareLanes(
    posters.map((p) => cadence.toOrbit(p.cadence.interval)),
  )
  const planets = posters.map((poster, i): Planet => {
    // area for data posted, as far as the smallest stay visible
    const radius = Math.max(
      metrics.planetMinRadius,
      metrics.planetMaxRadius * Math.sqrt(poster.posted / maxPosted),
    )
    return {
      poster,
      orbit: orbits[i] ?? innerOrbit,
      radius,
      phase: hashToUnit(poster.id) * TAU,
      showsIcon:
        poster.iconUrl !== undefined && radius >= metrics.iconMinRadius,
      isNamed: poster.rank < metrics.namedCount,
    }
  })

  return {
    width,
    height,
    sun: { x: width / 2, y: height / 2, radius: metrics.sunRadius },
    squash: metrics.squash,
    tilt: TILT,
    innerOrbit,
    outerOrbit,
    planets,
    lanes: [...new Set(orbits)].map((orbit) => ({
      orbit,
      isNamed: planets.some((p) => p.isNamed && p.orbit === orbit),
    })),
    ticks:
      metrics.tickGap !== undefined ? getTicks(cadence, metrics.tickGap) : [],
    compact,
  }
}

interface CadenceScale {
  shortest: number
  longest: number
  toOrbit: (interval: number) => number
}

/**
 * The orbit is the time between batches, on a log scale: cadences run from
 * seconds to hours, and on a linear one every busy poster would crowd the
 * innermost orbit. The quickest poster circles closest, the slowest farthest.
 */
function getCadenceScale(
  posters: LabPoster[],
  innerOrbit: number,
  outerOrbit: number,
): CadenceScale {
  const intervals = posters.map((p) => p.cadence.interval)
  const shortest = Math.min(...intervals)
  const longest = Math.max(...intervals)
  const span = Math.log(longest / shortest)
  return {
    shortest,
    longest,
    toOrbit: (interval) =>
      span > 0
        ? innerOrbit +
          ((outerOrbit - innerOrbit) * Math.log(interval / shortest)) / span
        : (innerOrbit + outerOrbit) / 2,
  }
}

/** The roundest cadences on the scale that keep their marks apart */
function getTicks(cadence: CadenceScale, gap: number): Tick[] {
  const ticks: Tick[] = []
  for (const interval of TICK_INTERVALS) {
    if (interval < cadence.shortest || interval > cadence.longest) continue
    const orbit = cadence.toOrbit(interval)
    if (ticks.every((t) => Math.abs(t.orbit - orbit) >= gap)) {
      ticks.push({ orbit, interval })
    }
  }
  return ticks.sort((a, b) => a.orbit - b.orbit)
}

/** The largest orbit that fits, once slanted and turned */
function fitOuterOrbit(width: number, height: number, metrics: Metrics) {
  const cos = Math.cos(TILT)
  const sin = Math.sin(TILT)
  const halfWidth = Math.hypot(cos, metrics.squash * sin)
  const halfHeight = Math.hypot(sin, metrics.squash * cos)
  return Math.max(
    0,
    Math.min(
      (width / 2 - metrics.margin) / halfWidth,
      (height / 2 - metrics.margin) / halfHeight,
    ),
  )
}

/** Orbits all but the same become one lane, drawn as one line rather than a thick one */
function shareLanes(orbits: number[]): number[] {
  const laneOf = new Map<number, number>()
  let lane: number | undefined
  for (const orbit of orbits.toSorted((a, b) => a - b)) {
    if (lane === undefined || orbit - lane >= LANE_GAP) lane = orbit
    laneOf.set(orbit, lane)
  }
  return orbits.map((orbit) => laneOf.get(orbit) ?? orbit)
}

/**
 * Where a planet is at `clock`, in radians. It goes once around per batch it
 * sends on average, the way the planets go round the Sun: anticlockwise as
 * seen from above.
 */
export function planetAngle(planet: Planet, clock: number): number {
  return planet.phase - (TAU * clock) / planet.poster.cadence.interval
}

/** The point of the plane `u` across and `v` towards the viewer from Ethereum, on screen */
export function toScreen(orrery: Orrery, u: number, v: number) {
  const cos = Math.cos(orrery.tilt)
  const sin = Math.sin(orrery.tilt)
  const flat = v * orrery.squash
  return {
    x: orrery.sun.x + u * cos - flat * sin,
    y: orrery.sun.y + u * sin + flat * cos,
  }
}

/** Far planets look a little smaller, which is most of what sells the depth */
export function perspective(depth: number): number {
  return 0.925 + 0.075 * depth
}

export function placePlanets(orrery: Orrery, clock: number): PlacedPlanet[] {
  return orrery.planets.map((planet, index) => {
    const angle = planetAngle(planet, clock)
    const depth = Math.sin(angle)
    const nearness = planet.orbit * depth
    const { x, y } = toScreen(orrery, planet.orbit * Math.cos(angle), nearness)
    return {
      index,
      x,
      y,
      radius: planet.radius * perspective(depth),
      angle,
      depth,
      nearness,
    }
  })
}

/**
 * The planet under the pointer. One the pointer is right over wins, the
 * nearest to the viewer first; otherwise the closest one within reach, as
 * small planets get a target larger than themselves. `keep` is held on to
 * for a little longer, so a planet moving off does not drop the tooltip.
 */
export function findPlanetAt(
  placed: PlacedPlanet[],
  x: number,
  y: number,
  keep: number | undefined,
  extraReach = 0,
): number | undefined {
  let over: PlacedPlanet | undefined
  let closest: PlacedPlanet | undefined
  let closestGap = Number.POSITIVE_INFINITY
  for (const planet of placed) {
    const distance = Math.hypot(planet.x - x, planet.y - y)
    const reach =
      Math.max(MIN_HIT_RADIUS, planet.radius + 3) +
      extraReach +
      (planet.index === keep ? 10 : 0)
    if (distance > reach) continue
    if (
      distance <= planet.radius &&
      (!over || planet.nearness > over.nearness)
    ) {
      over = planet
    }
    const gap = distance - planet.radius
    if (gap < closestGap) {
      closestGap = gap
      closest = planet
    }
  }
  return (over ?? closest)?.index
}

/** Whether a point is over Ethereum, give or take a few pixels */
export function isOverSun(orrery: Orrery, x: number, y: number): boolean {
  const { sun } = orrery
  return Math.hypot(x - sun.x, y - sun.y) <= sun.radius + 4
}

/** Whether a point lies within the orbit of radius `orbit` on screen */
export function isInsideOrbit(
  orrery: Orrery,
  x: number,
  y: number,
  orbit: number,
): boolean {
  const cos = Math.cos(orrery.tilt)
  const sin = Math.sin(orrery.tilt)
  const dx = x - orrery.sun.x
  const dy = y - orrery.sun.y
  const u = dx * cos + dy * sin
  const v = (-dx * sin + dy * cos) / orrery.squash
  return u * u + v * v < orbit * orbit
}

/** Spreads posters around their orbits, the same way on every visit */
function hashToUnit(id: string): number {
  let hash = 2166136261
  for (let i = 0; i < id.length; i++) {
    hash = Math.imul(hash ^ id.charCodeAt(i), 16777619)
  }
  return mulberry32(hash)()
}
