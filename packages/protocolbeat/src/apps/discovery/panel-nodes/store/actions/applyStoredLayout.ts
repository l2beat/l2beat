import type { State } from '../State'
import { hideItems, mapGraphItems } from '../utils/graphProjection'
import {
  reconcileNodeHiddenFields,
  type StoredNodeLayout,
} from '../utils/storage'
import { updateNodePositions } from '../utils/updateNodePositions'

export type ApplyLayoutMode = 'merge' | 'replace'

export function applyStoredLayout(
  state: State,
  saved: StoredNodeLayout,
  mode: ApplyLayoutMode,
): Partial<State> {
  const nodesWithFields = mapGraphItems(state.nodes, (node) => {
    const imported = saved.hiddenFields?.[node.id] ?? []
    const hiddenFields =
      mode === 'merge' ? [...node.hiddenFields, ...imported] : imported
    return {
      ...node,
      hiddenFields: reconcileNodeHiddenFields(node.fields, hiddenFields),
    }
  })
  const updatedNodes = nodesWithFields.map((node) => {
    const savedBox = saved.locations[node.id]
    const savedColor = saved.colors?.[node.id]

    if (mode === 'replace') {
      return {
        ...node,
        color: savedColor ?? 0,
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
    if (savedColor !== undefined) {
      next = { ...next, color: savedColor }
    }
    return next
  })

  const nodes = hideItems(updatedNodes, new Set(saved.hiddenNodes ?? []))
  return updateNodePositions(state, { nodes })
}
