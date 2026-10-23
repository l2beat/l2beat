import type { State } from '../State'
import { containerBoxes, expandedNodes } from '../utils/renderGraph'

// Members of opened groups are drawn on their own, so they can be focused too.
export function selectAndFocus(state: State, selected: string): Partial<State> {
  const node =
    state.nodes.find((x) => x.id === selected) ??
    expandedNodes(state.nodes).find((x) => x.id === selected)

  if (!node) {
    return state
  }

  const box = containerBoxes(state.nodes).get(selected) ?? node.box
  const minX = box.x
  const minY = box.y
  const maxX = box.x + box.width
  const maxY = box.y + box.height

  const nodesCenterX = (minX + maxX) / 2
  const nodesCenterY = (minY + maxY) / 2

  let offsetX = state.transform.offsetX
  let offsetY = state.transform.offsetY

  const viewport = state.viewportContainer

  if (viewport) {
    const rect = viewport.getBoundingClientRect()
    const viewportCenterX = rect.width / 2
    const viewportCenterY = rect.height / 2

    offsetX = viewportCenterX - nodesCenterX * state.transform.scale
    offsetY = viewportCenterY - nodesCenterY * state.transform.scale
  }

  return {
    transform: {
      ...state.transform,
      offsetX,
      offsetY,
    },
    selected: [selected],
  }
}
