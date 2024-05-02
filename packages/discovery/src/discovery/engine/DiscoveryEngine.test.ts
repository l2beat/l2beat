import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { DiscoveryLogger } from '../DiscoveryLogger'
import { AddressAnalyzer } from '../analysis/AddressAnalyzer'
import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { RawDiscoveryConfig } from '../config/RawDiscoveryConfig'
import { DiscoveryEngine } from './DiscoveryEngine'

describe(DiscoveryEngine.name, () => {
  const BLOCK_NUMBER = 1234
  const A = EthereumAddress.from('0xA')
  const B = EthereumAddress.from('0xB')
  const C = EthereumAddress.from('0xC')
  const D = EthereumAddress.from('0xD')
  // const strA = A.toString()
  const strB = B.toString()
  const strC = C.toString()
  const strD = D.toString()

  it('can perform a discovery', async () => {
    const config = generateFakeConfig([A], {
      [B.toString()]: { ignoreDiscovery: true },
    })

    const discoveryLogger = mockObject<DiscoveryLogger>({
      flushServer: () => {},
      log: () => {},
      logSkip: () => {},
      logRelatives: () => {},
    })

    const addressAnalyzer = mockObject<AddressAnalyzer>({
      analyze: mockFn(),
    })
    addressAnalyzer.analyze
      .resolvesToOnce({
        analysis: { type: 'EOA', address: A },
        relatives: { [strB]: new Set(), [strC]: new Set() },
      })
      .resolvesToOnce({
        analysis: { type: 'EOA', address: C },
        relatives: { [strB]: new Set(), [strD]: new Set() },
      })
      .resolvesToOnce({
        analysis: { type: 'EOA', address: D },
        relatives: {},
      })

    const engine = new DiscoveryEngine(addressAnalyzer, discoveryLogger)
    const result = await engine.discover(config, BLOCK_NUMBER)

    expect(result).toEqual([
      { type: 'EOA', address: A },
      { type: 'EOA', address: C },
      { type: 'EOA', address: D },
    ])

    expect(discoveryLogger.log).toHaveBeenCalledTimes(5)
    expect(discoveryLogger.logRelatives).toHaveBeenCalledTimes(0)
    expect(discoveryLogger.flushServer).toHaveBeenCalledTimes(1)
  })
})

const generateFakeConfig = (
  initialAddresses: EthereumAddress[],
  overrides: RawDiscoveryConfig['overrides'],
): DiscoveryConfig => {
  return new DiscoveryConfig({
    name: 'test',
    chain: 'ethereum',
    initialAddresses,
    overrides: overrides ?? {},
  })
}
