import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../test/database'
import { BridgeComparator } from './BridgeComparator'

describe(BridgeComparator.name, () => {
  describe(BridgeComparator.prototype.runCompare.name, () => {
    it('skips execution when already running (prevents concurrent runs)', async () => {
      const plugin = {
        name: 'plugin',
        type: 'message' as const,
        getExternalItems: mockFn().resolvesTo([]),
      }

      const comparator = new BridgeComparator(
        mockObject<Database>(),
        [plugin],
        Logger.SILENT,
      )

      await Promise.all([comparator.runCompare(), comparator.runCompare()])

      expect(plugin.getExternalItems).toHaveBeenCalledTimes(1)
    })
  })

  describe(BridgeComparator.prototype.fetchExternalItems.name, () => {
    it('fetches items from all plugins successfully, handles errors', async () => {
      const plugins = [
        {
          name: 'plugin1',
          type: 'message' as const,
          getExternalItems: mockFn().resolvesToOnce([]),
        },
        {
          name: 'plugin2',
          type: 'message' as const,
          getExternalItems: mockFn().throwsOnce(new Error('Plugin2 failed')),
        },
      ]

      const comparator = new BridgeComparator(
        mockDatabase(),
        plugins,
        Logger.SILENT,
      )

      await comparator.fetchExternalItems()

      plugins.forEach((plugin) => {
        expect(plugin.getExternalItems).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe(BridgeComparator.prototype.runCompare.name, () => {})
})
