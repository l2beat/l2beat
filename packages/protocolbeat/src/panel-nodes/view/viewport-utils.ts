import type { Node } from '../store/State'
import type { SvgConnection } from './ConnectionsSVG'
import {
  VIEWPORT_RENDER_MARGIN,
  CONNECTION_BOUNDS_PADDING,
  VIEWPORT_BOUNDS_MARGIN,
} from './constants'

export interface ViewportInfo {
  viewX: number
  viewY: number
  viewW: number
  viewH: number
}

export interface Bounds {
  minX: number
  minY: number
  width: number
  height: number
}

export interface Transform {
  offsetX: number
  offsetY: number
  scale: number
}

/**
 * Calculate viewport information from container and transform
 */
export function getViewportInfo(
  container: HTMLElement,
  transform: Transform,
): ViewportInfo {
  const rect = container.getBoundingClientRect()
  return {
    viewX: -transform.offsetX / transform.scale,
    viewY: -transform.offsetY / transform.scale,
    viewW: rect.width / transform.scale,
    viewH: rect.height / transform.scale,
  }
}

/**
 * Check if a box intersects with the viewport (with margin)
 */
export function isInViewport(
  box: { x: number; y: number; width: number; height: number },
  viewport: ViewportInfo,
  margin: number = VIEWPORT_RENDER_MARGIN,
): boolean {
  return (
    box.x + box.width >= viewport.viewX - margin &&
    box.x <= viewport.viewX + viewport.viewW + margin &&
    box.y + box.height >= viewport.viewY - margin &&
    box.y <= viewport.viewY + viewport.viewH + margin
  )
}

/**
 * Filter nodes that are visible in the viewport
 */
export function filterVisibleNodes(
  nodes: readonly Node[],
  hidden: readonly string[],
  viewport?: ViewportInfo,
): readonly Node[] {
  let candidates = nodes.filter((n) => !hidden.includes(n.id))

  if (viewport) {
    candidates = candidates.filter((n) => isInViewport(n.box, viewport))
  }

  return candidates
}

export function calculateBounds(
  connections: readonly SvgConnection[],
  viewport?: ViewportInfo,
): Bounds {
  if (viewport) {
    const margin = VIEWPORT_BOUNDS_MARGIN
    return {
      minX: viewport.viewX - margin,
      minY: viewport.viewY - margin,
      width: viewport.viewW + 2 * margin,
      height: viewport.viewH + 2 * margin,
    }
  }

  // Fallback to connection bounding box
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  connections.forEach(({ from, to }) => {
    minX = Math.min(minX, from.x, to.x) - CONNECTION_BOUNDS_PADDING
    maxX = Math.max(maxX, from.x, to.x) + CONNECTION_BOUNDS_PADDING
    minY = Math.min(minY, from.y, to.y) - CONNECTION_BOUNDS_PADDING
    maxY = Math.max(maxY, from.y, to.y) + CONNECTION_BOUNDS_PADDING
  })

  return {
    minX,
    minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

export function filterVisibleConnections(
  connections: readonly SvgConnection[],
  viewport?: ViewportInfo,
  margin: number = 0,
): readonly SvgConnection[] {
  if (!viewport) {
    return connections
  }

  return connections.filter(
    ({ from, to }) =>
      (from.x >= viewport.viewX - margin &&
        from.x <= viewport.viewX + viewport.viewW + margin &&
        from.y >= viewport.viewY - margin &&
        from.y <= viewport.viewY + viewport.viewH + margin) ||
      (to.x >= viewport.viewX - margin &&
        to.x <= viewport.viewX + viewport.viewW + margin &&
        to.y >= viewport.viewY - margin &&
        to.y <= viewport.viewY + viewport.viewH + margin),
  )
}
