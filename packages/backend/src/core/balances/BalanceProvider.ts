import {
  AssetId,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'

import { BalanceRecord } from '../../peripherals/database/BalanceRepository'
import { BalanceCall } from '../../peripherals/ethereum/calls/BalanceCall'
import { MulticallClient } from '../../peripherals/ethereum/MulticallClient'

export interface HeldAsset {
  holder: EthereumAddress
  assetId: AssetId
}

export interface BalanceProvider {
  fetchBalances: (
    missingAssets: HeldAsset[],
    timestamp: UnixTime,
    blockNumber: number,
  ) => Promise<BalanceRecord[]>
  getChainId: () => ChainId
}

export class EthereumBalanceProvider implements BalanceProvider {
  constructor(
    private readonly multiCallClient: MulticallClient,
    private readonly chainId: ChainId,
  ) {}
  public async fetchBalances(
    missingData: HeldAsset[],
    timestamp: UnixTime,
    blockNumber: number,
  ): Promise<BalanceRecord[]> {
    const calls = missingData.map((m) =>
      BalanceCall.encode(m.holder, m.assetId),
    )

    const multicallResponses = await this.multiCallClient.multicall(
      calls,
      blockNumber,
    )

    return multicallResponses.map((res, i) => ({
      holderAddress: missingData[i].holder,
      assetId: missingData[i].assetId,
      balance: BalanceCall.decodeOr(res, 0n),
      timestamp,
      chainId: this.chainId,
    }))
  }

  public getChainId(): ChainId {
    return this.chainId
  }
}
