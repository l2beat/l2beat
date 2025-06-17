import type { State } from '../State'

export function selectAndFocus(state: State, selected: string): Partial<State> {
  const node = state.nodes.find((x) => x.id === selected)

  if (!node) {
    return state
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
    selected: [selected],
  }
}
