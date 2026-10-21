import type { Logger } from '@l2beat/backend-tools'
import type { Database, PrivacyFlowEventRecord } from '@l2beat/database'
import {
  type BlockProvider,
  createPrivacyConfigurationId,
  type IRpcClient,
  type LogsProvider,
  stringifyPrivacyConfigurationParams,
} from '@l2beat/shared'
import { assert, type Log, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import chunk from 'lodash/chunk'
import { withCoreFeatureRpcMetricsContext } from '../../../tools/coreFeatureRpcMetrics'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { PrivacyFlowIndexerConfig } from '../types'
import { extractPrivacyFlowWithContext } from '../utils/extractPrivacyFlow'
import {
  fetchPrivacyLogMatches,
  type PrivacyLogMatch,
} from '../utils/privacyLogIndexerUtils'
import { ReceiptLogCache } from '../utils/ReceiptLogCache'

const EXTRACTION_BATCH_SIZE = 20

interface PrivacyFlowIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<PrivacyFlowIndexerConfig>,
    'name' | 'logger'
  > {
  chain: string
  blockProvider: BlockProvider
  logsProvider: LogsProvider
  rpcClient: IRpcClient
  db: Database
}

export class PrivacyFlowIndexer extends ManagedMultiIndexer<PrivacyFlowIndexerConfig> {
  constructor(
    private readonly $: PrivacyFlowIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.PRIVACY_FLOW,
        tags: {
          tag: $.chain,
          chain: $.chain,
        },
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<PrivacyFlowIndexerConfig>[],
  ) {
    const adjustedTo = Math.min(UnixTime.toNext(from, 'day'), to)
    this.logger.info('Fetching privacy flow logs', {
      from,
      to: adjustedTo,
      configurations: configurations.length,
    })

    const records = await withCoreFeatureRpcMetricsContext(
      'privacy.flow',
      { chain: this.$.chain },
      () => this.fetchRecordsForGroup(configurations, from, adjustedTo),
    )

    this.logger.info('Fetched privacy flow logs', {
      from,
      to: adjustedTo,
      records: records.length,
    })

    return async () => {
      await this.$.db.privacyFlowEvent.upsertMany(records)

      this.logger.info('Saved privacy flow events into DB', {
        from,
        to: adjustedTo,
        records: records.length,
      })

      return adjustedTo
    }
  }

  override async wipeData(
    configurations: WipeRemovalConfiguration[],
  ): Promise<void> {
    const deletedRecords = await this.$.db.privacyFlowEvent.deleteByConfigIds(
      configurations.map((c) => c.id),
    )

    if (deletedRecords > 0) {
      this.logger.info('Wiped privacy flow events for configurations', {
        configurations: configurations.length,
        deletedRecords,
      })
    }
  }

  override async trimData(
    configurations: TrimRemovalConfiguration[],
  ): Promise<void> {
    for (const configuration of configurations) {
      const [from, to] = configuration.range
      const deletedRecords =
        await this.$.db.privacyFlowEvent.deleteByConfigInTimeRange(
          configuration.id,
          from,
          to,
        )

      if (deletedRecords > 0) {
        this.logger.info('Trimmed privacy flow events', {
          configurationId: configuration.id,
          from,
          to,
          deletedRecords,
        })
      }
    }
  }

  private async fetchRecordsForGroup(
    configurations: Configuration<PrivacyFlowIndexerConfig>[],
    from: number,
    to: number,
  ): Promise<PrivacyFlowEventRecord[]> {
    const matches = await fetchPrivacyLogMatches(configurations, {
      chain: this.$.chain,
      from,
      to,
      privacyBlockTimestamp: this.$.db.privacyBlockTimestamp,
      logsProvider: this.$.logsProvider,
      blockProvider: this.$.blockProvider,
      logger: this.logger,
    })
    const rawRecords = await this.extractRawRecords(matches)

    if (rawRecords.length === 0) return []

    const priceLookup = await this.buildPriceLookup(rawRecords)
    return this.buildRecords(rawRecords, priceLookup)
  }

  private async extractRawRecords(
    matches: PrivacyLogMatch<PrivacyFlowIndexerConfig>[],
  ): Promise<RawRecord[]> {
    const context = {
      rpc: this.$.rpcClient,
      receipts: new ReceiptLogCache(this.$.rpcClient),
    }
    const rawRecords: RawRecord[] = []

    for (const batch of chunk(matches, EXTRACTION_BATCH_SIZE)) {
      const extracted = await Promise.all(
        batch.map(async ({ log, timestamp, configuration }) => {
          const result = await extractPrivacyFlowWithContext(
            configuration.properties,
            log,
            context,
          )
          if (!result || (result.count === 0 && result.amount === 0n)) {
            return undefined
          }
          return {
            configuration,
            log,
            count: result.count,
            amount: result.amount,
            timestamp,
          }
        }),
      )
      rawRecords.push(...extracted.filter((record) => record !== undefined))
    }

    return rawRecords
  }

  private buildRecords(
    rawRecords: RawRecord[],
    priceLookup: Map<string, number>,
  ): PrivacyFlowEventRecord[] {
    return rawRecords.map((raw) => {
      const config = raw.configuration.properties
      const hourTimestamp = UnixTime.toStartOf(raw.timestamp, 'hour')
      const price = priceLookup.get(`${config.priceId}:${hourTimestamp}`)
      assert(
        price !== undefined,
        `Missing price for ${config.priceId} at ${hourTimestamp}`,
      )
      const valueUsd = bigintToFloat(raw.amount, config.decimals) * price

      return {
        configurationId: raw.configuration.id,
        projectId: config.projectId,
        bucketId: config.bucketId,
        chain: config.chain,
        direction: config.direction,
        timestamp: raw.timestamp,
        blockNumber: raw.log.blockNumber,
        txHash: raw.log.transactionHash,
        logIndex: raw.log.logIndex,
        count: raw.count,
        amount: raw.amount,
        priceId: config.priceId,
        valueUsd,
      }
    })
  }

  private async buildPriceLookup(
    rawRecords: {
      configuration: Configuration<PrivacyFlowIndexerConfig>
      timestamp: UnixTime
    }[],
  ): Promise<Map<string, number>> {
    const priceIds = Array.from(
      new Set(rawRecords.map((r) => r.configuration.properties.priceId)),
    )
    let minRaw = rawRecords[0].timestamp
    let maxRaw = rawRecords[0].timestamp
    for (const r of rawRecords) {
      if (r.timestamp < minRaw) minRaw = r.timestamp
      if (r.timestamp > maxRaw) maxRaw = r.timestamp
    }
    const minTimestamp = UnixTime.toStartOf(minRaw, 'hour')
    const maxTimestamp = UnixTime.toStartOf(maxRaw, 'hour')

    const prices = await this.$.db.privacyPrice.getPricesByPriceIdsInRange(
      priceIds,
      minTimestamp,
      maxTimestamp,
    )

    const lookup = new Map<string, number>()
    for (const price of prices) {
      lookup.set(`${price.priceId}:${price.timestamp}`, price.priceUsd)
    }

    return lookup
  }

  static idToConfigurationId(
    config: Omit<PrivacyFlowIndexerConfig, 'id'>,
  ): string {
    return createPrivacyConfigurationId([
      'privacy-flow',
      config.projectId,
      config.bucketId,
      config.direction,
      config.chain,
      config.address.toString(),
      config.event,
      config.extractor,
      stringifyPrivacyConfigurationParams(config.params),
    ])
  }
}

interface RawRecord {
  configuration: Configuration<PrivacyFlowIndexerConfig>
  log: Log
  count: number
  amount: bigint
  timestamp: UnixTime
}

// Splits the bigint into whole/fractional parts before casting to Number to
// avoid precision loss for large raw amounts (e.g. 18-decimal tokens).
function bigintToFloat(amount: bigint, decimals: number): number {
  const divisor = 10n ** BigInt(decimals)
  const whole = amount / divisor
  const frac = amount % divisor
  return Number(whole) + Number(frac) / Number(divisor)
}
