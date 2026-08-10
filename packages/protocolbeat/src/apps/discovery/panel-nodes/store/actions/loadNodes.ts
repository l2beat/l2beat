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
  getGraphProjection,
  hideItems,
  mapGraphItems,
} from '../utils/graphProjection'
import {
  type NodeLocations,
  recallNodeLayout,
  reconcileNodeHiddenFields,
  type StoredGroup,
  type StoredNodeLayout,
} from '../utils/storage'
import { updateNodePositions } from '../utils/updateNodePositions'
import { makeGroupNode } from './group'
import { layout } from './other'

const NEW_NODE_HORIZONTAL_GAP = 120
const NEW_NODE_VERTICAL_GAP = 40

export interface AutoGroup {
  readonly id: string
  readonly name: string
  readonly memberIds: readonly string[]
}

export function loadNodes(
  state: State,
  projectId: string,
  nodes: Node[],
  autoGroups: AutoGroup[],
): Partial<State> {
  const toAddRaw: Node[] = nodes.filter(
    (x) => !state.nodes.some((y) => x.id === y.id),
  )
  const existingRaw: Node[] = state.nodes.map((node) => {
    const newNode = nodes.find((x) => x.id === node.id)
    if (!newNode) return node
    // Keep the user's choices for fields that already existed; default hides
    // (e.g. large arrays) only apply to fields that just appeared.
    const knownFieldNames = new Set(node.fields.map((field) => field.name))
    const newDefaults = newNode.hiddenFields.filter(
      (name) => !knownFieldNames.has(name),
    )
    const hiddenFields = reconcileNodeHiddenFields(newNode.fields, [
      ...node.hiddenFields,
      ...newDefaults,
    ])
    return { ...newNode, box: node.box, color: node.color, hiddenFields }
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
  const groupedNodes = saved?.groups?.length
    ? reconstructGroups(flatNodes, saved.groups)
    : flatNodes
  const nodesWithSavedGroupFields = restoreSavedGroupFields(groupedNodes, saved)
  const allNodes = hideItems(
    nodesWithSavedGroupFields,
    new Set(saved?.hiddenNodes ?? []),
  )
  const projection = getGraphProjection(allNodes)
  const visibleNodes = allNodes.filter(
    (node) => !projection.hiddenNodeIds.has(node.id),
  )
  const hasSavedLayout =
    !!saved && allNodes.some((node) => saved.locations[node.id] !== undefined)

  const baseState = {
    ...state,
    nodes: allNodes,
    projectId,
    loaded: true,
  }

  const shouldAutoLayoutFromScratch =
    state.nodes.length === 0 && !hasSavedLayout
  if (shouldAutoLayoutFromScratch) {
    const laidOut = {
      ...baseState,
      ...layout(
        baseState,
        stackAutoLayout(visibleNodes, true, projection.visibleEdges),
      ),
    }
    return collapseAutoGroups(laidOut, autoGroups)
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
  return reconcileNodeHiddenFields(node.fields, [
    ...recalledHiddenFields,
    ...defaultHiddenFields,
  ])
}

function restoreSavedGroupFields(
  nodes: readonly Node[],
  saved: StoredNodeLayout | undefined,
): readonly Node[] {
  if (saved?.hiddenFields === undefined) return nodes
  return mapGraphItems(nodes, (node) => {
    if (node.subnodes.length === 0) return node
    const imported = saved.hiddenFields?.[node.id]
    if (imported === undefined) return node
    const hiddenFields = reconcileNodeHiddenFields(node.fields, imported)
    return { ...node, hiddenFields }
  })
}

function collapseAutoGroups(state: State, autoGroups: AutoGroup[]): State {
  const byId = new Map(state.nodes.map((node) => [node.id, node]))
  const groups = autoGroups
    .map((group) => toStoredGroup(group, byId))
    .filter((group): group is StoredGroup => group !== undefined)
  if (groups.length === 0) {
    return state
  }
  return updateNodePositions(state, {
    nodes: reconstructGroups(state.nodes, groups),
  })
}

function toStoredGroup(
  group: AutoGroup,
  byId: Map<string, Node>,
): StoredGroup | undefined {
  const anchor = group.memberIds.map((id) => byId.get(id)).find(Boolean)?.box
  if (anchor === undefined) {
    return undefined
  }
  return {
    id: group.id,
    name: group.name,
    color: 0,
    opened: false,
    box: { x: anchor.x, y: anchor.y, width: NODE_WIDTH, height: NODE_WIDTH },
    members: [...group.memberIds],
  }
}
// Re-nest the flat contracts into their saved groups. Built bottom-up so a
// nested group is ready before its parent; a group whose members all vanished
// (e.g. the contract is gone from the API) is dropped.
function reconstructGroups(
  flat: readonly Node[],
  groups: StoredGroup[],
): Node[] {
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
      const firstMember = members[0]
      const colorSettings =
        group.id.startsWith('group:shared:') && firstMember !== undefined
          ? {
              color: group.color === 0 ? firstMember.color : group.color,
              colorSourceId: firstMember.colorSourceId ?? firstMember.id,
              hueShift: firstMember.hueShift,
            }
          : undefined
      byId.set(group.id, makeGroupNode(group, members, colorSettings))
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
  nodes: readonly Node[],
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
