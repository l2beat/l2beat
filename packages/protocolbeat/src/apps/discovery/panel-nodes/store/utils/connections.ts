import type { Connection, Field, Node } from '../State'
import { FIELD_HEIGHT, HEADER_HEIGHT } from './constants'
import { getNodeSummaryLineCount, resolveFieldTarget } from './entrypointGroups'

export function processConnection(
  index: number,
  from: { x: number; y: number; width: number },
  to: { x: number; y: number; width: number },
  fieldOffsetY = 0,
): Connection {
  const fromY =
    from.y + HEADER_HEIGHT + fieldOffsetY + FIELD_HEIGHT * (index + 0.5)
  const toY = to.y + HEADER_HEIGHT / 2

  const left = from.x
  const right = from.x + from.width

  const leftToLeft = Math.abs(to.x - left)
  const leftToRight = Math.abs(to.x + to.width - left)
  const rightToLeft = Math.abs(to.x - right)
  const rightToRight = Math.abs(to.x + to.width - right)

  const min = Math.min(leftToLeft, leftToRight, rightToLeft, rightToRight)

  if (min === leftToLeft) {
    return {
      from: { direction: 'left', x: from.x, y: fromY },
      to: { direction: 'left', x: to.x, y: toY },
    }
  }
  if (min === leftToRight) {
    return {
      from: { direction: 'left', x: from.x, y: fromY },
      to: { direction: 'right', x: to.x + to.width, y: toY },
    }
  }
  if (min === rightToLeft) {
    return {
      from: { direction: 'right', x: from.x + from.width, y: fromY },
      to: { direction: 'left', x: to.x, y: toY },
    }
  }
  if (min === rightToRight) {
    return {
      from: { direction: 'right', x: from.x + from.width, y: fromY },
      to: { direction: 'right', x: to.x + to.width, y: toY },
    }
  }

  throw new Error('impossible min result')
}

export function getResolvedFieldConnection(
  sourceNode: Node,
  field: Field,
  fieldIndex: number,
  visibleById: Map<string, Node>,
  targetResolver: Map<string, string>,
): Connection | undefined {
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
