import {
  CoingeckoId,
  EthereumAddress,
  stringAs,
  Token,
} from '@l2beat/shared-pure'
import { z } from 'zod'

const SourceEntry = z.object({
  symbol: z.string(),
  address: stringAs(EthereumAddress).optional(),
  coingeckoId: stringAs((s) => CoingeckoId(s)).optional(),
  category: z
    .union([z.literal('ether'), z.literal('stablecoin'), z.literal('other')])
    .optional(),
  type: z
    .union([z.literal('CBV'), z.literal('EBV'), z.literal('NMV')])
    .optional(),
  formula: z
    .union([
      z.literal('totalSupply'),
      z.literal('locked'),
      z.literal('circulatingSupply'),
    ])
    .optional(),

  bridgedUsing: z.optional(
    z.object({
      bridge: z.string(),
      slug: z.string().optional(),
    }),
  ),
})
export type SourceEntry = z.infer<typeof SourceEntry>
export const Source = z.record(z.array(SourceEntry))
export const Output = z.object({
  comment: z.string().optional(),
  tokens: z.array(Token),
})
export type Output = z.infer<typeof Output>
