import {
  AssetId,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'

import { BalanceRecord } from '../../peripherals/database/BalanceRepository'

export interface BalanceQuery {
  holder: EthereumAddress
  assetId: AssetId
}

export interface BalanceProvider {
  fetchBalances: (
    missingAssets: BalanceQuery[],
    timestamp: UnixTime,
    blockNumber: number,
  ) => Promise<BalanceRecord[]>
  getChainId: () => ChainId
}
