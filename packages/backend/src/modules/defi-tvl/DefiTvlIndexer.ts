import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  WipeRemovalConfiguration,
} from '../../tools/uif/multi/types'
import type { DefiLlamaClient } from './DefiLlamaClient'
import { mapDefiLlamaTvl } from './mapDefiLlamaTvl'
import type { DefiTvlProjectConfig } from './types'

interface DefiTvlIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<DefiTvlProjectConfig>, 'name'> {
  db: Database
  client: DefiLlamaClient
}

export class DefiTvlIndexer extends ManagedMultiIndexer<DefiTvlProjectConfig> {
  constructor(
    private readonly $: DefiTvlIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.DEFI_TVL,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<DefiTvlProjectConfig>[],
  ): Promise<() => Promise<number>> {
    assert(configurations.length === 1, 'Expected one DeFi TVL configuration')
    const config = configurations[0].properties
    const data = await this.$.client.getProtocol(config.protocolSlug)
    const records = mapDefiLlamaTvl(data, config, UnixTime(from), UnixTime(to))

    return async () => {
      await this.$.db.defiTvl.upsertMany(records)
      this.logger.info('Saved DeFi TVL records', {
        project: config.projectId,
        records: records.length,
        from,
        to,
      })
      return to
    }
  }

  override async wipeData(
    configurations: WipeRemovalConfiguration[],
  ): Promise<void> {
    const deletedRecords = await this.$.db.defiTvl.deleteByConfigIds(
      configurations.map((configuration) => configuration.id),
    )

    if (deletedRecords > 0) {
      this.logger.info('Wiped DeFi TVL records', { deletedRecords })
    }
  }
}
