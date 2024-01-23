import {
  CoingeckoId,
  EthereumAddress,
  stringAs,
  Token,
} from '@l2beat/shared-pure'
import { z } from 'zod'

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
  tokens: z.array(Token),
})
