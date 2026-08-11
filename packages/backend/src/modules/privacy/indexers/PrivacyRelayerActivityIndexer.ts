import type { Logger } from '@l2beat/backend-tools'
import type { Database, PrivacyRelayerActivityRecord } from '@l2beat/database'
import type { BlockProvider, LogsProvider } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { createPrivacyConfigurationId } from '../../../config/features/privacy'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { PrivacyRelayerActivityIndexerConfig } from '../types'
import { extractPrivacyRelayerActivity } from '../utils/extractPrivacyRelayerActivity'
import {
  buildPrivacyBlockTimestampLookup,
  buildPrivacyLogConfigMap,
  buildPrivacyLogFilter,
  getPrivacyLogConfigKey,
  resolvePrivacyBlockRange,
} from '../utils/privacyLogIndexerUtils'

interface PrivacyRelayerActivityIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<PrivacyRelayerActivityIndexerConfig>,
    'name' | 'logger'
  > {
  chain: string
  blockProvider: BlockProvider
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
    if (configurations.length === 0) return []

    const { blockFrom, blockTo } = await resolvePrivacyBlockRange(
      this.$.db.privacyBlockTimestamp,
      this.$.chain,
      from,
      to,
    )

    const { addresses, events } = buildPrivacyLogFilter(configurations)
    const logs = await this.$.logsProvider.getLogs(
      blockFrom,
      blockTo,
      addresses,
      events,
    )

    const blockTimestampLookup = await buildPrivacyBlockTimestampLookup(
      logs,
      this.$.blockProvider,
      this.logger,
    )
    const configMap = buildPrivacyLogConfigMap(configurations)
    const records: PrivacyRelayerActivityRecord[] = []

    for (const log of logs) {
      const key = getPrivacyLogConfigKey(log.address, log.topics[0])
      const matching = configMap.get(key) ?? []

      for (const configuration of matching) {
        const activity = extractPrivacyRelayerActivity(
          configuration.properties,
          log,
        )
        if (!activity) continue

        const timestamp = blockTimestampLookup.get(log.blockNumber)
        assert(
          timestamp,
          `Missing block timestamp for block ${log.blockNumber}`,
        )

        records.push({
          configurationId: configuration.id,
          projectId: configuration.properties.projectId,
          chain: configuration.properties.chain,
          timestamp,
          blockNumber: log.blockNumber,
          txHash: log.transactionHash,
          logIndex: log.logIndex,
          relayerAddress: activity.relayerAddress,
          recipientAddress: activity.recipientAddress,
        })
      }
    }

    return records
  }

  static idToConfigurationId(
    config: Omit<PrivacyRelayerActivityIndexerConfig, 'id'>,
  ): string {
    return createPrivacyConfigurationId([
      'privacy-relayer-activity',
      config.projectId,
      config.chain,
      config.address.toString(),
      config.event,
      config.extractor,
    ])
  }
}
