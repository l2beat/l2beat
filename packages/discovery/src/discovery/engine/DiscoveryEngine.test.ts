import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { UpgradeabilityParameters } from '@l2beat/discovery-types'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { AddressAnalyzer } from '../analysis/AddressAnalyzer'
import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { RawDiscoveryConfig } from '../config/RawDiscoveryConfig'
import { IProvider } from '../provider/IProvider'
import { DiscoveryEngine } from './DiscoveryEngine'

const base = {
  derivedName: undefined,
  errors: {},
  values: {},
  isVerified: true,
  deploymentTimestamp: new UnixTime(1234),
  deploymentBlockNumber: 9876,
  upgradeability: { type: 'immutable' } as UpgradeabilityParameters,
  implementations: [],
  abis: {},
  sourceBundles: [],
  matchingTemplates: {},
  relatives: {},
  selfMeta: undefined,
  targetsMeta: undefined,
  combinedMeta: undefined,
}

describe(DiscoveryEngine.name, () => {
  const A = EthereumAddress.from('0xA')
  const B = EthereumAddress.from('0xB')
  const C = EthereumAddress.from('0xC')
  const D = EthereumAddress.from('0xD')
  const strB = B.toString()
  const strC = C.toString()
  const strD = D.toString()
  const provider = mockObject<IProvider>({})

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
        ...base,
        address: A,
        type: 'Contract',
        name: 'A',
        relatives: { [strB]: new Set(), [strC]: new Set() },
      })
      .resolvesToOnce({
        ...base,
        address: C,
        type: 'Contract',
        name: 'C',
        relatives: { [strB]: new Set(), [strD]: new Set() },
      })
      .resolvesToOnce({
        ...base,
        address: D,
        type: 'Contract',
        name: 'D',
        relatives: {},
      })

    const engine = new DiscoveryEngine(addressAnalyzer, discoveryLogger)
    const result = await engine.discover(provider, config)

    expect(result).toEqual([
      {
        ...base,
        type: 'Contract',
        name: 'A',
        address: A,
        relatives: { [strB]: new Set(), [strC]: new Set() },
      },
      {
        ...base,
        type: 'Contract',
        name: 'C',
        address: C,
        relatives: { [strB]: new Set(), [strD]: new Set() },
      },
      { ...base, type: 'Contract', name: 'D', address: D },
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
