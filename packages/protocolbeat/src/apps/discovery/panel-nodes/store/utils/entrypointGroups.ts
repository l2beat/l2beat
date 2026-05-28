import type { ApiEntrypointGroup } from '../../../../../api/types'
import type { Node, State } from '../State'
import {
  BOTTOM_PADDING,
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  HIDDEN_FIELDS_FOOTER_HEIGHT,
  NODE_WIDTH,
} from './constants'

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
  return group?.bridgeAddresses[0] ?? group?.memberAddresses[0]
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
  const groupNodes: Node[] = []

  for (const group of context.groups) {
    if (!collapsed.has(group.id)) {
      continue
    }

    const groupNodeId = entrypointGroupNodeId(group.id)
    const memberIds = new Set(
      group.memberAddresses.filter((address) => nodesById.has(address)),
    )
    if (memberIds.size === 0) {
      continue
    }

    const bridgeAddress =
      group.bridgeAddresses.find((address) => nodesById.has(address)) ??
      group.memberAddresses.find((address) => nodesById.has(address))
    const bridgeNode = bridgeAddress ? nodesById.get(bridgeAddress) : undefined
    if (!bridgeNode) {
      continue
    }

    for (const memberId of memberIds) {
      hiddenSet.add(memberId)
      targetResolver.set(memberId, groupNodeId)
    }

    const visibleFields = bridgeNode.fields.filter(
      (field) => !memberIds.has(field.target),
    )
    const hiddenFieldsHeight =
      bridgeNode.hiddenFields.length > 0 ? HIDDEN_FIELDS_FOOTER_HEIGHT : 0
    const visibleFieldsCount = Math.max(
      0,
      visibleFields.length -
        bridgeNode.hiddenFields.filter((name) =>
          visibleFields.some((field) => field.name === name),
        ).length,
    )
    const entrypointGroup = {
      groupId: group.id,
      label: group.label,
      sourceProject: group.sourceProject,
      contractCount: group.contractCount,
      eoaCount: group.eoaCount,
      bridgeAddress: bridgeNode.id,
      summary: formatEntrypointSummary(group.contractCount, group.eoaCount),
    }

    const height =
      HEADER_HEIGHT +
      getNodeSummaryLineCount({ entrypointGroup }) *
        FIELD_HEIGHT +
      visibleFieldsCount * FIELD_HEIGHT +
      BOTTOM_PADDING +
      hiddenFieldsHeight

    groupNodes.push({
      ...bridgeNode,
      id: groupNodeId,
      name: `Entrypoint: ${group.label}`,
      isInitial: false,
      entrypointGroup,
      fields: visibleFields,
      box: {
        ...bridgeNode.box,
        // Keep the synthetic node width in sync with the underlying bridge
        // node so right-edge resize behaves like a regular node.
        width: bridgeNode.box.width,
        height,
      },
    })
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
