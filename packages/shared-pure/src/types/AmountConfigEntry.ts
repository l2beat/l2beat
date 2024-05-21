/*
                ====== IMPORTANT NOTICE ======
DO NOT MODIFY THIS FILE WITHOUT MODIFYING THE "createAmountId" FUNCTION
*/

import { z } from 'zod'
import { ProjectId } from './ProjectId'
import { UnixTime } from './UnixTime'
import { branded } from './branded'
import { EthereumAddress } from './EthereumAddress'
import { CoingeckoId } from './CoingeckoId'

export type AmountConfigEntry =
  | TotalSupplyEntry
  | CirculatingSupplyEntry
  | EscrowEntry

export interface TotalSupplyEntry extends AmountConfigBase {
  type: 'totalSupply'
  address: EthereumAddress
}

export interface CirculatingSupplyEntry extends AmountConfigBase {
  type: 'circulatingSupply'
  address: EthereumAddress | 'native'
  coingeckoId: CoingeckoId
}

export interface EscrowEntry extends AmountConfigBase {
  type: 'escrow'
  address: EthereumAddress | 'native'
  escrowAddress: EthereumAddress
}

export const AmountConfigBase = z.object({
  chain: z.string(),
  project: branded(z.string(), ProjectId),
  source: z.enum(['canonical', 'external', 'native']),
  sinceTimestamp: branded(z.number(), (n) => new UnixTime(n)),
  untilTimestamp: branded(z.number().optional(), (n) =>
    n !== undefined ? new UnixTime(n) : undefined,
  ),
  includeInTotal: z.boolean(),
  decimals: z.number(),
  symbol: z.string(),
})
export type AmountConfigBase = z.infer<typeof AmountConfigBase>
