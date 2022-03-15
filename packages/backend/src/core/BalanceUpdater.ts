import { AssetId, EthereumAddress, Logger } from '@l2beat/common'

import { ProjectInfo } from '../model/ProjectInfo'
import {
  BalanceRecord,
  BalanceRepository,
} from '../peripherals/database/BalanceRepository'
import { BalanceCall } from '../peripherals/ethereum/calls/BalanceCall'
import { MulticallClient } from '../peripherals/ethereum/MulticallClient'

interface HeldAsset {
  holder: EthereumAddress
  assetId: AssetId
}

export class BalanceUpdater {
  private processedBlocks = new Set<bigint>()

  constructor(
    private multicall: MulticallClient,
    private balanceRepository: BalanceRepository,
    private projects: ProjectInfo[],
    private logger: Logger
  ) {
    this.logger = this.logger.for(this)
  }

  async update(blocks: bigint[]) {
    const unprocessed = blocks.filter((x) => !this.processedBlocks.has(x))
    for (const blockNumber of unprocessed) {
      const missing = await this.getMissingDataByBlock(blockNumber)

      const balances = await this.fetchBalances(missing, blockNumber)
      await this.balanceRepository.addOrUpdate(balances)
      this.processedBlocks.add(blockNumber)

      this.logger.debug('Balances updated', {
        block: blockNumber.toString(),
        amount: missing.length,
      })
    }
  }

  async getMissingDataByBlock(blockNumber: bigint): Promise<HeldAsset[]> {
    const known: BalanceRecord[] = await this.balanceRepository.getByBlock(
      blockNumber
    )
    const knownSet = new Set(
      known.map((x) => `${x.holderAddress}-${x.assetId}`)
    )

    const missing: HeldAsset[] = []
    for (const project of this.projects) {
      for (const bridge of project.bridges) {
        if (bridge.sinceBlock > blockNumber) {
          continue
        }
        for (const token of bridge.tokens) {
          if (token.sinceBlock > blockNumber) {
            continue
          }
          // TODO: make bridge.address EthereumAddress
          const entry = {
            holder: EthereumAddress(bridge.address),
            assetId: token.id,
          }
          if (!knownSet.has(`${entry.holder}-${entry.assetId}`))
            missing.push(entry)
        }
      }
    }
    return missing
  }

  async fetchBalances(
    missingData: HeldAsset[],
    blockNumber: bigint
  ): Promise<BalanceRecord[]> {
    const calls = missingData.map((m) =>
      BalanceCall.encode(m.holder, m.assetId)
    )

    const multicallResponses = await this.multicall.multicall(
      calls,
      blockNumber
    )

    return multicallResponses.map((res, i) => ({
      holderAddress: missingData[i].holder,
      assetId: missingData[i].assetId,
      balance: BalanceCall.decodeOr(res, 0n),
      blockNumber,
    }))
  }
}
