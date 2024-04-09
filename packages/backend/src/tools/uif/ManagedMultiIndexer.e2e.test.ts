import { Logger } from '@l2beat/backend-tools'
import { RemovalConfiguration, UpdateConfiguration } from '@l2beat/uif'
import { expect, mockObject } from 'earl'

import { describeDatabase } from '../../test/database'
import { IndexerConfigurationRepository } from './IndexerConfigurationRepository'
import { IndexerService } from './IndexerService'
import { IndexerStateRepository } from './IndexerStateRepository'
import {
  ManagedMultiIndexerOptions,
  MangedMultiIndexer,
} from './ManagedMultiIndexer'

describeDatabase('ManagedMultiIndexer e2e', (database) => {
  it('e2e', async () => {
    const stateRepository = new IndexerStateRepository(database, Logger.SILENT)
    const configurationsRepository = new IndexerConfigurationRepository(
      database,
      Logger.SILENT,
    )

    const indexerService = new IndexerService(
      stateRepository,
      configurationsRepository,
    )

    const db = mockObject({
      add: async (_ids: string[], _timestamp: number) => {},
      remove: async (_id: string, _from: number, _to: number) => {},
    })

    const indexer = new TestIndexer(
      {
        parents: [],
        id: 'indexer',
        indexerService,
        configurations: [
          {
            id: '1'.repeat(12),
            minHeight: 1,
            maxHeight: null,
            properties: { address: '0x1' },
          },
        ],
        logger: Logger.SILENT,
        encode: (v: ConfigurationProperties) => JSON.stringify(v),
        decode: (blob: string) => JSON.parse(blob),
      },
      db,
    )

    await indexer.start()

    const indexerState = await stateRepository.getAll()
    const configurations = await configurationsRepository.getAll()

    expect(indexerState).toEqual([
      {
        indexerId: 'indexer',
        safeHeight: 0,
        minTimestamp: undefined,
      },
    ])

    expect(configurations).toEqual([
      {
        id: '111111111111',
        indexerId: 'indexer',
        properties: '{"address":"0x1"}',
        currentHeight: 10,
        minHeight: 1,
        maxHeight: null,
      },
    ])

    const target = 10
    let current = 1

    while (current !== target) {
      current = await indexer.update(current, target)
    }

    expect(db.add).toHaveBeenCalledWith(['111111111111'], 1)
  })
})

interface ConfigurationProperties {
  address: string
}

class TestIndexer extends MangedMultiIndexer<ConfigurationProperties> {
  constructor(
    override readonly options: ManagedMultiIndexerOptions<ConfigurationProperties>,
    private readonly db: {
      add: (ids: string[], timestamp: number) => Promise<void>
      remove: (id: string, from: number, to: number) => Promise<void>
    },
  ) {
    super(options)
  }

  override async multiUpdate(
    from: number,
    _to: number,
    configurations: UpdateConfiguration<ConfigurationProperties>[],
  ): Promise<number> {
    await this.db.add(
      configurations.map((c) => c.id),
      from,
    )
    return from + 1
  }
  override async removeData(
    configurations: RemovalConfiguration<ConfigurationProperties>[],
  ): Promise<void> {
    for (const c of configurations) {
      await this.db.remove(c.id, c.from, c.to)
    }
  }
}
