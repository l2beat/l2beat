import type {
  ApiEntrypointGroup,
  ApiProjectChain,
  Field as ApiField,
  FieldValue,
} from '../../../api/types'
import type { Node } from './store/State'
import { ENTRYPOINT_COLOR_COUNT } from './controls/ColorPicker'
import {
  getCollapseSeedAddresses,
  getDeclaredEntrypointAddresses,
  isPerEntrypointGroup,
} from './store/utils/entrypointGroups'

export interface EntrypointColorAssignment {
  groupId: string
  color: number
}

export type EntrypointColorAssignments = Map<
  string,
  readonly EntrypointColorAssignment[]
>

function addEntrypointColorAssignment(
  assignments: Map<string, EntrypointColorAssignment[]>,
  address: string,
  assignment: EntrypointColorAssignment,
): void {
  const existing = assignments.get(address) ?? []
  if (existing.some((entry) => entry.groupId === assignment.groupId)) {
    return
  }
  assignments.set(address, [...existing, assignment])
}

export function getPrimaryEntrypointColor(
  assignments: readonly EntrypointColorAssignment[] | undefined,
): number {
  return assignments?.[0]?.color ?? 0
}

/** Declared entrypoints always show only their own group color, not split stripes. */
export function getDisplayEntrypointColorIndices(
  assignments: readonly EntrypointColorAssignment[] | undefined,
  declaredGroupId: string | undefined,
  declaredGroupColor?: number,
): readonly number[] {
  if (declaredGroupId && declaredGroupColor !== undefined && declaredGroupColor > 0) {
    return [declaredGroupColor]
  }
  if (declaredGroupId) {
    const own = assignments?.find(
      (assignment) => assignment.groupId === declaredGroupId,
    )
    if (own !== undefined && own.color > 0) {
      return [own.color]
    }
  }
  return getEntrypointColorIndices(assignments, declaredGroupId)
}

export function resolveDisplayEntrypointColors(
  address: string,
  assignments: EntrypointColorAssignments,
  groups: readonly ApiEntrypointGroup[],
): readonly number[] {
  const explicitEntrypointByAddress = buildExplicitEntrypointMap(groups)
  const declaredGroupId = explicitEntrypointByAddress.get(address)
  if (declaredGroupId) {
    const group = groups.find((entry) => entry.id === declaredGroupId)
    return getDisplayEntrypointColorIndices(
      assignments.get(address),
      declaredGroupId,
      group?.color,
    )
  }
  return getEntrypointColorIndices(assignments.get(address))
}

export function buildDisplayEntrypointColorMap(
  assignments: EntrypointColorAssignments,
  groups: readonly ApiEntrypointGroup[],
  entries: readonly ApiProjectChain[],
): Map<string, readonly number[]> {
  const colors = new Map<string, readonly number[]>()
  const addresses = new Set<string>()
  for (const address of assignments.keys()) {
    addresses.add(address)
  }
  for (const chain of entries) {
    for (const entry of [
      ...chain.initialContracts,
      ...chain.discoveredContracts,
      ...chain.eoas,
    ]) {
      addresses.add(entry.address)
    }
  }
  for (const address of addresses) {
    colors.set(address, resolveDisplayEntrypointColors(address, assignments, groups))
  }
  return colors
}

export function getEntrypointColorIndices(
  assignments: readonly EntrypointColorAssignment[] | undefined,
  preferredGroupId?: string,
): readonly number[] {
  if (!assignments || assignments.length === 0) {
    return []
  }
  const sorted = [...assignments].sort((left, right) => {
    if (preferredGroupId) {
      if (left.groupId === preferredGroupId) {
        return -1
      }
      if (right.groupId === preferredGroupId) {
        return 1
      }
    }
    const leftPerEntrypoint = left.groupId.includes('::') ? 0 : 1
    const rightPerEntrypoint = right.groupId.includes('::') ? 0 : 1
    if (leftPerEntrypoint !== rightPerEntrypoint) {
      return leftPerEntrypoint - rightPerEntrypoint
    }
    return left.groupId.localeCompare(right.groupId)
  })
  const seen = new Set<number>()
  const result: number[] = []
  for (const assignment of sorted) {
    if (assignment.color <= 0 || seen.has(assignment.color)) {
      continue
    }
    seen.add(assignment.color)
    result.push(assignment.color)
  }
  return result
}

export function parseEntrypointColor(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return undefined
  }
  if (value < 0 || value > ENTRYPOINT_COLOR_COUNT) {
    return undefined
  }
  return value
}

export function readEntrypointsFileColor(
  content: string | undefined,
): number | undefined {
  if (!content || content.trim().length === 0) {
    return undefined
  }
  try {
    const parsed = JSON.parse(content) as { color?: unknown }
    return parseEntrypointColor(parsed.color)
  } catch {
    return undefined
  }
}

export function collectUsedEntrypointColors(
  groups: readonly ApiEntrypointGroup[],
  nodes: readonly Node[],
): Set<number> {
  const used = new Set<number>()
  for (const group of groups) {
    if (group.color !== undefined && group.color > 0) {
      used.add(group.color)
    }
  }
  for (const node of nodes) {
    if (node.entrypointMemberOf && node.color > 0) {
      used.add(node.color)
    }
  }
  return used
}

export function pickUnusedEntrypointColor(used: Set<number>): number {
  for (let color = 1; color <= ENTRYPOINT_COLOR_COUNT; color++) {
    if (!used.has(color)) {
      return color
    }
  }
  return 1
}

export function getEntrypointColorForMember(
  groupColors: ReadonlyMap<string, number>,
  groupId: string | undefined,
): number {
  if (!groupId) {
    return 0
  }
  return groupColors.get(groupId) ?? 0
}

/** All nodes hidden when an entrypoint group is collapsed (includes nested entrypoints). */
export function buildEntrypointCollapseMembers(
  groups: readonly ApiEntrypointGroup[],
  entries: readonly ApiProjectChain[],
): Map<string, readonly string[]> {
  const explicitEntrypointByAddress = buildExplicitEntrypointMap(groups)
  const adjacencyByProject = buildAdjacencyByProject(entries)
  const globalAdjacency = mergeAdjacencyMaps(adjacencyByProject)
  const membersByGroup = new Map<string, Set<string>>()

  for (const group of groups) {
    const adjacency =
      adjacencyByProject.get(group.sourceProject) ?? globalAdjacency
    const seeds = getCollapseSeedAddresses(group).filter((address) =>
      isPerEntrypointGroup(group)
        ? explicitEntrypointByAddress.get(address) === group.id
        : true,
    )
    const visited = new Set<string>()
    const members = new Set<string>()
    const queue = [...seeds]

    while (queue.length > 0) {
      const address = queue.shift()
      if (!address || visited.has(address)) {
        continue
      }
      visited.add(address)
      members.add(address)

      for (const target of adjacency.get(address) ?? []) {
        if (isExplicitEntrypointOfOther(target, group.id, explicitEntrypointByAddress)) {
          members.add(target)
          continue
        }
        if (!visited.has(target)) {
          queue.push(target)
        }
      }
    }

    membersByGroup.set(group.id, members)
  }

  expandNestedEntrypointMembers(membersByGroup, explicitEntrypointByAddress)

  return new Map(
    [...membersByGroup].map(([groupId, members]) => [groupId, [...members]]),
  )
}

/** When a parent collapse reaches a nested declared entrypoint, hide that entrypoint's subgraph too. */
function expandNestedEntrypointMembers(
  membersByGroup: Map<string, Set<string>>,
  explicitEntrypointByAddress: ReadonlyMap<string, string>,
): void {
  let changed = true
  while (changed) {
    changed = false
    for (const [groupId, members] of membersByGroup) {
      for (const address of [...members]) {
        const owner = explicitEntrypointByAddress.get(address)
        if (!owner || owner === groupId) {
          continue
        }
        const nestedMembers = membersByGroup.get(owner)
        if (!nestedMembers) {
          continue
        }
        for (const nestedAddress of nestedMembers) {
          if (!members.has(nestedAddress)) {
            members.add(nestedAddress)
            changed = true
          }
        }
      }
    }
  }
}

export function enrichEntrypointGroupsForCollapse(
  groups: readonly ApiEntrypointGroup[],
  entries: readonly ApiProjectChain[],
): ApiEntrypointGroup[] {
  const collapseMembers = buildEntrypointCollapseMembers(groups, entries)
  return groups.map((group) => {
    const members = collapseMembers.get(group.id)
    if (!members) {
      return group
    }
    const declared = getDeclaredEntrypointAddresses(group)
    return {
      ...group,
      declaredMemberAddresses: [...declared],
      memberAddresses: [...members],
    }
  })
}

/**
 * Assigns entrypoint palette colors by propagating from declared entrypoints along
 * field references within each entrypoint's project graph. Propagation stops at
 * nested declared entrypoints owned by other groups, so downstream nodes only inherit
 * colors from entrypoints that actually reach them.
 */
export function buildEntrypointColorAssignments(
  groups: readonly ApiEntrypointGroup[],
  entries: readonly ApiProjectChain[],
): EntrypointColorAssignments {
  const groupColorsByProject = new Map<string, number>()
  for (const group of groups) {
    if (group.color !== undefined && group.color > 0) {
      groupColorsByProject.set(group.sourceProject, group.color)
    }
  }

  const explicitEntrypointByAddress = buildExplicitEntrypointMap(groups)

  const adjacencyByProject = buildAdjacencyByProject(entries)
  const globalAdjacency = mergeAdjacencyMaps(adjacencyByProject)
  const assignments = new Map<string, EntrypointColorAssignment[]>()

  for (const [address, groupId] of explicitEntrypointByAddress) {
    const group = groups.find((entry) => entry.id === groupId)
    const color = group?.color ?? groupColorsByProject.get(group?.sourceProject ?? '')
    if (color !== undefined && color > 0) {
      addEntrypointColorAssignment(assignments, address, { groupId, color })
    }
  }

  for (const group of groups) {
    if (!isPerEntrypointGroup(group)) {
      continue
    }

    const color = group.color ?? groupColorsByProject.get(group.sourceProject)
    if (color === undefined || color <= 0) {
      continue
    }

    const seeds = getCollapseSeedAddresses(group).filter((address) =>
      explicitEntrypointByAddress.get(address) === group.id,
    )
    const adjacency = getAdjacencyForGroup(
      group.sourceProject,
      seeds,
      adjacencyByProject,
      globalAdjacency,
    )

    const queue = [...seeds]
    const visited = new Set<string>()

    while (queue.length > 0) {
      const address = queue.shift()
      if (!address || visited.has(address)) {
        continue
      }
      if (
        isExplicitEntrypointOfOther(
          address,
          group.id,
          explicitEntrypointByAddress,
        )
      ) {
        continue
      }
      visited.add(address)

      addEntrypointColorAssignment(assignments, address, {
        groupId: group.id,
        color,
      })

      for (const target of adjacency.get(address) ?? []) {
        if (
          isExplicitEntrypointOfOther(
            target,
            group.id,
            explicitEntrypointByAddress,
          )
        ) {
          continue
        }
        if (!visited.has(target)) {
          queue.push(target)
        }
      }
    }
  }

  return assignments
}

function getAdjacencyForGroup(
  sourceProject: string,
  seeds: readonly string[],
  adjacencyByProject: Map<string, Map<string, string[]>>,
  globalAdjacency: Map<string, string[]>,
): Map<string, string[]> {
  const projectAdjacency = adjacencyByProject.get(sourceProject)
  if (projectAdjacency && seeds.some((seed) => projectAdjacency.has(seed))) {
    return projectAdjacency
  }

  for (const adjacency of adjacencyByProject.values()) {
    if (seeds.some((seed) => adjacency.has(seed))) {
      return adjacency
    }
  }

  return globalAdjacency
}

function buildExplicitEntrypointMap(
  groups: readonly ApiEntrypointGroup[],
): Map<string, string> {
  const explicitEntrypointByAddress = new Map<string, string>()
  for (const group of groups) {
    if (!isPerEntrypointGroup(group)) {
      continue
    }
    for (const address of getDeclaredEntrypointAddresses(group)) {
      explicitEntrypointByAddress.set(address, group.id)
    }
  }
  return explicitEntrypointByAddress
}

function isExplicitEntrypointOfOther(
  address: string,
  groupId: string,
  explicitEntrypointByAddress: ReadonlyMap<string, string>,
): boolean {
  const owner = explicitEntrypointByAddress.get(address)
  return owner !== undefined && owner !== groupId
}

function mergeAdjacencyMaps(
  adjacencyByProject: Map<string, Map<string, string[]>>,
): Map<string, string[]> {
  const merged = new Map<string, string[]>()
  for (const adjacency of adjacencyByProject.values()) {
    for (const [address, targets] of adjacency) {
      const existing = merged.get(address) ?? []
      merged.set(address, [...new Set([...existing, ...targets])])
    }
  }
  return merged
}

function buildAdjacencyByProject(
  entries: readonly ApiProjectChain[],
): Map<string, Map<string, string[]>> {
  const result = new Map<string, Map<string, string[]>>()

  for (const chain of entries) {
    const adjacency = new Map<string, string[]>()
    const contracts = [
      ...chain.initialContracts,
      ...chain.discoveredContracts,
      ...chain.eoas,
    ]

    for (const contract of contracts) {
      const targets = collectFieldTargets(contract.fields ?? [])
      if (targets.length > 0) {
        adjacency.set(contract.address, targets)
      }
    }

    result.set(chain.project, adjacency)
  }

  return result
}

function collectFieldTargets(fields: readonly ApiField[]): string[] {
  const targets = new Set<string>()
  for (const field of fields) {
    for (const address of collectAddressesFromFieldValue(field.value)) {
      targets.add(address)
    }
  }
  return [...targets]
}

function collectAddressesFromFieldValue(value: FieldValue): string[] {
  if (value.type === 'address') {
    return [value.address]
  }
  if (value.type === 'array') {
    return value.values.flatMap((entry) => collectAddressesFromFieldValue(entry))
  }
  if (value.type === 'object') {
    return value.values.flatMap(([, entry]) =>
      collectAddressesFromFieldValue(entry),
    )
  }
  return []
}

/** Layout stores 0 for every node by default; don't let that override entrypoint colors. */
export function resolveNodeColorOnLoad(
  node: Pick<Node, 'id' | 'color' | 'entrypointMemberOf' | 'entrypointColors'>,
  savedColors: Readonly<Record<string, number>> | undefined,
): number {
  if (node.entrypointColors !== undefined && node.entrypointColors.length > 0) {
    return node.entrypointColors[0] ?? node.color
  }
  if (node.entrypointMemberOf !== undefined && node.color > 0) {
    return node.color
  }
  const savedColor = savedColors?.[node.id]
  if (savedColor !== undefined && savedColor !== 0) {
    return savedColor
  }
  return node.color
}
