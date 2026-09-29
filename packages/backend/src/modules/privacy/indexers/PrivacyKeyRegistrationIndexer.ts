import type { Logger } from '@l2beat/backend-tools'
import type { PrivacyAnonymitySetEventRecord } from '@l2beat/database'
import type { BlockProvider, LogsProvider } from '@l2beat/shared'
import { createPrivacyAnonymitySetConfigurationId } from '@l2beat/shared'
import { assert, EthereumAddress, UnixTime, unique } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { AnonymitySetFileStore } from '../AnonymitySetFileStore'
import type {
  PrivacyKeyRegistrationIndexerConfig,
  PrivacyKeyRegistrationIndexerConfigProperties,
} from '../types'

/** Part of the configuration id, the frontend derives the same id. */
export const KEY_REGISTRATION_EXTRACTOR = 'stealthKeyRegistration'

interface PrivacyKeyRegistrationIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<PrivacyKeyRegistrationIndexerConfig>,
    'name' | 'logger'
  > {
  chain: string
  blockProvider: BlockProvider
  logsProvider: LogsProvider
  store: AnonymitySetFileStore
}

/**
 * Records every key registration as an anonymity set event whose sender is
 * the registrant. Registrations carry no amount, so it is stored as 0.
 */
export class PrivacyKeyRegistrationIndexer extends ManagedMultiIndexer<PrivacyKeyRegistrationIndexerConfig> {
  constructor(
    private readonly $: PrivacyKeyRegistrationIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.PRIVACY_KEY_REGISTRATION,
        tags: { tag: $.chain, chain: $.chain },
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<PrivacyKeyRegistrationIndexerConfig>[],
  ) {
    const adjustedTo = Math.min(UnixTime.toNext(from, 'day'), to)
    const records = await fetchKeyRegistrationRecords(
      this.$,
      configurations,
      from,
      adjustedTo,
    )

    return async () => {
      await this.$.store.upsertMany(records)
      this.logger.info('Saved key registrations', {
        from,
        to: adjustedTo,
        records: records.length,
        file: this.$.store.filePath,
      })
      return adjustedTo
    }
  }

  override async wipeData(configurations: WipeRemovalConfiguration[]) {
    await this.$.store.deleteByConfigIds(configurations.map((c) => c.id))
  }

  override async trimData(configurations: TrimRemovalConfiguration[]) {
    for (const configuration of configurations) {
      await this.$.store.deleteByConfigInTimeRange(
        configuration.id,
        configuration.range[0],
        configuration.range[1],
      )
    }
  }

  static idToConfigurationId(
    config: PrivacyKeyRegistrationIndexerConfigProperties,
  ): string {
    return createPrivacyAnonymitySetConfigurationId({
      ...config,
      address: config.address.toString(),
      extractor: KEY_REGISTRATION_EXTRACTOR,
      params: {},
    })
  }
}

/**
 * Fetches registrations with timestamps in [from, to]. Adjacent ranges can
 * share boundary blocks; the store's upsert deduplicates them.
 */
export async function fetchKeyRegistrationRecords(
  $: { blockProvider: BlockProvider; logsProvider: LogsProvider },
  configurations: Configuration<PrivacyKeyRegistrationIndexerConfig>[],
  from: number,
  to: number,
): Promise<PrivacyAnonymitySetEventRecord[]> {
  if (configurations.length === 0) return []

  const [blockFrom, blockTo] = await Promise.all([
    $.blockProvider.getBlockNumberAtOrBefore(UnixTime(from)),
    $.blockProvider.getBlockNumberAtOrBefore(UnixTime(to)),
  ])

  const logs = await $.logsProvider.getLogs(
    blockFrom,
    blockTo,
    unique(configurations.map((c) => c.properties.address.toString())),
    [unique(configurations.map((c) => c.properties.event))],
  )

  const rawRecords = logs.flatMap((log) => {
    const registrant = log.topics[1]
    if (registrant === undefined) return []
    return configurations
      .filter(
        (c) =>
          c.properties.address === EthereumAddress(log.address) &&
          c.properties.event.toLowerCase() === log.topics[0]?.toLowerCase(),
      )
      .map((configuration) => ({
        configuration,
        log,
        sender: EthereumAddress(`0x${registrant.slice(-40)}`).toString(),
      }))
  })
  if (rawRecords.length === 0) return []

  const timestamps = await $.blockProvider.getBlockTimestamps(
    unique(rawRecords.map((record) => record.log.blockNumber)),
  )

  return rawRecords.flatMap((record) => {
    const timestamp = timestamps.get(record.log.blockNumber)
    assert(
      timestamp !== undefined,
      `Missing block timestamp for ${record.log.blockNumber}`,
    )
    if (timestamp < from || timestamp > to) return []

    const config = record.configuration.properties
    return [
      {
        configurationId: record.configuration.id,
        projectId: config.projectId,
        bucketId: config.bucketId,
        chain: config.chain,
        timestamp,
        blockNumber: record.log.blockNumber,
        txHash: record.log.transactionHash,
        logIndex: record.log.logIndex,
        sender: record.sender,
        amount: 0n,
      },
    ]
  })
}
