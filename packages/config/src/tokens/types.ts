import {
  ChainId,
  ChainSpecificAddress,
  CoingeckoId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'

export type GeneratedToken = z.infer<typeof GeneratedToken>
export const GeneratedToken = z.object({
  name: z.string(),
  coingeckoId: z.string().transform(CoingeckoId),
  address: z
    .string()
    .transform((address) => {
      if (ChainSpecificAddress.check(address)) {
        return ChainSpecificAddress.address(address)
      }
      return EthereumAddress(address)
    })
    .optional(),
  symbol: z.string(),
  decimals: z.number(),
  deploymentTimestamp: z.number().transform(UnixTime),
  // This is either coingecko listing timestamp or min timestamp of ethereum
  coingeckoListingTimestamp: z.number().transform(UnixTime),
  untilTimestamp: z.number().transform(UnixTime).optional(),
  /** @deprecated */
  category: z.enum([
    'ether',
    'stablecoin',
    'btc',
    'rwaRestricted',
    'rwaPublic',
    'other',
  ]),
  iconUrl: z.string().optional(),
  chainId: z.number().transform(ChainId),
  source: z.enum(['canonical', 'external', 'native']),
  supply: z.enum(['totalSupply', 'circulatingSupply', 'zero']),
  excludeFromTotal: z.literal(true).optional(),
  premint: z.string().optional(),
  bridgedUsing: z
    .object({
      bridges: z.array(
        z.object({
          name: z.string(),
          slug: z.string().optional(),
        }),
      ),
      warning: z.string().optional(),
    })
    .optional(),
})

export type SourceEntry = z.infer<typeof SourceEntry>
export const SourceEntry = z.object({
  symbol: z.string(),
  address: z.string().transform(EthereumAddress).optional(),
  coingeckoId: z.string().transform(CoingeckoId).optional(),
  category: z
    .enum(['ether', 'stablecoin', 'btc', 'rwaRestricted', 'rwaPublic', 'other'])
    .optional(),
  source: z.enum(['canonical', 'external', 'native']).optional(),
  supply: z.enum(['totalSupply', 'circulatingSupply', 'zero']).optional(),
  bridgedUsing: z
    .object({
      bridges: z.array(
        z.object({
          name: z.string(),
          slug: z.string().optional(),
        }),
      ),
      warning: z.string().optional(),
    })
    .optional(),
  deploymentTimestamp: z.number().transform(UnixTime).optional(),
  excludeFromTotal: z.literal(true).optional(),
})

export type Source = z.infer<typeof Source>
export const Source = z.record(z.string(), z.array(SourceEntry))

export type Output = z.infer<typeof Output>
export const Output = z.object({
  comment: z.string().optional(),
  tokens: z.array(GeneratedToken),
})
