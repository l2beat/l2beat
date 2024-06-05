/*
                ====== IMPORTANT NOTICE ======
DO NOT MODIFY THIS FILE WITHOUT MODIFYING THE "createAmountId" FUNCTION
*/

import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { ProjectId } from './ProjectId'
import { UnixTime } from './UnixTime'

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

export interface AmountConfigBase {
  chain: string
  project: ProjectId
  source: 'canonical' | 'external' | 'native'
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  includeInTotal: boolean
  decimals: number
  symbol: string
  isAssociated: boolean
}
