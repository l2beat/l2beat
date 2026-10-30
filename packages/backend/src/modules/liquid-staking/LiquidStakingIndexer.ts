import type { Logger } from '@l2beat/backend-tools'
import type { Database, LiquidStakingSnapshotRecord } from '@l2beat/database'
import type { BlockTimestampProvider, IRpcClient } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { withCoreFeatureRpcMetricsContext } from '../../tools/coreFeatureRpcMetrics'
import { INDEXER_NAMES } from '../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../../tools/uif/multi/types'
import { decodeUint, getLiquidStakingReads } from './liquidStakingReads'
import type { LiquidStakingProjectConfig } from './types'

/** Hours per update, so a long backfill saves its progress as it goes. */
const MAX_HOURS_PER_UPDATE = 24

interface LiquidStakingIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<LiquidStakingProjectConfig>, 'name'> {
  db: Database
  rpc: Pick<IRpcClient, 'multicall'>
  blockTimestampProvider: Pick<
    BlockTimestampProvider,
    'getBlockNumberAtOrBefore'
  >
}

/**
 * Reads every project's token state at the last Ethereum block at or before
 * each full hour, in one multicall per hour.
 */
export class LiquidStakingIndexer extends ManagedMultiIndexer<LiquidStakingProjectConfig> {
  constructor(
    private readonly $: LiquidStakingIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.LIQUID_STAKING,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<LiquidStakingProjectConfig>[],
  ): Promise<() => Promise<number>> {
    const first = UnixTime.toEndOf(UnixTime(from), 'hour')
    const last = Math.min(
      UnixTime.toStartOf(UnixTime(to), 'hour'),
      first + (MAX_HOURS_PER_UPDATE - 1) * UnixTime.HOUR,
    )

    const records = await withCoreFeatureRpcMetricsContext(
      'liquidStaking.snapshot',
      { chain: 'ethereum' },
      async () => {
        const records: LiquidStakingSnapshotRecord[] = []
        for (let t = first; t <= last; t += UnixTime.HOUR) {
          records.push(
            ...(await this.readSnapshots(UnixTime(t), configurations)),
          )
        }
        return records
      },
    )

    return async () => {
      await this.$.db.liquidStakingSnapshot.upsertMany(records)
      this.logger.info('Saved liquid staking snapshots', {
        from: first,
        to: last,
        records: records.length,
      })
      return last
    }
  }

  private async readSnapshots(
    timestamp: UnixTime,
    configurations: Configuration<LiquidStakingProjectConfig>[],
  ): Promise<LiquidStakingSnapshotRecord[]> {
    const blockNumber =
      await this.$.blockTimestampProvider.getBlockNumberAtOrBefore(
        timestamp,
        'ethereum',
      )
    const reads = configurations.map((c) =>
      getLiquidStakingReads(c.properties.contracts),
    )
    const responses = await this.$.rpc.multicall(
      reads.flatMap((r) => r.calls),
      blockNumber,
    )
    assert(
      responses.length === reads.reduce((n, r) => n + r.calls.length, 0),
      'Unexpected number of multicall responses',
    )

    let offset = 0
    return configurations.map((configuration, i) => {
      const { calls, toState } = reads[i]
      const results = responses.slice(offset, offset + calls.length)
      offset += calls.length
      // The multicall allows failures, and a call to an address without code
      // succeeds with no data.
      if (results.some((r) => !r.success || r.data.length === 0)) {
        throw new Error('Liquid staking call reverted', {
          cause: {
            projectId: configuration.properties.projectId,
            blockNumber,
          },
        })
      }

      return {
        configurationId: configuration.id,
        projectId: configuration.properties.projectId,
        timestamp,
        blockNumber,
        ...toState(results.map((r) => decodeUint(r.data))),
      }
    })
  }

  override async wipeData(
    configurations: WipeRemovalConfiguration[],
  ): Promise<void> {
    const deletedRecords =
      await this.$.db.liquidStakingSnapshot.deleteByConfigIds(
        configurations.map((configuration) => configuration.id),
      )
    if (deletedRecords > 0) {
      this.logger.info('Wiped liquid staking snapshots', { deletedRecords })
    }
  }

  override async trimData(
    configurations: TrimRemovalConfiguration[],
  ): Promise<void> {
    for (const configuration of configurations) {
      const [from, to] = configuration.range
      const deletedRecords =
        await this.$.db.liquidStakingSnapshot.deleteByConfigInTimeRange(
          configuration.id,
          UnixTime(from),
          UnixTime(to),
        )
      if (deletedRecords > 0) {
        this.logger.info('Trimmed liquid staking snapshots', {
          id: configuration.id,
          from,
          to,
          deletedRecords,
        })
      }
    }
  }
}
