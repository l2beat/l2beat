import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  numberAs,
  stringAs,
  UnixTime,
} from '@l2beat/shared-pure'
import { z } from 'zod'

export type GeneratedToken = z.infer<typeof GeneratedToken>
export const GeneratedToken = z.object({
  id: stringAs((s) => AssetId(s)),
  name: z.string(),
  coingeckoId: stringAs((s) => CoingeckoId(s)),
  address: stringAs((s) => EthereumAddress(s)).optional(),
  symbol: z.string(),
  decimals: z.number(),
  deploymentTimestamp: numberAs((n) => new UnixTime(n)),
  // This is either coingecko listing timestamp or min timestamp of ethereum
  coingeckoListingTimestamp: numberAs((n) => new UnixTime(n)),
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

export type SourceEntry = z.infer<typeof SourceEntry>
export const SourceEntry = z.object({
  symbol: z.string(),
  address: stringAs(EthereumAddress).optional(),
  coingeckoId: stringAs(CoingeckoId).optional(),
  category: z.enum(['ether', 'stablecoin', 'other']).optional(),
  type: z.enum(['CBV', 'EBV', 'NMV']).optional(),
  formula: z.enum(['totalSupply', 'locked', 'circulatingSupply']).optional(),
  bridgedUsing: z
    .object({
      bridge: z.string(),
      slug: z.string().optional(),
    })
    .optional(),
})

export type Source = z.infer<typeof Source>
export const Source = z.record(z.array(SourceEntry))

export type Output = z.infer<typeof Output>
export const Output = z.object({
  comment: z.string().optional(),
  tokens: z.array(GeneratedToken),
})
