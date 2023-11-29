import { z } from 'zod'

import { State } from '../State'

const NodeLocations = z.record(
  z.string(),
  z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  }),
)

const StorageNodeLocations = z.object({
  version: z.number().min(1).max(1),
  projectId: z.string(),
  locations: NodeLocations,
})

export type NodeLocations = z.infer<typeof NodeLocations>
export type StorageNodeLocations = z.infer<typeof StorageNodeLocations>

export function getLayoutStorageKey(projectId: string): string {
  return `layout/${projectId}`
}

export function encodeNodeLocations(state: State): StorageNodeLocations {
  return {
    version: 1,
    projectId: state.projectId,
    locations: Object.fromEntries(
      state.nodes.map((n) => [n.simpleNode.id, n.box]),
    ),
  }
}

export function decodeNodeLocations(inputJson: string): StorageNodeLocations {
  return StorageNodeLocations.parse(JSON.parse(inputJson))
}
