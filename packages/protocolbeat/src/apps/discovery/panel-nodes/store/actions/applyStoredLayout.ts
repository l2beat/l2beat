import type { Node, State } from '../State'
import { setItemsHidden, updateLeafNodes } from '../utils/graphProjection'
import { reconcileHiddenFields, type StoredNodeLayout } from '../utils/storage'
import { updateNodePositions } from '../utils/updateNodePositions'

export type ApplyLayoutMode = 'merge' | 'replace'

function fieldNamesOf(node: Node): string[] {
  return node.fields.map((field) => field.name)
}

export function applyStoredLayout(
  state: State,
  saved: StoredNodeLayout,
  mode: ApplyLayoutMode,
): Partial<State> {
  const nodesWithFields = updateLeafNodes(state.nodes, (node) => {
    const imported = saved.hiddenFields?.[node.id] ?? []
    const hiddenFields =
      mode === 'merge' ? [...node.hiddenFields, ...imported] : imported
    return {
      ...node,
      hiddenFields: reconcileHiddenFields(fieldNamesOf(node), hiddenFields),
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

  const nodes = setItemsHidden(
    updatedNodes,
    new Set(saved.hiddenNodes ?? []),
    true,
  )
  return updateNodePositions(state, { nodes })
}
