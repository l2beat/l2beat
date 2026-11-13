import {
  type ChainLabel,
  estimateTextWidth,
  getLabelMetrics,
} from './chainLabel'

export interface LabelledNode {
  x: number
  y: number
  radius: number
  label: ChainLabel
}

export interface SeparatedNode {
  x: number
  y: number
  showNetFlow: boolean
  /** Boxes of the name and net-flow lines, in graph coordinates */
  labelBoxes: Rect[]
}

export interface Rect {
  x0: number
  y0: number
  x1: number
  y1: number
}

// Roboto's ascent and descent in em: the box the browser gives an SVG text
const ASCENT = 0.93
const DESCENT = 0.24
/** Clear space kept between one chain's bubble or label and another's */
const GAP = 4
/** Net flows of bubbles this small or smaller may be left out */
const DROPPABLE_RADIUS = 12
/** Closest a bubble may come to the centre, as a share of `size` */
const MIN_DISTANCE = 0.12
/** A chain may turn this share of its slot either way around the ring */
const MAX_TURN = 0.45
/**
 * How far past its slot a chain may move outward on small screens, as a share
 * of its distance from the centre. Phones have room at the edge of the square
 * but none inward, where the logo and the larger chains' labels sit. Large
 * screens keep every chain on or inside the ring.
 */
const SMALL_SCREEN_MAX_OUTWARD = 0.15
/**
 * Overlap in px that one px of moving off the ring is worth. Small, so
 * chains leave the ring only to clear an overlap.
 */
const MOVE_COST = 0.02
const SEARCH_STEPS_PER_CHAIN = 300
const MAX_ITERATIONS = 300
/** A solve gives up once overlaps stop shrinking for this many steps */
const STALL_ITERATIONS = 20

/**
 * Moves bubbles until no chain's bubble or label overlaps another chain's,
 * or the logo in the middle. Chains that already fit stay where they are.
 *
 * 1. A search moves crowded chains inward (on small screens also a little
 *    outward, where phones have room) and a little around the ring, but
 *    never past half-way to a neighbour's slot, so the ring keeps its order.
 *    Each px a chain leaves its slot costs a little, so chains move only to
 *    clear an overlap. It's seeded, so the same data gives the same layout.
 * 2. Overlaps left over are pushed apart along their shortest way out. No
 *    chain is pushed further out of the `size` square than it started.
 *
 * If chains still overlap, the net-flow line of the smallest overlapping
 * bubble is left out and both steps run again from there, one line at a
 * time and only under bubbles up to DROPPABLE_RADIUS. On small screens, once
 * no such bubble is left, a net-flow line that still collides with another
 * chain or the logo is left out, smallest bubble first, so no figure is drawn
 * over or under something else. Names are never left out.
 */
export function separateLabels(
  nodes: LabelledNode[],
  size: number,
  isSmallScreen: boolean,
): SeparatedNode[] {
  const showNetFlow = nodes.map(() => true)
  const bySize = nodes
    .map((node, index) => ({ radius: node.radius, index }))
    .sort((a, b) => a.radius - b.radius || a.index - b.index)
  const logo = getLogoRect(size, isSmallScreen)
  const random = seededRandom(1)

  let positions: Point[] = nodes.map(({ x, y }) => ({ x, y }))
  for (let round = 0; ; round++) {
    const shapes = nodes.map((node, i) =>
      getShape(node, showNetFlow[i] ?? true, isSmallScreen),
    )
    const limits = getLimits(nodes, shapes, size)
    positions = search(nodes, positions, shapes, limits, size, logo, {
      random,
      // Later rounds only touch up the last layout
      steps: SEARCH_STEPS_PER_CHAIN * nodes.length * (round === 0 ? 1 : 0.3),
      startTemperature: round === 0 ? 8 : 2,
      maxOutward: isSmallScreen ? SMALL_SCREEN_MAX_OUTWARD : 0,
    })
    const solved = solve(positions, shapes, limits, logo)
    positions = solved.positions
    const toDrop =
      bySize.find(
        ({ index, radius }) =>
          radius <= DROPPABLE_RADIUS &&
          solved.overlapping.has(index) &&
          showNetFlow[index],
      ) ??
      (isSmallScreen
        ? bySize.find(({ index }) =>
            netFlowCollides(index, positions, shapes, logo),
          )
        : undefined)
    if (!toDrop) {
      return positions.map((p, i) => ({
        ...p,
        showNetFlow: showNetFlow[i] ?? true,
        labelBoxes: (shapes[i] as Shape).rects.map((rect) => offset(rect, p)),
      }))
    }
    showNetFlow[toDrop.index] = false
  }
}

/**
 * Whether chain `i`'s net-flow line overlaps another chain's bubble or label,
 * or the logo. Checked without GAP: only a real collision counts.
 */
function netFlowCollides(
  i: number,
  positions: Point[],
  shapes: Shape[],
  logo: Rect,
): boolean {
  const shape = shapes[i] as Shape
  const line = shape.rects[1]
  if (!line) return false
  const box = offset(line, positions[i] as Point)
  const touches = (a: Rect, b: Rect) =>
    a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1
  if (touches(box, logo)) return true
  for (let j = 0; j < positions.length; j++) {
    if (j === i) continue
    const p = positions[j] as Point
    const other = shapes[j] as Shape
    const nearestX = clamp(p.x, box.x0, box.x1)
    const nearestY = clamp(p.y, box.y0, box.y1)
    if (Math.hypot(p.x - nearestX, p.y - nearestY) < other.radius) return true
    if (other.rects.some((rect) => touches(box, offset(rect, p)))) return true
  }
  return false
}

interface Limits {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

/** A chain may stay as far outside the square as it started, but no further */
function getLimits(
  nodes: LabelledNode[],
  shapes: Shape[],
  size: number,
): Limits[] {
  return nodes.map((p, i) => {
    const b = (shapes[i] as Shape).bounds
    return {
      minX: Math.min(0, p.x + b.x0) - b.x0,
      maxX: Math.max(size, p.x + b.x1) - b.x1,
      minY: Math.min(0, p.y + b.y0) - b.y0,
      maxY: Math.max(size, p.y + b.y1) - b.y1,
    }
  })
}

/**
 * Simulated annealing over each chain's angle and distance from the centre.
 * Cost: the depth of every overlap, plus MOVE_COST per px off the ring.
 * Returns the cheapest layout it saw.
 */
function search(
  nodes: LabelledNode[],
  start: Point[],
  shapes: Shape[],
  limits: Limits[],
  size: number,
  logo: Rect,
  options: {
    random: () => number
    steps: number
    startTemperature: number
    maxOutward: number
  },
): Point[] {
  const c = size / 2
  const slot = (2 * Math.PI) / nodes.length
  const home = nodes.map(({ x, y }) => ({
    angle: Math.atan2(y - c, x - c),
    distance: Math.hypot(x - c, y - c),
  }))
  const positions = start.map(({ x, y }) => ({ x, y }))
  const polar = positions.map(({ x, y }) => ({
    angle: Math.atan2(y - c, x - c),
    distance: Math.hypot(x - c, y - c),
  }))

  const overlapOf = (i: number, p: Point) => {
    const shape = shapes[i] as Shape
    let total = obstacleDepth(p, shape, logo)
    for (let j = 0; j < positions.length; j++) {
      if (j === i) continue
      total += overlapDepth(p, shape, positions[j] as Point, shapes[j] as Shape)
    }
    return total
  }
  const moveCostOf = (i: number, angle: number, distance: number) => {
    const h = home[i] as (typeof home)[number]
    const turn = Math.abs(angleBetween(angle, h.angle))
    return MOVE_COST * (Math.abs(h.distance - distance) + h.distance * turn)
  }

  let overlap = 0
  for (let i = 0; i < positions.length; i++) {
    overlap += overlapOf(i, positions[i] as Point) / 2
  }
  if (overlap === 0) return positions

  let cost =
    overlap +
    polar.reduce((sum, p, i) => sum + moveCostOf(i, p.angle, p.distance), 0)
  let best = { cost, positions: positions.map((p) => ({ ...p })) }
  const endTemperature = 0.05
  const cooling =
    (endTemperature / options.startTemperature) ** (1 / options.steps)
  let temperature = options.startTemperature

  for (let step = 0; step < options.steps; step++, temperature *= cooling) {
    const i = Math.floor(options.random() * positions.length)
    const h = home[i] as (typeof home)[number]
    const current = polar[i] as (typeof polar)[number]
    // Moves shrink as the search cools
    const reach = Math.sqrt(temperature / options.startTemperature)
    const angle =
      h.angle +
      clamp(
        angleBetween(current.angle, h.angle) +
          (options.random() - 0.5) * slot * reach,
        -MAX_TURN * slot,
        MAX_TURN * slot,
      )
    const distance = clamp(
      current.distance + (options.random() - 0.5) * 0.2 * size * reach,
      Math.min(MIN_DISTANCE * size, h.distance),
      h.distance * (1 + options.maxOutward),
    )
    const next = {
      x: c + distance * Math.cos(angle),
      y: c + distance * Math.sin(angle),
    }
    const limit = limits[i] as Limits
    if (
      next.x < limit.minX ||
      next.x > limit.maxX ||
      next.y < limit.minY ||
      next.y > limit.maxY
    ) {
      continue
    }

    const delta =
      overlapOf(i, next) -
      overlapOf(i, positions[i] as Point) +
      moveCostOf(i, angle, distance) -
      moveCostOf(i, current.angle, current.distance)
    if (delta > 0 && options.random() >= Math.exp(-delta / temperature)) {
      continue
    }
    positions[i] = next
    polar[i] = { angle, distance }
    cost += delta
    if (cost < best.cost - 1e-9) {
      best = { cost, positions: positions.map((p) => ({ ...p })) }
    }
  }
  return best.positions
}

/**
 * How deep chains `a` and `b` overlap at their deepest point, in px. Same
 * measure as the length of `getPush`, without allocating: the search calls
 * it hundreds of thousands of times.
 */
function overlapDepth(pa: Point, a: Shape, pb: Point, b: Shape): number {
  if (
    pa.x + a.bounds.x1 + GAP <= pb.x + b.bounds.x0 ||
    pb.x + b.bounds.x1 + GAP <= pa.x + a.bounds.x0 ||
    pa.y + a.bounds.y1 + GAP <= pb.y + b.bounds.y0 ||
    pb.y + b.bounds.y1 + GAP <= pa.y + a.bounds.y0
  ) {
    return 0
  }
  let deepest = Math.max(
    0,
    a.radius + b.radius + GAP - Math.hypot(pb.x - pa.x, pb.y - pa.y),
  )
  for (const rb of b.rects) {
    deepest = Math.max(deepest, circleRectDepth(pa, a.radius, rb, pb))
  }
  for (const ra of a.rects) {
    deepest = Math.max(deepest, circleRectDepth(pb, b.radius, ra, pa))
    for (const rb of b.rects) {
      deepest = Math.max(
        deepest,
        rectRectDepth(
          ra.x0 + pa.x,
          ra.y0 + pa.y,
          ra.x1 + pa.x,
          ra.y1 + pa.y,
          rb.x0 + pb.x,
          rb.y0 + pb.y,
          rb.x1 + pb.x,
          rb.y1 + pb.y,
        ),
      )
    }
  }
  return deepest
}

function obstacleDepth(p: Point, shape: Shape, obstacle: Rect): number {
  let deepest = circleRectDepth(p, shape.radius, obstacle, ORIGIN)
  for (const rect of shape.rects) {
    deepest = Math.max(
      deepest,
      rectRectDepth(
        obstacle.x0,
        obstacle.y0,
        obstacle.x1,
        obstacle.y1,
        rect.x0 + p.x,
        rect.y0 + p.y,
        rect.x1 + p.x,
        rect.y1 + p.y,
      ),
    )
  }
  return deepest
}

const ORIGIN: Point = { x: 0, y: 0 }

/** Depth of a circle in `rect` moved by `at` */
function circleRectDepth(c: Point, r: number, rect: Rect, at: Point): number {
  const x0 = rect.x0 + at.x
  const y0 = rect.y0 + at.y
  const x1 = rect.x1 + at.x
  const y1 = rect.y1 + at.y
  const distance = Math.hypot(
    c.x - clamp(c.x, x0, x1),
    c.y - clamp(c.y, y0, y1),
  )
  if (distance > 0) return Math.max(0, r + GAP - distance)
  return rectRectDepth(x0, y0, x1, y1, c.x - r, c.y - r, c.x + r, c.y + r)
}

function rectRectDepth(
  ax0: number,
  ay0: number,
  ax1: number,
  ay1: number,
  bx0: number,
  by0: number,
  bx1: number,
  by1: number,
): number {
  const overlapX = Math.min(ax1, bx1) - Math.max(ax0, bx0) + GAP
  const overlapY = Math.min(ay1, by1) - Math.max(ay0, by0) + GAP
  if (overlapX <= 0 || overlapY <= 0) return 0
  return Math.min(overlapX, overlapY)
}

/** Signed angle from `b` to `a`, in (-π, π] */
function angleBetween(a: number, b: number) {
  const d = (a - b) % (2 * Math.PI)
  if (d > Math.PI) return d - 2 * Math.PI
  if (d <= -Math.PI) return d + 2 * Math.PI
  return d
}

/** mulberry32: small, fast and the same on every engine */
function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Matches `FlowsLogo` */
function getLogoRect(size: number, isSmallScreen: boolean): Rect {
  const scale = isSmallScreen ? 1.5 : 2
  const halfWidth = (88 * scale) / 2
  const halfHeight = (36 * scale) / 2
  const c = size / 2
  return {
    x0: c - halfWidth,
    y0: c - halfHeight,
    x1: c + halfWidth,
    y1: c + halfHeight,
  }
}

function depth(push: Point | undefined) {
  return push ? Math.hypot(push.x, push.y) : 0
}

interface Shape {
  radius: number
  /** Label boxes, relative to the bubble's centre */
  rects: Rect[]
  /** Everything the chain draws, relative to the bubble's centre */
  bounds: Rect
}

function getShape(
  node: LabelledNode,
  showNetFlow: boolean,
  isSmallScreen: boolean,
): Shape {
  const m = getLabelMetrics(isSmallScreen)
  const { nameLines, netFlow } = node.label
  const firstBaseline = node.radius + m.nameOffset
  const lastBaseline = firstBaseline + (nameLines.length - 1) * m.nameLineHeight
  const nameWidth = Math.max(
    ...nameLines.map((line) => estimateTextWidth(line, m.nameFontSize)),
  )
  const rects: Rect[] = [
    {
      x0: -nameWidth / 2,
      x1: nameWidth / 2,
      y0: firstBaseline - ASCENT * m.nameFontSize,
      y1: lastBaseline + DESCENT * m.nameFontSize,
    },
  ]
  if (showNetFlow) {
    const netFlowBaseline = lastBaseline + m.netFlowOffset
    const netFlowWidth = estimateTextWidth(netFlow, m.netFlowFontSize)
    rects.push({
      x0: -netFlowWidth / 2,
      x1: netFlowWidth / 2,
      // Starts where the name ends, so the two boxes don't overlap
      y0: Math.max(
        netFlowBaseline - ASCENT * m.netFlowFontSize,
        lastBaseline + DESCENT * m.nameFontSize,
      ),
      y1: netFlowBaseline + DESCENT * m.netFlowFontSize,
    })
  }
  const r = node.radius
  const bounds = rects.reduce(
    (b, rect) => ({
      x0: Math.min(b.x0, rect.x0),
      y0: Math.min(b.y0, rect.y0),
      x1: Math.max(b.x1, rect.x1),
      y1: Math.max(b.y1, rect.y1),
    }),
    { x0: -r, y0: -r, x1: r, y1: r },
  )
  return { radius: r, rects, bounds }
}

function solve(start: Point[], shapes: Shape[], limits: Limits[], logo: Rect) {
  const positions = start.map(({ x, y }) => ({ x, y }))

  // Moves a chain as far as its limits allow and returns how far it went
  const move = (i: number, dx: number, dy: number): Point => {
    const p = positions[i] as Point
    const limit = limits[i] as Limits
    const x = clamp(p.x + dx, limit.minX, limit.maxX)
    const y = clamp(p.y + dy, limit.minY, limit.maxY)
    const moved = { x: x - p.x, y: y - p.y }
    p.x = x
    p.y = y
    return moved
  }

  // Each overlap is resolved as soon as it's found, the two chains sharing
  // the move. When one is held by its limits, the other takes the rest.
  let leastOverlap = Number.POSITIVE_INFINITY
  let stalled = 0
  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    let overlap = 0
    for (let i = 0; i < positions.length; i++) {
      const shape = shapes[i] as Shape
      const push = getObstaclePush(positions[i] as Point, shape, logo)
      if (push) {
        move(i, push.x, push.y)
        overlap += depth(push)
      }
      for (let j = i + 1; j < positions.length; j++) {
        const push = getPush(
          positions[i] as Point,
          shape,
          positions[j] as Point,
          shapes[j] as Shape,
        )
        if (!push) continue
        const a = move(i, -push.x / 2, -push.y / 2)
        const b = move(j, push.x + a.x, push.y + a.y)
        move(i, -(push.x + a.x - b.x), -(push.y + a.y - b.y))
        overlap += depth(push)
      }
    }
    if (overlap === 0) break
    if (overlap < leastOverlap * 0.99) {
      leastOverlap = overlap
      stalled = 0
    } else if (++stalled === STALL_ITERATIONS) {
      break
    }
  }

  const overlapping = new Set<number>()
  for (let i = 0; i < positions.length; i++) {
    const shape = shapes[i] as Shape
    if (getObstaclePush(positions[i] as Point, shape, logo)) overlapping.add(i)
    for (let j = i + 1; j < positions.length; j++) {
      const push = getPush(
        positions[i] as Point,
        shape,
        positions[j] as Point,
        shapes[j] as Shape,
      )
      if (push) {
        overlapping.add(i)
        overlapping.add(j)
      }
    }
  }
  return { positions, overlapping }
}

interface Point {
  x: number
  y: number
}

/**
 * The shortest move of chain `b` (away from chain `a`) that ends their
 * deepest overlap, or undefined when they don't touch.
 */
function getPush(pa: Point, a: Shape, pb: Point, b: Shape): Point | undefined {
  // Most pairs are far apart: rule them out before the exact checks
  if (
    pa.x + a.bounds.x1 + GAP <= pb.x + b.bounds.x0 ||
    pb.x + b.bounds.x1 + GAP <= pa.x + a.bounds.x0 ||
    pa.y + a.bounds.y1 + GAP <= pb.y + b.bounds.y0 ||
    pb.y + b.bounds.y1 + GAP <= pa.y + a.bounds.y0
  ) {
    return undefined
  }

  let best = circleCircle(pa, a.radius, pb, b.radius)
  for (const rect of b.rects) {
    const push = circleRect(pa, a.radius, offset(rect, pb))
    if (push) best = deeper(best, { x: -push.x, y: -push.y })
  }
  for (const rect of a.rects) {
    best = deeper(best, circleRect(pb, b.radius, offset(rect, pa)))
  }
  for (const ra of a.rects) {
    for (const rb of b.rects) {
      best = deeper(best, rectRect(offset(ra, pa), offset(rb, pb)))
    }
  }
  return best
}

function deeper(a: Point | undefined, b: Point | undefined) {
  return depth(b) > depth(a) ? b : a
}

/** The shortest move of a chain out of a fixed rect */
function getObstaclePush(
  p: Point,
  shape: Shape,
  obstacle: Rect,
): Point | undefined {
  const b = shape.bounds
  if (
    p.x + b.x1 + GAP <= obstacle.x0 ||
    obstacle.x1 + GAP <= p.x + b.x0 ||
    p.y + b.y1 + GAP <= obstacle.y0 ||
    obstacle.y1 + GAP <= p.y + b.y0
  ) {
    return undefined
  }
  let best = circleRect(p, shape.radius, obstacle)
  for (const rect of shape.rects) {
    best = deeper(best, rectRect(obstacle, offset(rect, p)))
  }
  return best
}

function circleCircle(
  a: Point,
  ra: number,
  b: Point,
  rb: number,
): Point | undefined {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const distance = Math.hypot(dx, dy)
  const depth = ra + rb + GAP - distance
  if (depth <= 0) return undefined
  if (distance === 0) return { x: 0, y: depth }
  return { x: (dx / distance) * depth, y: (dy / distance) * depth }
}

/** Move of the circle out of the rect */
function circleRect(c: Point, r: number, rect: Rect): Point | undefined {
  const nearestX = clamp(c.x, rect.x0, rect.x1)
  const nearestY = clamp(c.y, rect.y0, rect.y1)
  const dx = c.x - nearestX
  const dy = c.y - nearestY
  const distance = Math.hypot(dx, dy)
  if (distance > 0) {
    const depth = r + GAP - distance
    if (depth <= 0) return undefined
    return { x: (dx / distance) * depth, y: (dy / distance) * depth }
  }
  // The centre is inside the rect: treat the circle as its bounding box
  const push = rectRect(rect, {
    x0: c.x - r,
    y0: c.y - r,
    x1: c.x + r,
    y1: c.y + r,
  })
  return push
}

/** Move of rect `b` out of rect `a` along the shallower axis */
function rectRect(a: Rect, b: Rect): Point | undefined {
  const overlapX = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) + GAP
  const overlapY = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) + GAP
  if (overlapX <= 0 || overlapY <= 0) return undefined
  if (overlapX < overlapY) {
    const sign = b.x0 + b.x1 >= a.x0 + a.x1 ? 1 : -1
    return { x: sign * overlapX, y: 0 }
  }
  const sign = b.y0 + b.y1 >= a.y0 + a.y1 ? 1 : -1
  return { x: 0, y: sign * overlapY }
}

function offset(rect: Rect, p: Point): Rect {
  return {
    x0: rect.x0 + p.x,
    y0: rect.y0 + p.y,
    x1: rect.x1 + p.x,
    y1: rect.y1 + p.y,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
