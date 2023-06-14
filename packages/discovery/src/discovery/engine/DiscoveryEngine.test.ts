import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { AddressAnalyzer } from '../analysis/AddressAnalyzer'
import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { DiscoveryEngine } from './DiscoveryEngine'

describe(DiscoveryEngine.name, () => {
  const BLOCK_NUMBER = 1234
  const A = EthereumAddress.random()
  const B = EthereumAddress.random()
  const C = EthereumAddress.random()
  const D = EthereumAddress.random()

  it('can perform a discovery', async () => {
    const config = new DiscoveryConfig({
      name: 'test',
      initialAddresses: [A],
      overrides: { [B.toString()]: { ignoreDiscovery: true } },
    })

    const discoveryLogger = mockObject<DiscoveryLogger>({
      flush: () => {},
      log: () => {},
      logSkip: () => {},
      logRelatives: () => {},
    })

    const addressAnalyzer = mockObject<AddressAnalyzer>({
      analyze: mockFn(),
    })
    addressAnalyzer.analyze
      .given(A, config.overrides.get(A), BLOCK_NUMBER)
      .resolvesToOnce({
        analysis: { type: 'EOA', address: A },
        relatives: [B, C],
      })
      .given(C, config.overrides.get(C), BLOCK_NUMBER)
      .resolvesToOnce({
        analysis: { type: 'EOA', address: C },
        relatives: [B, D],
      })
      .given(D, config.overrides.get(D), BLOCK_NUMBER)
      .resolvesToOnce({
        analysis: { type: 'EOA', address: D },
        relatives: [],
      })

    const engine = new DiscoveryEngine(addressAnalyzer, discoveryLogger)
    const result = await engine.discover(config, BLOCK_NUMBER)

    expect(result).toEqual([
      { type: 'EOA', address: A },
      { type: 'EOA', address: C },
      { type: 'EOA', address: D },
    ])

    expect(discoveryLogger.log).toHaveBeenCalledTimes(3)
    expect(discoveryLogger.logSkip).toHaveBeenCalledTimes(1)
    expect(discoveryLogger.logRelatives).toHaveBeenCalledTimes(3)
    expect(discoveryLogger.flush).toHaveBeenCalledTimes(1)
  })
})
