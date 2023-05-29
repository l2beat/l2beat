import {
  ConfigReader,
  DiscoveryConfig,
  DiscoveryEngine,
} from '@l2beat/discovery'
import { EthereumAddress } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'

import { DiscoveryRunner } from './DiscoveryRunner'

const ADDRESS = EthereumAddress.random()

describe(DiscoveryRunner.name, () => {
  describe(DiscoveryRunner.prototype.run.name, () => {
    it('runs discovery twice', async () => {
      const engine = mockObject<DiscoveryEngine>({ discover: async () => [] })
      const runner = new DiscoveryRunner(engine, mockObject<ConfigReader>({}))
      await runner.run(config, 1, {
        runSanityCheck: true,
        injectInitialAddresses: false,
      })

      expect(engine.discover).toHaveBeenCalledTimes(2)
    })

    it('injects initial addresses', async () => {
      const engine = mockObject<DiscoveryEngine>({ discover: async () => [] })
      const configReader = mockObject<ConfigReader>({
        readDiscovery: mockFn().resolvesTo({
          contracts: [{ address: ADDRESS }],
        }),
      })
      const runner = new DiscoveryRunner(engine, configReader)

      await runner.run(config, 1, {
        runSanityCheck: false,
        injectInitialAddresses: true,
      })

      expect(engine.discover).toHaveBeenNthCalledWith(
        1,
        new DiscoveryConfig({
          ...config.raw,
          initialAddresses: [ADDRESS],
        }),
        1,
      )
    })
  })
})

const config: DiscoveryConfig = new DiscoveryConfig({
  name: 'project-a',
  initialAddresses: [],
})
