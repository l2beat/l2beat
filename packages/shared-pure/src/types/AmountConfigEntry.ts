/*
                ====== IMPORTANT NOTICE ======
DO NOT MODIFY THIS FILE WITHOUT MODIFYING THE "createAmountId" FUNCTION

KEEP IN MIND THAT THIS TYPE WILL BE SERIALIZED AND STORED IN THE DATABASE
WHEN ADDING A NEW FIELD MAKE SURE TO WRITE A DB MIGRATION OR MAKE FIELD OPTIONAL
*/

import { z } from 'zod'
import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { ProjectId } from './ProjectId'
import { UnixTime } from './UnixTime'
import { branded, stringAs } from './branded'

export const AmountConfigBase = z.object({
  chain: z.string(),
  // TODO: resolve issue with type while using stringAs()
  project: z.string().refine((s) => ProjectId(s)),
  source: z.enum(['canonical', 'external', 'native']),
  sinceTimestamp: branded(z.number(), (n) => new UnixTime(n)),
  untilTimestamp: branded(z.number().optional(), (n) =>
    n !== undefined ? new UnixTime(n) : undefined,
  ),
  includeInTotal: z.boolean(),
  decimals: z.number(),
  symbol: z.string(),
  isAssociated: z.boolean().optional(),
})
export type AmountConfigBase = z.infer<typeof AmountConfigBase>

export const TotalSupplyEntry = AmountConfigBase.extend({
  type: z.literal('totalSupply'),
  address: stringAs(EthereumAddress),
})
export type TotalSupplyEntry = z.infer<typeof TotalSupplyEntry>

export const CirculatingSupplyEntry = AmountConfigBase.extend({
  type: z.literal('circulatingSupply'),
  address: z.union([stringAs(EthereumAddress), z.literal('native')]),
  coingeckoId: stringAs(CoingeckoId),
})
export type CirculatingSupplyEntry = z.infer<typeof CirculatingSupplyEntry>

export const EscrowEntry = AmountConfigBase.extend({
  type: z.literal('escrow'),
  address: z.union([stringAs(EthereumAddress), z.literal('native')]),
  escrowAddress: stringAs(EthereumAddress),
})
export type EscrowEntry = z.infer<typeof EscrowEntry>

export const AmountConfigEntry = z.union([
  TotalSupplyEntry,
  CirculatingSupplyEntry,
  EscrowEntry,
])
export type AmountConfigEntry = z.infer<typeof AmountConfigEntry>
