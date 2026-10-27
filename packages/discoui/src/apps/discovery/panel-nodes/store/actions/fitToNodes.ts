import type { State } from '../State'
import { expandedNodes } from '../utils/renderGraph'
import { topLevelByDescendant } from '../utils/subnodes'

const PADDING = 80
const SCALE_MIN = 0.1
const SCALE_MAX = 1

// insetTopPx keeps the fitted nodes clear of an overlay at the top. A node
// inside a closed group is shown by the group's box.
export function fitToNodes(
  state: State,
  ids: ReadonlySet<string>,
  insetTopPx = 0,
): Partial<State> {
  const viewport = state.viewportContainer
  const drawnBy = topLevelByDescendant(expandedNodes(state.nodes))
  const boxes = [...ids].flatMap((id) => drawnBy.get(id)?.box ?? [])
  if (!viewport || boxes.length === 0) {
    return {}
  }

  const minX = Math.min(...boxes.map((b) => b.x)) - PADDING
  const minY = Math.min(...boxes.map((b) => b.y)) - PADDING
  const maxX = Math.max(...boxes.map((b) => b.x + b.width)) + PADDING
  const maxY = Math.max(...boxes.map((b) => b.y + b.height)) + PADDING

  const rect = viewport.getBoundingClientRect()
  const height = Math.max(rect.height - insetTopPx, rect.height / 3)
  const fit = Math.min(rect.width / (maxX - minX), height / (maxY - minY))
  const scale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, fit))

  return {
    transform: {
      scale,
      offsetX: rect.width / 2 - ((minX + maxX) / 2) * scale,
      offsetY: rect.height - height + height / 2 - ((minY + maxY) / 2) * scale,
    },
  }
}
