import type { Field, Node } from '../State'
import { FIELD_HEIGHT } from './constants'
import { processConnection } from './connectionGeometry'
import { getNodeSummaryLineCount, resolveFieldTarget } from './entrypointGroups'

export { processConnection } from './connectionGeometry'

export function getResolvedFieldConnection(
  sourceNode: Node,
  field: Field,
  fieldIndex: number,
  visibleById: Map<string, Node>,
  targetResolver: Map<string, string>,
) {
  const resolvedTarget = resolveFieldTarget(field.target, targetResolver)
  const targetNode = visibleById.get(resolvedTarget)
  if (!targetNode) {
    return undefined
  }

  if (resolvedTarget === field.target) {
    return field.connection
  }

  const hiddenFieldsSet =
    sourceNode.hiddenFields.length > 0
      ? new Set(sourceNode.hiddenFields)
      : undefined
  let visibleIndex = 0
  for (let i = 0; i < fieldIndex; i++) {
    const name = sourceNode.fields[i]?.name
    if (name && !hiddenFieldsSet?.has(name)) {
      visibleIndex++
    }
  }

  const fieldOffsetY = getNodeSummaryLineCount(sourceNode) * FIELD_HEIGHT
  return processConnection(
    visibleIndex,
    sourceNode.box,
    targetNode.box,
    fieldOffsetY,
  )
}
