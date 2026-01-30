import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { InteropPlugins } from '../../plugins'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { InteropCleanerLoop } from './InteropCleanerLoop'

describe(InteropCleanerLoop.name, () => {
  describe(InteropCleanerLoop.prototype.run.name, () => {
    it('cleans expired data and orphaned plugin entries', async () => {
      const now = UnixTime.now()

      const deleteExpired = mockFn().resolvesTo(5)
      const deleteMessageBefore = mockFn().resolvesTo(10)
      const deleteTransferBefore = mockFn().resolvesTo(15)
      const deletePricesBefore = mockFn().resolvesTo(20)
      const deleteSyncStateNotIn = mockFn().resolvesTo(2)
      const deleteSyncedRangeNotIn = mockFn().resolvesTo(3)

      const store = mockObject<InteropEventStore>({
        deleteExpired,
      })

      const db = mockObject<Database>({
        interopMessage: mockObject<Database['interopMessage']>({
          deleteBefore: deleteMessageBefore,
        }),
        interopTransfer: mockObject<Database['interopTransfer']>({
          deleteBefore: deleteTransferBefore,
        }),
        interopRecentPrices: mockObject<Database['interopRecentPrices']>({
          deleteBefore: deletePricesBefore,
        }),
        interopPluginSyncState: mockObject<Database['interopPluginSyncState']>({
          deleteNotInPluginNames: deleteSyncStateNotIn,
        }),
        interopPluginSyncedRange: mockObject<
          Database['interopPluginSyncedRange']
        >({
          deleteNotInPluginNames: deleteSyncedRangeNotIn,
        }),
      })

      const plugins: InteropPlugins = {
        comparePlugins: [],
        configPlugins: [],
        eventPlugins: [{ name: 'plugin-a' }, { name: 'plugin-b' }] as InteropPlugins['eventPlugins'],
      }

      const cleaner = new InteropCleanerLoop(
        store,
        db,
        plugins,
        Logger.SILENT,
      )

      await cleaner.run()

      expect(deleteExpired).toHaveBeenCalledTimes(1)
      expect(deleteMessageBefore).toHaveBeenCalledTimes(1)
      expect(deleteTransferBefore).toHaveBeenCalledTimes(1)
      expect(deletePricesBefore).toHaveBeenCalledTimes(1)
      expect(deleteSyncStateNotIn).toHaveBeenCalledWith(['plugin-a', 'plugin-b'])
      expect(deleteSyncedRangeNotIn).toHaveBeenCalledWith(['plugin-a', 'plugin-b'])
    })

    it('passes empty list to deleteNotInPluginNames when no plugins', async () => {
      const deleteSyncStateNotIn = mockFn().resolvesTo(0)
      const deleteSyncedRangeNotIn = mockFn().resolvesTo(0)

      const store = mockObject<InteropEventStore>({
        deleteExpired: mockFn().resolvesTo(0),
      })

      const db = mockObject<Database>({
        interopMessage: mockObject<Database['interopMessage']>({
          deleteBefore: mockFn().resolvesTo(0),
        }),
        interopTransfer: mockObject<Database['interopTransfer']>({
          deleteBefore: mockFn().resolvesTo(0),
        }),
        interopRecentPrices: mockObject<Database['interopRecentPrices']>({
          deleteBefore: mockFn().resolvesTo(0),
        }),
        interopPluginSyncState: mockObject<Database['interopPluginSyncState']>({
          deleteNotInPluginNames: deleteSyncStateNotIn,
        }),
        interopPluginSyncedRange: mockObject<
          Database['interopPluginSyncedRange']
        >({
          deleteNotInPluginNames: deleteSyncedRangeNotIn,
        }),
      })

      const plugins: InteropPlugins = {
        comparePlugins: [],
        configPlugins: [],
        eventPlugins: [],
      }

      const cleaner = new InteropCleanerLoop(store, db, plugins, Logger.SILENT)

      await cleaner.run()

      expect(deleteSyncStateNotIn).toHaveBeenCalledWith([])
      expect(deleteSyncedRangeNotIn).toHaveBeenCalledWith([])
    })
  })
})
