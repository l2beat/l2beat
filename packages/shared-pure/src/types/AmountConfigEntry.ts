/*
                ====== IMPORTANT NOTICE ======
DO NOT MODIFY THIS FILE WITHOUT MODIFYING THE "createAmountId" FUNCTION
DO NOT MODIFY THIS FILE WITHOUT MODIFYING THE getAmountsStatus FUNCTION
*/

import type { AssetId } from './AssetId'
import type { CoingeckoId } from './CoingeckoId'
import type { EthereumAddress } from './EthereumAddress'
import type { ProjectId } from './ProjectId'
import type { Token } from './Token'
import type { UnixTime } from './UnixTime'

export type AmountConfigEntry =
  | TotalSupplyEntry
  | CirculatingSupplyEntry
  | EscrowEntry
  | PremintedEntry
  | AggLayerL2Token
  | AggLayerNativeEtherPreminted
  | AggLayerNativeEtherWrapped
  | ElasticChainL2Token
  | ElasticChainEther

export interface PremintedEntry extends AmountConfigBase {
  type: 'preminted'
  address: EthereumAddress | 'native'
  coingeckoId: CoingeckoId
  escrowAddress: EthereumAddress
}

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
  assetId: AssetId
  chain: string
  project: ProjectId
  source: Token['source']
  dataSource: string
  sinceTimestamp: UnixTime
  untilTimestamp: UnixTime | undefined
  includeInTotal: boolean
  decimals: number
  symbol: string
  isAssociated: boolean
  category: Token['category']
  bridgedUsing?: Token['bridgedUsing']
}

export interface AggLayerL2Token extends AmountConfigBase {
  type: 'aggLayerL2Token'
  l1Address: EthereumAddress
  originNetwork: number
  escrowAddress: EthereumAddress
}

export interface AggLayerNativeEtherPreminted extends AmountConfigBase {
  type: 'aggLayerNativeEtherPreminted'
  l2BridgeAddress: EthereumAddress
  premintedAmount: bigint
  escrowAddress: EthereumAddress
}

export interface AggLayerNativeEtherWrapped extends AmountConfigBase {
  type: 'aggLayerNativeEtherWrapped'
  wethAddress: EthereumAddress
  escrowAddress: EthereumAddress
}

export interface ElasticChainL2Token extends AmountConfigBase {
  type: 'elasticChainL2Token'
  l1Address: EthereumAddress
  escrowAddress: EthereumAddress
  l2BridgeAddress: EthereumAddress
}

export interface ElasticChainEther extends AmountConfigBase {
  type: 'elasticChainEther'
  address: EthereumAddress
  escrowAddress: EthereumAddress
}
