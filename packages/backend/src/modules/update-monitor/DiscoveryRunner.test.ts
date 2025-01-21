import { Logger } from '@l2beat/backend-tools'
import {
  type AllProviders,
  DiscoveryConfig,
  type DiscoveryEngine,
  type IProvider,
} from '@l2beat/discovery'
import { expect, mockFn, mockObject } from 'earl'

import { ProviderStats } from '@l2beat/discovery'
import { DiscoveryRunner } from './DiscoveryRunner'

describe(DiscoveryRunner.name, () => {
  const MOCK_PROVIDER = mockObject<IProvider>({})

  describe(DiscoveryRunner.prototype.discoverWithRetry.name, () => {
    it('does not modify the source config', async () => {
      const engine = mockObject<DiscoveryEngine>({ discover: async () => [] })
      const sourceConfig: DiscoveryConfig = new DiscoveryConfig({
        ...getMockConfig().raw,
      })
      const runner = new DiscoveryRunner(
        mockObject<AllProviders>({
          get: () => MOCK_PROVIDER,
          getStats: () => ({
            highLevelMeasurements: new ProviderStats(),
            cacheMeasurements: new ProviderStats(),
            lowLevelMeasurements: new ProviderStats(),
          }),
        }),
        engine,
        'ethereum',
      )
      await runner.discoverWithRetry(sourceConfig, 1, Logger.SILENT)

      expect(sourceConfig).toEqual(getMockConfig())
    })

    describe(DiscoveryRunner.prototype.discoverWithRetry.name, () => {
      it('retries successfully', async () => {
        const engine = mockObject<DiscoveryEngine>({
          discover: mockFn()
            .rejectsWithOnce(new Error('error'))
            .rejectsWithOnce(new Error('error'))
            .resolvesToOnce([]),
        })
        const runner = new DiscoveryRunner(
          mockObject<AllProviders>({
            get: () => MOCK_PROVIDER,
            getStats: () => ({
              highLevelMeasurements: new ProviderStats(),
              cacheMeasurements: new ProviderStats(),
              lowLevelMeasurements: new ProviderStats(),
            }),
          }),
          engine,
          'ethereum',
        )

        await runner.discoverWithRetry(getMockConfig(), 1, Logger.SILENT, 2, 10)

        expect(engine.discover).toHaveBeenCalledTimes(3)
      })

      it('throws error if maxRetries exceed', async () => {
        const engine = mockObject<DiscoveryEngine>({
          discover: mockFn()
            .rejectsWithOnce(new Error('error'))
            .rejectsWithOnce(new Error('error'))
            .resolvesToOnce([]),
        })
        const runner = new DiscoveryRunner(
          mockObject<AllProviders>({
            get: () => MOCK_PROVIDER,
            getStats: () => ({
              highLevelMeasurements: new ProviderStats(),
              cacheMeasurements: new ProviderStats(),
              lowLevelMeasurements: new ProviderStats(),
            }),
          }),
          engine,
          'ethereum',
        )

        await expect(
          async () =>
            await runner.discoverWithRetry(
              getMockConfig(),
              1,
              Logger.SILENT,
              1,
              10,
            ),
        ).toBeRejectedWith('error')
      })
    })
  })
})

const getMockConfig = () => {
  return new DiscoveryConfig({
    name: 'project-a',
    chain: 'ethereum',
    initialAddresses: [],
  })
}
