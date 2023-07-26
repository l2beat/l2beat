import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { ConfigReader } from './config/ConfigReader'
import { DiscoveryConfig } from './config/DiscoveryConfig'
import { DiscoveryRunner } from './DiscoveryRunner'
import { DiscoveryEngine } from './engine/DiscoveryEngine'
import { DiscoveryProvider } from './provider/DiscoveryProvider'

const ADDRESS = EthereumAddress.random()

describe(DiscoveryRunner.name, () => {
  describe(DiscoveryRunner.prototype.run.name, () => {
    it('runs discovery twice', async () => {
      const engine = mockObject<DiscoveryEngine>({ discover: async () => [] })
      const runner = new DiscoveryRunner(
        mockObject<DiscoveryProvider>({}),
        engine,
        mockObject<ConfigReader>({}),
        ChainId.ETHEREUM,
      )
      await runner.run(getMockConfig(), 1, {
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
      const runner = new DiscoveryRunner(
        mockObject<DiscoveryProvider>({}),
        engine,
        configReader,
        ChainId.ETHEREUM,
      )

      await runner.run(getMockConfig(), 1, {
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
        ChainId.ETHEREUM,
      )
      await runner.run(sourceConfig, 1, {
        runSanityCheck: true,
        injectInitialAddresses: true,
      })

      expect(sourceConfig).toEqual(getMockConfig())
    })
  })
})

const getMockConfig = () => {
  return new DiscoveryConfig({
    name: 'project-a',
    initialAddresses: [],
  })
}
