/**
 * Where everything on the map sits, shared by the canvas and the HTML laid
 * over it, so the block number lands in the core the canvas draws.
 *
 * `orbit`: a tilted orrery, the orbits drawn as ellipses around the core.
 * `arc`: on a phone the full orbit would shrink every body to a dot, so the
 * systems spread over the upper half only, above a core at the bottom.
 */
export type MapMode = 'orbit' | 'arc'

export interface Geometry {
  mode: MapMode
  width: number
  height: number
  cx: number
  cy: number
  rx: [number, number, number]
  ry: [number, number, number]
  core: number
  countdownRing: number
  gasRing: number
  gasWidth: number
  blobRing: number
  blobWidth: number
  bodyScale: number
  /** Arc mode keeps bodies inside this span of angles, upper half only */
  arcFrom: number
  arcTo: number
}

const TILT = 0.5
const ARC_TILT = 0.8
const ARC_MARGIN = 0.2

/**
 * `sideReserve` keeps the outer orbit clear of the HUD laid over the map's
 * sides on wide screens
 */
export function getGeometry(
  width: number,
  height: number,
  mode: MapMode,
  sideReserve = 0,
): Geometry {
  if (mode === 'arc') {
    const core = clamp(width * 0.12, 38, 50)
    const cy = height - core - 22
    const outer = Math.min(width * 0.46, (cy - 30) / ARC_TILT)
    const rx: [number, number, number] = [outer * 0.64, outer * 0.82, outer]
    return {
      mode,
      width,
      height,
      cx: width / 2,
      cy,
      rx,
      ry: rx.map((r) => r * ARC_TILT) as [number, number, number],
      core,
      countdownRing: core + 3,
      gasRing: core + 8.5,
      gasWidth: 4,
      blobRing: core + 15.5,
      blobWidth: 5,
      bodyScale: 0.74,
      arcFrom: Math.PI + ARC_MARGIN,
      arcTo: 2 * Math.PI - ARC_MARGIN,
    }
  }
  const core = clamp(height * 0.135, 52, 72)
  const outer = Math.min(
    width * 0.35,
    width / 2 - sideReserve,
    (height / 2 - 34) / TILT,
  )
  const rx: [number, number, number] = [outer * 0.57, outer * 0.79, outer]
  return {
    mode,
    width,
    height,
    cx: width / 2,
    cy: height / 2,
    rx,
    ry: rx.map((r) => r * TILT) as [number, number, number],
    core,
    countdownRing: core + 4,
    gasRing: core + 12,
    gasWidth: 6,
    blobRing: core + 22,
    blobWidth: 7,
    bodyScale: 1,
    arcFrom: 0,
    arcTo: 2 * Math.PI,
  }
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
