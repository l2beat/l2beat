import type { InteropPluginName } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { expect, mockObject } from 'earl'
import { createCallerFactory } from '../../../../../../trpc/init'
import { createSummaryRouter } from './summary'

describe(createSummaryRouter.name, () => {
  it('returns a safe runtime config summary with copy payloads', async () => {
    const callerFactory = createCallerFactory(
      createSummaryRouter({
        aggregationConfigs: [
          {
            id: 'layerzero',
            type: 'other',
            plugins: [
              {
                plugin: 'layerzero' as InteropPluginName,
                bridgeType: 'burnAndMint',
              },
              {
                plugin: 'usdt0' as InteropPluginName,
                bridgeType: 'burnAndMint',
              },
            ],
            durationSplit: {
              burnAndMint: [
                {
                  label: 'Fast',
                  transferTypes: ['send'],
                },
              ],
            },
          },
          {
            id: 'relay',
            type: 'other',
            plugins: [{ plugin: 'relay', bridgeType: 'nonMinting' }],
          },
        ],
        aggregationEnabled: true,
        captureEnabled: true,
        chains: [
          { id: 'megaeth', type: 'evm' },
          { id: 'worldchain', type: 'evm' },
        ],
        cleanerEnabled: true,
        compareEnabled: true,
        configSync: {
          enabled: true,
          chains: [
            { id: 1, name: 'ethereum' },
            { id: 10, name: 'optimism' },
          ],
          configIntervalMs: 12 * 60 * 60 * 1000,
        },
        dangerousOperationsEnabled: false,
        dashboardEnabled: true,
        financialsEnabled: true,
        matchingEnabled: true,
        oneSidedChains: ['solana'],
      }),
    )
    const caller = callerFactory({
      headers: new Headers(),
      db: mockObject<Database>({}),
      session: { email: 'dev@l2beat.com' },
    })

    const result = await caller.config()

    expect(result).toEqual({
      featureToggles: {
        capture: true,
        matching: true,
        cleaner: true,
        aggregation: true,
        dashboard: true,
        compare: true,
        financials: true,
        configSync: true,
        dangerousOperations: false,
      },
      capture: {
        enabled: true,
        chains: [
          { id: 'megaeth', name: 'MegaETH', display: 'MEGA' },
          { id: 'worldchain', name: 'World Chain', display: 'WORLD' },
        ],
        copyPayload: {
          enabled: true,
          chains: [
            { id: 'megaeth', type: 'evm' },
            { id: 'worldchain', type: 'evm' },
          ],
        },
      },
      configSync: {
        enabled: true,
        chains: [
          { id: 1, name: 'ethereum' },
          { id: 10, name: 'optimism' },
        ],
        configIntervalMs: 43_200_000,
      },
      oneSided: {
        chains: [{ id: 'solana', name: 'Solana', display: 'SOL' }],
        copyPayload: ['solana'],
      },
      aggregation: {
        enabled: true,
        configsCount: 2,
        uniquePluginsCount: 3,
        configsWithDurationSplitCount: 1,
        copyPayload: [
          {
            id: 'layerzero',
            type: 'other',
            plugins: [
              {
                plugin: 'layerzero' as InteropPluginName,
                bridgeType: 'burnAndMint',
              },
              {
                plugin: 'usdt0' as InteropPluginName,
                bridgeType: 'burnAndMint',
              },
            ],
            durationSplit: {
              burnAndMint: [
                {
                  label: 'Fast',
                  transferTypes: ['send'],
                },
              ],
            },
          },
          {
            id: 'relay',
            type: 'other',
            plugins: [{ plugin: 'relay', bridgeType: 'nonMinting' }],
          },
        ],
      },
    })
  })
})
