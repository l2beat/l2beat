import { stackAutoLayout } from '../../controls/StackLayoutButton'
import type { Node, State } from '../State'
import {
  BOTTOM_PADDING,
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  HIDDEN_FIELDS_FOOTER_HEIGHT,
  NODE_WIDTH,
  VALUE_SEPARATOR_HEIGHT,
} from '../utils/constants'
import {
  type NodeLocations,
  recallNodeLayout,
  type StoredNodeLayout,
} from '../utils/storage'
import { layout } from './other'
import { setNodes as applyNodePositions } from './setNodes'

const NEW_NODE_HORIZONTAL_GAP = 120
const NEW_NODE_VERTICAL_GAP = 40

export function loadNodes(
  state: State,
  projectId: string,
  nodes: Node[],
): Partial<State> {
  const toAdd: Node[] = nodes.filter(
    (x) => !state.nodes.some((y) => x.id === y.id),
  )
  const existing: Node[] = state.nodes.map((node) => {
    const newNode = nodes.find((x) => x.id === node.id)
    return newNode ? { ...newNode, box: node.box, color: node.color } : node
  })
  toAdd.push(...createUnknownNodes([...toAdd, ...existing]))

  const saved = recallNodeLayout(projectId)
  const nodesWithoutSavedLayout = new Set<string>()
  const added = toAdd.map((node) => {
    const hiddenFields = combinedHiddenFields(node, saved)

    const box = saved?.locations[node.id]
    const x = box?.x ?? 0
    const y = box?.y ?? 0
    const width = box?.width ?? NODE_WIDTH
    const addressFields = node.fields.filter((field) => field.type === 'address')
    const valueFields = node.fields.filter((field) => field.type === 'value')
    const visibleAddressCount = addressFields.filter(
      (field) => !hiddenFields.includes(field.name),
    ).length
    const visibleValueCount = valueFields.filter(
      (field) => !hiddenFields.includes(field.name),
    ).length
    const hasValueSection = valueFields.length > 0
    const hiddenFieldsHeight =
      hiddenFields.length > 0 ? HIDDEN_FIELDS_FOOTER_HEIGHT : 0
    const height =
      HEADER_HEIGHT +
      visibleAddressCount * FIELD_HEIGHT +
      (hasValueSection ? VALUE_SEPARATOR_HEIGHT : 0) +
      visibleValueCount * FIELD_HEIGHT +
      BOTTOM_PADDING +
      hiddenFieldsHeight
    const savedColor = saved?.colors?.[node.id]
    const color = typeof savedColor === 'number' ? savedColor : node.color

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
  const unknownNodeIds = state.userPreferences.hideUnknownOnLoad
    ? allNodes
        .filter((node) => node.addressType === 'Unknown')
        .map((node) => node.id)
    : []

  const savedHiddenNodes = saved?.hiddenNodes ?? []
  const shouldReuseCurrentHidden = state.projectId === projectId
  const baseHiddenNodes = shouldReuseCurrentHidden ? state.hidden : []
  const hiddenNodes = [
    ...new Set([...savedHiddenNodes, ...baseHiddenNodes, ...unknownNodeIds]),
  ].filter((id) => allNodeIds.has(id))
  const visibleNodes = allNodes.filter((node) => !hiddenNodes.includes(node.id))
  const hasSavedLayout =
    !!saved && allNodes.some((node) => saved.locations[node.id] !== undefined)

  const baseState = {
    ...state,
    hidden: hiddenNodes,
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

  return applyNodePositions(
    {
      ...baseState,
      nodes: nodesWithFallback,
    },
    nodesWithFallback,
  )
}

function createUnknownNodes(nodes: Node[]): Node[] {
  const unknownIds = new Set<string>()
  const knownIds = new Set(nodes.map((node) => node.id))

  for (const node of nodes) {
    for (const field of node.fields) {
      if (field.type === 'address' && !knownIds.has(field.target)) {
        unknownIds.add(field.target)
      }
    }
  }

  return [...unknownIds].map(idToUnknown)
}

function idToUnknown(id: string): Node {
  // TODO: better address treatment
  const address = id.split(':')[1] as string
  const name = `Unknown ${address.slice(0, 6)}…${address.slice(-4)}`
  return {
    id,
    address,
    isReachable: false,
    isInitial: false,
    hasTemplate: false,
    addressType: 'Unknown',
    name,
    box: { x: 0, y: 0, width: 0, height: 0 },
    color: 0,
    hueShift: 0,
    fields: [],
    hiddenFields: [],
    data: null,
  }
}

function combinedHiddenFields(
  node: Node,
  saved: StoredNodeLayout | undefined,
): string[] {
  const recalledHiddenFields = saved?.hiddenFields?.[node.id] ?? []
  const defaultHiddenFields = node.hiddenFields
  return [...new Set([...recalledHiddenFields, ...defaultHiddenFields])]
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
