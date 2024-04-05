import { Logger } from '@l2beat/backend-tools'
import { RemovalConfiguration, UpdateConfiguration } from '@l2beat/uif'
import { expect, mockObject } from 'earl'

import { IndexerService } from './IndexerService'
import {
  ManagedMultiIndexerOptions,
  MangedMultiIndexer,
} from './ManagedMultiIndexer'

describe(MangedMultiIndexer.name, () => {
  it(MangedMultiIndexer.prototype.getSafeHeight.name, async () => {
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

  it(MangedMultiIndexer.prototype.setSafeHeight.name, async () => {
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

  it(MangedMultiIndexer.prototype.multiInitialize.name, async () => {
    throw new Error('not implemented')
  })

  it(MangedMultiIndexer.prototype.saveConfigurations.name, async () => {
    throw new Error('not implemented')
  })
})

class TestIndexer extends MangedMultiIndexer<string> {
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
