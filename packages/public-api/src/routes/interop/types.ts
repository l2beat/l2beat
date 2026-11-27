import { v } from '@l2beat/validate'

const SNAPSHOT_TIMESTAMP_DESCRIPTION =
  'UNIX timestamp (seconds) of the end of the 24 hours the numbers cover. The same on every item of a response. The snapshot is stale when this is more than a few hours old.'

const SplitAverageTransferTimeSchema = v.object({
  label: v.string().meta({
    description: 'Which kind of transfer the duration is for, e.g. "Fast".',
  }),
  duration: v.union([v.number(), v.null()]).meta({
    description: 'Seconds. Null when no transfer of this kind was timed.',
  }),
})

export const AverageTransferTimeSchema = v
  .union([
    v.object({
      type: v.literal('single'),
      duration: v.number().meta({ description: 'Seconds.' }),
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
  .meta({
    description:
      'Average time from the source transaction to the destination one. `single` is one average, `split` one per kind of transfer. `unknown` means we do not measure the time for this protocol; null means no transfer was timed in these 24 hours.',
  })

export const InteropProtocolChainBreakdownSchema = v.object({
  id: v.string(),
  name: v.string(),
  volume: v.number().meta({
    description:
      'USD value the protocol moved out of the chain plus the value it moved into it.',
  }),
  transferCount: v.number().meta({
    description: 'Transfers that start or end on the chain.',
  }),
  avgTransferTimeSeconds: v.union([v.number(), v.null()]),
})

const interopProtocolAggregateFields = {
  id: v.string(),
  slug: v.string(),
  name: v.string(),
  subgroupId: v.union([v.string(), v.null()]).meta({
    description:
      'ID of the aggregate/root interop protocol this protocol belongs to. Null for aggregate/root protocols.',
  }),
  totalVolume: v.number().meta({
    description:
      'USD value of the transfers. A transfer counts once, at the larger of its value on the source and on the destination chain.',
  }),
  totalTransferCount: v.number(),
  avgTransferTime: AverageTransferTimeSchema,
  chainsBreakdown: v.array(InteropProtocolChainBreakdownSchema).meta({
    description:
      'A transfer between two chains is listed under both, so the volumes and counts add up to more than the totals.',
  }),
}
const InteropProtocolAggregateSchema = v.object(interopProtocolAggregateFields)

/** What the aggregation computes, before the response says which snapshot it is. */
export type InteropProtocolAggregate = v.infer<
  typeof InteropProtocolAggregateSchema
>

export const InteropProtocolSchema = v
  .object({
    ...interopProtocolAggregateFields,
    timestamp: v.number().meta({ description: SNAPSHOT_TIMESTAMP_DESCRIPTION }),
  })
  .describe('InteropProtocol')

export type InteropProtocol = v.infer<typeof InteropProtocolSchema>
export const InteropProtocolsResultSchema = v.array(InteropProtocolSchema)

export const InteropChainProtocolBreakdownSchema = v.object({
  id: v.string(),
  slug: v.string(),
  name: v.string(),
  volume: v.number().meta({
    description:
      'USD value the protocol moved out of the chain plus the value it moved into it.',
  }),
  transferCount: v.number(),
})

const interopChainAggregateFields = {
  id: v.string(),
  name: v.string(),
  totalVolume: v.number().meta({
    description: '`inflowsUsd` plus `outflowsUsd`.',
  }),
  totalTransferCount: v.number().meta({
    description: 'Transfers that start or end on the chain.',
  }),
  inflowsUsd: v.number().meta({
    description: 'USD value of the transfers that arrived from other chains.',
  }),
  outflowsUsd: v.number().meta({
    description: 'USD value of the transfers that left the chain.',
  }),
  avgTransferTimeSeconds: v.union([v.number(), v.null()]).meta({
    description:
      'Null when no transfer was timed. Protocols whose transfer time we do not measure are left out of the average.',
  }),
  protocolsBreakdown: v.array(InteropChainProtocolBreakdownSchema),
}
const InteropChainAggregateSchema = v.object(interopChainAggregateFields)

/** What the aggregation computes, before the response says which snapshot it is. */
export type InteropChainAggregate = v.infer<typeof InteropChainAggregateSchema>

export const InteropChainSchema = v
  .object({
    ...interopChainAggregateFields,
    timestamp: v.number().meta({ description: SNAPSHOT_TIMESTAMP_DESCRIPTION }),
  })
  .describe('InteropChain')

export type InteropChain = v.infer<typeof InteropChainSchema>
export const InteropChainsResultSchema = v.array(InteropChainSchema)
