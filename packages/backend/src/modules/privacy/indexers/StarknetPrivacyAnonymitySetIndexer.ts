import type { Logger } from '@l2beat/backend-tools'
import type { Database, PrivacyAnonymitySetEventRecord } from '@l2beat/database'
import type { BlockProvider, StarknetClient } from '@l2beat/shared'
import { createPrivacyAnonymitySetConfigurationId } from '@l2beat/shared'
import { assert, UnixTime, unique } from '@l2beat/shared-pure'
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
  StarknetPrivacyAnonymitySetIndexerConfig,
  StarknetPrivacyAnonymitySetIndexerConfigProperties,
  StarknetPrivacyEvent,
} from '../types'
import { extractStarknetAnonymitySetDeposit } from '../utils/extractStarknetAnonymitySetDeposit'

interface StarknetPrivacyAnonymitySetIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<StarknetPrivacyAnonymitySetIndexerConfig>,
    'name' | 'logger'
  > {
  chain: string
  blockProvider: BlockProvider
  starknetClient: StarknetClient
  db: Database
}

/**
 * Starknet counterpart of PrivacyAnonymitySetIndexer. Writes the same table,
 * so the frontend reads Starknet pools through the unchanged query path.
 */
export class StarknetPrivacyAnonymitySetIndexer extends ManagedMultiIndexer<StarknetPrivacyAnonymitySetIndexerConfig> {
  constructor(
    private readonly $: StarknetPrivacyAnonymitySetIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.PRIVACY_STARKNET_ANONYMITY_SET,
        tags: { tag: $.chain, chain: $.chain },
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<StarknetPrivacyAnonymitySetIndexerConfig>[],
  ) {
    const adjustedTo = Math.min(UnixTime.toNext(from, 'day'), to)
    const records = await this.fetchRecords(configurations, from, adjustedTo)

    return async () => {
      await this.$.db.privacyAnonymitySetEvent.upsertMany(records)
      this.logger.info('Saved Starknet privacy anonymity set deposits', {
        from,
        to: adjustedTo,
        records: records.length,
      })
      return adjustedTo
    }
  }

  override async wipeData(configurations: WipeRemovalConfiguration[]) {
    await this.$.db.privacyAnonymitySetEvent.deleteByConfigIds(
      configurations.map((c) => c.id),
    )
  }

  override async trimData(configurations: TrimRemovalConfiguration[]) {
    for (const configuration of configurations) {
      await this.$.db.privacyAnonymitySetEvent.deleteByConfigInTimeRange(
        configuration.id,
        configuration.range[0],
        configuration.range[1],
      )
    }
  }

  private async fetchRecords(
    configurations: Configuration<StarknetPrivacyAnonymitySetIndexerConfig>[],
    from: number,
    to: number,
  ): Promise<PrivacyAnonymitySetEventRecord[]> {
    if (configurations.length === 0) return []

    const [blockFrom, blockTo] = await Promise.all([
      this.$.db.privacyBlockTimestamp.findBlockNumberByChainAndTimestamp(
        this.$.chain,
        UnixTime.toStartOf(from, 'hour'),
      ),
      this.$.db.privacyBlockTimestamp.findBlockNumberByChainAndTimestamp(
        this.$.chain,
        UnixTime.toEndOf(to, 'hour'),
      ),
    ])
    assert(blockFrom !== undefined, `Missing block mapping: from=${from}`)
    assert(blockTo !== undefined, `Missing block mapping: to=${to}`)

    const events = await this.fetchEvents(configurations, blockFrom, blockTo)
    if (events.length === 0) return []

    const configMap = new Map<
      string,
      Configuration<StarknetPrivacyAnonymitySetIndexerConfig>[]
    >()
    for (const configuration of configurations) {
      const key = configKey(
        configuration.properties.address,
        configuration.properties.event,
      )
      configMap.set(key, [...(configMap.get(key) ?? []), configuration])
    }

    const rawRecords = events.flatMap((event) => {
      const matching =
        configMap.get(configKey(event.address, event.keys[0] ?? '')) ?? []
      return matching.flatMap((configuration) => {
        const deposit = extractStarknetAnonymitySetDeposit(
          configuration.properties,
          event,
        )
        return deposit && deposit.amount > 0n
          ? [{ configuration, event, ...deposit }]
          : []
      })
    })
    if (rawRecords.length === 0) return []

    const timestamps = await this.$.blockProvider.getBlockTimestamps(
      unique(rawRecords.map((record) => record.event.blockNumber)),
    )

    // The hourly block mapping can make adjacent ranges share boundary blocks.
    // Filtering by timestamp keeps the exact range; the upsert deduplicates
    // any boundary events fetched again by the following update.
    return rawRecords.flatMap((record) => {
      const timestamp = timestamps.get(record.event.blockNumber)
      assert(
        timestamp !== undefined,
        `Missing block timestamp for ${record.event.blockNumber}`,
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
          blockNumber: record.event.blockNumber,
          txHash: record.event.transactionHash,
          logIndex: record.event.eventIndex,
          sender: record.sender,
          amount: record.amount,
        },
      ]
    })
  }

  private async fetchEvents(
    configurations: Configuration<StarknetPrivacyAnonymitySetIndexerConfig>[],
    blockFrom: number,
    blockTo: number,
  ): Promise<StarknetPrivacyEvent[]> {
    const selectorsByAddress = new Map<string, Set<string>>()
    for (const configuration of configurations) {
      const address = configuration.properties.address
      const selectors = selectorsByAddress.get(address) ?? new Set<string>()
      selectors.add(configuration.properties.event)
      selectorsByAddress.set(address, selectors)
    }

    const events = await Promise.all(
      Array.from(selectorsByAddress.entries()).map(
        async ([address, selectors]) => {
          const result = await this.$.starknetClient.getEvents(
            blockFrom,
            blockTo,
            address,
            Array.from(selectors),
          )
          return result.map((event) => ({
            address,
            blockNumber: event.block_number,
            transactionHash: event.transaction_hash,
            eventIndex: event.event_index,
            keys: event.keys,
            data: event.data,
          }))
        },
      ),
    )
    return events.flat()
  }

  static idToConfigurationId(
    config: StarknetPrivacyAnonymitySetIndexerConfigProperties,
  ): string {
    return createPrivacyAnonymitySetConfigurationId(config)
  }
}

/** Felts compare by value, as the RPC may pad them differently than config. */
function configKey(address: string, event: string): string {
  return `${BigInt(address)}:${BigInt(event)}`
}
