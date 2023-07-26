import { Logger } from '@l2beat/shared'
import { assert, ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { setTimeout } from 'timers/promises'

import {
  BalanceRecord,
  BalanceRepository,
} from '../../peripherals/database/BalanceRepository'
import { BalanceStatusRepository } from '../../peripherals/database/BalanceStatusRepository'
import { BlockNumberUpdater } from '../BlockNumberUpdater'
import { Clock } from '../Clock'
import { TaskQueue } from '../queue/TaskQueue'
import { BalanceProject } from './BalanceProject'
import { BalanceProvider, BalanceQuery } from './BalanceProvider'
import { getBalanceConfigHash } from './getBalanceConfigHash'

export class BalanceUpdater {
  private readonly configHash: Hash256
  private readonly knownSet = new Set<number>()
  private readonly taskQueue: TaskQueue<UnixTime>

  constructor(
    private readonly balanceProvider: BalanceProvider,
    private readonly blockNumberUpdater: BlockNumberUpdater,
    private readonly balanceRepository: BalanceRepository,
    private readonly balanceStatusRepository: BalanceStatusRepository,
    private readonly clock: Clock,
    private readonly projects: BalanceProject[],
    private readonly logger: Logger,
    private readonly chainId: ChainId,
    private readonly minTimestamp: UnixTime,
  ) {
    this.logger = this.logger.for(this)
    this.configHash = getBalanceConfigHash(projects)
    this.taskQueue = new TaskQueue(
      (timestamp) => this.update(timestamp),
      this.logger.for('taskQueue'),
      {
        metricsId: BalanceUpdater.name,
      },
    )

    assert(
      this.balanceProvider.getChainId() === this.chainId,
      'ChainId mismatch',
    )
  }

  getMinTimestamp() {
    return this.minTimestamp
  }

  async getBalancesWhenReady(timestamp: UnixTime, refreshIntervalMs = 1000) {
    assert(
      timestamp.gte(this.minTimestamp),
      'Programmer error: requested timestamp does not exist',
    )

    while (!this.knownSet.has(timestamp.toNumber())) {
      this.logger.debug('Something is waiting for getBalancesWhenReady', {
        timestamp: timestamp.toString(),
      })
      await setTimeout(refreshIntervalMs)
    }
    return this.balanceRepository.getByTimestamp(this.chainId, timestamp)
  }

  async start() {
    const known = await this.balanceStatusRepository.getByConfigHash(
      this.chainId,
      this.configHash,
    )
    for (const timestamp of known) {
      this.knownSet.add(timestamp.toNumber())
    }

    this.logger.info('Started', { chainId: this.chainId.toString() })
    return this.clock.onEveryHour((timestamp) => {
      if (!this.knownSet.has(timestamp.toNumber())) {
        if (timestamp.gte(this.minTimestamp)) {
          // we add to front to sync from newest to oldest
          this.taskQueue.addToFront(timestamp)
        }
      }
    })
  }

  // TODO(radomski): Remove all op-optimism/arb-arbitrum tokens from balances.
  // Don't fetch balances for those two tokens
  async update(timestamp: UnixTime) {
    assert(
      timestamp.gte(this.minTimestamp),
      'Timestamp cannot be smaller than minTimestamp',
    )

    this.logger.debug('Update started', {
      timestamp: timestamp.toNumber(),
      chainId: this.chainId.toString(),
    })
    const known = await this.balanceRepository.getByTimestamp(
      this.chainId,
      timestamp,
    )
    const missing = getMissingData(timestamp, known, this.projects)

    if (missing.length > 0) {
      const blockNumber = await this.blockNumberUpdater.getBlockNumberWhenReady(
        timestamp,
      )

      assert(blockNumber, 'No timestamp for this block number')

      const balances = await this.balanceProvider.fetchBalances(
        missing,
        timestamp,
        blockNumber,
      )

      await this.balanceRepository.addOrUpdateMany(balances)
      this.logger.debug('Updated balances', {
        timestamp: timestamp.toNumber(),
        chainId: this.chainId.toString(),
      })
    } else {
      this.logger.debug('Skipped updating balances', {
        timestamp: timestamp.toNumber(),
        chainId: this.chainId.toString(),
      })
    }
    this.knownSet.add(timestamp.toNumber())
    await this.balanceStatusRepository.add({
      chainId: this.chainId,
      configHash: this.configHash,
      timestamp,
    })
    this.logger.info('Update completed', {
      timestamp: timestamp.toNumber(),
      chainId: this.chainId.toString(),
    })
  }
}

export function getMissingData(
  timestamp: UnixTime,
  known: BalanceRecord[],
  projects: BalanceProject[],
): BalanceQuery[] {
  const knownSet = new Set(
    known.map((x) => `${x.holderAddress.toString()}-${x.assetId.toString()}`),
  )

  const missing: BalanceQuery[] = []
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
