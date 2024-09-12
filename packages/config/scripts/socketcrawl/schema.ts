import { z } from 'zod'

export const SocketVaults = z.record(
  z.array(
    z.object({
      address: z.string(),
      hubOrBridge: z.string().nullable(),
      siblingChainSlug: z.union([z.number(), z.string()]).nullable(),
      tokens: z.array(
        z.object({
          token: z.string(),
          tokenName: z.string().optional(),
          tokenSymbol: z.string().optional(),
          tvl: z.number(),
        }),
      ),
      owner: z.string().nullable(),
      tags: z.array(z.string()).optional(),
    }),
  ),
)

export type SocketVaults = z.infer<typeof SocketVaults>
