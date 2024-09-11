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
    r: z.number(),
    g: z.number(),
    b: z.number(),
  }),
)

const StorageNodeLocations = z.object({
  version: z.number().min(1).max(1),
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
    version: 1,
    projectId: state.projectId,
    locations: Object.fromEntries(
      state.nodes.map((n) => [n.simpleNode.id, n.box]),
    ),
    colors: Object.fromEntries(
      state.nodes.map((n) => [n.simpleNode.id, n.simpleNode.color]),
    ),
  }
}

export function decodeNodeState(inputJson: string): StorageNodeLocations {
  return StorageNodeLocations.parse(JSON.parse(inputJson))
}
