import type { State } from '../State'
import { boxContains } from '../utils/containment'
import { toViewCoordinates } from '../utils/coordinates'
import {
  getEntrypointGroupIdForNode,
  getVisibleDisplayedNodes,
} from '../utils/entrypointGroups'
import { toggleEntrypointGroup } from './other'

export function onNodeDoubleClick(
  state: State,
  event: MouseEvent,
  container: HTMLElement,
): Partial<State> {
  const { x, y } = toViewCoordinates(event, container, state.transform)
  const node = getVisibleDisplayedNodes(state).find((entry) =>
    boxContains(entry.box, x, y),
  )
  if (!node) {
    return {}
  }

  const groupId = getEntrypointGroupIdForNode(node, state.entrypointGroups)
  if (groupId) {
    return toggleEntrypointGroup(state, groupId)
  }

  return {}
}
