import type { Database } from '@l2beat/database'
import { expect, mockFn, mockObject } from 'earl'
import { createCallerFactory } from '../trpc'
import { createStatusRouter } from './status'

describe(createStatusRouter.name, () => {
  it('returns plugin sync statuses and serializes toBlock', async () => {
    const caller = createCaller({
      getPluginSyncStatuses: async () => [
        {
          pluginName: 'plugin',
          chain: 'ethereum',
          syncMode: 'following-idle',
          toBlock: 123n,
          toTimestamp: 456,
          lastError: 'boom',
          resyncRequestedFrom: 111,
        },
      ],
    })

    const result = await caller.pluginSyncStatuses()

    expect(result).toEqual([
      {
        pluginName: 'plugin',
        chain: 'ethereum',
        syncMode: 'following-idle',
        toBlock: '123',
        toTimestamp: 456,
        lastError: 'boom',
        resyncRequestedFrom: 111,
      },
    ])
  })

  it('applies wildcard resync values to unspecified chains', async () => {
    const setResyncRequestedFrom = mockFn().resolvesTo(undefined)
    const caller = createCaller(
      {
        getChainsForPlugin: () => ['ethereum', 'arbitrum'],
      },
      {
        interopPluginSyncState: mockObject<Database['interopPluginSyncState']>({
          setResyncRequestedFrom,
        }),
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
    expect(result).toEqual({ updatedChains: ['ethereum', 'arbitrum'] })
  })

  it('marks all plugin chains for wipe on restart from now', async () => {
    const upsert = mockFn().resolvesTo(undefined)
    const caller = createCaller(
      {
        getChainsForPlugin: () => ['ethereum', 'arbitrum'],
      },
      {
        interopPluginSyncState: mockObject<Database['interopPluginSyncState']>({
          upsert,
        }),
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
    expect(result).toEqual({ updatedChains: ['ethereum', 'arbitrum'] })
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

    expect(result).toEqual(statuses)
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
    db: mockObject<Database>(db ?? {}),
    session: { email: 'user@example.com' },
  })
}
