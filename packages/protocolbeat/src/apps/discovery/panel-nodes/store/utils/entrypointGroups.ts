import type { ApiEntrypointGroup } from '../../../../../api/types'
import type { EntrypointGroupInfo, Node, State } from '../State'
import {
  BOTTOM_PADDING,
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  HIDDEN_FIELDS_FOOTER_HEIGHT,
  NODE_WIDTH,
} from './constants'
import { processConnection } from './connectionGeometry'

const ENTRYPOINT_SUMMARY_LINES = 1

export const entrypointGroupNodeId = (groupId: string) => `entrypoint:${groupId}`

export function isEntrypointGroupNodeId(id: string): boolean {
  return id.startsWith('entrypoint:')
}

export function getEntrypointGroupIdFromNodeId(id: string): string | undefined {
  if (!isEntrypointGroupNodeId(id)) {
    return undefined
  }
  return id.slice('entrypoint:'.length)
}

export function findDeclaredEntrypointGroupId(
  address: string,
  groups: readonly ApiEntrypointGroup[],
): string | undefined {
  let fallback: string | undefined
  for (const group of groups) {
    if (!getDeclaredEntrypointAddresses(group).includes(address)) {
      continue
    }
    if (isPerEntrypointGroup(group)) {
      return group.id
    }
    fallback ??= group.id
  }
  return fallback
}

export function getEntrypointGroupIdForNode(
  node: Pick<Node, 'id' | 'entrypointMemberOf' | 'entrypointGroup'>,
  groups?: readonly ApiEntrypointGroup[],
): string | undefined {
  if (isEntrypointGroupNodeId(node.id)) {
    return getEntrypointGroupIdFromNodeId(node.id)
  }
  if (node.entrypointGroup) {
    return node.entrypointGroup.groupId
  }
  if (groups) {
    const declaredGroup = findDeclaredEntrypointGroupId(node.id, groups)
    if (declaredGroup) {
      return declaredGroup
    }
  }
  return node.entrypointMemberOf
}

export function getDeclaredEntrypointAddresses(
  group: Pick<ApiEntrypointGroup, 'declaredMemberAddresses' | 'memberAddresses'>,
): readonly string[] {
  return group.declaredMemberAddresses ?? group.memberAddresses
}

/** Per-entrypoint groups use `project::address` ids; module-wide groups use the project name. */
export function isPerEntrypointGroup(
  group: Pick<ApiEntrypointGroup, 'id'>,
): boolean {
  return group.id.includes('::')
}

export function getCollapseSeedAddresses(
  group: Pick<
    ApiEntrypointGroup,
    'id' | 'declaredMemberAddresses' | 'memberAddresses' | 'bridgeAddresses'
  >,
): readonly string[] {
  if (isPerEntrypointGroup(group)) {
    return getDeclaredEntrypointAddresses(group)
  }
  if (group.bridgeAddresses.length > 0) {
    return group.bridgeAddresses
  }
  return group.memberAddresses
}

export interface EntrypointCollapseContext {
  groups: readonly ApiEntrypointGroup[]
  collapsedGroupIds: readonly string[]
}

export interface EntrypointCollapseResult {
  nodes: readonly Node[]
  hidden: readonly string[]
  targetResolver: Map<string, string>
}

export function formatAppearsInProjectsLabel(appearsInProjectsCount: number): string {
  return `[in ${appearsInProjectsCount} project${appearsInProjectsCount === 1 ? '' : 's'}]`
}

export function getNodeSummaryLineCount(
  node: Pick<Node, 'entrypointGroup'>,
): number {
  return node.entrypointGroup ? ENTRYPOINT_SUMMARY_LINES : 0
}

export function getDisplayedNodes(
  state: Pick<
    State,
    'nodes' | 'hidden' | 'entrypointGroups' | 'collapsedEntrypointGroups'
  >,
): EntrypointCollapseResult {
  return applyEntrypointCollapse(state.nodes, state.hidden, {
    groups: state.entrypointGroups,
    collapsedGroupIds: state.collapsedEntrypointGroups,
  })
}

export function getVisibleDisplayedNodes(
  state: Pick<
    State,
    'nodes' | 'hidden' | 'entrypointGroups' | 'collapsedEntrypointGroups'
  >,
): Node[] {
  const displayed = getDisplayedNodes(state)
  const hiddenSet = new Set(displayed.hidden)
  return displayed.nodes.filter((node) => !hiddenSet.has(node.id))
}

export function resolveFocusNodeId(
  nodeId: string,
  state: Pick<
    State,
    'entrypointGroups' | 'collapsedEntrypointGroups' | 'hidden'
  >,
): string {
  if (isEntrypointGroupNodeId(nodeId)) {
    return nodeId
  }

  const collapsedGroup = state.entrypointGroups.find(
    (group) =>
      state.collapsedEntrypointGroups.includes(group.id) &&
      (group.bridgeAddresses.includes(nodeId) ||
        group.memberAddresses.includes(nodeId)),
  )
  if (collapsedGroup) {
    return entrypointGroupNodeId(collapsedGroup.id)
  }

  return nodeId
}

export function resolvePhysicalNodeId(
  nodeId: string,
  state: Pick<State, 'entrypointGroups' | 'nodes'>,
): string {
  if (!isEntrypointGroupNodeId(nodeId)) {
    return nodeId
  }

  const groupId = getEntrypointGroupIdFromNodeId(nodeId)
  if (!groupId) {
    return nodeId
  }

  const bridgeAddress = getEntrypointBridgeAddress(
    groupId,
    state.entrypointGroups,
  )
  if (bridgeAddress && state.nodes.some((node) => node.id === bridgeAddress)) {
    return bridgeAddress
  }

  return nodeId
}

export function normalizeSelectionForDisplay(
  selected: readonly string[],
  state: Pick<
    State,
    'entrypointGroups' | 'collapsedEntrypointGroups' | 'hidden'
  >,
): string[] {
  return [
    ...new Set(selected.map((id) => resolveFocusNodeId(id, state))),
  ]
}

export function expandSelectionForHighlighting(
  selected: readonly string[],
  state: Pick<
    State,
    'entrypointGroups' | 'collapsedEntrypointGroups' | 'hidden'
  >,
): Set<string> {
  const result = new Set(normalizeSelectionForDisplay(selected, state))

  for (const id of result) {
    if (!isEntrypointGroupNodeId(id)) {
      continue
    }
    const groupId = getEntrypointGroupIdFromNodeId(id)
    if (!groupId || !state.collapsedEntrypointGroups.includes(groupId)) {
      continue
    }
    const group = state.entrypointGroups.find((entry) => entry.id === groupId)
    if (!group) {
      continue
    }
    for (const memberId of group.memberAddresses) {
      result.add(memberId)
    }
  }

  return result
}

export function isSelectionTargetHighlighted(
  fieldTarget: string,
  resolvedTarget: string,
  displaySelected: ReadonlySet<string>,
  highlightSelection: ReadonlySet<string>,
): boolean {
  return (
    displaySelected.has(resolvedTarget) ||
    highlightSelection.has(fieldTarget) ||
    highlightSelection.has(resolvedTarget)
  )
}

export function getEntrypointBridgeAddress(
  groupId: string,
  groups: readonly ApiEntrypointGroup[],
): string | undefined {
  const group = groups.find((entry) => entry.id === groupId)
  if (!group) {
    return undefined
  }
  const declared = getDeclaredEntrypointAddresses(group)
  return (
    group.bridgeAddresses.find((address) => declared.includes(address)) ??
    declared[0] ??
    group.bridgeAddresses[0] ??
    group.memberAddresses[0]
  )
}

export function getDragPositionsForSelection(
  state: Pick<State, 'nodes' | 'entrypointGroups'>,
  selected: readonly string[],
): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {}

  for (const id of selected) {
    if (isEntrypointGroupNodeId(id)) {
      const groupId = getEntrypointGroupIdFromNodeId(id)
      if (!groupId) {
        continue
      }
      const bridgeAddress = getEntrypointBridgeAddress(
        groupId,
        state.entrypointGroups,
      )
      const bridgeNode = bridgeAddress
        ? state.nodes.find((node) => node.id === bridgeAddress)
        : undefined
      if (bridgeNode) {
        positions[bridgeNode.id] = {
          x: bridgeNode.box.x,
          y: bridgeNode.box.y,
        }
      }
      continue
    }

    const node = state.nodes.find((entry) => entry.id === id)
    if (node) {
      positions[node.id] = { x: node.box.x, y: node.box.y }
    }
  }

  return positions
}

interface CollapsePlan {
  group: ApiEntrypointGroup
  groupNodeId: string
  memberIds: Set<string>
  bridgeNode: Node
  entrypointGroup: EntrypointGroupInfo
}

export function applyEntrypointCollapse(
  nodes: readonly Node[],
  hidden: readonly string[],
  context: EntrypointCollapseContext,
): EntrypointCollapseResult {
  const collapsed = new Set(context.collapsedGroupIds)
  if (collapsed.size === 0 || context.groups.length === 0) {
    return { nodes, hidden, targetResolver: new Map() }
  }

  const nodesById = new Map(nodes.map((node) => [node.id, node]))
  const hiddenSet = new Set(hidden)
  const targetResolver = new Map<string, string>()
  const plans: CollapsePlan[] = []

  for (const group of context.groups) {
    if (!collapsed.has(group.id)) {
      continue
    }

    const groupNodeId = entrypointGroupNodeId(group.id)
    const memberIds = new Set(
      group.memberAddresses.filter((address) => nodesById.has(address)),
    )
    for (const address of getDeclaredEntrypointAddresses(group)) {
      if (nodesById.has(address)) {
        memberIds.add(address)
      }
    }
    if (memberIds.size === 0) {
      continue
    }

    const declaredAddresses = getDeclaredEntrypointAddresses(group)
    const bridgeAddress =
      group.bridgeAddresses.find((address) => nodesById.has(address)) ??
      declaredAddresses.find((address) => nodesById.has(address)) ??
      group.memberAddresses.find((address) => nodesById.has(address))
    const bridgeNode = bridgeAddress ? nodesById.get(bridgeAddress) : undefined
    if (!bridgeNode) {
      continue
    }

    let contractCount = 0
    let eoaCount = 0
    for (const memberId of memberIds) {
      const memberNode = nodesById.get(memberId)
      if (!memberNode) {
        continue
      }
      if (
        memberNode.addressType === 'EOA' ||
        memberNode.addressType === 'EOAPermissioned'
      ) {
        eoaCount++
      } else {
        contractCount++
      }
    }

    plans.push({
      group,
      groupNodeId,
      memberIds,
      bridgeNode,
      entrypointGroup: {
        groupId: group.id,
        label: group.label,
        sourceProject: group.sourceProject,
        contractCount,
        eoaCount,
        bridgeAddress: bridgeNode.id,
        summary: formatEntrypointSummary(contractCount, eoaCount),
      },
    })
  }

  for (const plan of plans) {
    for (const memberId of plan.memberIds) {
      hiddenSet.add(memberId)
      targetResolver.set(memberId, plan.groupNodeId)
    }
  }

  const displayNodesById = new Map(nodesById)
  const groupNodes: Node[] = []

  for (const plan of plans) {
    const hiddenFieldsHeight =
      plan.bridgeNode.hiddenFields.length > 0 ? HIDDEN_FIELDS_FOOTER_HEIGHT : 0
    const syntheticBox = {
      ...plan.bridgeNode.box,
      width: plan.bridgeNode.box.width,
    }
    const visibleFields = buildCollapsedGroupFields(
      { box: syntheticBox, hiddenFields: plan.bridgeNode.hiddenFields },
      plan.bridgeNode,
      plan.memberIds,
      displayNodesById,
      targetResolver,
      plan.entrypointGroup,
    )
    const visibleFieldsCount = Math.max(
      0,
      visibleFields.length -
        plan.bridgeNode.hiddenFields.filter((name) =>
          visibleFields.some((field) => field.name === name),
        ).length,
    )
    const height =
      HEADER_HEIGHT +
      getNodeSummaryLineCount({ entrypointGroup: plan.entrypointGroup }) *
        FIELD_HEIGHT +
      visibleFieldsCount * FIELD_HEIGHT +
      BOTTOM_PADDING +
      hiddenFieldsHeight

    const syntheticNode: Node = {
      ...plan.bridgeNode,
      id: plan.groupNodeId,
      name: `Entrypoint: ${plan.group.label}`,
      isInitial: false,
      entrypointGroup: plan.entrypointGroup,
      fields: visibleFields,
      box: {
        ...syntheticBox,
        height,
      },
    }

    groupNodes.push(syntheticNode)
    displayNodesById.set(plan.groupNodeId, syntheticNode)
  }

  return {
    nodes: [...nodes, ...groupNodes],
    hidden: [...hiddenSet],
    targetResolver,
  }
}

export function formatEntrypointSummary(
  contractCount: number,
  eoaCount: number,
): string {
  const parts: string[] = []
  parts.push(`${contractCount} contract${contractCount === 1 ? '' : 's'}`)
  parts.push(`${eoaCount} EOA${eoaCount === 1 ? '' : 's'}`)
  return parts.join(', ')
}

export function resolveFieldTarget(
  target: string,
  targetResolver: Map<string, string>,
): string {
  return targetResolver.get(target) ?? target
}

/** Outward and cross-entrypoint links shown on a collapsed entrypoint node. */
export function buildCollapsedGroupFields(
  sourceNode: Pick<Node, 'box' | 'hiddenFields'>,
  bridgeNode: Node,
  memberIds: ReadonlySet<string>,
  nodesById: Map<string, Node>,
  targetResolver: Map<string, string>,
  entrypointGroup?: EntrypointGroupInfo,
): Node['fields'] {
  const hiddenFieldsSet =
    sourceNode.hiddenFields.length > 0
      ? new Set(sourceNode.hiddenFields)
      : undefined
  const fieldOffsetY =
    getNodeSummaryLineCount({ entrypointGroup }) * FIELD_HEIGHT
  const fields: Node['fields'] = []
  const seen = new Set<string>()

  const consider = (name: string, rawTarget: string) => {
    if (hiddenFieldsSet?.has(name)) {
      return
    }
    const resolvedTarget = resolveFieldTarget(rawTarget, targetResolver)
    const isCrossEntrypoint = isEntrypointGroupNodeId(resolvedTarget)
    const isInternal =
      !isCrossEntrypoint &&
      (memberIds.has(rawTarget) || memberIds.has(resolvedTarget))
    if (isInternal) {
      return
    }

    const dedupeKey = `${name}\0${resolvedTarget}`
    if (seen.has(dedupeKey)) {
      return
    }
    seen.add(dedupeKey)

    const targetNode = nodesById.get(resolvedTarget)
    if (!targetNode) {
      return
    }

    fields.push({
      name,
      target: resolvedTarget,
      box: { x: 0, y: 0, width: 0, height: 0 },
      connection: processConnection(
        fields.length,
        sourceNode.box,
        targetNode.box,
        fieldOffsetY,
      ),
    })
  }

  for (const field of bridgeNode.fields) {
    consider(field.name, field.target)
  }

  for (const memberId of memberIds) {
    if (memberId === bridgeNode.id) {
      continue
    }
    const memberNode = nodesById.get(memberId)
    if (!memberNode) {
      continue
    }
    const memberHidden =
      memberNode.hiddenFields.length > 0
        ? new Set(memberNode.hiddenFields)
        : undefined
    for (const field of memberNode.fields) {
      if (memberHidden?.has(field.name)) {
        continue
      }
      consider(field.name, field.target)
    }
  }

  return fields
}

export function buildEntrypointMemberMap(
  groups: readonly ApiEntrypointGroup[],
): Map<string, string> {
  const result = new Map<string, string>()
  for (const group of groups) {
    for (const address of group.memberAddresses) {
      result.set(address, group.id)
    }
  }
  return result
}

export function getEntrypointGroupsForSelection(
  selected: readonly string[],
  groups: readonly ApiEntrypointGroup[],
): ApiEntrypointGroup[] {
  if (selected.length === 0 || groups.length === 0) {
    return []
  }

  const selectedSet = new Set(selected)
  const matched = new Map<string, ApiEntrypointGroup>()

  for (const group of groups) {
    if (selectedSet.has(entrypointGroupNodeId(group.id))) {
      matched.set(group.id, group)
      continue
    }
    const touchesGroup =
      group.memberAddresses.some((address) => selectedSet.has(address)) ||
      group.bridgeAddresses.some((address) => selectedSet.has(address))
    if (touchesGroup) {
      matched.set(group.id, group)
    }
  }

  return [...matched.values()].sort((a, b) => a.label.localeCompare(b.label))
}

export function getCollapsedMemberIds(
  groups: readonly ApiEntrypointGroup[],
  collapsedGroupIds: readonly string[],
): Set<string> {
  const collapsed = new Set(collapsedGroupIds)
  const memberIds = new Set<string>()
  for (const group of groups) {
    if (!collapsed.has(group.id)) {
      continue
    }
    for (const address of group.memberAddresses) {
      memberIds.add(address)
    }
  }
  return memberIds
}
