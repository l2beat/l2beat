import type { State } from '../State'
import { boxContains } from '../utils/containment'
import { toViewCoordinates } from '../utils/coordinates'
import { reverseIter } from '../utils/reverseIter'
import { updateNodePositions } from '../utils/updateNodePositions'

export function onDoubleClick(
  state: State,
  event: MouseEvent,
  container: HTMLElement,
): Partial<State> {
  const { x, y } = toViewCoordinates(event, container, state.transform)

  for (const node of reverseIter(state.nodes)) {
    if (state.hidden.includes(node.id)) {
      continue
    }

    if (boxContains(node.box, x, y)) {
      const nodes = state.nodes.map((other) =>
        other.id === node.id ? { ...other, opened: !other.opened } : other,
      )

      return updateNodePositions(state, { nodes })
    }
  }

  return {}
}
