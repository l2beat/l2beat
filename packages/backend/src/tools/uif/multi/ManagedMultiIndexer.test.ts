import { Logger } from '@l2beat/backend-tools'
import {
  RemovalConfiguration,
  SavedConfiguration,
  UpdateConfiguration,
} from '@l2beat/uif'
import { expect, mockFn, mockObject } from 'earl'

import { _TEST_ONLY_resetUniqueIds } from '../ids'
import { IndexerService } from '../IndexerService'
import {
  ManagedMultiIndexer,
  ManagedMultiIndexerOptions,
} from './ManagedMultiIndexer'

describe(ManagedMultiIndexer.name, () => {
  afterEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe('constructor', () => {
    it('constructor throws on duplicate indexer ids', () => {
      const common = {
        parents: [],
        configurations: [],
        indexerService: mockObject<IndexerService>(),
        logger: Logger.SILENT,
        encode: (v: string) => v,
        decode: (blob: string) => blob,
      }
      new TestIndexer({ ...common, id: 'a' })
      expect(() => {
        new TestIndexer({ ...common, id: 'a' })
      }).toThrow('Indexer id a is duplicated!')
    })

    it('constructor throws on duplicate configuration ids', () => {
      const common = {
        parents: [],
        indexerService: mockObject<IndexerService>(),
        logger: Logger.SILENT,
        encode: (v: string) => v,
        decode: (blob: string) => blob,
      }
      new TestIndexer({
        ...common,
        id: 'a',
        configurations: [mock({ id: 'a' }), mock({ id: 'b' })],
      })
      expect(() => {
        new TestIndexer({
          ...common,
          id: 'b',
          configurations: [mock({ id: 'a' })],
        })
      }).toThrow('Configuration id a is duplicated!')
    })
  })

  it(ManagedMultiIndexer.prototype.getSafeHeight.name, async () => {
    const indexerService = mockObject<IndexerService>({
      getSafeHeight: async () => 1,
    })

    const indexer = new TestIndexer({
      parents: [],
      id: 'indexer',
      indexerService,
      configurations: [],
      logger: Logger.SILENT,
      encode: (v: string) => v,
      decode: (blob: string) => blob,
    })

    const result = await indexer.getSafeHeight()

    expect(result).toEqual(1)
    expect(indexerService.getSafeHeight).toHaveBeenOnlyCalledWith('indexer')
  })

  it(ManagedMultiIndexer.prototype.setSafeHeight.name, async () => {
    const indexerService = mockObject<IndexerService>({
      setSafeHeight: async () => {},
    })

    const indexer = new TestIndexer({
      parents: [],
      id: 'indexer',
      indexerService,
      configurations: [],
      logger: Logger.SILENT,
      encode: (v: string) => v,
      decode: (blob: string) => blob,
    })

    await indexer.setSafeHeight(1)

    expect(indexerService.setSafeHeight).toHaveBeenOnlyCalledWith('indexer', 1)
  })

  it(ManagedMultiIndexer.prototype.multiInitialize.name, async () => {
    const configurations = [mock<string>({ id: 'a' })]
    const indexerService = mockObject<IndexerService>({
      getSavedConfigurations: mockFn().resolvesTo(configurations),
    })

    const decode = (blob: string) => blob
    const indexer = new TestIndexer({
      parents: [],
      id: 'indexer',
      indexerService,
      configurations: [],
      logger: Logger.SILENT,
      encode: (v: string) => v,
      decode,
    })

    const result = await indexer.multiInitialize()

    expect(result).toEqual(configurations)
    expect(indexerService.getSavedConfigurations).toHaveBeenOnlyCalledWith(
      'indexer',
      decode,
    )
  })

  it(ManagedMultiIndexer.prototype.saveConfigurations.name, async () => {
    const configurations = [mock<string>({ id: 'a', currentHeight: null })]
    const indexerService = mockObject<IndexerService>({
      upsertConfigurations: async () => {},
      updateSavedConfigurations: async () => {},
      persistOnlyUsedConfigurations: async () => {},
    })

    const encode = (v: unknown) => v as string
    const indexer = new TestIndexer({
      parents: [],
      id: 'indexer',
      indexerService,
      configurations: [],
      logger: Logger.SILENT,
      encode,
      decode: (blob: string) => blob,
    })

    await indexer.saveConfigurations(configurations)

    expect(indexerService.upsertConfigurations).toHaveBeenOnlyCalledWith(
      'indexer',
      configurations,
      encode,
    )
    expect(
      indexerService.persistOnlyUsedConfigurations,
    ).toHaveBeenOnlyCalledWith(
      'indexer',
      configurations.map((c) => c.id),
    )

    await indexer.saveConfigurations(
      configurations.map((c) => ({ ...c, currentHeight: 1 })),
    )
    await indexer.saveConfigurations(
      configurations.map((c) => ({ ...c, currentHeight: 2 })),
    )

    expect(indexerService.updateSavedConfigurations).toHaveBeenNthCalledWith(
      1,
      'indexer',
      configurations.map((c) => c.id),
      1,
    )

    expect(indexerService.updateSavedConfigurations).toHaveBeenLastCalledWith(
      'indexer',
      configurations.map((c) => c.id),
      2,
    )
  })
})

class TestIndexer extends ManagedMultiIndexer<string> {
  override multiUpdate(
    _from: number,
    to: number,
    _configurations: UpdateConfiguration<string>[],
  ): Promise<number> {
    return Promise.resolve(to)
  }
  override removeData(
    _configurations: RemovalConfiguration<string>[],
  ): Promise<void> {
    return Promise.resolve()
  }
  constructor(override readonly options: ManagedMultiIndexerOptions<string>) {
    super(options)
  }
}

function mock<T>(
  record: Partial<SavedConfiguration<T>>,
): SavedConfiguration<T> {
  return {
    id: 'id',
    currentHeight: null,
    minHeight: 0,
    maxHeight: null,
    properties: 'properties' as T,
    ...record,
  }
}
