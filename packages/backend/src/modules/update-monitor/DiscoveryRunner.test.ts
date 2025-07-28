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
      const engine = mockObject<DiscoveryEngine>({ discover: async () => [] })
      const sourceConfig: ConfigRegistry = getMockConfig()
      const runner = new DiscoveryRunner(
        mockObject<AllProviders>({
          get: mockFn().resolvesTo(MOCK_PROVIDER),
          getStats: () => ({
            highLevelMeasurements: new ProviderStats(),
            cacheMeasurements: new ProviderStats(),
            lowLevelMeasurements: new ProviderStats(),
          }),
        }),
        engine,
        mockObject<TemplateService>(),
        'ethereum',
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
      const engine = mockObject<DiscoveryEngine>({ discover: async () => [] })
      const sourceConfig: ConfigRegistry = getMockConfig({
        modelCrossChainPermissions: true,
      })
      const allProvidersMock = mockObject<AllProviders>({
        get: mockFn().resolvesTo(MOCK_PROVIDER),
        getStats: () => ({
          highLevelMeasurements: new ProviderStats(),
          cacheMeasurements: new ProviderStats(),
          lowLevelMeasurements: new ProviderStats(),
        }),
      })
      const runner = new DiscoveryRunner(
        allProvidersMock,
        engine,
        mockObject<TemplateService>(),
        'ethereum',
      )
      await runner.discoverWithRetry(
        sourceConfig,
        1,
        Logger.SILENT,
        1,
        10,
        { 'project-a': { arbitrum: { timestamp: 123 } } },
        getMockConfigReader({ modelCrossChainPermissions: true }),
      )

      expect(allProvidersMock.get).toHaveBeenCalledTimes(2)
      expect(allProvidersMock.get).toHaveBeenNthCalledWith(1, 'arbitrum', 123)
      expect(allProvidersMock.get).toHaveBeenNthCalledWith(2, 'ethereum', 1)
      expect(engine.discover).toHaveBeenCalledTimes(2)
      expect(engine.discover).toHaveBeenNthCalledWith(
        1,
        MOCK_PROVIDER,
        getMockConfig({ chain: 'arbitrum', modelCrossChainPermissions: true })
          .structure,
      )
      expect(engine.discover).toHaveBeenNthCalledWith(
        2,
        MOCK_PROVIDER,
        getMockConfig({ chain: 'ethereum', modelCrossChainPermissions: true })
          .structure,
      )
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
            get: mockFn().resolvesTo(MOCK_PROVIDER),
            getStats: () => ({
              highLevelMeasurements: new ProviderStats(),
              cacheMeasurements: new ProviderStats(),
              lowLevelMeasurements: new ProviderStats(),
            }),
          }),
          engine,
          mockObject<TemplateService>(),
          'ethereum',
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
        })
        const runner = new DiscoveryRunner(
          mockObject<AllProviders>({
            get: mockFn().resolvesTo(MOCK_PROVIDER),
            getStats: () => ({
              highLevelMeasurements: new ProviderStats(),
              cacheMeasurements: new ProviderStats(),
              lowLevelMeasurements: new ProviderStats(),
            }),
          }),
          engine,
          mockObject<TemplateService>(),
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
    readConfig: (_name: string, chain: string) =>
      getMockConfig({ ...options, chain }),
    readRawConfig: () => getMockRawConfig(options),
    getProjectPath: () => '/tmp/discovery',
    readAllDiscoveredChainsForProject: () => ['ethereum', 'arbitrum'],
  })
}
