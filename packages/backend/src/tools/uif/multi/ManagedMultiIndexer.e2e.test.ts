import { Logger } from '@l2beat/backend-tools'
import { RemovalConfiguration, UpdateConfiguration } from '@l2beat/uif'
import { expect, mockObject } from 'earl'

import { describeDatabase } from '../../../test/database'
import { _TEST_ONLY_resetUniqueIds } from '../ids'
import {
  IndexerConfigurationRecord,
  IndexerConfigurationRepository,
} from '../IndexerConfigurationRepository'
import { IndexerService } from '../IndexerService'
import { IndexerStateRepository } from '../IndexerStateRepository'
import {
  ManagedMultiIndexer,
  ManagedMultiIndexerOptions,
} from './ManagedMultiIndexer'

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
    const UNCHANGED = mock('a')
    const MIN_HEIGHT_CHANGE = mock('b', { minHeight: 100, currentHeight: 200 })
    const MAX_HEIGHT_CHANGE = mock('c', {
      minHeight: 100,
      currentHeight: 200,
      maxHeight: null,
    })

    const PROPERTIES_CHANGE = mock('d')
    const REMOVED = mock('e', { currentHeight: 100 })

    await configurationsRepository.addOrUpdateManyConfigurations([
      UNCHANGED,
      MIN_HEIGHT_CHANGE,
      MAX_HEIGHT_CHANGE,
      PROPERTIES_CHANGE,
      REMOVED,
    ])

    const ADDED = mock('f')
    const db = mockObject({
      add: async () => {},
      remove: async (_id: string, _from: number, _to: number) => {},
    })
    const indexer = new TestIndexer(
      {
        parents: [],
        id: INDEXER_ID,
        indexerService,
        configurations: [
          UNCHANGED,
          { ...MIN_HEIGHT_CHANGE, minHeight: 50 },
          { ...MAX_HEIGHT_CHANGE, maxHeight: 150 },
          { ...PROPERTIES_CHANGE, properties: 'different-properties' },
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
    expect(safeHeight).toEqual(undefined)

    const indexerState = await stateRepository.findIndexerState(INDEXER_ID)
    const configurations = await configurationsRepository.getAll()

    expect(indexerState).toEqual({
      indexerId: INDEXER_ID,
      safeHeight: 0,
      minTimestamp: undefined,
    })

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
      REMOVED.currentHeight!,
    )

    expect(db.remove).toHaveBeenCalledWith(
      MIN_HEIGHT_CHANGE.id,
      MIN_HEIGHT_CHANGE.minHeight,
      MIN_HEIGHT_CHANGE.currentHeight!,
    )

    expect(db.remove).toHaveBeenCalledWith(
      MAX_HEIGHT_CHANGE.id,
      151,
      MAX_HEIGHT_CHANGE.currentHeight!,
    )
    expect(db.remove).toHaveBeenCalledTimes(3)
  })

  it('update', async () => {
    const stateRepository = new IndexerStateRepository(database, Logger.SILENT)
    const configurationsRepository = new IndexerConfigurationRepository(
      database,
      Logger.SILENT,
    )

    const A = mock('a', { minHeight: 100, maxHeight: 300 })
    const B = mock('b', { minHeight: 200, maxHeight: 500 })
    const C = mock('c', { minHeight: 400, maxHeight: 550 })
    const D = mock('d', { minHeight: 100, maxHeight: null, currentHeight: 550 })
    await configurationsRepository.addOrUpdateManyConfigurations([D])

    const indexerService = new IndexerService(
      stateRepository,
      configurationsRepository,
    )

    const db = mockObject({
      add: async (_ids: string[], _from: number, _to: number) => {},
      remove: async (_id: string, _from: number, _to: number) => {},
    })

    const indexer = new TestIndexer(
      {
        parents: [],
        id: INDEXER_ID,
        indexerService,
        configurations: [A, B, C, D],
        logger: Logger.SILENT,
        encode: (v: string) => v,
        decode: (blob: string) => blob,
      },
      db,
    )

    await indexer.start()

    const target = 600
    let current = 99

    // This "+1" logic mimics Indexer.executeUpdate
    while (current + 1 < target) {
      current = await indexer.update(current + 1, target)
    }

    // 100 - 199 A
    // 200 - 300 AB
    // 301 - 399 B
    // 400 - 500 BC
    // 501 - 550 C
    // 551 - inf CD
    expect(db.add).toHaveBeenNthCalledWith(1, [A.id], 100, 199)
    expect(db.add).toHaveBeenNthCalledWith(2, [A.id, B.id], 200, 300)
    expect(db.add).toHaveBeenNthCalledWith(3, [B.id], 301, 399)
    expect(db.add).toHaveBeenNthCalledWith(4, [B.id, C.id], 400, 500)
    expect(db.add).toHaveBeenNthCalledWith(5, [C.id, D.id], 501, 550)
    expect(db.add).toHaveBeenLastCalledWith([D.id], 551, 600)
    // expect(db.add).toHaveBeenLastCalledWith([C.id, D.id], 551, 600)

    const configurations = await configurationsRepository.getAll()

    expect(configurations).toEqualUnsorted([
      { ...A, currentHeight: A.maxHeight },
      { ...B, currentHeight: B.maxHeight },
      { ...C, currentHeight: 550 },
      { ...D, currentHeight: target },
    ])
  })
})

class TestIndexer extends ManagedMultiIndexer<string> {
  constructor(
    override readonly options: ManagedMultiIndexerOptions<string>,
    private readonly db: {
      add: (ids: string[], from: number, to: number) => Promise<void>
      remove: (id: string, from: number, to: number) => Promise<void>
    },
  ) {
    super(options)
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: UpdateConfiguration<string>[],
  ): Promise<number> {
    await this.db.add(
      configurations.map((c) => c.id),
      from,
      to,
    )
    return to
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
