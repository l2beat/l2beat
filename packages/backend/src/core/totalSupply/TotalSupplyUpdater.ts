import { Logger } from '@l2beat/shared'
import {
  assert,
  AssetId,
  ChainId,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
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
    private readonly minTimestamp: UnixTime,
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
      'ChainId mismatch between totalSupplyProvider and totalSupplyUpdater',
    )
  }

  getMinTimestamp() {
    return this.minTimestamp
  }

  async getTotalSuppliesWhenReady(
    timestamp: UnixTime,
    refreshIntervalMs = 1000,
  ) {
    assert(
      timestamp.gte(this.minTimestamp),
      'Programmer error: requested timestamp does not exist',
    )

    while (!this.knownSet.has(timestamp.toNumber())) {
      this.logger.debug('Something is waiting for getTotalSuppliesWhenReady', {
        timestamp: timestamp.toString(),
      })
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
        if (timestamp.gte(this.minTimestamp)) {
          // we add to front to sync from newest to oldest
          this.taskQueue.addToFront(timestamp)
        }
      }
    })
  }

  async update(timestamp: UnixTime) {
    assert(
      timestamp.gte(this.minTimestamp),
      'Timestamp cannot be smaller than minTimestamp',
    )

    this.logger.debug('Update started', {
      timestamp: timestamp.toNumber(),
      chainId: this.chainId.toString(),
    })
    const known = await this.totalSupplyRepository.getByTimestamp(
      this.chainId,
      timestamp,
    )

    const missingTotalSupplies = getMissingTotalSupplies(
      timestamp,
      known,
      this.tokens,
    )

    if (missingTotalSupplies.length > 0) {
      const blockNumber = await this.blockNumberUpdater.getBlockNumberWhenReady(
        timestamp,
      )

      assert(blockNumber, 'No timestamp for this block number')

      const totalSupplies = await this.totalSupplyProvider.getTotalSupplies(
        missingTotalSupplies,
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

export function getMissingTotalSupplies(
  timestamp: UnixTime,
  known: TotalSupplyRecord[],
  tokens: TotalSupplyTokensConfig[],
): TotalSupplyQuery[] {
  function makeKey(assetId: AssetId) {
    return `${assetId.toString()}`
  }

  const knownTotalSupplies = new Set(
    known.map(({ assetId }) => makeKey(assetId)),
  )

  const tokensToQuery: TotalSupplyQuery[] = []

  for (const token of tokens) {
    if (token.sinceTimestamp.gt(timestamp)) {
      continue
    }

    const queryCandidate: TotalSupplyQuery = {
      tokenAddress: EthereumAddress(token.tokenAddress),
      assetId: token.assetId,
    }

    if (!knownTotalSupplies.has(makeKey(queryCandidate.assetId))) {
      tokensToQuery.push(queryCandidate)
    }
  }

  return tokensToQuery
}
