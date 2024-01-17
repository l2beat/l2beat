import { z } from 'zod'

import { AssetId } from './AssetId'
import { numberAs, stringAs } from './branded'
import { ChainId } from './ChainId'
import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { UnixTime } from './UnixTime'

export const Token = z.object({
  id: stringAs((s) => AssetId(s)),
  chainId: numberAs(ChainId),

  address: stringAs((s) => EthereumAddress(s)).optional(),
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),

  iconUrl: z.optional(z.string()),
  coingeckoId: stringAs((s) => CoingeckoId(s)),

  sinceTimestamp: numberAs((n) => new UnixTime(n)),

  type: z.union([z.literal('CBV'), z.literal('EBV'), z.literal('NMV')]),
  formula: z.union([
    z.literal('totalSupply'),
    z.literal('locked'),
    z.literal('circulatingSupply'),
  ]),

  bridgedUsing: z.optional(
    z.object({
      bridge: z.string(),
      slug: z.string().optional(),
    }),
  ),

  /** @deprecated */
  category: z.union([
    z.literal('ether'),
    z.literal('stablecoin'),
    z.literal('other'),
  ]),
})

export type Token = z.infer<typeof Token>
