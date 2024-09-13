import {
  ChainId,
  CoingeckoId,
  EthereumAddress,
  UnixTime,
  numberAs,
  stringAs,
} from '@l2beat/shared-pure'
import { z } from 'zod'

export type GeneratedToken = z.infer<typeof GeneratedToken>
export const GeneratedToken = z.object({
  name: z.string(),
  coingeckoId: stringAs((s) => CoingeckoId(s)),
  address: stringAs((s) => EthereumAddress(s)).optional(),
  symbol: z.string(),
  decimals: z.number(),
  deploymentTimestamp: numberAs((n) => new UnixTime(n)),
  // This is either coingecko listing timestamp or min timestamp of ethereum
  coingeckoListingTimestamp: numberAs((n) => new UnixTime(n)),
  untilTimestamp: numberAs((n) => new UnixTime(n)).optional(),
  /** @deprecated */
  category: z.enum(['ether', 'stablecoin', 'other']),
  iconUrl: z.optional(z.string()),
  chainId: numberAs(ChainId),
  source: z.enum(['canonical', 'external', 'native']),
  supply: z.enum(['totalSupply', 'circulatingSupply', 'zero']),
  excludeFromTotal: z.literal(true).optional(),
  bridgedUsing: z.optional(
    z.object({
      bridges: z.array(
        z.object({
          name: z.string(),
          slug: z.string().optional(),
        }),
      ),
      warning: z.string().optional(),
    }),
  ),
})

export type SourceEntry = z.infer<typeof SourceEntry>
export const SourceEntry = z.object({
  symbol: z.string(),
  address: stringAs(EthereumAddress).optional(),
  coingeckoId: stringAs(CoingeckoId).optional(),
  category: z.enum(['ether', 'stablecoin', 'other']).optional(),
  source: z.enum(['canonical', 'external', 'native']).optional(),
  supply: z.enum(['totalSupply', 'circulatingSupply', 'zero']).optional(),
  bridgedUsing: z.optional(
    z.object({
      bridges: z.array(
        z.object({
          name: z.string(),
          slug: z.string().optional(),
        }),
      ),
      warning: z.string().optional(),
    }),
  ),
  deploymentTimestamp: numberAs((n) => new UnixTime(n)).optional(),
  excludeFromTotal: z.literal(true).optional(),
})

export type Source = z.infer<typeof Source>
export const Source = z.record(z.array(SourceEntry))

export type Output = z.infer<typeof Output>
export const Output = z.object({
  comment: z.string().optional(),
  tokens: z.array(GeneratedToken),
})
