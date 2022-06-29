import {
  AssetId,
  EthereumAddress,
  Hash256,
  Logger,
  UnixTime,
} from '@l2beat/common'

import { ProjectInfo } from '../model/ProjectInfo'
import {
  BalanceRecord,
  BalanceRepository,
} from '../peripherals/database/BalanceRepository'
import { BalanceStatusRepository } from '../peripherals/database/BalanceStatusRepository'
import { BlockNumberRepository } from '../peripherals/database/BlockNumberRepository'
import { BalanceCall } from '../peripherals/ethereum/calls/BalanceCall'
import { MulticallClient } from '../peripherals/ethereum/MulticallClient'
import { getConfigHash } from './getConfigHash'

interface HeldAsset {
  holder: EthereumAddress
  assetId: AssetId
}

export class BalanceUpdater {
  private configHash: Hash256
  constructor(
    private multicall: MulticallClient,
    private balanceRepository: BalanceRepository,
    private blockNumberRepository: BlockNumberRepository,
    private balanceStatusRepository: BalanceStatusRepository,
    private projects: ProjectInfo[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
    this.configHash = getConfigHash(projects)
  }

  async update(timestamps: UnixTime[]) {
    const known = await this.balanceStatusRepository.getByConfigHash(
      this.configHash,
    )
    const knownSet = new Set(known.map((x) => x.toNumber()))

    const unprocessed = timestamps.filter((x) => !knownSet.has(x.toNumber()))
    this.logger.info('Update started', { timestamps: unprocessed.length })
    for (const timestamp of unprocessed) {
      const missing = await this.getMissingData(timestamp)

      if (missing.length > 0) {
        const balances = await this.fetchBalances(missing, timestamp)
        await this.balanceRepository.addOrUpdateMany(balances)
        this.logger.info('Updated balances', {
          timestamp: timestamp.toNumber(),
        })
      } else {
        this.logger.info('Skipped updating balances', {
          timestamp: timestamp.toNumber(),
        })
      }
      await this.balanceStatusRepository.add({
        configHash: this.configHash,
        timestamp,
      })
    }
    this.logger.info('Update completed', { timestamps: timestamps.length })
  }

  async getMissingData(timestamp: UnixTime): Promise<HeldAsset[]> {
    const known = await this.balanceRepository.getByTimestamp(timestamp)
    const knownSet = new Set(
      known.map((x) => `${x.holderAddress.toString()}-${x.assetId.toString()}`),
    )

    const missing: HeldAsset[] = []
    for (const project of this.projects) {
      for (const bridge of project.bridges) {
        if (bridge.sinceTimestamp.gt(timestamp)) {
          continue
        }
        for (const token of bridge.tokens) {
          if (token.sinceTimestamp.gt(timestamp)) {
            continue
          }
          const entry = {
            holder: bridge.address,
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
    timestamp: UnixTime,
  ): Promise<BalanceRecord[]> {
    const blockNumberRecord = await this.blockNumberRepository.findByTimestamp(
      timestamp,
    )
    if (!blockNumberRecord) {
      throw new Error('Programmer error: No timestamp for this block number')
    }

    const calls = missingData.map((m) =>
      BalanceCall.encode(m.holder, m.assetId),
    )

    const multicallResponses = await this.multicall.multicall(
      calls,
      blockNumberRecord.blockNumber,
    )

    return multicallResponses.map((res, i) => ({
      holderAddress: missingData[i].holder,
      assetId: missingData[i].assetId,
      balance: BalanceCall.decodeOr(res, 0n),
      timestamp,
    }))
  }
}
