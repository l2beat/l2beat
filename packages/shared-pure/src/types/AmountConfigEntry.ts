import { CoingeckoId } from './CoingeckoId'
import { EthereumAddress } from './EthereumAddress'
import { ProjectId } from './ProjectId'
import { UnixTime } from './UnixTime'

export type AmountConfigEntry =
  | TotalSupplyEntry
  | CirculatingSupplyEntry
  | EscrowEntry

export type TotalSupplyEntry = AmountConfigBase & TotalSupplySpecific
export interface TotalSupplySpecific {
  type: 'totalSupply'
  address: EthereumAddress
}

export type CirculatingSupplyEntry = AmountConfigBase &
  CirculatingSupplySpecific
export interface CirculatingSupplySpecific {
  type: 'circulatingSupply'
  address: EthereumAddress | 'native'
  coingeckoId: CoingeckoId
}
export type EscrowEntry = AmountConfigBase & EscrowSpecific
export interface EscrowSpecific {
  type: 'escrow'
  address: EthereumAddress | 'native'
  escrowAddress: EthereumAddress
}

export interface AmountConfigBase {
  chain: string
  project: ProjectId
  source: 'canonical' | 'external' | 'native'
  sinceTimestamp: UnixTime
  includeInTotal: boolean
}
