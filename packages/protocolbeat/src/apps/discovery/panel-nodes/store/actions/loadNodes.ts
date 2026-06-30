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
  type StoredGroup,
  type StoredNodeLayout,
} from '../utils/storage'
import { updateNodePositions } from '../utils/updateNodePositions'
import { makeGroupNode } from './group'
import { layout } from './other'

const NEW_NODE_HORIZONTAL_GAP = 120
const NEW_NODE_VERTICAL_GAP = 40

export function loadNodes(
  state: State,
  projectId: string,
  nodes: Node[],
): Partial<State> {
  const toAddRaw: Node[] = nodes.filter(
    (x) => !state.nodes.some((y) => x.id === y.id),
  )
  const existingRaw: Node[] = state.nodes.map((node) => {
    const newNode = nodes.find((x) => x.id === node.id)
    return newNode ? { ...newNode, box: node.box, color: node.color } : node
  })
  const knownIds = new Set([...toAddRaw, ...existingRaw].map((node) => node.id))
  const dropDanglingFields = (node: Node): Node => ({
    ...node,
    fields: node.fields.filter((field) => knownIds.has(field.target)),
  })
  const toAdd = toAddRaw.map(dropDanglingFields)
  const existing = existingRaw.map(dropDanglingFields)

  const saved = recallNodeLayout(projectId)
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
      visibleFieldsCount * FIELD_HEIGHT +
      BOTTOM_PADDING +
      hiddenFieldsHeight
    const savedColor = saved?.colors?.[node.id]
    const color = savedColor ?? node.color

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

  const flatNodes = existing.concat(added)
  // Rebuild user-created groups from the saved layout, re-nesting the freshly
  // loaded contracts. Members live nested, so ids are gathered from the tree.
  const allNodes = saved?.groups?.length
    ? reconstructGroups(flatNodes, saved.groups)
    : flatNodes
  const allNodeIds = collectAllIds(allNodes)

  const savedHiddenNodes = saved?.hiddenNodes ?? []
  const shouldReuseCurrentHidden = state.projectId === projectId
  const baseHiddenNodes = shouldReuseCurrentHidden ? state.hidden : []
  const hiddenNodes = [
    ...new Set([...savedHiddenNodes, ...baseHiddenNodes]),
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

  return updateNodePositions(state, {
    hidden: hiddenNodes,
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

function collectAllIds(nodes: readonly Node[]): Set<string> {
  const ids = new Set<string>()
  const walk = (list: readonly Node[]) => {
    for (const node of list) {
      ids.add(node.id)
      walk(node.subnodes)
    }
  }
  walk(nodes)
  return ids
}

// Re-nest the flat contracts into their saved groups. Built bottom-up so a
// nested group is ready before its parent; a group whose members all vanished
// (e.g. the contract is gone from the API) is dropped.
function reconstructGroups(flat: Node[], groups: StoredGroup[]): Node[] {
  const byId = new Map(flat.map((node) => [node.id, node]))
  const groupIds = new Set(groups.map((group) => group.id))
  const built = new Set<string>()
  const consumed = new Set<string>()

  let progressed = true
  while (progressed) {
    progressed = false
    for (const group of groups) {
      if (built.has(group.id)) {
        continue
      }
      const childGroups = group.members.filter((id) => groupIds.has(id))
      if (!childGroups.every((id) => built.has(id))) {
        continue
      }
      built.add(group.id)
      progressed = true
      const members = group.members
        .map((id) => byId.get(id))
        .filter((node): node is Node => node !== undefined)
      if (members.length === 0) {
        continue
      }
      for (const member of members) {
        consumed.add(member.id)
      }
      byId.set(group.id, makeGroupNode(group, members))
    }
  }

  const result: Node[] = []
  for (const node of flat) {
    if (!consumed.has(node.id)) {
      result.push(node)
    }
  }
  for (const group of groups) {
    if (consumed.has(group.id)) {
      continue
    }
    const node = byId.get(group.id)
    if (node) {
      result.push(node)
    }
  }
  return result
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
