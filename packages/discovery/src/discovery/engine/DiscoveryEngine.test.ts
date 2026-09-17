import { Logger } from '@l2beat/backend-tools'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { AddressAnalyzer } from '../analysis/AddressAnalyzer'
import { ConfigRegistry } from '../config/ConfigRegistry'
import {
  type StructureConfig,
  StructureContract,
} from '../config/StructureConfig'
import type { AllProviders } from '../provider/AllProviders'
import type { IProvider } from '../provider/IProvider'
import { EMPTY_ANALYZED_CONTRACT } from '../utils/testUtils'
import { DiscoveryEngine } from './DiscoveryEngine'

const base = {
  ...EMPTY_ANALYZED_CONTRACT,
  isVerified: true,
  deploymentTimestamp: UnixTime(1234),
  deploymentBlockNumber: 9876,
  selfMeta: undefined,
  targetsMeta: undefined,
  combinedMeta: undefined,
}

type Thenable<T> = PromiseLike<T> | T

describe(DiscoveryEngine.name, () => {
  const A = ChainSpecificAddress.random()
  const B = ChainSpecificAddress.random()
  const C = ChainSpecificAddress.random()
  const D = ChainSpecificAddress.random()
  const strB = B.toString()
  const strC = C.toString()
  const strD = D.toString()
  const provider = {
    get: vi.fn().mockResolvedValue({
      then: undefined,
    } as unknown as Thenable<IProvider>),
  } as unknown as AllProviders

  it('can perform a discovery', async () => {
    const config = generateFakeConfig([A], {
      [B.toString()]: StructureContract.parse({ ignoreDiscovery: true }),
    })

    const addressAnalyzer = {
      analyze: vi.fn(),
    } as unknown as AddressAnalyzer
    vi.mocked(addressAnalyzer.analyze)
      .mockResolvedValueOnce({
        ...base,
        address: A,
        type: 'Contract',
        name: 'A',
        relatives: { [strB]: new Set(), [strC]: new Set() },
      })
      .mockResolvedValueOnce({
        ...base,
        address: C,
        type: 'Contract',
        name: 'C',
        relatives: { [strB]: new Set(), [strD]: new Set() },
      })
      .mockResolvedValueOnce({
        ...base,
        address: D,
        type: 'Contract',
        name: 'D',
        relatives: {},
      })

    const engine = new DiscoveryEngine(addressAnalyzer, Logger.SILENT)
    const { analyses } = await engine.discover(provider, config.structure, 1234)

    expect(analyses).toStrictEqual([
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
  initialAddresses: ChainSpecificAddress[],
  overrides: StructureConfig['overrides'],
): ConfigRegistry => {
  return new ConfigRegistry({
    name: 'test',
    chain: 'ethereum',
    initialAddresses,
    overrides: overrides ?? {},
  })
}
