import { stackAutoLayout } from '../../controls/StackLayoutButton'
import type { Node, State } from '../State'
import {
  BOTTOM_PADDING,
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  HIDDEN_FIELDS_FOOTER_HEIGHT,
  NODE_WIDTH,
} from '../utils/constants'
import {
  type NodeLocations,
  recallNodeLayout,
  reconcileHiddenFields,
  type StoredNodeLayout,
} from '../utils/storage'
import { resolveNodeColorOnLoad } from '../../entrypointColors'
import { getNodeSummaryLineCount } from '../utils/entrypointGroups'
import { updateNodePositions } from '../utils/updateNodePositions'
import { layout } from './other'

const NEW_NODE_HORIZONTAL_GAP = 120
const NEW_NODE_VERTICAL_GAP = 40

export function loadNodes(
  state: State,
  projectId: string,
  nodes: Node[],
): Partial<State> {
  const saved = recallNodeLayout(projectId)
  const toAddRaw: Node[] = nodes.filter(
    (x) => !state.nodes.some((y) => x.id === y.id),
  )
  const existingRaw: Node[] = state.nodes.map((node) => {
    const newNode = nodes.find((x) => x.id === node.id)
    return newNode
      ? {
          ...newNode,
          box: node.box,
          color: resolveNodeColorOnLoad(newNode, saved?.colors),
        }
      : node
  })
  const knownIds = new Set([...toAddRaw, ...existingRaw].map((node) => node.id))
  const dropDanglingFields = (node: Node): Node => ({
    ...node,
    fields: node.fields.filter((field) => knownIds.has(field.target)),
  })
  const toAdd = toAddRaw.map(dropDanglingFields)
  const existing = existingRaw.map(dropDanglingFields)

  const nodesWithoutSavedLayout = new Set<string>()
  const added = toAdd.map((node) => {
    const hiddenFields = combinedHiddenFields(node, saved)

    const box = saved?.locations[node.id]
    const x = box?.x ?? 0
    const y = box?.y ?? 0
    const width = box?.width ?? NODE_WIDTH
    const hiddenFieldsHeight =
      hiddenFields.length > 0 ? HIDDEN_FIELDS_FOOTER_HEIGHT : 0
    const visibleFieldsCount = Math.max(
      0,
      node.fields.length - hiddenFields.length,
    )
    const height =
      HEADER_HEIGHT +
      getNodeSummaryLineCount(node) * FIELD_HEIGHT +
      visibleFieldsCount * FIELD_HEIGHT +
      BOTTOM_PADDING +
      hiddenFieldsHeight
    const color = resolveNodeColorOnLoad(node, saved?.colors)

    if (!box) {
      nodesWithoutSavedLayout.add(node.id)
    }

    return {
      ...node,
      color,
      hiddenFields,
      box: { x, y, width, height: height },
    }
  })

  const allNodes = existing.concat(added)
  const allNodeIds = new Set(allNodes.map((node) => node.id))

  const savedHiddenNodes = saved?.hiddenNodes ?? []
  const shouldReuseCurrentHidden = state.projectId === projectId
  const baseHiddenNodes = shouldReuseCurrentHidden ? state.hidden : []
  const hiddenNodes = [
    ...new Set([...savedHiddenNodes, ...baseHiddenNodes]),
  ].filter((id) => allNodeIds.has(id))

  const savedCollapsedGroups = saved?.collapsedEntrypointGroups ?? []
  const shouldReuseCollapsedGroups = state.projectId === projectId
  const collapsedEntrypointGroups = shouldReuseCollapsedGroups
    ? state.collapsedEntrypointGroups
    : savedCollapsedGroups
  const visibleNodes = allNodes.filter((node) => !hiddenNodes.includes(node.id))
  const hasSavedLayout =
    !!saved && allNodes.some((node) => saved.locations[node.id] !== undefined)

  const baseState = {
    ...state,
    hidden: hiddenNodes,
    collapsedEntrypointGroups,
    nodes: allNodes,
    projectId,
    loaded: true,
  }

  const shouldAutoLayoutFromScratch =
    state.nodes.length === 0 && !hasSavedLayout
  if (shouldAutoLayoutFromScratch) {
    return layout(baseState, stackAutoLayout(visibleNodes))
  }

  const fallbackLocations =
    saved && hasSavedLayout && nodesWithoutSavedLayout.size > 0
      ? placeNewNodes(allNodes, nodesWithoutSavedLayout, saved)
      : {}

  const nodesWithFallback =
    Object.keys(fallbackLocations).length === 0
      ? allNodes
      : allNodes.map((node) => {
          const fallback = fallbackLocations[node.id]
          if (!fallback) {
            return node
          }
          return {
            ...node,
            box: {
              ...node.box,
              x: fallback.x,
              y: fallback.y,
            },
          }
        })

  return updateNodePositions(state, {
    hidden: hiddenNodes,
    collapsedEntrypointGroups,
    nodes: nodesWithFallback,
    projectId,
    loaded: true,
  })
}

function combinedHiddenFields(
  node: Node,
  saved: StoredNodeLayout | undefined,
): string[] {
  const recalledHiddenFields = saved?.hiddenFields?.[node.id] ?? []
  const defaultHiddenFields = node.hiddenFields
  const fieldNames = node.fields.map((f) => f.name)
  return reconcileHiddenFields(fieldNames, [
    ...recalledHiddenFields,
    ...defaultHiddenFields,
  ])
}

function placeNewNodes(
  nodes: Node[],
  missingIds: Set<string>,
  saved: StoredNodeLayout,
): NodeLocations {
  const anchors = nodes.filter((node) => saved.locations[node.id] !== undefined)
  if (anchors.length === 0) {
    return {}
  }

  const rightEdge = Math.max(
    ...anchors.map((node) => node.box.x + node.box.width),
  )
  const topEdge = Math.min(...anchors.map((node) => node.box.y))

  const placement: NodeLocations = {}
  let currentY = topEdge

  for (const node of nodes) {
    if (!missingIds.has(node.id)) {
      continue
    }
    placement[node.id] = {
      x: rightEdge + NEW_NODE_HORIZONTAL_GAP,
      y: currentY,
    }
    currentY += node.box.height + NEW_NODE_VERTICAL_GAP
  }

  return placement
}
