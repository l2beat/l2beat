import type { Logger } from '@l2beat/backend-tools'
import type { Database, PrivacyFlowEventRecord } from '@l2beat/database'
import type { BlockProvider, LogsProvider } from '@l2beat/shared'
import { assert, type Log, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { createPrivacyConfigurationId } from '../../../config/features/privacy'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { PrivacyFlowIndexerConfig } from '../types'
import { extractPrivacyFlow } from '../utils/extractPrivacyFlow'

interface PrivacyFlowIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<PrivacyFlowIndexerConfig>,
    'name' | 'logger'
  > {
  chain: string
  blockProvider: BlockProvider
  logsProvider: LogsProvider
  db: Database
}

export class PrivacyFlowIndexer extends ManagedMultiIndexer<PrivacyFlowIndexerConfig> {
  private readonly blockTimestampCache = new Map<number, UnixTime>()

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
    const adjustedFrom =
      UnixTime.toStartOf(from, 'hour') < from
        ? UnixTime.toStartOf(from, 'hour') + UnixTime.HOUR
        : UnixTime.toStartOf(from, 'hour')
    const adjustedTo = Math.min(UnixTime.toEndOf(adjustedFrom, 'day'), to)
    this.logger.info('Fetching privacy flow logs', {
      from: adjustedFrom,
      to: adjustedTo,
      configurations: configurations.length,
    })

    const records = await this.fetchRecordsForGroup(
      configurations,
      adjustedFrom,
      adjustedTo,
    )

    this.logger.info('Fetched privacy flow logs', {
      from: adjustedFrom,
      to: adjustedTo,
      records: records.length,
    })

    return async () => {
      await this.$.db.privacyFlowEvent.upsertMany(records)

      this.logger.info('Saved privacy flow events into DB', {
        from: adjustedFrom,
        to: adjustedTo,
        records: records.length,
      })

      return adjustedTo
    }
  }

  override async removeData(
    configurations: RemovalConfiguration[],
  ): Promise<void> {
    for (const configuration of configurations) {
      const deletedRecords =
        await this.$.db.privacyFlowEvent.deleteByConfigInBlockRange(
          configuration.id,
          configuration.from,
          configuration.to,
        )

      if (deletedRecords > 0) {
        this.logger.info('Deleted privacy flow events', {
          configurationId: configuration.id,
          from: configuration.from,
          to: configuration.to,
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
    if (configurations.length === 0) return []

    const hourFrom =
      UnixTime.toStartOf(from, 'hour') < from
        ? UnixTime.toStartOf(from, 'hour') + UnixTime.HOUR
        : UnixTime.toStartOf(from, 'hour')
    const hourTo = UnixTime.toStartOf(to, 'hour')

    const blockFrom =
      await this.$.db.privacyBlockTimestamp.findBlockNumberByChainAndTimestamp(
        this.$.chain,
        hourFrom,
      )
    const blockTo =
      await this.$.db.privacyBlockTimestamp.findBlockNumberByChainAndTimestamp(
        this.$.chain,
        hourTo,
      )

    assert(
      blockFrom !== undefined,
      `Missing block timestamp mapping for ${this.$.chain}: from=${hourFrom}`,
    )
    assert(
      blockTo !== undefined,
      `Missing block timestamp mapping for ${this.$.chain}: to=${hourTo}`,
    )

    const { addresses, events } = buildLogFilter(configurations)
    const logs = await this.$.logsProvider.getLogs(
      blockFrom,
      blockTo,
      addresses,
      events,
    )

    const blockNumbers = new Set<number>(logs.map((l) => l.blockNumber))
    const blockTimestampLookup = await this.buildBlockTimestampLookup(
      Array.from(blockNumbers),
    )

    const configMap = buildConfigMap(configurations)
    const rawRecords = this.extractRawRecords(
      logs,
      configMap,
      blockTimestampLookup,
    )

    if (rawRecords.length === 0) return []

    const priceLookup = await this.buildPriceLookup(rawRecords)
    return this.buildRecords(rawRecords, priceLookup)
  }

  private extractRawRecords(
    logs: Log[],
    configMap: Map<string, Configuration<PrivacyFlowIndexerConfig>[]>,
    blockTimestampLookup: Map<number, UnixTime>,
  ): RawRecord[] {
    const rawRecords: RawRecord[] = []

    for (const log of logs) {
      const key = `${log.address.toLowerCase()}:${log.topics[0]?.toLowerCase() ?? ''}`
      const matching = configMap.get(key) ?? []

      for (const configuration of matching) {
        let result: { count: number; amount: bigint } | undefined
        try {
          result = extractPrivacyFlow(configuration.properties, log)
        } catch (error) {
          this.logger.error('Failed to extract privacy flow from log', {
            configurationId: configuration.id,
            blockNumber: log.blockNumber,
            txHash: log.transactionHash,
            logIndex: log.logIndex,
            error,
          })
          continue
        }

        if (!result || (result.count === 0 && result.amount === 0n)) {
          continue
        }

        const timestamp = blockTimestampLookup.get(log.blockNumber)
        assert(
          timestamp,
          `Missing block timestamp for block ${log.blockNumber}`,
        )

        rawRecords.push({
          configuration,
          log,
          count: result.count,
          amount: result.amount,
          timestamp,
        })
      }
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
      const valueUsd = (Number(raw.amount) * price) / 10 ** config.decimals

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
    const priceIds = new Set(
      rawRecords.map((r) => r.configuration.properties.priceId),
    )
    const timestamps = rawRecords.map((r) => r.timestamp)
    const minTimestamp = UnixTime.toStartOf(Math.min(...timestamps), 'hour')
    const maxTimestamp = UnixTime.toStartOf(Math.max(...timestamps), 'hour')

    const lookup = new Map<string, number>()

    const priceResults = await Promise.all(
      Array.from(priceIds).map((priceId) =>
        this.$.db.privacyPrice
          .getPricesByPriceIdInRange(priceId, minTimestamp, maxTimestamp)
          .then((prices) => ({ priceId, prices })),
      ),
    )

    for (const { priceId, prices } of priceResults) {
      for (const price of prices) {
        lookup.set(`${priceId}:${price.timestamp}`, price.priceUsd)
      }
    }

    return lookup
  }

  private async buildBlockTimestampLookup(
    blockNumbers: number[],
  ): Promise<Map<number, UnixTime>> {
    const lookup = new Map<number, UnixTime>()
    const missing: number[] = []

    for (const blockNumber of blockNumbers) {
      const cached = this.blockTimestampCache.get(blockNumber)
      if (cached !== undefined) {
        lookup.set(blockNumber, cached)
      } else {
        missing.push(blockNumber)
      }
    }

    if (missing.length > 0) {
      const timestamps = await this.$.blockProvider.getBlockTimestamps(missing)
      for (const [blockNumber, timestamp] of timestamps) {
        this.blockTimestampCache.set(blockNumber, timestamp)
        lookup.set(blockNumber, timestamp)
      }
    }

    return lookup
  }

  static idToConfigurationId(config: PrivacyFlowIndexerConfig): string {
    return createPrivacyConfigurationId([
      'privacy-flow',
      config.projectId,
      config.bucketId,
      config.direction,
      config.chain,
      config.address.toString(),
      config.event,
      config.extractor,
      stringifyParams(config.params),
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

function buildLogFilter(
  configurations: Configuration<PrivacyFlowIndexerConfig>[],
): { addresses: string[]; events: string[] } {
  const addresses = Array.from(
    new Set(configurations.map((c) => c.properties.address.toString())),
  )

  const events = Array.from(
    new Set(configurations.map((c) => c.properties.event)),
  )

  return { addresses, events }
}

function buildConfigMap(
  configurations: Configuration<PrivacyFlowIndexerConfig>[],
): Map<string, Configuration<PrivacyFlowIndexerConfig>[]> {
  const configMap = new Map<string, Configuration<PrivacyFlowIndexerConfig>[]>()

  for (const configuration of configurations) {
    const addr = configuration.properties.address.toString().toLowerCase()
    const event = configuration.properties.event.toLowerCase()
    const key = `${addr}:${event}`
    const existing = configMap.get(key) ?? []
    existing.push(configuration)
    configMap.set(key, existing)
  }

  return configMap
}

function stringifyParams(params: Record<string, unknown>): string {
  const keys = Object.keys(params).sort()
  return keys.map((k) => `${k}=${String(params[k])}`).join(',')
}
