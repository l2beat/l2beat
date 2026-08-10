import { v } from '@l2beat/validate'

const NodeBox = v.object({
  x: v.number(),
  y: v.number(),
  width: v.number().optional(),
  height: v.number().optional(),
})

const NodeLocations = v.record(v.string(), NodeBox)
const NodeColors = v.record(v.string(), v.number())
const NodeHiddenFields = v.record(v.string(), v.array(v.string()))
const HiddenNodes = v.array(v.string())

// A user-created group. `members` lists the ids of its direct children, which
// may themselves be group ids (nesting is resolved on load). Flat rather than
// recursive so the schema stays simple and validatable.
const StoredGroup = v.object({
  id: v.string(),
  name: v.string(),
  color: v.number(),
  opened: v.boolean(),
  box: NodeBox,
  members: v.array(v.string()),
})

export const LayoutMetadata = v.object({
  description: v.string().optional(),
})

export const LayoutV4 = v.object({
  version: v.literal(4),
  projectId: v.string(),
  metadata: LayoutMetadata.optional(),
  locations: NodeLocations,
  colors: NodeColors.optional(),
  hiddenFields: NodeHiddenFields.optional(),
  hiddenNodes: HiddenNodes.optional(),
  groups: v.array(StoredGroup).optional(),
})

export type LayoutMetadataV4 = v.infer<typeof LayoutMetadata>
export type LayoutV4 = v.infer<typeof LayoutV4>
export type NodeLocationsV4 = v.infer<typeof NodeLocations>
export type StoredGroupV4 = v.infer<typeof StoredGroup>
