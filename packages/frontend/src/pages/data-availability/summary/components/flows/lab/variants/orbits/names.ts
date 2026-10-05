import {
  approach,
  type Box,
  circleBox,
  type Frame,
  isDimmed,
  overlaps,
} from './drawing'
import type { Orrery, PlacedPlanet } from './orrery'
import type { ScaleMark } from './scale'

/** Where a name sits, kept from frame to frame so it glides rather than jumps */
export interface NameState {
  alpha: number
  /** Turn from straight outward, in radians, as drawn now */
  turn: number
  /** Turn it is gliding towards */
  targetTurn: number
}

const FONT = '500 12px Roboto, Arial, sans-serif'
const TEXT_HEIGHT = 13
/** Between a planet and its name */
const GAP = 4
/** Room kept around a name, so two names never read as one line */
const SPACING = 5
/** Names keep this far from the edges of the drawing */
const INSET = 4
/**
 * Seconds a name takes to fade in, and out: it gives way at once to a name
 * it would cover, and comes back without a flicker
 */
const FADE_IN = 0.25
const FADE_OUT = 0.05
/** Seconds a name takes to glide to a new place beside its planet */
const GLIDE = 0.15

/**
 * Places to try, as turns from straight outward: outward first, away from
 * Ethereum, where the orbits fan out and there is the most room, then a
 * little either way. The inner side is crowded, so names go there only
 * when they have to show.
 */
const TURNS = [0, 0.55, -0.55, 1.1, -1.1]
const LAST_RESORT_TURNS = [...TURNS, 1.7, -1.7, Math.PI]

export function createNameStates(count: number): NameState[] {
  return Array.from({ length: count }, () => ({
    alpha: 0,
    turn: 0,
    targetTurn: 0,
  }))
}

/**
 * Names of the largest posters, and of the one in focus. A name that would
 * cover another name, a planet worth a name or Ethereum moves round its
 * planet to where there is room, or steps out until there is; the larger
 * poster keeps its place.
 */
export function drawNames(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  scaleMarks: ScaleMark[],
) {
  const { orrery, paint, placed, focus, names, isMoving, dt } = frame
  ctx.font = FONT
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'

  const taken = getObstacles(frame, scaleMarks)
  for (const index of getNameOrder(frame)) {
    const p = placed[index]
    const planet = orrery.planets[index]
    const state = names[index]
    if (!p || !planet || !state) continue
    const name = planet.poster.name
    const width = ctx.measureText(name).width
    const isFocused = focus.hovered === index || focus.highlighted === index
    const isWanted =
      isFocused || (planet.isNamed && focus.highlighted === undefined)

    const turn = isWanted
      ? findNameTurn(p, width, orrery, state, (box) =>
          taken.every(
            (t) => t.owner === index || !overlaps(box, t.box, SPACING),
          ),
        )
      : undefined
    const isShown = isFocused || turn !== undefined
    if (turn !== undefined) state.targetTurn = turn
    else if (isFocused) state.targetTurn = findAnyNameTurn(p, width, orrery)

    // a name coming into view starts where it belongs, not gliding there
    const glides = isMoving && state.alpha > 0.05
    state.turn = glides
      ? glideTurn(state.turn, state.targetTurn, dt, GLIDE)
      : state.targetTurn
    const visibility = isShown ? 1 : 0
    state.alpha = isMoving
      ? approach(state.alpha, visibility, dt / (isShown ? FADE_IN : FADE_OUT))
      : visibility

    const box = getNameBox(p, width, orrery, state.turn)
    if (isShown) taken.push({ box, owner: index })
    if (state.alpha < 0.02) continue

    const x = (box.left + box.right) / 2
    const y = (box.top + box.bottom) / 2
    ctx.globalAlpha = state.alpha
    ctx.lineWidth = 3.5
    ctx.strokeStyle = paint.tokens.surface
    ctx.strokeText(name, x, y)
    ctx.fillStyle = isFocused ? paint.tokens.primary : paint.tokens.secondary
    ctx.fillText(name, x, y)
  }
  ctx.globalAlpha = 1
}

/** Who gets room for a name first: the poster in focus, then the largest */
function getNameOrder({ orrery, focus, names }: Frame): number[] {
  const order: number[] = []
  if (focus.highlighted !== undefined) order.push(focus.highlighted)
  if (focus.hovered !== undefined && focus.hovered !== focus.highlighted) {
    order.push(focus.hovered)
  }
  orrery.planets.forEach((planet, index) => {
    if (order.includes(index)) return
    if (planet.isNamed || (names[index]?.alpha ?? 0) > 0) order.push(index)
  })
  return order
}

/**
 * What a name must not cover: Ethereum, the marks of the scale and every
 * planet worth seeing. A name may cross the smallest planets
 */
function getObstacles({ orrery, placed, focus }: Frame, marks: ScaleMark[]) {
  const { sun } = orrery
  const taken: { box: Box; owner: number }[] = [
    { box: circleBox(sun.x, sun.y, sun.radius + 3), owner: -1 },
    ...marks.map((mark) => ({ box: mark.box, owner: -1 })),
  ]
  for (const p of placed) {
    const planet = orrery.planets[p.index]
    const isVisible = !isDimmed(focus, p.index)
    if (planet && isVisible && (planet.isNamed || planet.radius >= 3.5)) {
      taken.push({ box: circleBox(p.x, p.y, p.radius + 1), owner: p.index })
    }
  }
  return taken
}

/**
 * Where the name of a planet fits, as a turn from straight outward, or
 * nothing when it fits nowhere. A name keeps its place while it fits there,
 * so names do not hop around as planets pass each other.
 */
function findNameTurn(
  planet: PlacedPlanet,
  textWidth: number,
  orrery: Orrery,
  state: NameState,
  isFree: (box: Box) => boolean,
): number | undefined {
  for (const turn of [state.targetTurn, ...TURNS]) {
    const box = getNameBox(planet, textWidth, orrery, turn)
    if (isWithin(box, orrery) && isFree(box)) return turn
  }
  return undefined
}

/** The first place on the drawing at all, for a name that has to show */
function findAnyNameTurn(
  planet: PlacedPlanet,
  textWidth: number,
  orrery: Orrery,
): number {
  return (
    LAST_RESORT_TURNS.find((turn) =>
      isWithin(getNameBox(planet, textWidth, orrery, turn), orrery),
    ) ?? 0
  )
}

function getNameBox(
  planet: PlacedPlanet,
  textWidth: number,
  orrery: Orrery,
  turn: number,
): Box {
  const angle =
    Math.atan2(planet.y - orrery.sun.y, planet.x - orrery.sun.x) + turn
  return getBoxBeside(planet, Math.cos(angle), Math.sin(angle), textWidth)
}

/**
 * As close along the direction as the box can be while it clears the
 * planet: then its nearest corner or side hugs the planet whichever way the
 * direction points, and the name reads as the planet's.
 */
function getBoxBeside(
  planet: PlacedPlanet,
  dirX: number,
  dirY: number,
  width: number,
): Box {
  const halfWidth = width / 2
  const halfHeight = TEXT_HEIGHT / 2
  const clearance = planet.radius + GAP
  // the gap between box and planet only grows along the way, so halve it down
  let near = 0
  let far = clearance + halfWidth + halfHeight
  for (let i = 0; i < 12; i++) {
    const reach = (near + far) / 2
    const gapX = Math.max(Math.abs(dirX * reach) - halfWidth, 0)
    const gapY = Math.max(Math.abs(dirY * reach) - halfHeight, 0)
    if (Math.hypot(gapX, gapY) < clearance) near = reach
    else far = reach
  }
  const x = planet.x + dirX * far
  const y = planet.y + dirY * far
  return {
    left: x - halfWidth,
    right: x + halfWidth,
    top: y - halfHeight,
    bottom: y + halfHeight,
  }
}

function isWithin(box: Box, orrery: Orrery) {
  return (
    box.left >= INSET &&
    box.top >= INSET &&
    box.right <= orrery.width - INSET &&
    box.bottom <= orrery.height - INSET
  )
}

/** Turns `from` towards `to` the short way round, about all of it in `seconds` */
function glideTurn(from: number, to: number, dt: number, seconds: number) {
  const left = Math.atan2(Math.sin(to - from), Math.cos(to - from))
  const turned = from + left * (1 - Math.exp(-dt / (seconds / 3)))
  return Math.atan2(Math.sin(turned), Math.cos(turned))
}
