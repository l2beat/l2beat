import { EthereumAddress } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'

import { AddressAnalyzer } from '../analysis/AddressAnalyzer'
import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { DiscoveryLogger } from '../utils/DiscoveryLogger'
import { DiscoveryEngine } from './DiscoveryEngine'

describe(DiscoveryEngine.name, () => {
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

    const addressAnalyzer = mockObject<AddressAnalyzer>({
      analyze: mockFn(),
    })
    addressAnalyzer.analyze
      .given(A, config.overrides.get(A))
      .resolvesToOnce({
        analysis: { type: 'EOA', address: A },
        relatives: [B, C],
      })
      .given(C, config.overrides.get(C))
      .resolvesToOnce({
        analysis: { type: 'EOA', address: C },
        relatives: [B, D],
      })
      .given(D, config.overrides.get(D))
      .resolvesToOnce({
        analysis: { type: 'EOA', address: D },
        relatives: [],
      })

    const engine = new DiscoveryEngine(addressAnalyzer, DiscoveryLogger.SILENT)
    const result = await engine.discover(config)

    expect(result).toEqual([
      { type: 'EOA', address: A },
      { type: 'EOA', address: C },
      { type: 'EOA', address: D },
    ])
  })
})
