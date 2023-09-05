import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'

import { CirculatingSupplyRecord } from '../../peripherals/database/CirculatingSupplyRepository'

export interface CirculatingSupplyQuery {
  assetId: AssetId
  decimals: number
  coingeckoId: CoingeckoId
  address: EthereumAddress
}

export interface CirculatingSupplyProvider {
  getCirculatingSupplies: (
    totalSupplyQueries: CirculatingSupplyQuery[],
    timestamp: UnixTime,
  ) => Promise<CirculatingSupplyRecord[]>
  getChainId: () => ChainId
}
