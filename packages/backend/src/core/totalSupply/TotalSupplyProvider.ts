import {
  AssetId,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'

import { TotalSupplyRecord } from '../../peripherals/database/TotalSupplyRepository'

export interface TotalSupplyQuery {
  assetId: AssetId
  tokenAddress: EthereumAddress
}

export interface TotalSupplyProvider {
  getTotalSupplies: (
    totalSupplyQueries: TotalSupplyQuery[],
    timestamp: UnixTime,
    blockNumber: number,
  ) => Promise<TotalSupplyRecord[]>
  getChainId: () => ChainId
}
