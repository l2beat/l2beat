import { z } from 'zod'

export const CoinListPlatformResult = z.array(
  z.object({
    id: z.string().transform((x) => (x ? x.toString() : undefined)),
    symbol: z.string(),
    name: z.string(),
    platforms: z.record(z.string(), z.union([z.string(), z.null()])),
  }),
)
