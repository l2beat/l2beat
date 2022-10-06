import { Logger, TaskQueue } from '@l2beat/common'
import { AssetId, EthereumAddress, Hash256, UnixTime } from '@l2beat/types'
import { setTimeout } from 'timers/promises'

import {
  BalanceRecord,
  BalanceRepository,
} from '../../peripherals/database/BalanceRepository'
import { BalanceStatusRepository } from '../../peripherals/database/BalanceStatusRepository'
import { BalanceCall } from '../../peripherals/ethereum/calls/BalanceCall'
import { MulticallClient } from '../../peripherals/ethereum/MulticallClient'
import { assert } from '../../tools/assert'
import { BlockNumberUpdater } from '../BlockNumberUpdater'
import { Clock } from '../Clock'
import { BalanceProject } from './BalanceProject'
import { getBalanceConfigHash } from './getBalanceConfigHash'

interface HeldAsset {
  holder: EthereumAddress
  assetId: AssetId
}

export class BalanceUpdater {
  private readonly configHash: Hash256
  private readonly knownSet = new Set<number>()
  private readonly taskQueue: TaskQueue<UnixTime>

  constructor(
    private readonly multicall: MulticallClient,
    private readonly blockNumberUpdater: BlockNumberUpdater,
    private readonly balanceRepository: BalanceRepository,
    private readonly balanceStatusRepository: BalanceStatusRepository,
    private readonly clock: Clock,
    private readonly projects: BalanceProject[],
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
    this.configHash = getBalanceConfigHash(projects)
    this.taskQueue = new TaskQueue(
      (timestamp) => this.update(timestamp),
      this.logger.for('taskQueue'),
    )
  }

  async getBalancesWhenReady(timestamp: UnixTime, refreshIntervalMs = 1000) {
    while (!this.knownSet.has(timestamp.toNumber())) {
      await setTimeout(refreshIntervalMs)
    }
    return this.balanceRepository.getByTimestamp(timestamp)
  }

  async start() {
    const known = await this.balanceStatusRepository.getByConfigHash(
      this.configHash,
    )
    for (const timestamp of known) {
      this.knownSet.add(timestamp.toNumber())
    }

    this.logger.info('Started')
    return this.clock.onEveryHour((timestamp) => {
      if (!this.knownSet.has(timestamp.toNumber())) {
        // we add to front to sync from newest to oldest
        this.taskQueue.addToFront(timestamp)
      }
    })
  }

  async update(timestamp: UnixTime) {
    this.logger.debug('Update started', { timestamp: timestamp.toNumber() })
    const known = await this.balanceRepository.getByTimestamp(timestamp)
    const missing = getMissingData(timestamp, known, this.projects)

    if (missing.length > 0) {
      const balances = await this.fetchBalances(missing, timestamp)
      await this.balanceRepository.addOrUpdateMany(balances)
      this.logger.debug('Updated balances', {
        timestamp: timestamp.toNumber(),
      })
    } else {
      this.logger.debug('Skipped updating balances', {
        timestamp: timestamp.toNumber(),
      })
    }
    this.knownSet.add(timestamp.toNumber())
    await this.balanceStatusRepository.add({
      configHash: this.configHash,
      timestamp,
    })
    this.logger.info('Update completed', { timestamp: timestamp.toNumber() })
  }

  async fetchBalances(
    missingData: HeldAsset[],
    timestamp: UnixTime,
  ): Promise<BalanceRecord[]> {
    const blockNumber = await this.blockNumberUpdater.getBlockNumberWhenReady(
      timestamp,
    )
    assert(blockNumber, 'No timestamp for this block number')

    const calls = missingData.map((m) =>
      BalanceCall.encode(m.holder, m.assetId),
    )

    const multicallResponses = await this.multicall.multicall(
      calls,
      blockNumber,
    )

    return multicallResponses.map((res, i) => ({
      holderAddress: missingData[i].holder,
      assetId: missingData[i].assetId,
      balance: BalanceCall.decodeOr(res, 0n),
      timestamp,
    }))
  }
}

export function getMissingData(
  timestamp: UnixTime,
  known: BalanceRecord[],
  projects: BalanceProject[],
): HeldAsset[] {
  const knownSet = new Set(
    known.map((x) => `${x.holderAddress.toString()}-${x.assetId.toString()}`),
  )

  const missing: HeldAsset[] = []
  for (const project of projects) {
    for (const escrow of project.escrows) {
      if (escrow.sinceTimestamp.gt(timestamp)) {
        continue
      }
      for (const token of escrow.tokens) {
        if (token.sinceTimestamp.gt(timestamp)) {
          continue
        }
        const entry = {
          holder: escrow.address,
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
