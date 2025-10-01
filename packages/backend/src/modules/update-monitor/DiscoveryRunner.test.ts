import { Logger } from '@l2beat/backend-tools'
import {
  type AllProviders,
  type ConfigReader,
  ConfigRegistry,
  type DiscoveryEngine,
  type IProvider,
  ProviderStats,
  type TemplateService,
} from '@l2beat/discovery'
import { expect, type MockObject, mockFn, mockObject } from 'earl'
import { DiscoveryRunner } from './DiscoveryRunner'

type Thenable<T> = PromiseLike<T> | T

describe(DiscoveryRunner.name, () => {
  const MOCK_PROVIDER = mockObject<Thenable<IProvider>>({
    timestamp: 123,
    blockNumber: 123,
    then: undefined,
  }) as MockObject<IProvider>

  describe(DiscoveryRunner.prototype.discoverWithRetry.name, () => {
    it('does not modify the source config', async () => {
      const engine = mockObject<DiscoveryEngine>({
        discover: async () => [],
        reset: () => {},
      })
      const sourceConfig: ConfigRegistry = getMockConfig()
      const runner = new DiscoveryRunner(
        mockObject<AllProviders>({
          get: mockFn().resolvesTo(MOCK_PROVIDER),
          getStats: () => ({
            ethereum: {
              highLevelMeasurements: new ProviderStats(),
              cacheMeasurements: new ProviderStats(),
              lowLevelMeasurements: new ProviderStats(),
            },
          }),
        }),
        engine,
        mockObject<TemplateService>(),
      )
      await runner.discoverWithRetry(
        sourceConfig,
        1,
        Logger.SILENT,
        1,
        10,
        {},
        getMockConfigReader(),
      )

      expect(sourceConfig).toEqual(getMockConfig())
    })

    it('discovers dependent project when modelCrossChainPermissions is set', async () => {
      const engine = mockObject<DiscoveryEngine>({
        discover: async () => [],
        reset: () => {},
      })
      const sourceConfig: ConfigRegistry = getMockConfig({
        modelCrossChainPermissions: true,
      })
      const allProvidersMock = mockObject<AllProviders>({
        get: mockFn().resolvesTo(MOCK_PROVIDER),
        getStats: () => ({
          ethereum: {
            highLevelMeasurements: new ProviderStats(),
            cacheMeasurements: new ProviderStats(),
            lowLevelMeasurements: new ProviderStats(),
          },
        }),
      })
      const runner = new DiscoveryRunner(
        allProvidersMock,
        engine,
        mockObject<TemplateService>(),
      )
      await runner.discoverWithRetry(
        sourceConfig,
        1,
        Logger.SILENT,
        1,
        10,
        { 'project-a': { timestamp: 123 } },
        getMockConfigReader({ modelCrossChainPermissions: true }),
      )

      expect(allProvidersMock.get).toHaveBeenCalledTimes(0)
      expect(engine.discover).toHaveBeenCalledTimes(1)
      expect(engine.discover).toHaveBeenNthCalledWith(
        1,
        allProvidersMock,
        getMockConfig({ modelCrossChainPermissions: true }).structure,
        1,
      )
    })

    describe(DiscoveryRunner.prototype.discoverWithRetry.name, () => {
      it('retries successfully', async () => {
        const engine = mockObject<DiscoveryEngine>({
          discover: mockFn()
            .rejectsWithOnce(new Error('error'))
            .rejectsWithOnce(new Error('error'))
            .resolvesToOnce([]),
          reset: () => {},
        })
        const runner = new DiscoveryRunner(
          mockObject<AllProviders>({
            get: mockFn().resolvesTo(MOCK_PROVIDER),
            getStats: () => ({
              ethereum: {
                highLevelMeasurements: new ProviderStats(),
                cacheMeasurements: new ProviderStats(),
                lowLevelMeasurements: new ProviderStats(),
              },
            }),
          }),
          engine,
          mockObject<TemplateService>(),
        )

        await runner.discoverWithRetry(
          getMockConfig(),
          1,
          Logger.SILENT,
          2,
          10,
          {},
          getMockConfigReader(),
        )

        expect(engine.discover).toHaveBeenCalledTimes(3)
      })

      it('throws error if maxRetries exceed', async () => {
        const engine = mockObject<DiscoveryEngine>({
          discover: mockFn()
            .rejectsWithOnce(new Error('error'))
            .rejectsWithOnce(new Error('error'))
            .resolvesToOnce([]),
          reset: () => {},
        })
        const runner = new DiscoveryRunner(
          mockObject<AllProviders>({
            get: mockFn().resolvesTo(MOCK_PROVIDER),
            getStats: () => ({
              ethereum: {
                highLevelMeasurements: new ProviderStats(),
                cacheMeasurements: new ProviderStats(),
                lowLevelMeasurements: new ProviderStats(),
              },
            }),
          }),
          engine,
          mockObject<TemplateService>(),
        )

        await expect(
          async () =>
            await runner.discoverWithRetry(
              getMockConfig(),
              1,
              Logger.SILENT,
              1,
              10,
              {},
              getMockConfigReader(),
            ),
        ).toBeRejectedWith('error')
      })
    })
  })
})

const getMockRawConfig = (options?: {
  chain?: string
  modelCrossChainPermissions?: boolean
}) => ({
  name: 'project-a',
  chain: options?.chain ?? 'ethereum',
  maxAddresses: 100,
  maxDepth: 6,
  initialAddresses: [],
  sharedModules: [],
  modelCrossChainPermissions: options?.modelCrossChainPermissions,
})

const getMockConfig = (options?: {
  chain?: string
  modelCrossChainPermissions?: boolean
}) => {
  return new ConfigRegistry({
    ...getMockRawConfig(options),
  })
}

const getMockConfigReader = (options?: {
  modelCrossChainPermissions?: boolean
}) => {
  return mockObject<ConfigReader>({
    readConfig: (_name: string) => getMockConfig({ ...options }),
    readRawConfig: () => getMockRawConfig(options),
    getProjectPath: () => '/tmp/discovery',
  })
}
