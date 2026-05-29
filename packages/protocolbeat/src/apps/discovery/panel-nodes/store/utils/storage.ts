import type { State } from '../State'
import {
  CURRENT_LAYOUT_VERSION,
  type Layout,
  LayoutSchema,
  migrateLayout,
} from './layout'

export const StoredNodeLayout = LayoutSchema
export type StoredNodeLayout = Layout
export type { NodeLocations } from './layout'

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

function getLayoutStorageKey(projectId: string): string {
  return `layout/${projectId}`
}

export function buildStoredNodeLayout(state: State): StoredNodeLayout {
  return {
    version: CURRENT_LAYOUT_VERSION,
    projectId: state.projectId,
    locations: Object.fromEntries(state.nodes.map((n) => [n.id, n.box])),
    colors: Object.fromEntries(
      state.nodes.filter((n) => n.color !== 0).map((n) => [n.id, n.color]),
    ),
    hiddenFields: Object.fromEntries(
      state.nodes
        .filter((n) => n.hiddenFields.length > 0)
        .map((n) => [n.id, n.hiddenFields]),
    ),
    hiddenNodes: [...state.hidden],
    collapsedEntrypointGroups: [...state.collapsedEntrypointGroups],
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
