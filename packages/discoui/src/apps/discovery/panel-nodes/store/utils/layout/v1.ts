import { v } from '@l2beat/validate'

// v1 captures the historical shape that lived in localStorage and shared
// files before an explicit version field existed. Two notable looseness
// points are preserved here so we can still ingest those payloads:
//   - `version` is optional; absence means v1
//   - `colors` accepts the legacy { l, c, h } oklch object form alongside
//     the numeric palette index that superseded it
const NodeLocations = v.record(
  v.string(),
  v.object({
    x: v.number(),
    y: v.number(),
    width: v.number().optional(),
    height: v.number().optional(),
  }),
)

const LegacyOklchColor = v.object({
  l: v.number(),
  c: v.number(),
  h: v.number(),
})

const NodeColors = v.record(v.string(), v.union([LegacyOklchColor, v.number()]))

const NodeHiddenFields = v.record(v.string(), v.array(v.string()))
const HiddenNodes = v.array(v.string())

export const LayoutV1 = v.object({
  version: v.literal(1).optional(),
  projectId: v.string(),
  locations: NodeLocations,
  colors: NodeColors.optional(),
  hiddenFields: NodeHiddenFields.optional(),
  hiddenNodes: HiddenNodes.optional(),
})

export type LayoutV1 = v.infer<typeof LayoutV1>
