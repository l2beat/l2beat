import { Logger } from '@l2beat/shared'
import { assert, ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { setTimeout } from 'timers/promises'

import {
  TotalSupplyRecord,
  TotalSupplyRepository,
} from '../../peripherals/database/TotalSupplyRepository'
import { TotalSupplyStatusRepository } from '../../peripherals/database/TotalSupplyStatusRepository'
import { BlockNumberUpdater } from '../BlockNumberUpdater'
import { Clock } from '../Clock'
import { TaskQueue } from '../queue/TaskQueue'
import { getTotalSupplyConfigHash } from './getTotalSupplyConfigHash'
import { TotalSupplyProvider, TotalSupplyQuery } from './TotalSupplyProvider'
import { TotalSupplyTokensConfig } from './TotalSupplyTokensConfig'

export class TotalSupplyUpdater {
  private readonly configHash: Hash256
  private readonly knownSet = new Set<number>()
  private readonly taskQueue: TaskQueue<UnixTime>

  constructor(
    private readonly totalSupplyProvider: TotalSupplyProvider,
    private readonly blockNumberUpdater: BlockNumberUpdater,
    private readonly totalSupplyRepository: TotalSupplyRepository,
    private readonly totalSupplyStatusRepository: TotalSupplyStatusRepository,
    private readonly clock: Clock,
    private readonly tokens: TotalSupplyTokensConfig[],
    private readonly logger: Logger,
    private readonly chainId: ChainId,
  ) {
    this.logger = this.logger.for(this)
    this.configHash = getTotalSupplyConfigHash(tokens)
    this.taskQueue = new TaskQueue(
      (timestamp) => this.update(timestamp),
      this.logger.for('taskQueue'),
      {
        metricsId: TotalSupplyUpdater.name,
      },
    )

    assert(
      this.totalSupplyProvider.getChainId() === this.chainId,
      'ChainId mismatch between totalSupplyProvider and totalSupplyUpdater provider',
    )
  }

  async getTotalSuppliesWhenReady(
    timestamp: UnixTime,
    refreshIntervalMs = 1000,
  ) {
    while (!this.knownSet.has(timestamp.toNumber())) {
      await setTimeout(refreshIntervalMs)
    }
    return this.totalSupplyRepository.getByTimestamp(this.chainId, timestamp)
  }

  async start() {
    const known = await this.totalSupplyStatusRepository.getByConfigHash(
      this.chainId,
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
    this.logger.debug('Update started', {
      timestamp: timestamp.toNumber(),
      chainId: this.chainId.toString(),
    })
    const known = await this.totalSupplyRepository.getByTimestamp(
      this.chainId,
      timestamp,
    )

    const missing = getMissingData(timestamp, known, this.tokens)

    if (missing.length > 0) {
      const blockNumber = await this.blockNumberUpdater.getBlockNumberWhenReady(
        timestamp,
      )

      assert(blockNumber, 'No timestamp for this block number')

      const totalSupplies = await this.totalSupplyProvider.getTotalSupplies(
        missing,
        timestamp,
        blockNumber,
      )

      await this.totalSupplyRepository.addOrUpdateMany(totalSupplies)
      this.logger.debug('Updated total supplies', {
        timestamp: timestamp.toNumber(),
        chainId: this.chainId.toString(),
      })
    } else {
      this.logger.debug('Skipped updating total supplies', {
        timestamp: timestamp.toNumber(),
        chainId: this.chainId.toString(),
      })
    }
    this.knownSet.add(timestamp.toNumber())
    await this.totalSupplyStatusRepository.add({
      chainId: this.chainId,
      configHash: this.configHash,
      timestamp,
    })
    this.logger.info('Update completed', { timestamp: timestamp.toNumber() })
  }
}

export function getMissingData(
  timestamp: UnixTime,
  known: TotalSupplyRecord[],
  tokens: TotalSupplyTokensConfig[],
): TotalSupplyQuery[] {
  const knownSet = new Set(
    // FIXME: here? how to distinguish properly?
    known.map(({ assetId }) => `${assetId.toString()}`),
  )

  const missing: TotalSupplyQuery[] = []

  for (const token of tokens) {
    if (token.sinceTimestamp.gt(timestamp)) {
      continue
    }

    const entry: TotalSupplyQuery = {
      tokenAddress: token.tokenAddress,
      assetId: token.assetId,
    }

    if (!knownSet.has(`${entry.assetId.toString()}`)) {
      missing.push(entry)
    }
  }

  return missing
}
