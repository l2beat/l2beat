import { Logger } from '@l2beat/shared'
import {
  assert,
  AssetId,
  AssetType,
  ChainId,
  Hash256,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { setTimeout } from 'timers/promises'

import {
  CirculatingSupplyRecord,
  CirculatingSupplyRepository,
} from '../../peripherals/database/CirculatingSupplyRepository'
import { CirculatingSupplyStatusRepository } from '../../peripherals/database/CirculatingSupplyStatusRepository'
import { Clock } from '../Clock'
import { TaskQueue } from '../queue/TaskQueue'
import {
  CirculatingSupplyProvider,
  CirculatingSupplyQuery,
} from './CirculatingSupplyProvider'
import { getCirculatingSupplyConfigHash } from './getTotalSupplyConfigHash'

export class CirculatingSupplyUpdater {
  private readonly configHash: Hash256
  private readonly knownSet = new Set<number>()
  private readonly taskQueue: TaskQueue<UnixTime>

  constructor(
    private readonly circulatingSupplyProvider: CirculatingSupplyProvider,
    private readonly circulatingSupplyRepository: CirculatingSupplyRepository,
    private readonly circulatingSupplyStatusRepository: CirculatingSupplyStatusRepository,
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
          token.formula === 'circulatingSupply',
      ),
      'Programmer error: tokens must be of circulatingSupply formula and on the same chain as the circulatingSupplyUpdater',
    )
    this.logger = this.logger.for(this)
    this.configHash = getCirculatingSupplyConfigHash(tokens)
    this.taskQueue = new TaskQueue(
      (timestamp) => this.update(timestamp),
      this.logger.for('taskQueue'),
      {
        metricsId: CirculatingSupplyUpdater.name,
      },
    )

    assert(
      this.circulatingSupplyProvider.getChainId() === this.chainId,
      'ChainId mismatch between circulatingSupplyProvider and circulatingSupplyUpdater',
    )
  }

  getMinTimestamp() {
    return this.minTimestamp
  }

  getChainId() {
    return this.chainId
  }

  getAssetType(): AssetType {
    return 'EBV'
  }

  async getCirculatingSuppliesWhenReady(
    timestamp: UnixTime,
    refreshIntervalMs = 1000,
  ) {
    assert(
      timestamp.gte(this.minTimestamp),
      'Programmer error: requested timestamp does not exist',
    )

    while (!this.knownSet.has(timestamp.toNumber())) {
      this.logger.debug(
        'Something is waiting for getCirculatingSuppliesWhenReady',
        {
          timestamp: timestamp.toString(),
        },
      )
      await setTimeout(refreshIntervalMs)
    }
    return this.circulatingSupplyRepository.getByTimestamp(
      this.chainId,
      timestamp,
    )
  }

  async start() {
    const known = await this.circulatingSupplyStatusRepository.getByConfigHash(
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
    const known = await this.circulatingSupplyRepository.getByTimestamp(
      this.chainId,
      timestamp,
    )

    const missingCirculatingSupplies = getMissingCirculatingSupplies(
      timestamp,
      known,
      this.tokens,
    )

    if (missingCirculatingSupplies.length > 0) {
      const circulatingSupplies =
        await this.circulatingSupplyProvider.getCirculatingSupplies(
          missingCirculatingSupplies,
          timestamp,
        )

      await this.circulatingSupplyRepository.addOrUpdateMany(
        circulatingSupplies,
      )
      this.logger.debug('Updated circulating supplies', {
        timestamp: timestamp.toNumber(),
        chainId: this.chainId.toString(),
      })
    } else {
      this.logger.debug('Skipped updating circulating supplies', {
        timestamp: timestamp.toNumber(),
        chainId: this.chainId.toString(),
      })
    }
    this.knownSet.add(timestamp.toNumber())
    await this.circulatingSupplyStatusRepository.add({
      chainId: this.chainId,
      configHash: this.configHash,
      timestamp,
    })
    this.logger.info('Update completed', { timestamp: timestamp.toNumber() })
  }
}

export function getMissingCirculatingSupplies(
  timestamp: UnixTime,
  known: CirculatingSupplyRecord[],
  tokens: Token[],
): CirculatingSupplyQuery[] {
  function makeKey(assetId: AssetId) {
    return `${assetId.toString()}`
  }

  const knownCirculatingSupplies = new Set(
    known.map(({ assetId }) => makeKey(assetId)),
  )

  const tokensToQuery: CirculatingSupplyQuery[] = []

  for (const token of tokens) {
    if (token.sinceTimestamp.gt(timestamp)) {
      continue
    }

    assert(
      token.address !== undefined,
      'Token address should not be undefined there',
    )

    const queryCandidate: CirculatingSupplyQuery = {
      assetId: token.id,
      decimals: token.decimals,
      address: token.address,
      coingeckoId: token.coingeckoId,
    }

    if (!knownCirculatingSupplies.has(makeKey(queryCandidate.assetId))) {
      tokensToQuery.push(queryCandidate)
    }
  }

  return tokensToQuery
}
