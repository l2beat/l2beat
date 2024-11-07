import { z } from 'zod'

import type { State } from '../State'

const NodeLocations = z.record(
  z.string(),
  z.object({
    x: z.number(),
    y: z.number(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
)

const NodeColors = z.record(
  z.string(),
  z.union([
    z.object({
      l: z.number(),
      c: z.number(),
      h: z.number(),
    }),
    z.number(),
  ]),
)

const StoredNodeLayout = z.object({
  projectId: z.string(),
  locations: NodeLocations,
  colors: NodeColors.optional(),
})

export type NodeLocations = z.infer<typeof NodeLocations>
export type StoredNodeLayout = z.infer<typeof StoredNodeLayout>

function getLayoutStorageKey(projectId: string): string {
  return `layout/${projectId}`
}

export function persistNodeLayout(state: State): void {
  if (state.nodes.length <= 0 || !state.projectId) {
    return
  }
  const locations = {
    projectId: state.projectId,
    locations: Object.fromEntries(state.nodes.map((n) => [n.id, n.box])),
    colors: Object.fromEntries(state.nodes.map((n) => [n.id, n.color])),
  }
  localStorage.setItem(
    getLayoutStorageKey(state.projectId),
    JSON.stringify(locations),
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
