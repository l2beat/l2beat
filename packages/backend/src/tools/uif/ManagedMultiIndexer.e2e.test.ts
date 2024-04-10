import { Logger } from '@l2beat/backend-tools'
import { RemovalConfiguration, UpdateConfiguration } from '@l2beat/uif'
import { expect, mockObject } from 'earl'

import { describeDatabase } from '../../test/database'
import { _TEST_ONLY_resetUniqueIds } from './ids'
import {
  IndexerConfigurationRecord,
  IndexerConfigurationRepository,
} from './IndexerConfigurationRepository'
import { IndexerService } from './IndexerService'
import { IndexerStateRepository } from './IndexerStateRepository'
import {
  ManagedMultiIndexerOptions,
  MangedMultiIndexer,
} from './ManagedMultiIndexer'

/* What to test:

update()
- splits correctly into ranges

*/

const INDEXER_ID = 'indexer'

describeDatabase('ManagedMultiIndexer e2e', (database) => {
  const stateRepository = new IndexerStateRepository(database, Logger.SILENT)
  const configurationsRepository = new IndexerConfigurationRepository(
    database,
    Logger.SILENT,
  )

  const indexerService = new IndexerService(
    stateRepository,
    configurationsRepository,
  )

  afterEach(async () => {
    _TEST_ONLY_resetUniqueIds()
    await stateRepository.deleteAll()
    await configurationsRepository.deleteAll()
  })

  it('start', async () => {
    const UNCHANGED = {
      ...mock('a'),
    }
    const MIN_HEIGHT_CHANGE = {
      ...mock('b'),
      minHeight: 100,
      currentHeight: 200,
    }
    const MAX_HEIGHT_CHANGE = {
      ...mock('c'),
      minHeight: 100,
      currentHeight: 200,
      maxHeight: null,
    }
    const PROPERTIES_CHANGE = {
      ...mock('d'),
    }
    const REMOVED = {
      ...mock('e'),
      currentHeight: 100,
    }
    await configurationsRepository.addOrUpdateManyConfigurations([
      UNCHANGED,
      MIN_HEIGHT_CHANGE,
      MAX_HEIGHT_CHANGE,
      PROPERTIES_CHANGE,
      REMOVED,
    ])

    const ADDED = {
      ...mock('f'),
    }
    const db = mockObject({
      add: async (_ids: string[], _timestamp: number) => {},
      remove: async (_id: string, _from: number, _to: number) => {},
    })
    const indexer = new TestIndexer(
      {
        parents: [],
        id: INDEXER_ID,
        indexerService,
        configurations: [
          UNCHANGED,
          {
            ...MIN_HEIGHT_CHANGE,
            minHeight: 50,
          },
          {
            ...MAX_HEIGHT_CHANGE,
            maxHeight: 150,
          },
          {
            ...PROPERTIES_CHANGE,
            properties: 'different-properties',
          },
          // configuration "e" not present, should be deleted
          ADDED,
        ],
        logger: Logger.SILENT,
        encode: (v: string) => v,
        decode: (blob: string) => blob,
      },
      db,
    )

    await indexer.start()

    const safeHeight = await indexer.getSafeHeight()
    expect(safeHeight).toEqual(0)

    const indexerState = await stateRepository.findIndexerState(INDEXER_ID)
    const configurations = await configurationsRepository.getAll()

    // expect(indexerState).toEqual({
    //   indexerId: INDEXER_ID,
    //   safeHeight: 0,
    //   minTimestamp: undefined,
    // })

    expect(configurations).toEqual([
      UNCHANGED,
      {
        ...MIN_HEIGHT_CHANGE,
        minHeight: 50,
        currentHeight: null,
      },
      {
        ...MAX_HEIGHT_CHANGE,
        maxHeight: 150,
        currentHeight: 150,
      },
      {
        ...PROPERTIES_CHANGE,
        properties: 'different-properties',
      },
      // configuration "e" not present, should be deleted
      ADDED,
    ])

    expect(db.remove).toHaveBeenCalledWith(
      REMOVED.id,
      REMOVED.minHeight,
      REMOVED.currentHeight,
    )

    expect(db.remove).toHaveBeenCalledWith(
      MIN_HEIGHT_CHANGE.id,
      MIN_HEIGHT_CHANGE.minHeight,
      MIN_HEIGHT_CHANGE.currentHeight,
    )

    expect(db.remove).toHaveBeenCalledWith(
      MAX_HEIGHT_CHANGE.id,
      151,
      MAX_HEIGHT_CHANGE.currentHeight,
    )
  })

  //   it('update', async () => {
  //     const stateRepository = new IndexerStateRepository(database, Logger.SILENT)
  //     const configurationsRepository = new IndexerConfigurationRepository(
  //       database,
  //       Logger.SILENT,
  //     )

  //     const indexerService = new IndexerService(
  //       stateRepository,
  //       configurationsRepository,
  //     )

  //     const db = mockObject({
  //       add: async (_ids: string[], _timestamp: number) => {},
  //       remove: async (_id: string, _from: number, _to: number) => {},
  //     })

  //     const indexer = new TestIndexer(
  //       {
  //         parents: [],
  //         id: INDEXER_ID,
  //         indexerService,
  //         configurations: [
  //           {
  //             id: '1'.repeat(12),
  //             minHeight: 1,
  //             maxHeight: null,
  //             properties: { address: '0x1' },
  //           },
  //         ],
  //         logger: Logger.SILENT,
  //         encode: (v: ConfigurationProperties) => JSON.stringify(v),
  //         decode: (blob: string) => JSON.parse(blob),
  //       },
  //       db,
  //     )

  //     await indexer.start()

  //     const indexerState = await stateRepository.getAll()
  //     const configurations = await configurationsRepository.getAll()

  //     expect(indexerState).toEqual([
  //       {
  //         indexerId: INDEXER_ID,
  //         safeHeight: 0,
  //         minTimestamp: undefined,
  //       },
  //     ])

  //     expect(configurations).toEqual([
  //       {
  //         id: '111111111111',
  //         indexerId: INDEXER_ID,
  //         properties: '{"address":"0x1"}',
  //         currentHeight: 10,
  //         minHeight: 1,
  //         maxHeight: null,
  //       },
  //     ])

  //     const target = 10
  //     let current = 1

  //     while (current !== target) {
  //       current = await indexer.update(current, target)
  //     }

  //     expect(db.add).toHaveBeenCalledWith(['111111111111'], 1)
  //   })
})

class TestIndexer extends MangedMultiIndexer<string> {
  constructor(
    override readonly options: ManagedMultiIndexerOptions<string>,
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
    configurations: UpdateConfiguration<string>[],
  ): Promise<number> {
    await this.db.add(
      configurations.map((c) => c.id),
      from,
    )
    return from + 1
  }
  override async removeData(
    configurations: RemovalConfiguration<string>[],
  ): Promise<void> {
    for (const c of configurations) {
      await this.db.remove(c.id, c.from, c.to)
    }
  }
}

function mock(
  id: string,
  record?: Partial<IndexerConfigurationRecord>,
): IndexerConfigurationRecord {
  return {
    id: id.repeat(12),
    indexerId: INDEXER_ID,
    currentHeight: null,
    minHeight: 1,
    maxHeight: null,
    properties: "{address: 'a'}",
    ...record,
  }
}
