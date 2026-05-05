import type { State } from '../State'
import type { StoredNodeLayout } from '../utils/storage'
import { updateNodePositions } from '../utils/updateNodePositions'

export type ApplyLayoutMode = 'merge' | 'replace'

export function applyStoredLayout(
  state: State,
  saved: StoredNodeLayout,
  mode: ApplyLayoutMode,
): Partial<State> {
  const updatedNodes = state.nodes.map((node) => {
    const savedBox = saved.locations[node.id]
    const savedColor = saved.colors?.[node.id]
    const savedHiddenFields = saved.hiddenFields?.[node.id]

    if (mode === 'replace') {
      return {
        ...node,
        color: typeof savedColor === 'number' ? savedColor : 0,
        hiddenFields: savedHiddenFields ?? [],
        box: {
          ...node.box,
          x: savedBox?.x ?? node.box.x,
          y: savedBox?.y ?? node.box.y,
          width: savedBox?.width ?? node.box.width,
        },
      }
    }

    let next = node
    if (savedBox) {
      next = {
        ...next,
        box: {
          ...next.box,
          x: savedBox.x,
          y: savedBox.y,
          width: savedBox.width ?? next.box.width,
        },
      }
    }
    if (typeof savedColor === 'number') {
      next = { ...next, color: savedColor }
    }
    if (savedHiddenFields !== undefined) {
      next = { ...next, hiddenFields: savedHiddenFields }
    }
    return next
  })

  const allIds = new Set(updatedNodes.map((n) => n.id))
  const fileHidden = (saved.hiddenNodes ?? []).filter((id) => allIds.has(id))
  const newHidden =
    mode === 'replace'
      ? fileHidden
      : [...new Set([...state.hidden, ...fileHidden])]

  return updateNodePositions({
    ...state,
    nodes: updatedNodes,
    hidden: newHidden,
  })
}
