import { AssetId, EthereumAddress, Logger } from '@l2beat/common'

import { ProjectInfo } from '../model/ProjectInfo'
import {
  BalanceRecord,
  BalanceRepository,
} from '../peripherals/database/BalanceRepository'
import { BalanceCall } from '../peripherals/ethereum/calls/BalanceCall'
import { MulticallClient } from '../peripherals/ethereum/MulticallClient'

type Metadata = { address: EthereumAddress; asset: AssetId }

export class BalanceUpdater {
  constructor(
    private multicall: MulticallClient,
    private balanceRepository: BalanceRepository,
    private projects: ProjectInfo[],
    private logger: Logger
  ) {
    this.logger = this.logger.for(this)
  }

  async update(blocks: bigint[]) {
    for (const block of blocks) {
      const missing = await this.getMissingDataByBlock(block)

      await this.fetchBalances(missing, block)

      this.logger.debug('Balances updated', {
        block: block.toString(),
        amount: missing.length,
      })
    }
  }

  async getMissingDataByBlock(blockNumber: bigint): Promise<Metadata[]> {
    const known = await this.balanceRepository.getDataBoundaries()

    const missing = []

    for (const project of this.projects) {
      for (const bridge of project.bridges) {
        if (bridge.sinceBlock > blockNumber) {
          continue
        } else {
          for (const token of bridge.tokens) {
            if (token.sinceBlock > blockNumber) {
              continue
            } else {
              const data = known.get(`${bridge.address}-${token.id}`)
              if (
                data === undefined ||
                data.earliestBlockNumber > blockNumber ||
                data!.latestBlockNumber < blockNumber
              ) {
                missing.push({
                  address: EthereumAddress(bridge.address),
                  asset: token.id,
                })
              } else {
                continue
              }
            }
          }
        }
      }
    }
    return missing
  }

  async fetchBalances(missingData: Metadata[], blockNumber: bigint) {
    const calls = missingData.map((m) =>
      BalanceCall.generate(m.address, m.asset)
    )

    const multicallResponses = await this.multicall.multicall(
      calls.map((call) => call.request),
      blockNumber
    )

    const balances: BalanceRecord[] = multicallResponses.map((res, i) => ({
      holderAddress: calls[i].holder,
      assetId: calls[i].asset,
      balance: BalanceCall.decode(res)
        ? (BalanceCall.decode(res) as bigint)
        : BigInt(0),
      blockNumber: blockNumber,
    }))

    this.balanceRepository.addOrUpdate(balances)
  }
}
