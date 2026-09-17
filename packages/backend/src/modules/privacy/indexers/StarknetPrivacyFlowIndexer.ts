import type { Logger } from '@l2beat/backend-tools'
import type { Database, PrivacyFlowEventRecord } from '@l2beat/database'
import type { BlockProvider, StarknetClient } from '@l2beat/shared'
import { createPrivacyConfigurationId } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
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
  StarknetPrivacyEvent,
  StarknetPrivacyFlowIndexerConfig,
} from '../types'
import { extractStarknetPrivacyFlow } from '../utils/extractStarknetPrivacyFlow'

interface StarknetPrivacyFlowIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<StarknetPrivacyFlowIndexerConfig>,
    'name' | 'logger'
  > {
  chain: string
  blockProvider: BlockProvider
  starknetClient: StarknetClient
  db: Database
}

export class StarknetPrivacyFlowIndexer extends ManagedMultiIndexer<StarknetPrivacyFlowIndexerConfig> {
  constructor(
    private readonly $: StarknetPrivacyFlowIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.PRIVACY_STARKNET_FLOW,
        tags: { tag: $.chain, chain: $.chain },
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<StarknetPrivacyFlowIndexerConfig>[],
  ) {
    const adjustedTo = Math.min(UnixTime.toNext(from, 'day'), to)
    const records = await this.fetchRecords(configurations, from, adjustedTo)

    return async () => {
      await this.$.db.privacyFlowEvent.upsertMany(records)
      this.logger.info('Saved Starknet privacy flow events', {
        from,
        to: adjustedTo,
        records: records.length,
      })
      return adjustedTo
    }
  }

  override async wipeData(configurations: WipeRemovalConfiguration[]) {
    await this.$.db.privacyFlowEvent.deleteByConfigIds(
      configurations.map((c) => c.id),
    )
  }

  override async trimData(configurations: TrimRemovalConfiguration[]) {
    for (const configuration of configurations) {
      await this.$.db.privacyFlowEvent.deleteByConfigInTimeRange(
        configuration.id,
        configuration.range[0],
        configuration.range[1],
      )
    }
  }

  private async fetchRecords(
    configurations: Configuration<StarknetPrivacyFlowIndexerConfig>[],
    from: number,
    to: number,
  ): Promise<PrivacyFlowEventRecord[]> {
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
      Configuration<StarknetPrivacyFlowIndexerConfig>[]
    >()
    for (const configuration of configurations) {
      const key = configKey(
        configuration.properties.address,
        configuration.properties.event,
      )
      configMap.set(key, [...(configMap.get(key) ?? []), configuration])
    }

    const timestamps = await this.$.blockProvider.getBlockTimestamps(
      Array.from(new Set(events.map((event) => event.blockNumber))),
    )
    const rawRecords = events.flatMap((event) => {
      const matching =
        configMap.get(configKey(event.address, event.keys[0] ?? '')) ?? []
      const timestamp = timestamps.get(event.blockNumber)
      assert(timestamp, `Missing block timestamp for ${event.blockNumber}`)
      return matching.flatMap((configuration) => {
        const extracted = extractStarknetPrivacyFlow(
          configuration.properties,
          event,
        )
        return extracted
          ? [{ configuration, event, timestamp, ...extracted }]
          : []
      })
    })

    if (rawRecords.length === 0) return []

    const priceIds = Array.from(
      new Set(
        rawRecords.map((record) => record.configuration.properties.priceId),
      ),
    )
    const minTimestamp = UnixTime.toStartOf(
      Math.min(...rawRecords.map((record) => record.timestamp)),
      'hour',
    )
    const maxTimestamp = UnixTime.toStartOf(
      Math.max(...rawRecords.map((record) => record.timestamp)),
      'hour',
    )
    const prices = await this.$.db.privacyPrice.getPricesByPriceIdsInRange(
      priceIds,
      minTimestamp,
      maxTimestamp,
    )
    const priceLookup = new Map(
      prices.map((price) => [
        `${price.priceId}:${price.timestamp}`,
        price.priceUsd,
      ]),
    )

    return rawRecords.map((record) => {
      const config = record.configuration.properties
      const hourTimestamp = UnixTime.toStartOf(record.timestamp, 'hour')
      const price = priceLookup.get(`${config.priceId}:${hourTimestamp}`)
      assert(price !== undefined, `Missing price for ${config.priceId}`)
      return {
        configurationId: record.configuration.id,
        projectId: config.projectId,
        bucketId: config.bucketId,
        chain: config.chain,
        direction: config.direction,
        timestamp: record.timestamp,
        blockNumber: record.event.blockNumber,
        txHash: record.event.transactionHash,
        logIndex: record.event.eventIndex,
        count: record.count,
        amount: record.amount,
        priceId: config.priceId,
        valueUsd: bigintToFloat(record.amount, config.decimals) * price,
      }
    })
  }

  private async fetchEvents(
    configurations: Configuration<StarknetPrivacyFlowIndexerConfig>[],
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
    config: Omit<StarknetPrivacyFlowIndexerConfig, 'id'>,
  ): string {
    return createPrivacyConfigurationId([
      'privacy-starknet-flow',
      config.projectId,
      config.bucketId,
      config.direction,
      config.chain,
      config.address,
      config.event,
      config.extractor,
      config.params.tokenAddress,
    ])
  }
}

function configKey(address: string, event: string): string {
  return `${address.toLowerCase()}:${event.toLowerCase()}`
}

function bigintToFloat(amount: bigint, decimals: number): number {
  const divisor = 10n ** BigInt(decimals)
  return Number(amount / divisor) + Number(amount % divisor) / Number(divisor)
}
