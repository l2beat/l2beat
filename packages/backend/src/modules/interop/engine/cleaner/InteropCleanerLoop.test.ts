import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { InteropPlugins } from '../../plugins'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { InteropCleanerLoop } from './InteropCleanerLoop'

describe(InteropCleanerLoop.name, () => {
  describe(InteropCleanerLoop.prototype.run.name, () => {
    it('cleans expired data, orphaned plugin entries, and removed chains', async () => {
      const deleteExpired = vi.fn().mockResolvedValue(5)
      const deleteMessageBefore = vi.fn().mockResolvedValue(10)
      const deleteTransferBefore = vi.fn().mockResolvedValue(15)
      const deletePricesBefore = vi.fn().mockResolvedValue(20)
      const deleteConfigs = vi.fn().mockResolvedValue(7)
      const deleteSyncStateNotIn = vi.fn().mockResolvedValue(2)
      const deleteSyncedRangeNotIn = vi.fn().mockResolvedValue(3)
      const deleteSyncStateNotInChains = vi.fn().mockResolvedValue(4)
      const deleteSyncedRangeNotInChains = vi.fn().mockResolvedValue(6)

      const store = {
        deleteExpired,
      } as unknown as InteropEventStore

      const db = {
        interopMessage: {
          deleteBefore: deleteMessageBefore,
        } as unknown as Database['interopMessage'],
        interopTransfer: {
          deleteBefore: deleteTransferBefore,
        } as unknown as Database['interopTransfer'],
        interopRecentPrices: {
          deleteBefore: deletePricesBefore,
        } as unknown as Database['interopRecentPrices'],
        interopConfig: {
          deleteAllButLatestPerKey: deleteConfigs,
        } as unknown as Database['interopConfig'],
        interopPluginSyncState: {
          deleteNotInPluginNames: deleteSyncStateNotIn,
          deleteNotInChains: deleteSyncStateNotInChains,
        } as unknown as Database['interopPluginSyncState'],
        interopPluginSyncedRange: {
          deleteNotInPluginNames: deleteSyncedRangeNotIn,
          deleteNotInChains: deleteSyncedRangeNotInChains,
        } as unknown as Database['interopPluginSyncedRange'],
      } as unknown as Database

      const plugins: InteropPlugins = {
        comparePlugins: [],
        configPlugins: [],
        eventPlugins: [
          { name: 'plugin-a' },
          { name: 'plugin-b' },
        ] as InteropPlugins['eventPlugins'],
      }

      const KEEP_LATEST = 3
      const KNOWN_CHAINS = ['ethereum', 'arbitrum']

      const cleaner = new InteropCleanerLoop(
        store,
        db,
        plugins,
        KNOWN_CHAINS,
        Logger.SILENT,
        undefined,
        KEEP_LATEST,
      )

      await cleaner.run()

      expect(deleteExpired).toHaveBeenCalledTimes(1)
      expect(deleteMessageBefore).toHaveBeenCalledTimes(1)
      expect(deleteTransferBefore).toHaveBeenCalledTimes(1)
      expect(deletePricesBefore).toHaveBeenCalledTimes(1)

      const messageCutoff = deleteMessageBefore.mock.calls[0][0] as number
      const transferCutoff = deleteTransferBefore.mock.calls[0][0] as number
      expect(messageCutoff - transferCutoff).toBe(6 * UnixTime.DAY)
      expect(deleteConfigs).toHaveBeenCalledWith(KEEP_LATEST)
      expect(deleteSyncStateNotIn).toHaveBeenCalledWith([
        'plugin-a',
        'plugin-b',
      ])
      expect(deleteSyncedRangeNotIn).toHaveBeenCalledWith([
        'plugin-a',
        'plugin-b',
      ])
      expect(deleteSyncStateNotInChains).toHaveBeenCalledWith(KNOWN_CHAINS)
      expect(deleteSyncedRangeNotInChains).toHaveBeenCalledWith(KNOWN_CHAINS)
    })

    it('passes empty lists to deleters when no plugins and no known chains', async () => {
      const deleteSyncStateNotIn = vi.fn().mockResolvedValue(0)
      const deleteSyncedRangeNotIn = vi.fn().mockResolvedValue(0)
      const deleteSyncStateNotInChains = vi.fn().mockResolvedValue(0)
      const deleteSyncedRangeNotInChains = vi.fn().mockResolvedValue(0)

      const store = {
        deleteExpired: vi.fn().mockResolvedValue(0),
      } as unknown as InteropEventStore

      const deleteConfigs = vi.fn().mockResolvedValue(0)
      const db = {
        interopMessage: {
          deleteBefore: vi.fn().mockResolvedValue(0),
        } as unknown as Database['interopMessage'],
        interopTransfer: {
          deleteBefore: vi.fn().mockResolvedValue(0),
        } as unknown as Database['interopTransfer'],
        interopRecentPrices: {
          deleteBefore: vi.fn().mockResolvedValue(0),
        } as unknown as Database['interopRecentPrices'],
        interopConfig: {
          deleteAllButLatestPerKey: deleteConfigs,
        } as unknown as Database['interopConfig'],
        interopPluginSyncState: {
          deleteNotInPluginNames: deleteSyncStateNotIn,
          deleteNotInChains: deleteSyncStateNotInChains,
        } as unknown as Database['interopPluginSyncState'],
        interopPluginSyncedRange: {
          deleteNotInPluginNames: deleteSyncedRangeNotIn,
          deleteNotInChains: deleteSyncedRangeNotInChains,
        } as unknown as Database['interopPluginSyncedRange'],
      } as unknown as Database

      const plugins: InteropPlugins = {
        comparePlugins: [],
        configPlugins: [],
        eventPlugins: [],
      }

      const cleaner = new InteropCleanerLoop(
        store,
        db,
        plugins,
        [],
        Logger.SILENT,
      )

      await cleaner.run()

      expect(deleteSyncStateNotIn).toHaveBeenCalledWith([])
      expect(deleteSyncedRangeNotIn).toHaveBeenCalledWith([])
      expect(deleteSyncStateNotInChains).toHaveBeenCalledWith([])
      expect(deleteSyncedRangeNotInChains).toHaveBeenCalledWith([])
    })
  })
})
