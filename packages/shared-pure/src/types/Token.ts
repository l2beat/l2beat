import { z } from 'zod'

import { AssetId } from './AssetId'
import { numberAs, stringAs } from './branded'
import { ChainId } from './ChainId'
import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { UnixTime } from './UnixTime'

export const Token = z.object({
  id: stringAs((s) => AssetId(s)),
  name: z.string(),
  coingeckoId: stringAs((s) => CoingeckoId(s)),
  address: stringAs((s) => EthereumAddress(s)).optional(),
  symbol: z.string(),
  decimals: z.number(),
  sinceTimestamp: numberAs((n) => new UnixTime(n)),

  /** @deprecated */
  category: z.union([
    z.literal('ether'),
    z.literal('stablecoin'),
    z.literal('other'),
  ]),
  iconUrl: z.optional(z.string()),
  chainId: numberAs(ChainId),
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
})

export type Token = z.infer<typeof Token>
