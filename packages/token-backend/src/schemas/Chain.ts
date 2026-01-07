import { v } from '@l2beat/validate'

export const ChainApiSchema = v.union([
  v.object({
    type: v.literal('rpc'),
    url: v.string(),
    callsPerMinute: v.number().optional(),
  }),
  v.object({
    type: v.literal('etherscan'),
    callsPerMinute: v.number().optional(),
  }),
  v.object({
    type: v.literal('blockscout'),
    url: v.string(),
    callsPerMinute: v.number().optional(),
  }),
  v.object({
    type: v.literal('blockscoutV2'),
    url: v.string(),
    callsPerMinute: v.number().optional(),
  }),
  v.object({
    type: v.literal('routescan'),
    url: v.string(),
    callsPerMinute: v.number().optional(),
  }),
])

export const ChainRecord = v.object({
  name: v.string(),
  chainId: v.number(),
  explorerUrl: v.union([v.string(), v.null()]),
  aliases: v.union([v.array(v.string()), v.null()]),
  apis: v.union([v.array(ChainApiSchema), v.null()]),
})

export type ChainRecord = v.infer<typeof ChainRecord>

export const ChainUpdateSchema = v.object({
  name: v.string(),
  chainId: v.number().optional(),
  explorerUrl: v.union([v.string(), v.null()]).optional(),
  aliases: v.union([v.array(v.string()), v.null()]).optional(),
  apis: v.union([v.array(ChainApiSchema), v.null()]).optional(),
})

export type ChainUpdate = v.infer<typeof ChainUpdateSchema>
