import { v } from '@l2beat/validate'

import type { State } from '../State'

const NodeLocations = v.record(
  v.string(),
  v.object({
    x: v.number(),
    y: v.number(),
    width: v.number().optional(),
    height: v.number().optional(),
  }),
)

// Accepts the legacy { l, c, h } oklch object form for backward compatibility
// with localStorage entries written before colors became a numeric palette
// index. Readers must coerce non-numeric entries to 0.
const NodeColors = v.record(
  v.string(),
  v.union([
    v.object({
      l: v.number(),
      c: v.number(),
      h: v.number(),
    }),
    v.number(),
  ]),
)

const NodeHiddenFields = v.record(v.string(), v.array(v.string()))
const HiddenNodes = v.array(v.string())

export const StoredNodeLayout = v.object({
  projectId: v.string(),
  locations: NodeLocations,
  colors: NodeColors.optional(),
  hiddenFields: NodeHiddenFields.optional(),
  hiddenNodes: HiddenNodes.optional(),
})

export type NodeLocations = v.infer<typeof NodeLocations>
export type StoredNodeLayout = v.infer<typeof StoredNodeLayout>

function getLayoutStorageKey(projectId: string): string {
  return `layout/${projectId}`
}

export function buildStoredNodeLayout(state: State): StoredNodeLayout {
  return {
    projectId: state.projectId,
    locations: Object.fromEntries(state.nodes.map((n) => [n.id, n.box])),
    colors: Object.fromEntries(state.nodes.map((n) => [n.id, n.color])),
    hiddenFields: Object.fromEntries(
      state.nodes
        .filter((n) => n.hiddenFields.length > 0)
        .map((n) => [n.id, n.hiddenFields]),
    ),
    hiddenNodes: [...state.hidden],
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
  const result = StoredNodeLayout.safeParse(JSON.parse(storage))
  if (!result.success) {
    localStorage.removeItem(key)
  }
  return result.data
}
