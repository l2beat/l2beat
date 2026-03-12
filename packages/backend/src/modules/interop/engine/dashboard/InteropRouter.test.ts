import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { InteropFeatureConfig } from '../../../../config/Config'
import { createTestApiServer } from '../../../../test/testApiServer'
import type { InteropSyncersManager } from '../sync/InteropSyncersManager'
import { createInteropRouter } from './InteropRouter'

function makeConfig(dangerousOperationsEnabled = false): InteropFeatureConfig {
  return {
    aggregation: false,
    capture: { enabled: false, chains: [] },
    matching: false,
    cleaner: false,
    dangerousOperationsEnabled,
    dashboard: { enabled: true, getExplorerUrl: () => undefined },
    compare: { enabled: false },
    financials: { enabled: false, tokenDbApiUrl: '' },
    config: { enabled: false, chains: [], configIntervalMs: -1 },
    inMemoryEventCap: 0,
    notifications: false,
  }
}

describe(createInteropRouter.name, () => {
  describe('GET /interop/status', () => {
    it('hides dangerous controls when dangerous operations are disabled', async () => {
      const db = mockObject<Database>({})
      const syncersManager = mockObject<InteropSyncersManager>({
        getPluginSyncStatuses: mockFn().resolvesTo([
          {
            pluginName: 'plugin',
            chain: 'ethereum',
            syncMode: 'following-idle',
          },
        ]),
      })

      const router = createInteropRouter(
        db,
        makeConfig(false),
        [],
        syncersManager,
        Logger.SILENT,
      )
      const api = createTestApiServer([router])

      const response = await api.get('/interop/status?showResync=1').expect(200)

      expect(response.text.includes('interop-resync-button')).toEqual(false)
      expect(response.text.includes('interop-restart-from-now-button')).toEqual(
        false,
      )
    })

    it('shows dangerous controls when dangerous operations are enabled', async () => {
      const db = mockObject<Database>({})
      const syncersManager = mockObject<InteropSyncersManager>({
        getPluginSyncStatuses: mockFn().resolvesTo([
          {
            pluginName: 'plugin',
            chain: 'ethereum',
            syncMode: 'following-idle',
          },
        ]),
      })

      const router = createInteropRouter(
        db,
        makeConfig(true),
        [],
        syncersManager,
        Logger.SILENT,
      )
      const api = createTestApiServer([router])

      const response = await api.get('/interop/status?showResync=1').expect(200)

      expect(response.text.includes('interop-resync-button')).toEqual(true)
      expect(response.text.includes('interop-restart-from-now-button')).toEqual(
        true,
      )
    })
  })

  describe('POST /interop/refresh-financials', () => {
    it('marks all transfers as unprocessed', async () => {
      const markAllAsUnprocessed = mockFn().resolvesTo(42)
      const interopTransfer = mockObject<Database['interopTransfer']>({
        markAllAsUnprocessed,
      })
      const db = mockObject<Database>({
        interopTransfer,
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        getPluginSyncStatuses: mockFn().resolvesTo([]),
      })

      const router = createInteropRouter(
        db,
        makeConfig(),
        [],
        syncersManager,
        Logger.SILENT,
      )
      const api = createTestApiServer([router])

      const response = await api.post('/interop/refresh-financials').expect(200)

      expect(markAllAsUnprocessed).toHaveBeenCalledTimes(1)
      expect(response.body).toEqual({ updatedTransfers: 42 })
    })
  })

  describe('POST /interop/resync', () => {
    it('fails when dangerous operations are disabled', async () => {
      const setResyncRequestedFrom = mockFn().resolvesTo(undefined)
      const interopPluginSyncState = mockObject<
        Database['interopPluginSyncState']
      >({
        setResyncRequestedFrom,
      })
      const db = mockObject<Database>({
        interopPluginSyncState,
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        getPluginSyncStatuses: mockFn().resolvesTo([]),
      })

      const router = createInteropRouter(
        db,
        makeConfig(false),
        [],
        syncersManager,
        Logger.SILENT,
      )
      const api = createTestApiServer([router])

      const response = await api
        .post('/interop/resync')
        .send({
          pluginName: 'plugin',
          resyncRequestedFrom: { '*': 2000 },
        })
        .expect(403)

      expect(response.body).toEqual({
        error: 'Interop resync and restart operations are disabled',
      })
      expect(setResyncRequestedFrom).toHaveBeenCalledTimes(0)
    })

    it('applies wildcard to unspecified existing chains', async () => {
      const setResyncRequestedFrom = mockFn().resolvesTo(undefined)
      const interopPluginSyncState = mockObject<
        Database['interopPluginSyncState']
      >({
        setResyncRequestedFrom,
      })
      const db = mockObject<Database>({
        interopPluginSyncState,
        transaction: async (cb) => await cb(),
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        getPluginSyncStatuses: mockFn().resolvesTo([]),
        getChainsForPlugin: mockFn().returns(['chain-a', 'chain-b', 'chain-c']),
      })

      const router = createInteropRouter(
        db,
        makeConfig(true),
        [],
        syncersManager,
        Logger.SILENT,
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

  describe('POST /interop/restart-from-now', () => {
    it('fails when dangerous operations are disabled', async () => {
      const upsert = mockFn().resolvesTo(undefined)
      const interopPluginSyncState = mockObject<
        Database['interopPluginSyncState']
      >({
        upsert,
      })
      const db = mockObject<Database>({
        interopPluginSyncState,
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        getPluginSyncStatuses: mockFn().resolvesTo([]),
      })

      const router = createInteropRouter(
        db,
        makeConfig(false),
        [],
        syncersManager,
        Logger.SILENT,
      )
      const api = createTestApiServer([router])

      const response = await api
        .post('/interop/restart-from-now')
        .send({ pluginName: 'plugin' })
        .expect(403)

      expect(response.body).toEqual({
        error: 'Interop resync and restart operations are disabled',
      })
      expect(upsert).toHaveBeenCalledTimes(0)
    })

    it('marks plugin chains for wipe when dangerous operations are enabled', async () => {
      const upsert = mockFn().resolvesTo(undefined)
      const interopPluginSyncState = mockObject<
        Database['interopPluginSyncState']
      >({
        upsert,
      })
      const db = mockObject<Database>({
        interopPluginSyncState,
        transaction: async (cb) => await cb(),
      })
      const syncersManager = mockObject<InteropSyncersManager>({
        getPluginSyncStatuses: mockFn().resolvesTo([]),
        getChainsForPlugin: mockFn().returns(['chain-a', 'chain-b']),
      })

      const router = createInteropRouter(
        db,
        makeConfig(true),
        [],
        syncersManager,
        Logger.SILENT,
      )
      const api = createTestApiServer([router])

      const response = await api
        .post('/interop/restart-from-now')
        .send({ pluginName: 'plugin' })
        .expect(200)

      expect(upsert).toHaveBeenCalledTimes(2)
      expect(upsert).toHaveBeenCalledWith({
        pluginName: 'plugin',
        chain: 'chain-a',
        lastError: null,
        resyncRequestedFrom: null,
        wipeRequired: true,
      })
      expect(upsert).toHaveBeenCalledWith({
        pluginName: 'plugin',
        chain: 'chain-b',
        lastError: null,
        resyncRequestedFrom: null,
        wipeRequired: true,
      })
      expect(response.body).toEqual({ updatedChains: ['chain-a', 'chain-b'] })
    })
  })
})
