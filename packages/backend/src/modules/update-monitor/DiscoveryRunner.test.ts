import { Logger } from '@l2beat/backend-tools'
import {
  ConfigReader,
  DiscoveryConfig,
  DiscoveryEngine,
  DiscoveryProvider,
} from '@l2beat/discovery'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { DiscoveryRunner } from './DiscoveryRunner'

const ADDRESS = EthereumAddress.random()

describe(DiscoveryRunner.name, () => {
  describe(DiscoveryRunner.prototype.run.name, () => {
    it('runs discovery twice', async () => {
      const engine = mockObject<DiscoveryEngine>({ discover: async () => [] })
      const runner = new DiscoveryRunner(
        mockObject<DiscoveryProvider>({}),
        engine,
        mockObject<ConfigReader>({}),
        'ethereum',
      )
      await runner.run(getMockConfig(), 1, {
        logger: Logger.SILENT,
        runSanityCheck: true,
        injectInitialAddresses: false,
      })

      expect(engine.discover).toHaveBeenCalledTimes(2)
    })

    it('run success but sanity check throws an error', async () => {
      const engine = mockObject<DiscoveryEngine>({
        discover: mockFn()
          .resolvesToOnce([])
          .throwsOnce(new Error('sanity call errored'))
          .resolvesToOnce([]),
      })
      const runner = new DiscoveryRunner(
        mockObject<DiscoveryProvider>({}),
        engine,
        mockObject<ConfigReader>({}),
        'ethereum',
      )

      await expect(() =>
        runner.run(getMockConfig(), 1, {
          logger: Logger.SILENT,
          runSanityCheck: true,
          injectInitialAddresses: false,
          maxRetries: 10,
          retryDelayMs: 10,
        }),
      ).not.toBeRejected()
      expect(engine.discover).toHaveBeenCalledTimes(3)
    })

    it('injects initial addresses', async () => {
      const engine = mockObject<DiscoveryEngine>({ discover: async () => [] })
      const configReader = mockObject<ConfigReader>({
        readDiscovery: mockFn().resolvesTo({
          contracts: [{ address: ADDRESS }],
        }),
      })
      const runner = new DiscoveryRunner(
        mockObject<DiscoveryProvider>({}),
        engine,
        configReader,
        'ethereum',
      )

      await runner.run(getMockConfig(), 1, {
        logger: Logger.SILENT,
        runSanityCheck: false,
        injectInitialAddresses: true,
      })

      expect(engine.discover).toHaveBeenNthCalledWith(
        1,
        new DiscoveryConfig({
          ...getMockConfig().raw,
          initialAddresses: [ADDRESS],
        }),
        1,
      )
    })

    it('does not modify the source config', async () => {
      const engine = mockObject<DiscoveryEngine>({ discover: async () => [] })
      const sourceConfig: DiscoveryConfig = new DiscoveryConfig({
        ...getMockConfig().raw,
      })
      const configReader = mockObject<ConfigReader>({
        readDiscovery: mockFn().resolvesTo({
          contracts: [{ address: ADDRESS }],
        }),
      })
      const runner = new DiscoveryRunner(
        mockObject<DiscoveryProvider>({}),
        engine,
        configReader,
        'ethereum',
      )
      await runner.run(sourceConfig, 1, {
        logger: Logger.SILENT,
        runSanityCheck: true,
        injectInitialAddresses: true,
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
          mockObject<DiscoveryProvider>({}),
          engine,
          mockObject<ConfigReader>({}),
          'ethereum',
        )

        await runner.run(getMockConfig(), 1, {
          logger: Logger.SILENT,
          runSanityCheck: false,
          injectInitialAddresses: false,
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
          mockObject<DiscoveryProvider>({}),
          engine,
          mockObject<ConfigReader>({}),
          'ethereum',
        )

        await expect(
          async () =>
            await runner.run(getMockConfig(), 1, {
              logger: Logger.SILENT,
              runSanityCheck: false,
              injectInitialAddresses: false,
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
