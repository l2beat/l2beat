import type { State } from '../State'
import { expandedNodes } from '../utils/renderGraph'
import { topLevelByDescendant } from '../utils/subnodes'

// Selects what the graph draws for the contracts and centers the first: a
// member of an opened group is drawn on its own, a closed group stands in
// for its members, and a hidden contract is not drawn at all.
export function selectAndFocus(
  state: State,
  contracts: readonly string[],
): Partial<State> {
  const drawn = topLevelByDescendant(expandedNodes(state.nodes))
  const selected: string[] = []
  for (const contract of contracts) {
    const id = drawn.get(contract)?.id
    if (id !== undefined && !selected.includes(id)) {
      selected.push(id)
    }
  }
  const first = selected[0]
  const node = first === undefined ? undefined : drawn.get(first)

  if (!node) {
    return { selected: [] }
  }

  const minX = node.box.x
  const minY = node.box.y
  const maxX = node.box.x + node.box.width
  const maxY = node.box.y + node.box.height

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
    selected,
  }
}
