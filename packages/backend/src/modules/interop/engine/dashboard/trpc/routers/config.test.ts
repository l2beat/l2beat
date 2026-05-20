import type { Database } from '@l2beat/database'
import { expect, mockObject } from 'earl'
import { createCallerFactory } from '../../../../../../trpc/init'
import { createConfigRouter } from './config'

describe(createConfigRouter.name, () => {
  it('returns live interop configuration state', async () => {
    const callerFactory = createCallerFactory(
      createConfigRouter({
        aggregationEnabled: true,
        aggregationConfigs: [
          {
            id: 'across',
            name: 'Across',
            type: 'intent',
            plugins: [
              {
                plugin: 'across',
                bridgeType: 'nonMinting',
              },
            ],
          },
        ],
        captureEnabled: true,
        chains: [
          { id: 'ethereum', type: 'evm' },
          { id: 'arbitrum', type: 'evm' },
        ],
        oneSidedChains: ['solana'],
        matchingEnabled: true,
        cleanerEnabled: false,
        dashboardEnabled: true,
        compareEnabled: false,
        dangerousOperationsEnabled: true,
        financialsEnabled: true,
        tokenDbApiUrl: 'https://token-db.example/api/trpc',
        configSyncEnabled: true,
        configChains: [{ id: 1, name: 'ethereum' }],
        configIntervalMs: 3_600_000,
        inMemoryEventCap: 500_000,
      }),
    )
    const caller = callerFactory({
      headers: new Headers(),
      db: mockObject<Database>({}),
      session: { email: 'user@example.com' },
    })

    const result = await caller.summary()

    expect(result).toEqual({
      features: {
        aggregationEnabled: true,
        captureEnabled: true,
        matchingEnabled: true,
        cleanerEnabled: false,
        dashboardEnabled: true,
        compareEnabled: false,
        dangerousOperationsEnabled: true,
        financialsEnabled: true,
        configSyncEnabled: true,
      },
      aggregation: {
        enabled: true,
        configs: [
          {
            id: 'across',
            name: 'Across',
            type: 'intent',
            plugins: [
              {
                plugin: 'across',
                bridgeType: 'nonMinting',
              },
            ],
          },
        ],
      },
      capture: {
        enabled: true,
        chains: [
          { id: 'ethereum', type: 'evm' },
          { id: 'arbitrum', type: 'evm' },
        ],
      },
      oneSidedChains: ['solana'],
      financials: {
        enabled: true,
        tokenDbApiUrl: 'https://token-db.example/api/trpc',
      },
      configSync: {
        enabled: true,
        chains: [{ id: 1, name: 'ethereum' }],
        configIntervalMs: 3_600_000,
      },
      inMemoryEventCap: 500_000,
    })
  })
})
