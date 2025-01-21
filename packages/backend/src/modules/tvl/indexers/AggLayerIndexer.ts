import { INDEXER_NAMES } from '@l2beat/backend-shared'
import {
  assert,
  type AggLayerL2Token,
  type AggLayerNativeEtherPreminted,
  type AggLayerNativeEtherWrapped,
  type Configuration,
  type RemovalConfiguration,
  UnixTime,
} from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type { AggLayerAmountConfig, AggLayerAmountIndexerDeps } from './types'

export class AggLayerIndexer extends ManagedMultiIndexer<AggLayerAmountConfig> {
  constructor(private readonly $: AggLayerAmountIndexerDeps) {
    super({
      ...$,
      name: INDEXER_NAMES.AGGLAYER,
      tags: {
        tag: $.chain,
        chain: $.chain,
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<AggLayerAmountConfig>[],
  ) {
    const timestamp = this.$.syncOptimizer.getTimestampToSync(from)
    if (timestamp.toNumber() > to) {
      this.logger.info('Skipping update due to sync optimization', {
        from,
        to,
        optimizedTimestamp: timestamp.toNumber(),
      })
      return () => Promise.resolve(to)
    }

    const blockNumber = await this.getBlockNumber(timestamp)

    const tokens = configurations.filter(
      (c): c is Configuration<AggLayerL2Token> =>
        c.properties.type === 'aggLayerL2Token',
    )

    const nativeToken = configurations.find(
      (
        c,
      ): c is Configuration<
        AggLayerNativeEtherPreminted | AggLayerNativeEtherWrapped
      > =>
        c.properties.type === 'aggLayerNativeEtherPreminted' ||
        c.properties.type === 'aggLayerNativeEtherWrapped',
    )

    const amounts = await this.$.aggLayerService.fetchAmounts(
      timestamp,
      blockNumber,
      tokens.map((c) => ({ id: c.id, ...c.properties })),
      nativeToken
        ? { id: nativeToken.id, ...nativeToken.properties }
        : undefined,
    )

    this.logger.info('Fetched AggLayer amounts for timestamp', {
      timestamp: timestamp.toNumber(),
      blockNumber,
      tokens: tokens.length,
      nativeToken: nativeToken?.properties.type ?? undefined,
      responseSize: amounts.length,
    })

    const nonZeroAmounts = amounts.filter((a) => a.amount > 0)

    return async () => {
      await this.$.db.amount.insertMany(nonZeroAmounts)
      this.logger.info('Saved AggLayer amounts for timestamp into DB', {
        timestamp: timestamp.toNumber(),
        records: nonZeroAmounts.length,
      })

      return timestamp.toNumber()
    }
  }

  private async getBlockNumber(timestamp: UnixTime) {
    const blockNumber =
      await this.$.db.blockTimestamp.findBlockNumberByChainAndTimestamp(
        this.$.chain,
        timestamp,
      )
    assert(
      blockNumber,
      `Block number not found for timestamp: ${timestamp.toNumber()}`,
    )
    return blockNumber
  }

  override async removeData(configurations: RemovalConfiguration[]) {
    for (const configuration of configurations) {
      const deletedRecords = await this.$.db.amount.deleteByConfigInTimeRange(
        configuration.id,
        new UnixTime(configuration.from),
        new UnixTime(configuration.to),
      )

      if (deletedRecords > 0) {
        this.logger.info('Deleted amounts for configuration', {
          id: configuration.id,
          from: configuration.from,
          to: configuration.to,
          deletedRecords,
        })
      }
    }
  }
}
