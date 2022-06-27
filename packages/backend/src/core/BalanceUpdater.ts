import { AssetId, EthereumAddress, Logger } from '@l2beat/common'

import { ProjectInfo } from '../model/ProjectInfo'
import {
  BalanceRecord,
  BalanceRepository,
} from '../peripherals/database/BalanceRepository'
import { BlockNumberRepository } from '../peripherals/database/BlockNumberRepository'
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
    private blockNumberRepository: BlockNumberRepository,
    private projects: ProjectInfo[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async update(blocks: bigint[]) {
    const unprocessed = blocks.filter((x) => !this.processedBlocks.has(x))
    this.logger.info('Update started', { blocks: unprocessed.length })
    for (const blockNumber of unprocessed) {
      const missing = await this.getMissingDataByBlock(blockNumber)

      if (missing.length > 0) {
        const balances = await this.fetchBalances(missing, blockNumber)
        await this.balanceRepository.addOrUpdateMany(balances)
        this.logger.info('Updated balances', {
          blockNumber: Number(blockNumber),
        })
      } else {
        this.logger.info('Skipped updating balances', {
          blockNumber: Number(blockNumber),
        })
      }

      this.processedBlocks.add(blockNumber)
    }
    this.logger.info('Update completed', { blocks: unprocessed.length })
  }

  async getMissingDataByBlock(blockNumber: bigint): Promise<HeldAsset[]> {
    const known: BalanceRecord[] = await this.balanceRepository.getByBlock(
      blockNumber,
    )
    const knownSet = new Set(
      known.map((x) => `${x.holderAddress.toString()}-${x.assetId.toString()}`),
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
          if (
            !knownSet.has(
              `${entry.holder.toString()}-${entry.assetId.toString()}`,
            )
          )
            missing.push(entry)
        }
      }
    }
    return missing
  }

  async fetchBalances(
    missingData: HeldAsset[],
    blockNumber: bigint,
  ): Promise<BalanceRecord[]> {
    const calls = missingData.map((m) =>
      BalanceCall.encode(m.holder, m.assetId),
    )

    const multicallResponses = await this.multicall.multicall(
      calls,
      blockNumber,
    )

    const blockNumberRecord =
      await this.blockNumberRepository.findByBlockNumber(blockNumber)
    if (!blockNumberRecord) {
      throw new Error(
        'Programmer error: can not find timestamp for this block number',
      )
    }

    return multicallResponses.map((res, i) => ({
      holderAddress: missingData[i].holder,
      assetId: missingData[i].assetId,
      balance: BalanceCall.decodeOr(res, 0n),
      timestamp: blockNumberRecord.timestamp,
    }))
  }
}
