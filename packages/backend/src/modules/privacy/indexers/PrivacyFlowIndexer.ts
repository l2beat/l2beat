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
import { extractPrivacyFlow } from '../services/PrivacyFlowExtractor'
import type { PrivacyFlowIndexerConfig } from '../types'

interface PrivacyFlowIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<PrivacyFlowIndexerConfig>,
    'name' | 'logger'
  > {
  chain: string
  blockProvider: BlockProvider
  logsProvider: LogsProvider
  db: Database
  batchSize: number
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
    const adjustedTo = Math.min(to, from + this.$.batchSize - 1)

    this.logger.info('Fetching privacy flow logs', {
      from,
      to: adjustedTo,
      configurations: configurations.length,
    })

    const groups = groupConfigurationsByFilter(configurations)
    const records: PrivacyFlowEventRecord[] = []
    const blockTimestampCache = new Map<number, Promise<UnixTime>>()

    for (const [_, groupConfigs] of groups) {
      const groupRecords = await this.fetchRecordsForGroup(
        groupConfigs,
        from,
        adjustedTo,
        blockTimestampCache,
      )
      records.push(...groupRecords)
    }

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
    blockTimestampCache: Map<number, Promise<UnixTime>>,
  ): Promise<PrivacyFlowEventRecord[]> {
    if (configurations.length === 0) return []

    const source = configurations[0].properties
    const logs = await this.$.logsProvider.getLogs(
      from,
      to,
      source.address ? [source.address.toString()] : undefined,
      [source.event],
    )

    const records: PrivacyFlowEventRecord[] = []

    for (const log of logs) {
      for (const configuration of configurations) {
        let result: { count: number; amount: bigint } | undefined
        try {
          result = extractPrivacyFlow(configuration.properties, log)
        } catch (error) {
          this.logger.warn('Failed to extract privacy flow from log', {
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

        const timestamp = await this.getBlockTimestamp(log, blockTimestampCache)

        records.push({
          configurationId: configuration.id,
          projectId: configuration.properties.projectId,
          assetKey: configuration.properties.assetKey,
          bucketId: configuration.properties.bucketId,
          chain: configuration.properties.chain,
          direction: configuration.properties.direction,
          timestamp,
          blockNumber: log.blockNumber,
          txHash: log.transactionHash,
          logIndex: log.logIndex,
          count: result.count,
          amount: result.amount,
        })
      }
    }

    return records
  }

  private async getBlockTimestamp(
    log: Log,
    cache: Map<number, Promise<UnixTime>>,
  ): Promise<UnixTime> {
    const cached = cache.get(log.blockNumber)
    if (cached) return await cached

    const promise = this.$.blockProvider
      .getBlockWithTransactions(log.blockNumber)
      .then((block) => {
        assert(
          block.number === log.blockNumber,
          `Expected block ${log.blockNumber}, got ${block.number}`,
        )
        return UnixTime(block.timestamp)
      })

    cache.set(log.blockNumber, promise)
    return await promise
  }

  static idToConfigurationId(config: PrivacyFlowIndexerConfig): string {
    return createPrivacyConfigurationId([
      'privacy-flow',
      config.projectId,
      config.assetKey,
      config.bucketId,
      config.direction,
      config.chain,
      config.address?.toString() ?? '',
      config.event,
      config.extractor,
      stringifyParams(config.params),
    ])
  }
}

function groupConfigurationsByFilter(
  configurations: Configuration<PrivacyFlowIndexerConfig>[],
): Map<string, Configuration<PrivacyFlowIndexerConfig>[]> {
  const groups = new Map<string, Configuration<PrivacyFlowIndexerConfig>[]>()

  for (const configuration of configurations) {
    const source = configuration.properties
    const key = `${source.chain}:${source.address?.toString() ?? ''}:${source.event}`
    const existing = groups.get(key) ?? []
    existing.push(configuration)
    groups.set(key, existing)
  }

  return groups
}

function stringifyParams(params: Record<string, unknown>): string {
  const keys = Object.keys(params).sort()
  return keys.map((k) => `${k}=${String(params[k])}`).join(',')
}
