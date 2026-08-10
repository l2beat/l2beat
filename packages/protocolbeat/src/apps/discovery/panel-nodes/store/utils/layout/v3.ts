import { v } from '@l2beat/validate'

const NodeLocations = v.record(
  v.string(),
  v.object({
    x: v.number(),
    y: v.number(),
    width: v.number().optional(),
    height: v.number().optional(),
  }),
)

const NodeColors = v.record(v.string(), v.number())
const NodeHiddenFields = v.record(v.string(), v.array(v.string()))
const HiddenNodes = v.array(v.string())

export const LayoutMetadata = v.object({
  description: v.string().optional(),
})

export const LayoutV3 = v.object({
  version: v.literal(3),
  projectId: v.string(),
  metadata: LayoutMetadata.optional(),
  locations: NodeLocations,
  colors: NodeColors.optional(),
  hiddenFields: NodeHiddenFields.optional(),
  hiddenNodes: HiddenNodes.optional(),
})

export type LayoutMetadataV3 = v.infer<typeof LayoutMetadata>
export type LayoutV3 = v.infer<typeof LayoutV3>
export type NodeLocationsV3 = v.infer<typeof NodeLocations>
