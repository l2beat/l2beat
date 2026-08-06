import { InteropBridgeTypeValues } from '@l2beat/shared-pure'
import { type Validator, v } from '@l2beat/validate'

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

const nullable = <T>(validator: Validator<T>) => v.union([validator, v.null()])

const MAX_UNIX_TIME = 4102444800 // 2100-01-01

/**
 * Query params always arrive as strings. They are validated here and converted
 * by `parseIntegerParam` at the call site, which keeps the query schema a
 * `Validator` - `transform` would downgrade it to a bare `Parser`.
 */
const integerParam = (name: string, min: number, max: number) =>
  v
    .string()
    .check((raw) => {
      const value = Number(raw)
      return Number.isInteger(value) && value >= min && value <= max
    }, `${name} must be an integer between ${min} and ${max}`)
    .meta({ format: 'integer' })

export function parseIntegerParam(raw: string | undefined): number | undefined {
  return raw === undefined ? undefined : Number(raw)
}

export const INTEROP_ROWS_MAX_LIMIT = 1000
export const INTEROP_ROWS_DEFAULT_LIMIT = 100

const InteropRowsQueryBase = {
  plugin: v.string().meta({
    description:
      'Plugin id. Required - it bounds every query to a single plugin. Discoverable via /v1/interop/plugins.',
  }),
  type: v.string().optional().meta({
    description: 'Exact message/transfer type, e.g. "across.Transfer".',
  }),
  srcChain: v.string().optional(),
  dstChain: v.string().optional(),
  from: integerParam('from', 0, MAX_UNIX_TIME).optional().meta({
    description: 'Inclusive lower bound on timestamp, unix seconds.',
  }),
  to: integerParam('to', 0, MAX_UNIX_TIME).optional().meta({
    description: 'Exclusive upper bound on timestamp, unix seconds.',
  }),
  order: v.enum(['asc', 'desc']).optional().meta({
    description: 'Order by (timestamp, id). Defaults to desc.',
  }),
  limit: integerParam('limit', 1, INTEROP_ROWS_MAX_LIMIT)
    .optional()
    .meta({
      description: `Rows per page, 1-${INTEROP_ROWS_MAX_LIMIT}. Defaults to ${INTEROP_ROWS_DEFAULT_LIMIT}.`,
    }),
  cursor: v.string().optional().meta({
    description:
      'Opaque cursor from a previous response. Only valid for the filter set and order that produced it.',
  }),
}

export const InteropMessagesQuerySchema = v.object({
  ...InteropRowsQueryBase,
  app: v.string().optional().meta({
    description: 'Exact app name attributed to the message.',
  }),
})
export type InteropMessagesQuery = v.infer<typeof InteropMessagesQuerySchema>

export const InteropTransfersQuerySchema = v.object(InteropRowsQueryBase)
export type InteropTransfersQuery = v.infer<typeof InteropTransfersQuerySchema>

export const InteropMessageSchema = v
  .object({
    plugin: v.string(),
    type: v.string(),
    app: v.string(),
    messageId: v.string(),
    timestamp: v.number().meta({
      description:
        'max(srcTime, dstTime) in unix seconds - the sort key of this endpoint.',
    }),
    duration: nullable(v.number()).meta({
      description: 'dstTime - srcTime in seconds.',
    }),
    srcChain: nullable(v.string()),
    srcTime: nullable(v.number()),
    srcTxHash: nullable(v.string()),
    srcLogIndex: nullable(v.number()),
    dstChain: nullable(v.string()),
    dstTime: nullable(v.number()),
    dstTxHash: nullable(v.string()),
    dstLogIndex: nullable(v.number()),
  })
  .describe('InteropMessage')

export type InteropMessage = v.infer<typeof InteropMessageSchema>

export const InteropMessagesResultSchema = v
  .object({
    data: v.array(InteropMessageSchema),
    nextCursor: nullable(v.string()).meta({
      description:
        'Pass back as `cursor` to fetch the next page. Null on the last page.',
    }),
  })
  .describe('InteropMessagesResult')

export type InteropMessagesResult = v.infer<typeof InteropMessagesResultSchema>

export const InteropTransferSchema = v
  .object({
    plugin: v.string(),
    type: v.string(),
    transferId: v.string(),
    bridgeType: v.enum(InteropBridgeTypeValues).meta({
      description:
        'Plugin-declared bridge type, or one derived from srcWasBurned/dstWasMinted when the plugin did not declare it.',
    }),
    timestamp: v.number().meta({
      description:
        'max(srcTime, dstTime) in unix seconds - the sort key of this endpoint.',
    }),
    duration: nullable(v.number()).meta({
      description: 'dstTime - srcTime in seconds.',
    }),
    srcChain: v.string(),
    srcTime: nullable(v.number()),
    srcTxHash: nullable(v.string()),
    srcLogIndex: nullable(v.number()),
    srcTokenAddress: nullable(v.string()),
    srcAbstractTokenId: nullable(v.string()),
    srcSymbol: nullable(v.string()),
    srcRawAmount: nullable(v.string()).meta({
      description:
        'Exact on-chain amount as a decimal string. Prefer this over srcAmount, which is a single-precision float.',
    }),
    srcAmount: nullable(v.number()),
    srcPrice: nullable(v.number()),
    srcValueUsd: nullable(v.number()),
    srcWasBurned: nullable(v.boolean()),
    dstChain: v.string(),
    dstTime: nullable(v.number()),
    dstTxHash: nullable(v.string()),
    dstLogIndex: nullable(v.number()),
    dstTokenAddress: nullable(v.string()),
    dstAbstractTokenId: nullable(v.string()),
    dstSymbol: nullable(v.string()),
    dstRawAmount: nullable(v.string()).meta({
      description:
        'Exact on-chain amount as a decimal string. Prefer this over dstAmount, which is a single-precision float.',
    }),
    dstAmount: nullable(v.number()),
    dstPrice: nullable(v.number()),
    dstValueUsd: nullable(v.number()),
    dstWasMinted: nullable(v.boolean()),
    isProcessed: v.boolean().meta({
      description:
        'False while token resolution and pricing are still pending, in which case symbol/amount/price/valueUsd fields are not yet populated. Rows are updated in place after insertion.',
    }),
  })
  .describe('InteropTransfer')

export type InteropTransfer = v.infer<typeof InteropTransferSchema>

export const InteropTransfersResultSchema = v
  .object({
    data: v.array(InteropTransferSchema),
    nextCursor: nullable(v.string()).meta({
      description:
        'Pass back as `cursor` to fetch the next page. Null on the last page.',
    }),
  })
  .describe('InteropTransfersResult')

export type InteropTransfersResult = v.infer<
  typeof InteropTransfersResultSchema
>

const InteropTypeSummarySchema = v
  .object({
    type: v.string(),
    count: v.number(),
    oldestTimestamp: v.number(),
    newestTimestamp: v.number(),
  })
  .describe('InteropTypeSummary')

export const InteropPluginSchema = v
  .object({
    plugin: v.string(),
    messageTypes: v.array(InteropTypeSummarySchema),
    transferTypes: v.array(InteropTypeSummarySchema),
  })
  .describe('InteropPlugin')

export type InteropPlugin = v.infer<typeof InteropPluginSchema>
export const InteropPluginsResultSchema = v.array(InteropPluginSchema)
