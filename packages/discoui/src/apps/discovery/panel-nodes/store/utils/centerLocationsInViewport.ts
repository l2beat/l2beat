import type { Node, State } from '../State'
import type { NodeLocations } from './storage'

// Translates a computed layout as a whole so its bounding box is centered
// in the part of the canvas the user is currently looking at. World (0,0)
// is only on screen until the user pans or zooms, so layouts anchored
// there would land outside the viewport.
export function centerLocationsInViewport(
  locations: NodeLocations,
  nodes: readonly Node[],
  transform: State['transform'],
  viewportContainer: HTMLElement | undefined,
): NodeLocations {
  if (!viewportContainer) {
    return locations
  }

  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY
  for (const node of nodes) {
    const location = locations[node.id]
    if (!location) {
      continue
    }
    minX = Math.min(minX, location.x)
    minY = Math.min(minY, location.y)
    maxX = Math.max(maxX, location.x + node.box.width)
    maxY = Math.max(maxY, location.y + node.box.height)
  }
  if (minX > maxX) {
    return locations
  }

  const rect = viewportContainer.getBoundingClientRect()
  const { offsetX, offsetY, scale } = transform
  const viewportCenterWorldX = (rect.width / 2 - offsetX) / scale
  const viewportCenterWorldY = (rect.height / 2 - offsetY) / scale

  const deltaX = viewportCenterWorldX - (minX + maxX) / 2
  const deltaY = viewportCenterWorldY - (minY + maxY) / 2

  const centered: NodeLocations = {}
  for (const [id, location] of Object.entries(locations)) {
    centered[id] = { x: location.x + deltaX, y: location.y + deltaY }
  }
  return centered
}
