import type { Logger } from '@l2beat/backend-tools'
import type { Database, PrivacyFlowEventRecord } from '@l2beat/database'
import type { BlockProvider, LogsProvider } from '@l2beat/shared'
import { assert, type Log, UnixTime, unique } from '@l2beat/shared-pure'
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

    const records = await this.fetchRecordsForGroup(
      configurations,
      from,
      adjustedTo,
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

  override async removeData(
    configurations: RemovalConfiguration[],
  ): Promise<void> {
    for (const configuration of configurations) {
      const deletedRecords =
        await this.$.db.privacyFlowEvent.deleteByConfigInTimeRange(
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

    const adjustedFrom = UnixTime.toStartOf(from, 'hour')
    const adjustedTo = UnixTime.toEndOf(to, 'hour')
    const [blockFrom, blockTo] = await Promise.all([
      this.$.db.privacyBlockTimestamp.findBlockNumberByChainAndTimestamp(
        this.$.chain,
        adjustedFrom,
      ),
      this.$.db.privacyBlockTimestamp.findBlockNumberByChainAndTimestamp(
        this.$.chain,
        adjustedTo,
      ),
    ])

    assert(
      blockFrom !== undefined,
      `Missing block timestamp mapping for ${this.$.chain}: from=${adjustedFrom}`,
    )
    assert(
      blockTo !== undefined,
      `Missing block timestamp mapping for ${this.$.chain}: to=${adjustedTo}`,
    )

    const { addresses, events } = buildLogFilter(configurations)
    const logs = await this.$.logsProvider.getLogs(
      blockFrom,
      blockTo,
      addresses,
      events,
    )

    const blockTimestampLookup = await this.buildBlockTimestampLookup(logs)
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
        const result = extractPrivacyFlow(configuration.properties, log)

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

  private async buildBlockTimestampLookup(
    logs: Log[],
  ): Promise<Map<number, UnixTime>> {
    const logsWithoutTimestamps = logs.filter(
      (l) => l.blockTimestamp === undefined,
    )
    const logsWithTimestamps = logs
      .map((l) => [l.blockNumber, l.blockTimestamp])
      .filter((l): l is [number, number] => l[1] !== undefined)

    const lookup = new Map<number, UnixTime>(logsWithTimestamps)

    if (logsWithoutTimestamps.length === 0) {
      return lookup
    }

    this.logger.info('Fetching block timestamps for logs without timestamps', {
      logsWithTimestamps: logsWithTimestamps.length,
      logsWithoutTimestamps: logsWithoutTimestamps.length,
      blocksWithTimestamps: unique(logsWithTimestamps.map((l) => l[0])).length,
      blocksWithoutTimestamps: unique(
        logsWithoutTimestamps.map((l) => l.blockNumber),
      ).length,
    })

    const timestamps = await this.$.blockProvider.getBlockTimestamps(
      unique(logsWithoutTimestamps.map((l) => l.blockNumber)),
    )
    for (const [blockNumber, timestamp] of timestamps) {
      lookup.set(blockNumber, timestamp)
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

// Splits the bigint into whole/fractional parts before casting to Number to
// avoid precision loss for large raw amounts (e.g. 18-decimal tokens).
function bigintToFloat(amount: bigint, decimals: number): number {
  const divisor = 10n ** BigInt(decimals)
  const whole = amount / divisor
  const frac = amount % divisor
  return Number(whole) + Number(frac) / Number(divisor)
}
