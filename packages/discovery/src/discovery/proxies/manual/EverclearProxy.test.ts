import { assert, EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { type providers, utils } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import { getEverclearProxy, modules } from './EverclearProxy'

describe(getEverclearProxy.name, () => {
  const stringABI = [
    'event ModuleAddressUpdated(bytes32 type, address previousAddress, address newAddress)',
  ]
  const abi = new utils.Interface(stringABI)

  const event =
    <T extends unknown[]>(name: string) =>
    (...args: T) =>
      abi.encodeEventLog(abi.getEvent(name), args) as providers.Log

  const ModuleAddressUpdated = event<
    [string, EthereumAddress, EthereumAddress]
  >('ModuleAddressUpdated')

  const txHashes = Array(5)
    .fill(0)
    .map(() => Hash256.random())

  const getLogsStub = (events: providers.Log[]) => {
    return (
      _: EthereumAddress,
      topics: (string | string[] | null)[],
    ): Promise<providers.Log[]> => {
      const topic0 = typeof topics[0] === 'string' ? topics[0] : topics[0]?.[0]
      assert(!!topic0)
      const result = events
        .map((e, i) => ({
          ...e,
          blockNumber: i + 1,
          transactionHash: txHashes[i]!,
        }))
        .filter((e) => e.topics[0] === topic0)

      return new Promise((resolve, _) => resolve(result))
    }
  }

  const IMPLEMENTATIONS = modules.map((_) => EthereumAddress.random())
  const ADDRESS = EthereumAddress.random()
  const ADMIN = EthereumAddress.random()

  it('fetches all modules, with past upgrades', async () => {
    const callMethodMock = mockFn()
      .given(ADDRESS, 'function owner() view returns (address)', [])
      .resolvesToOnce(ADMIN)

    // Set up responses for each module
    modules.forEach((module, index) => {
      callMethodMock
        .given(
          ADDRESS,
          `function modules(bytes32 _moduleType) external view returns (address _module)`,
          [module.toString()],
        )
        .resolvesToOnce(IMPLEMENTATIONS[index])
    })

    const M0I0 = EthereumAddress.random()
    const M0I1 = EthereumAddress.random()
    const M2I0 = EthereumAddress.random()
    const M3I0 = EthereumAddress.random()
    const M3I1 = EthereumAddress.random()

    const logs = [
      ModuleAddressUpdated(modules[0]?.toString()!, M0I0, M0I1),
      ModuleAddressUpdated(modules[3]?.toString()!, M3I0, M3I1),
      ModuleAddressUpdated(modules[2]?.toString()!, M2I0, IMPLEMENTATIONS[2]!),
      ModuleAddressUpdated(modules[0]?.toString()!, M0I1, IMPLEMENTATIONS[0]!),
      ModuleAddressUpdated(modules[3]?.toString()!, M3I1, IMPLEMENTATIONS[3]!),
    ]

    const provider = mockObject<IProvider>({
      callMethod: callMethodMock,
      getBlock: mockFn().resolvesTo({
        timestamp: 987234,
        transactionHash: Hash256.random(),
      }),
      getLogs: getLogsStub(logs),
    })

    const result = await getEverclearProxy(provider, ADDRESS)
    expect(result).toEqual({
      type: 'Everclear proxy',
      values: {
        $admin: ADMIN.toString(),
        $implementations: IMPLEMENTATIONS,
        $pastUpgrades: [
          [
            'ERROR',
            txHashes[0]!,
            [M0I1, IMPLEMENTATIONS[1]!, M2I0, M3I0, IMPLEMENTATIONS[4]!],
          ],
          [
            'ERROR',
            txHashes[1]!,
            [M0I1, IMPLEMENTATIONS[1]!, M2I0, M3I1, IMPLEMENTATIONS[4]!],
          ],
          [
            'ERROR',
            txHashes[2]!,
            [
              M0I1,
              IMPLEMENTATIONS[1]!,
              IMPLEMENTATIONS[2]!,
              M3I1,
              IMPLEMENTATIONS[4]!,
            ],
          ],
          [
            'ERROR',
            txHashes[3]!,
            [
              IMPLEMENTATIONS[0]!,
              IMPLEMENTATIONS[1]!,
              IMPLEMENTATIONS[2]!,
              M3I1,
              IMPLEMENTATIONS[4]!,
            ],
          ],
          ['ERROR', txHashes[4]!, IMPLEMENTATIONS],
        ],
        $upgradeCount: logs.length,
      },
    })
  })

  it('fetches all modules, no past upgrades', async () => {
    const callMethodMock = mockFn()
      .given(ADDRESS, 'function owner() view returns (address)', [])
      .resolvesToOnce(ADMIN)

    // Set up responses for each module
    modules.forEach((module, index) => {
      callMethodMock
        .given(
          ADDRESS,
          `function modules(bytes32 _moduleType) external view returns (address _module)`,
          [module.toString()],
        )
        .resolvesToOnce(IMPLEMENTATIONS[index])
    })

    const provider = mockObject<IProvider>({
      callMethod: callMethodMock,
      getLogs: mockFn().resolvesTo([]),
    })

    const result = await getEverclearProxy(provider, ADDRESS)
    expect(result).toEqual({
      type: 'Everclear proxy',
      values: {
        $admin: ADMIN.toString(),
        $implementations: IMPLEMENTATIONS,
        $pastUpgrades: [],
        $upgradeCount: 0,
      },
    })
  })
})
