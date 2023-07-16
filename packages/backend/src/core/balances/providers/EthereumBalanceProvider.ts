import { ChainId, UnixTime } from '@l2beat/shared-pure'

import { BalanceRecord } from '../../../peripherals/database/BalanceRepository'
import { BalanceCall } from '../../../peripherals/ethereum/calls/BalanceCall'
import { MulticallClient } from '../../../peripherals/ethereum/MulticallClient'
import { BalanceProvider, BalanceQuery } from '../BalanceProvider'

export class EthereumBalanceProvider implements BalanceProvider {
  private readonly chainId = ChainId.ETHEREUM

  constructor(private readonly multiCallClient: MulticallClient) {}

  public async fetchBalances(
    missingData: BalanceQuery[],
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
