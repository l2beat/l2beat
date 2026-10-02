import type { Logger } from '@l2beat/backend-tools'
import type { Database, PrivacyRelayerActivityRecord } from '@l2beat/database'
import type { BlockProvider, IRpcClient, LogsProvider } from '@l2beat/shared'
import {
  createPrivacyConfigurationId,
  stringifyPrivacyConfigurationParams,
} from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type {
  PrivacyRelayerActivityIndexerConfig,
  PrivacyRelayerActivityIndexerConfigProperties,
} from '../types'
import { extractPrivacyRelayerActivity } from '../utils/extractPrivacyRelayerActivity'
import { mapInBatches } from '../utils/mapInBatches'
import { fetchPrivacyLogMatches } from '../utils/privacyLogIndexerUtils'
import { ReceiptLogCache } from '../utils/ReceiptLogCache'

// Receipt-based extractors make several RPC requests per log.
const EXTRACTION_BATCH_SIZE = 20

interface PrivacyRelayerActivityIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<PrivacyRelayerActivityIndexerConfig>,
    'name' | 'logger'
  > {
  chain: string
  blockProvider: BlockProvider
  rpcClient: IRpcClient
  logsProvider: LogsProvider
  db: Database
}

export class PrivacyRelayerActivityIndexer extends ManagedMultiIndexer<PrivacyRelayerActivityIndexerConfig> {
  constructor(
    private readonly $: PrivacyRelayerActivityIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.PRIVACY_RELAYER_ACTIVITY,
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
    configurations: Configuration<PrivacyRelayerActivityIndexerConfig>[],
  ) {
    const adjustedTo = Math.min(UnixTime.toNext(from, 'day'), to)
    this.logger.info('Fetching privacy relayer activity logs', {
      from,
      to: adjustedTo,
      configurations: configurations.length,
    })

    const records = await this.fetchRecords(configurations, from, adjustedTo)

    this.logger.info('Fetched privacy relayer activity logs', {
      from,
      to: adjustedTo,
      records: records.length,
    })

    return async () => {
      await this.$.db.privacyRelayerActivity.upsertMany(records)

      this.logger.info('Saved privacy relayer activity into DB', {
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
    const deletedRecords =
      await this.$.db.privacyRelayerActivity.deleteByConfigIds(
        configurations.map((c) => c.id),
      )

    if (deletedRecords > 0) {
      this.logger.info('Wiped privacy relayer activity for configurations', {
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
        await this.$.db.privacyRelayerActivity.deleteByConfigInTimeRange(
          configuration.id,
          from,
          to,
        )

      if (deletedRecords > 0) {
        this.logger.info('Trimmed privacy relayer activity', {
          configurationId: configuration.id,
          from,
          to,
          deletedRecords,
        })
      }
    }
  }

  private async fetchRecords(
    configurations: Configuration<PrivacyRelayerActivityIndexerConfig>[],
    from: number,
    to: number,
  ): Promise<PrivacyRelayerActivityRecord[]> {
    const matches = await fetchPrivacyLogMatches(configurations, {
      chain: this.$.chain,
      from,
      to,
      privacyBlockTimestamp: this.$.db.privacyBlockTimestamp,
      logsProvider: this.$.logsProvider,
      blockProvider: this.$.blockProvider,
      logger: this.logger,
    })

    const context = {
      rpc: this.$.rpcClient,
      receipts: new ReceiptLogCache(this.$.rpcClient),
    }
    const records = await mapInBatches(
      matches,
      EXTRACTION_BATCH_SIZE,
      async ({ log, timestamp, configuration }) => {
        const activity = await extractPrivacyRelayerActivity(
          configuration.properties,
          log,
          context,
        )
        if (!activity) return undefined
        return {
          configurationId: configuration.id,
          projectId: configuration.properties.projectId,
          chain: configuration.properties.chain,
          timestamp,
          blockNumber: log.blockNumber,
          txHash: log.transactionHash,
          logIndex: log.logIndex,
          relayerAddress: activity.relayerAddress,
        }
      },
    )
    return records.filter((record) => record !== undefined)
  }

  static idToConfigurationId(
    config: PrivacyRelayerActivityIndexerConfigProperties,
  ): string {
    return createPrivacyConfigurationId([
      'privacy-relayer-activity',
      config.projectId,
      config.chain,
      config.address.toString(),
      config.event,
      config.extractor,
      // Only appended when present, so ids of extractors without params stay unchanged.
      ...('params' in config
        ? [stringifyPrivacyConfigurationParams(config.params)]
        : []),
    ])
  }
}
