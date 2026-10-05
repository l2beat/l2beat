import { mixColors, readableColor } from '../../color'
import type { ThemeTokens } from '../../hooks'
import type { LabData } from '../../model'
import type { NameState } from './names'
import { type Orrery, type PlacedPlanet, TAU } from './orrery'
import type { Simulation } from './simulation'

/** Everything a frame is drawn from */
export interface Frame {
  orrery: Orrery
  sim: Simulation
  paint: Paint
  stars: Star[]
  placed: PlacedPlanet[]
  focus: Focus
  /** False for a still picture: no comets, no trails, nothing fades */
  isMoving: boolean
  /** Where each poster's name is and how visible, kept from frame to frame */
  names: NameState[]
  dt: number
}

/** Colors and images, settled once per theme */
export interface Paint {
  tokens: ThemeTokens
  /** Each poster's color, made readable on the card */
  colors: string[]
  /** Ethereum's indigo */
  sunColor: string
  /** Ethereum's disc is lit from within: its middle, and its rim */
  sunCore: string
  sunRim: string
  icons: (HTMLImageElement | undefined)[]
  sunIcon: HTMLImageElement | undefined
  /** Orbits of the posters named on the drawing, on the near and the far side */
  orbitNear: string
  orbitFar: string
  /** Orbits of the rest, fainter */
  tailOrbitNear: string
  tailOrbitFar: string
  /** Behind icons, as not every icon is opaque */
  iconBackdrop: string
  /** Icons are made for light pages; on the dark card a white one would outshine Ethereum */
  iconHaze: number
}

/**
 * The theme's colors, worked out for the drawing. Brand colors go through
 * `readableColor`, as some are black or near white
 */
export function createPaint(
  data: LabData,
  tokens: ThemeTokens,
  images: Map<string, HTMLImageElement>,
): Paint {
  const sunColor = readableColor(data.daLayer.color, tokens.surface)
  const { isDark, surface, divider } = tokens
  return {
    tokens,
    colors: data.posters.map((p) => readableColor(p.color, surface)),
    sunColor,
    sunCore: isDark ? mixColors(surface, sunColor, 0.34) : '#ffffff',
    sunRim: mixColors(isDark ? surface : '#ffffff', sunColor, 0.14),
    icons: data.posters.map((p) =>
      p.iconUrl ? images.get(p.iconUrl) : undefined,
    ),
    sunIcon: images.get(data.daLayer.iconUrl),
    orbitNear: isDark ? mixColors(divider, '#ffffff', 0.1) : divider,
    orbitFar: mixColors(divider, surface, 0.4),
    tailOrbitNear: mixColors(divider, surface, isDark ? 0.15 : 0.4),
    tailOrbitFar: mixColors(divider, surface, isDark ? 0.5 : 0.65),
    iconBackdrop: isDark ? mixColors(surface, '#ffffff', 0.08) : '#ffffff',
    iconHaze: isDark ? 0.12 : 0,
  }
}

export interface Star {
  x: number
  y: number
  radius: number
  alpha: number
}

/** Posters the reader is looking at */
export interface Focus {
  hovered: number | undefined
  highlighted: number | undefined
}

/** A rectangle on screen, as text takes up */
export interface Box {
  left: number
  top: number
  right: number
  bottom: number
}

/** With a poster picked, the others step back, all but the one under the pointer */
export function isDimmed({ highlighted, hovered }: Focus, index: number) {
  return highlighted !== undefined && highlighted !== index && hovered !== index
}

/** The orbit of radius `radius` from angle `from` to `to`, as it looks on screen */
export function strokeOrbit(
  ctx: CanvasRenderingContext2D,
  orrery: Orrery,
  radius: number,
  from: number,
  to: number,
) {
  ctx.beginPath()
  ctx.ellipse(
    orrery.sun.x,
    orrery.sun.y,
    radius,
    radius * orrery.squash,
    orrery.tilt,
    from,
    to,
  )
  ctx.stroke()
}

export function fillDisc(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, TAU)
  ctx.fill()
}

export function overlaps(a: Box, b: Box, padding = 0): boolean {
  return (
    a.left < b.right + padding &&
    b.left < a.right + padding &&
    a.top < b.bottom + padding &&
    b.top < a.bottom + padding
  )
}

export function circleBox(x: number, y: number, radius: number): Box {
  return {
    left: x - radius,
    right: x + radius,
    top: y - radius,
    bottom: y + radius,
  }
}

/** `value` moved towards `target` by at most `step` */
export function approach(value: number, target: number, step: number) {
  return value < target
    ? Math.min(target, value + step)
    : Math.max(target, value - step)
}

export function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}
