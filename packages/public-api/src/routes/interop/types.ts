import { v } from '@l2beat/validate'

const SplitAverageTransferTimeSchema = v.object({
  label: v.string(),
  duration: v.union([v.number(), v.null()]),
})

export const AverageTransferTimeSchema = v.union([
  v.object({
    type: v.literal('single'),
    duration: v.number(),
  }),
  v.object({
    type: v.literal('split'),
    splits: v.array(SplitAverageTransferTimeSchema),
  }),
  v.object({
    type: v.literal('unknown'),
  }),
  v.null(),
])

export const InteropProtocolChainBreakdownSchema = v.object({
  id: v.string(),
  name: v.string(),
  volume: v.number(),
  transferCount: v.number(),
  avgTransferTimeSeconds: v.union([v.number(), v.null()]),
})

export const InteropProtocolSchema = v
  .object({
    id: v.string(),
    slug: v.string(),
    name: v.string(),
    subgroupId: v.union([v.string(), v.null()]).meta({
      description:
        'ID of the aggregate/root interop protocol this protocol belongs to. Null for aggregate/root protocols.',
    }),
    totalVolume: v.number(),
    totalTransferCount: v.number(),
    avgTransferTime: AverageTransferTimeSchema,
    chainsBreakdown: v.array(InteropProtocolChainBreakdownSchema),
  })
  .describe('InteropProtocol')

export type InteropProtocol = v.infer<typeof InteropProtocolSchema>
export const InteropProtocolsResultSchema = v.array(InteropProtocolSchema)

export const InteropChainProtocolBreakdownSchema = v.object({
  id: v.string(),
  slug: v.string(),
  name: v.string(),
  volume: v.number(),
  transferCount: v.number(),
})

export const InteropChainSchema = v
  .object({
    id: v.string(),
    name: v.string(),
    totalVolume: v.number(),
    totalTransferCount: v.number(),
    inflowsUsd: v.number(),
    outflowsUsd: v.number(),
    avgTransferTimeSeconds: v.union([v.number(), v.null()]),
    protocolsBreakdown: v.array(InteropChainProtocolBreakdownSchema),
  })
  .describe('InteropChain')

export type InteropChain = v.infer<typeof InteropChainSchema>
export const InteropChainsResultSchema = v.array(InteropChainSchema)
