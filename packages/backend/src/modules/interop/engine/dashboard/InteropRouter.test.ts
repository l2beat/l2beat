import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { InteropFeatureConfig } from '../../../../config/Config'
import { createTestApiServer } from '../../../../test/testApiServer'
import type { InteropTransferStream } from '../stream/InteropTransferStream'
import type { InteropSyncersManager } from '../sync/InteropSyncersManager'
import { createInteropRouter } from './InteropRouter'

const config: InteropFeatureConfig = {
  aggregation: false,
  capture: { enabled: false, chains: [] },
  matching: false,
  cleaner: false,
  dashboard: { enabled: true, getExplorerUrl: () => undefined },
  compare: { enabled: false },
  financials: { enabled: false, tokenDbApiUrl: '' },
  config: { enabled: false, chains: [], configIntervalMs: -1 },
  inMemoryEventCap: 0,
}

describe(createInteropRouter.name, () => {
  describe('POST /interop/resync', () => {
    it('applies wildcard to unspecified existing chains', async () => {
      const setResyncRequestedFrom = mockFn().resolvesTo(undefined)
      const interopPluginSyncState = mockObject<
        Database['interopPluginSyncState']
      >({
        setResyncRequestedFrom,
        findByPluginName: mockFn().resolvesTo([
          {
            pluginName: 'plugin',
            chain: 'chain-a',
            lastError: null,
            resyncRequestedFrom: null,
            wipeRequired: false,
          },
          {
            pluginName: 'plugin',
            chain: 'chain-b',
            lastError: null,
            resyncRequestedFrom: null,
            wipeRequired: false,
          },
          {
            pluginName: 'plugin',
            chain: 'chain-c',
            lastError: null,
            resyncRequestedFrom: null,
            wipeRequired: false,
          },
        ]),
      })
      const db = mockObject<Database>({
        interopPluginSyncState,
        transaction: async (cb) => await cb(),
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        getPluginSyncStatuses: mockFn().resolvesTo([]),
      })
      const transferStream = mockObject<InteropTransferStream>({
        subscribe: mockFn().returns(() => {}),
      })

      const router = createInteropRouter(
        db,
        config,
        [],
        syncersManager,
        Logger.SILENT,
        transferStream,
      )
      const api = createTestApiServer([router])

      await api
        .post('/interop/resync')
        .send({
          pluginName: 'plugin',
          resyncRequestedFrom: {
            'chain-a': 1000,
            '*': 2000,
          },
        })
        .expect(200)

      expect(setResyncRequestedFrom).toHaveBeenCalledTimes(3)
      expect(setResyncRequestedFrom).toHaveBeenCalledWith(
        'plugin',
        'chain-a',
        UnixTime(1000),
      )
      expect(setResyncRequestedFrom).toHaveBeenCalledWith(
        'plugin',
        'chain-b',
        UnixTime(2000),
      )
      expect(setResyncRequestedFrom).toHaveBeenCalledWith(
        'plugin',
        'chain-c',
        UnixTime(2000),
      )
    })
  })
})
