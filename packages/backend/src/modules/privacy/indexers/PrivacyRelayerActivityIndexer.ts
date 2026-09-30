import type { Logger } from '@l2beat/backend-tools'
import type { Database, PrivacyRelayerActivityRecord } from '@l2beat/database'
import type { BlockProvider, IRpcClient, LogsProvider } from '@l2beat/shared'
import { createPrivacyConfigurationId } from '@l2beat/shared'
import { EthereumAddress, UnixTime, unique } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
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
import { getPrivacyTransactions } from '../utils/getPrivacyTransactions'
import { fetchPrivacyLogMatches } from '../utils/privacyLogIndexerUtils'

interface PrivacyRelayerActivityIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<PrivacyRelayerActivityIndexerConfig>,
    'name' | 'logger'
  > {
  chain: string
  blockProvider: BlockProvider
  logsProvider: LogsProvider
  rpcClient: IRpcClient
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

    const activities = matches.flatMap((match) => {
      const activity = extractPrivacyRelayerActivity(
        match.configuration.properties,
        match.log,
      )
      return activity ? [{ ...match, activity }] : []
    })
    const transactions = await getPrivacyTransactions(
      this.$.rpcClient,
      unique(
        activities
          .filter(({ activity }) => 'transactionSender' in activity)
          .map(({ log }) => log.transactionHash.toLowerCase()),
      ),
    )

    const records: PrivacyRelayerActivityRecord[] = []
    for (const { log, timestamp, configuration, activity } of activities) {
      let relayerAddress: EthereumAddress
      if ('transactionSender' in activity) {
        const transaction = transactions.get(log.transactionHash.toLowerCase())
        // A direct call to the emitting contract is not relayed.
        if (
          transaction?.to === undefined ||
          transaction.to === EthereumAddress(log.address)
        ) {
          continue
        }
        relayerAddress = transaction.from
      } else {
        relayerAddress = activity.relayerAddress
      }

      records.push({
        configurationId: configuration.id,
        projectId: configuration.properties.projectId,
        chain: configuration.properties.chain,
        timestamp,
        blockNumber: log.blockNumber,
        txHash: log.transactionHash,
        logIndex: log.logIndex,
        relayerAddress,
      })
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
