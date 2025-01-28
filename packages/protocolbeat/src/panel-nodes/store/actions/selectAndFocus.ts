import type { State } from '../State'

export function selectAndFocus(
  state: State,
  selected: readonly string[],
): Partial<State> {
  if (
    state.selected.length === selected.length &&
    state.selected.every((x, i) => x === selected[i])
  ) {
    return state
  }

  if (selected.length === 0) {
    return { selected }
  }

  let minX = Infinity
  let minY = Infinity
  const nodes = state.nodes.filter((x) => selected.includes(x.id))
  for (const node of nodes) {
    minX = Math.min(node.box.x, minX)
    minY = Math.min(node.box.y, minY)
  }

  return {
    transform: {
      // TODO: In the future this should center. Maybe even animate
      ...state.transform,
      offsetX: 100 - minX * state.transform.scale,
      offsetY: 100 - minY * state.transform.scale,
    },
    selected,
  }
}
