import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  numberAs,
  stringAs,
  UnixTime,
} from '@l2beat/shared-pure'
import { z } from 'zod'

export type TokenInfo = z.infer<typeof TokenInfo>
export const TokenInfo = z.object({
  /** Internal token id. Usually ticker-name */
  id: stringAs((s) => AssetId(s)),
  /** Token name as dictated by the token contract */
  name: z.string(),
  /** Token Coingecko API id. Used to fetch prices */
  coingeckoId: stringAs((s) => CoingeckoId(s)),
  /** Token address. Only Ether has no address */
  address: stringAs((s) => EthereumAddress(s)).optional(),
  /** Token symbol as dictated by the token contract */
  symbol: z.string(),
  /** Token decimals as dictated by the token contract */
  decimals: z.number(),
  /** Timestamp of the token contract deployment transaction */
  sinceTimestamp: numberAs((n) => new UnixTime(n)),
  /** Which category does the token belong to */
  category: z.union([
    z.literal('ether'),
    z.literal('stablecoin'),
    z.literal('other'),
  ]),
})
