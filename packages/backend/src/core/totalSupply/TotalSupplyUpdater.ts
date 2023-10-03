import { Logger } from '@l2beat/backend-tools'
import {
  assert,
  AssetId,
  ChainId,
  Hash256,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { setTimeout } from 'timers/promises'

import { UpdaterStatus } from '../../api/controllers/status/view/TvlStatusPage'
import { getChainMinTimestamp } from '../../config/chains'
import {
  TotalSupplyRecord,
  TotalSupplyRepository,
} from '../../peripherals/database/TotalSupplyRepository'
import { TotalSupplyStatusRepository } from '../../peripherals/database/TotalSupplyStatusRepository'
import { BlockNumberUpdater } from '../BlockNumberUpdater'
import { Clock } from '../Clock'
import { TaskQueue } from '../queue/TaskQueue'
import { getStatus } from '../reports/getStatus'
import { getTotalSupplyConfigHash } from './getTotalSupplyConfigHash'
import { TotalSupplyProvider, TotalSupplyQuery } from './TotalSupplyProvider'

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
    private readonly tokens: Token[],
    private readonly logger: Logger,
    private readonly chainId: ChainId,
    private readonly minTimestamp: UnixTime,
  ) {
    assert(
      tokens.every(
        (token) =>
          token.chainId === this.getChainId() &&
          token.formula === this.getAssetType(),
      ),
      'Programmer error: tokens must be of type EBV and on the same chain as the totalSupplyUpdater',
    )
    this.logger = this.logger.for(
      `${this.constructor.name}.${ChainId.getName(chainId)}`,
    )
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

  getChainId() {
    return this.chainId
  }

  getAssetType() {
    return 'totalSupply'
  }

  getStatus(): UpdaterStatus {
    return getStatus(
      this.constructor.name,
      this.clock.getFirstHour(),
      this.clock.getLastHour(),
      this.knownSet,
      getChainMinTimestamp(this.chainId),
    )
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
  tokens: Token[],
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

    assert(
      token.address !== undefined,
      'Token address should not be undefined there',
    )

    const queryCandidate: TotalSupplyQuery = {
      tokenAddress: token.address,
      assetId: token.id,
    }

    if (!knownTotalSupplies.has(makeKey(queryCandidate.assetId))) {
      tokensToQuery.push(queryCandidate)
    }
  }

  return tokensToQuery
}
