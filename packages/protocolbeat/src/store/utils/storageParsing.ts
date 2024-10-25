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
  z.object({
    l: z.number(),
    c: z.number(),
    h: z.number(),
  }),
)

const StorageNodeLocations = z.object({
  projectId: z.string(),
  locations: NodeLocations,
  colors: NodeColors.optional(),
})

export type NodeLocations = z.infer<typeof NodeLocations>
export type NodeColors = z.infer<typeof NodeColors>
export type StorageNodeLocations = z.infer<typeof StorageNodeLocations>

export function getLayoutStorageKey(projectId: string): string {
  return `layout/${projectId}`
}

export function encodeNodeState(state: State): StorageNodeLocations {
  return {
    projectId: state.projectId,
    locations: Object.fromEntries(state.nodes.map((n) => [n.id, n.box])),
    colors: Object.fromEntries(state.nodes.map((n) => [n.id, n.color])),
  }
}

export function decodeNodeState(
  inputJson: string,
): StorageNodeLocations | undefined {
  const result = StorageNodeLocations.safeParse(JSON.parse(inputJson))
  return result.success ? result.data : undefined
}
