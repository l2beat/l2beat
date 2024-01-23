import { z } from 'zod'

import { AssetId } from './AssetId'
import { numberAs, stringAs } from './branded'
import { ChainId } from './ChainId'
import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { UnixTime } from './UnixTime'

export type Token = z.infer<typeof Token>
export const Token = z.object({
  id: stringAs((s) => AssetId(s)),
  name: z.string(),
  coingeckoId: stringAs((s) => CoingeckoId(s)),
  address: stringAs((s) => EthereumAddress(s)).optional(),
  symbol: z.string(),
  decimals: z.number(),
  sinceTimestamp: numberAs((n) => new UnixTime(n)),
  /** @deprecated */
  category: z.enum(['ether', 'stablecoin', 'other']),
  iconUrl: z.optional(z.string()),
  chainId: numberAs(ChainId),
  type: z.enum(['CBV', 'EBV', 'NMV']),
  formula: z.enum(['totalSupply', 'locked', 'circulatingSupply']),
  bridgedUsing: z.optional(
    z.object({
      bridge: z.string(),
      slug: z.string().optional(),
    }),
  ),
})
