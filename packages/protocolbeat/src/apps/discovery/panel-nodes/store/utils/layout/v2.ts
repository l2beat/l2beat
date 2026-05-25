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

export const LayoutV2 = v.object({
  version: v.literal(2),
  projectId: v.string(),
  locations: NodeLocations,
  colors: NodeColors.optional(),
  hiddenFields: NodeHiddenFields.optional(),
  hiddenNodes: HiddenNodes.optional(),
})

export type LayoutV2 = v.infer<typeof LayoutV2>
export type NodeLocationsV2 = v.infer<typeof NodeLocations>
