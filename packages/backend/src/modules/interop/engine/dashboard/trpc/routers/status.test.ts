import type { Database } from '@l2beat/database'
import { describe, expect, it, vi } from 'vitest'
import { INDEXER_NAMES } from '../../../../../../tools/uif/indexerIdentity'
import { createCallerFactory } from '../../../../../../trpc/init'
import { createStatusRouter } from './status'

describe(createStatusRouter.name, () => {
  it('returns plugin sync statuses and serializes toBlock', async () => {
    const caller = createCaller({
      getPluginSyncStatuses: async () => [
        {
          pluginName: 'plugin',
          chain: 'ethereum',
          chainStatus: 'active' as const,
          syncMode: 'following-idle',
          toBlock: 123n,
          toTimestamp: 456,
          lastError: 'boom',
          resyncRequestedFrom: 111,
          blocksAggregation: true,
        },
      ],
    })

    const result = await caller.pluginSyncStatuses()

    expect(result).toStrictEqual([
      {
        pluginName: 'plugin',
        chain: 'ethereum',
        chainStatus: 'active',
        syncMode: 'following-idle',
        toBlock: '123',
        toTimestamp: 456,
        lastError: 'boom',
        resyncRequestedFrom: 111,
        blocksAggregation: true,
      },
    ])
  })

  it('returns the persisted Relay checkpoint', async () => {
    const findByIndexerId = vi.fn().mockResolvedValue({
      indexerId: INDEXER_NAMES.INTEROP_RELAY,
      safeHeight: 1_700_000_000,
    })
    const caller = createCaller(undefined, {
      indexerState: { findByIndexerId } as unknown as Database['indexerState'],
    })

    const result = await caller.relay()

    expect(findByIndexerId).toHaveBeenCalledExactlyOnceWith(
      INDEXER_NAMES.INTEROP_RELAY,
    )
    expect(result).toStrictEqual({ syncedTo: 1_700_000_000 })
  })

  it('returns no Relay checkpoint before the indexer initializes', async () => {
    const caller = createCaller(undefined, {
      indexerState: {
        findByIndexerId: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['indexerState'],
    })

    const result = await caller.relay()

    expect(result).toStrictEqual({ syncedTo: undefined })
  })

  it('applies wildcard resync values to unspecified chains', async () => {
    const setResyncRequestedFrom = vi.fn().mockResolvedValue(undefined)
    const caller = createCaller(
      {
        getChainsForPlugin: () => ['ethereum', 'arbitrum'],
      },
      {
        interopPluginSyncState: {
          setResyncRequestedFrom,
        } as unknown as Database['interopPluginSyncState'],
        transaction: async (cb) => await cb(),
      },
    )

    const result = await caller.resync({
      pluginName: 'plugin',
      resyncRequestedFrom: {
        ethereum: 1_000,
        '*': 2_000,
      },
    })

    expect(setResyncRequestedFrom).toHaveBeenCalledTimes(2)
    expect(setResyncRequestedFrom).toHaveBeenCalledWith(
      'plugin',
      'ethereum',
      1_000,
    )
    expect(setResyncRequestedFrom).toHaveBeenCalledWith(
      'plugin',
      'arbitrum',
      2_000,
    )
    expect(result).toStrictEqual({ updatedChains: ['ethereum', 'arbitrum'] })
  })

  it('marks all plugin chains for wipe on restart from now', async () => {
    const upsert = vi.fn().mockResolvedValue(undefined)
    const caller = createCaller(
      {
        getChainsForPlugin: () => ['ethereum', 'arbitrum'],
      },
      {
        interopPluginSyncState: {
          upsert,
        } as unknown as Database['interopPluginSyncState'],
        transaction: async (cb) => await cb(),
      },
    )

    const result = await caller.restartFromNow({
      pluginName: 'plugin',
    })

    expect(upsert).toHaveBeenCalledTimes(2)
    expect(upsert).toHaveBeenCalledWith({
      pluginName: 'plugin',
      chain: 'ethereum',
      lastError: null,
      resyncRequestedFrom: null,
      wipeRequired: true,
    })
    expect(upsert).toHaveBeenCalledWith({
      pluginName: 'plugin',
      chain: 'arbitrum',
      lastError: null,
      resyncRequestedFrom: null,
      wipeRequired: true,
    })
    expect(result).toStrictEqual({ updatedChains: ['ethereum', 'arbitrum'] })
  })

  it('returns processor statuses', async () => {
    const statuses = [
      {
        chain: 'ethereum',
        block: 123,
        timestamp: 1_700_000_000,
      },
      {
        chain: 'arbitrum',
        block: 456,
        timestamp: 1_700_000_123,
      },
    ]

    const caller = createCaller({
      getProcessorStatuses: () => statuses,
    })

    const result = await caller.processors()

    expect(result).toStrictEqual(statuses)
  })
})

function createCaller(
  deps?: Partial<Parameters<typeof createStatusRouter>[0]>,
  db?: Partial<Database>,
) {
  const callerFactory = createCallerFactory(
    createStatusRouter({
      getChainsForPlugin: () => [],
      getPluginSyncStatuses: async () => [],
      getProcessorStatuses: () => [],
      ...deps,
    }),
  )

  return callerFactory({
    headers: new Headers(),
    db: (db ?? {}) as unknown as Database,
    session: { email: 'user@example.com' },
  })
}
