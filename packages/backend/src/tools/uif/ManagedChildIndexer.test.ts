import { Logger } from '@l2beat/backend-tools'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { IndexerService } from './IndexerService'
import { _TEST_ONLY_resetUniqueIds } from './ids'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from './ManagedChildIndexer'

describe(ManagedChildIndexer.name, () => {
  afterEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe('constructor', () => {
    it('constructor throws on duplicate indexer ids', () => {
      const common = {
        parents: [],
        indexerService: {} as unknown as IndexerService,
        minHeight: 0,
      }
      new TestIndexer({ ...common, name: 'a' }, Logger.SILENT)
      expect(() => {
        new TestIndexer({ ...common, name: 'a' }, Logger.SILENT)
      }).toThrow('Indexer id a is duplicated!')
    })
  })

  describe(ManagedChildIndexer.prototype.initialize.name, () => {
    it('returns safe height', async () => {
      const indexerService = {
        getIndexerState: vi.fn(async () => ({
          indexerId: 'indexer',
          safeHeight: 1,
        })),
      } as unknown as IndexerService

      const indexer = new TestIndexer(
        {
          parents: [],
          name: 'indexer',
          minHeight: 0,
          indexerService,
        },
        Logger.SILENT,
      )

      const result = await indexer.initialize()

      expect(result).toEqual({ safeHeight: 1, configHash: undefined })
    })

    it('returns minHeight - 1 if safeHeight not defined', async () => {
      const indexerService = {
        getIndexerState: vi.fn(async () => undefined),
      } as unknown as IndexerService

      const indexer = new TestIndexer(
        {
          parents: [],
          name: 'indexer',
          minHeight: 100,
          indexerService,
        },
        Logger.SILENT,
      )

      const result = await indexer.initialize()

      expect(result).toEqual({ safeHeight: 99, configHash: undefined })
    })

    it('invalidates on config change', async () => {
      const indexerService = {
        getIndexerState: vi.fn(async () => ({
          indexerId: 'indexer',
          safeHeight: 111,
          configHash: 'old-hash',
        })),
      } as unknown as IndexerService

      const minHeight = 100
      const indexer = new TestIndexer(
        {
          parents: [],
          name: 'indexer',
          minHeight: minHeight,
          configHash: 'new-hash',
          indexerService,
        },
        Logger.SILENT,
      )

      const result = await indexer.initialize()

      expect(result).toEqual({
        safeHeight: minHeight - 1,
        configHash: 'new-hash',
      })
    })
  })

  it(ManagedChildIndexer.prototype.setSafeHeight.name, async () => {
    const indexerService = {
      setSafeHeight: vi.fn(async () => {}),
    } as unknown as IndexerService

    const indexer = new TestIndexer(
      {
        parents: [],
        name: 'indexer',
        minHeight: 0,
        indexerService,
      },
      Logger.SILENT,
    )

    await indexer.setSafeHeight(1)

    expect(indexerService.setSafeHeight).toHaveBeenCalledExactlyOnceWith(
      'indexer',
      1,
    )
  })
})

class TestIndexer extends ManagedChildIndexer {
  override readonly options: ManagedChildIndexerOptions

  constructor(options: ManagedChildIndexerOptions, logger: Logger) {
    super(options, logger)
    this.options = options
  }

  override update(_from: number, to: number): Promise<number> {
    return Promise.resolve(to)
  }

  override invalidate(targetHeight: number): Promise<number> {
    return Promise.resolve(targetHeight)
  }
}
