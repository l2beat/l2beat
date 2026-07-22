import type { Node, State } from '../State'
import {
  CURRENT_LAYOUT_VERSION,
  type Layout,
  type LayoutMetadata,
  LayoutSchema,
  migrateLayout,
  type StoredGroup,
} from './layout'

export const StoredNodeLayout = LayoutSchema
export type StoredNodeLayout = Layout
export type { NodeLocations, StoredGroup } from './layout'

export function reconcileHiddenFields(
  fieldNames: readonly string[],
  hiddenFieldNames: readonly string[],
): string[] {
  const valid = new Set(fieldNames)
  const result = new Set<string>()
  for (const name of hiddenFieldNames) {
    if (valid.has(name)) {
      result.add(name)
    }
  }
  return [...result]
}

export function reconcileNodeHiddenFields(
  fields: readonly { readonly name: string; readonly label?: string }[],
  hiddenFieldNames: readonly string[],
): string[] {
  const hidden = new Set(hiddenFieldNames)
  const legacyGroupFields = fields
    .filter((field) => field.label !== undefined && hidden.has(field.label))
    .map((field) => field.name)
  return reconcileHiddenFields(
    fields.map((field) => field.name),
    [...hiddenFieldNames, ...legacyGroupFields],
  )
}

function getLayoutStorageKey(projectId: string): string {
  return `layout/${projectId}`
}

export function buildStoredNodeLayout(
  state: State,
  metadata?: LayoutMetadata,
): StoredNodeLayout {
  // Walk the whole tree so nested members keep their positions, and record one
  // entry per group so the group structure can be rebuilt after a data reload.
  const all: Node[] = []
  const groups: StoredGroup[] = []
  const walk = (nodes: readonly Node[]) => {
    for (const node of nodes) {
      all.push(node)
      if (node.subnodes.length > 0) {
        groups.push({
          id: node.id,
          name: node.name,
          color: node.color,
          opened: node.opened,
          box: node.box,
          members: node.subnodes.map((subnode) => subnode.id),
        })
        walk(node.subnodes)
      }
    }
  }
  walk(state.nodes)

  return {
    version: CURRENT_LAYOUT_VERSION,
    projectId: state.projectId,
    metadata,
    locations: Object.fromEntries(all.map((n) => [n.id, n.box])),
    colors: Object.fromEntries(all.map((n) => [n.id, n.color])),
    hiddenFields: Object.fromEntries(
      all
        .filter((n) => n.hiddenFields.length > 0)
        .map((n) => [n.id, n.hiddenFields]),
    ),
    groups: groups.length > 0 ? groups : undefined,
  }
}

export function persistNodeLayout(state: State): void {
  if (state.nodes.length <= 0 || !state.projectId) {
    return
  }
  localStorage.setItem(
    getLayoutStorageKey(state.projectId),
    JSON.stringify(buildStoredNodeLayout(state)),
  )
}

export function recallNodeLayout(
  projectId: string,
): StoredNodeLayout | undefined {
  const key = getLayoutStorageKey(projectId)
  const storage = localStorage.getItem(key)
  if (storage === null) {
    return undefined
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(storage)
  } catch {
    localStorage.removeItem(key)
    return undefined
  }
  const result = migrateLayout(parsed)
  if (!result.ok) {
    if (result.reason !== 'too-new') {
      localStorage.removeItem(key)
    }
    return undefined
  }
  return result.layout
}
