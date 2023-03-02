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
  /** Internal token id. Usually ticker-name */
  id: branded(z.string(), (s) => AssetId(s)),
  /** Token name as dictated by the token contract */
  name: z.string(),
  /** Token Coingecko API id. Used to fetch prices */
  coingeckoId: branded(z.string(), (s) => CoingeckoId(s)),
  /** Token address. Only Ether has no address */
  address: branded(z.string(), (s) => EthereumAddress(s)).optional(),
  /** Token symbol as dictated by the token contract */
  symbol: z.string(),
  /** Token decimals as dictated by the token contract */
  decimals: z.number(),
  /** Timestamp of the token contract deployment transaction */
  sinceTimestamp: branded(z.number(), (n) => new UnixTime(n)),
  /** Which category does the token belong to */
  category: z.union([
    z.literal('ether'),
    z.literal('stablecoin'),
    z.literal('other'),
  ]),
})
