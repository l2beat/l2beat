import { Logger } from '@l2beat/backend-tools'
import {
  AllProviders,
  ConfigReader,
  DiscoveryConfig,
  DiscoveryEngine,
  IProvider,
} from '@l2beat/discovery'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { ProviderStats } from '@l2beat/discovery'
import { DiscoveryRunner } from './DiscoveryRunner'

const ADDRESS = EthereumAddress.random()

describe(DiscoveryRunner.name, () => {
  const MOCK_PROVIDER = mockObject<IProvider>({})

  describe(DiscoveryRunner.prototype.run.name, () => {
    it('does not modify the source config', async () => {
      const engine = mockObject<DiscoveryEngine>({ discover: async () => [] })
      const sourceConfig: DiscoveryConfig = new DiscoveryConfig({
        ...getMockConfig().raw,
      })
      const configReader = mockObject<ConfigReader>({
        readDiscovery: mockFn().returns({
          contracts: [{ address: ADDRESS }],
        }),
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
        configReader,
        'ethereum',
      )
      await runner.run(sourceConfig, 1, {
        logger: Logger.SILENT,
      })

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
          mockObject<ConfigReader>({}),
          'ethereum',
        )

        await runner.run(getMockConfig(), 1, {
          logger: Logger.SILENT,
          maxRetries: 2,
          retryDelayMs: 10,
        })

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
          mockObject<ConfigReader>({}),
          'ethereum',
        )

        await expect(
          async () =>
            await runner.run(getMockConfig(), 1, {
              logger: Logger.SILENT,
              maxRetries: 1,
              retryDelayMs: 10,
            }),
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
