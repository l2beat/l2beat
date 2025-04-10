import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { DiscoveryLogger } from '../DiscoveryLogger'
import type { AddressAnalyzer } from '../analysis/AddressAnalyzer'
import { ConfigRegistry } from '../config/ConfigRegistry'
import {
  type StructureConfig,
  StructureContract,
} from '../config/StructureConfig'
import type { IProvider } from '../provider/IProvider'
import { EMPTY_ANALYZED_CONTRACT } from '../utils/testUtils'
import { DiscoveryEngine } from './DiscoveryEngine'

const base = {
  ...EMPTY_ANALYZED_CONTRACT,
  derivedName: undefined,
  isVerified: true,
  deploymentTimestamp: UnixTime(1234),
  deploymentBlockNumber: 9876,
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
      [B.toString()]: StructureContract.parse({ ignoreDiscovery: true }),
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

    const engine = new DiscoveryEngine(addressAnalyzer, DiscoveryLogger.SILENT)
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
  })
})

const generateFakeConfig = (
  initialAddresses: EthereumAddress[],
  overrides: StructureConfig['overrides'],
): ConfigRegistry => {
  return new ConfigRegistry({
    name: 'test',
    chain: 'ethereum',
    initialAddresses,
    overrides: overrides ?? {},
  })
}
