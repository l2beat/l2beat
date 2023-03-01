import {
  AssetId,
  branded,
  CoingeckoId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared'
import { z } from 'zod'

export type TokenInfo = z.infer<typeof TokenInfo>
export const TokenInfo = z.object({
  id: branded(z.string(), (s) => AssetId(s)),
  name: z.string(),
  symbol: z.string(),
  address: z.optional(branded(z.string(), (s) => EthereumAddress(s))),
  coingeckoId: branded(z.string(), (s) => CoingeckoId(s)),
  decimals: z.number(),
  sinceTimestamp: branded(z.number(), (n) => new UnixTime(n)),
  category: z.union([
    z.literal('ether'),
    z.literal('stablecoin'),
    z.literal('other'),
  ]),
})
