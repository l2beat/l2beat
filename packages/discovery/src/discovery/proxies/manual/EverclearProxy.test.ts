import { assert, EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { type providers, utils } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import { IMPLEMENTATION_SLOT } from '../auto/Eip1967Proxy'
import { getEverclearProxy, modules } from './EverclearProxy'

describe(getEverclearProxy.name, () => {
  const stringABI = [
    'event ModuleAddressUpdated(bytes32 type, address previousAddress, address newAddress)',
    'event Upgraded(address indexed implementation)',
  ]
  const abi = new utils.Interface(stringABI)

  const event =
    <T extends unknown[]>(name: string) =>
    (...args: T) =>
      abi.encodeEventLog(abi.getEvent(name), args) as providers.Log

  const ModuleAddressUpdated = event<
    [string, EthereumAddress, EthereumAddress]
  >('ModuleAddressUpdated')
  const Upgraded = event<[EthereumAddress]>('Upgraded')

  const txHashes = Array(10)
    .fill(0)
    .map(() => Hash256.random())

  const getLogsStub = (events: providers.Log[]) => {
    return (
      _: EthereumAddress,
      topics: (string | string[] | null)[],
    ): Promise<providers.Log[]> => {
      const topic0 = typeof topics[0] === 'string' ? [topics[0]] : topics[0]
      assert(!!topic0)
      const result = events
        .map((e, i) => ({
          ...e,
          blockNumber: i + 1,
          transactionHash: txHashes[i]!,
        }))
        .filter((e) => topic0.includes(e.topics[0]!))

      return new Promise((resolve, _) => resolve(result))
    }
  }

  const MAIN_IMPLEMENTATION = EthereumAddress.random()
  const MODULE_IMPLEMENTATIONS = modules.map((_) => EthereumAddress.random())
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
        .resolvesToOnce(MODULE_IMPLEMENTATIONS[index])
    })

    const EMI0 = EthereumAddress.random()
    const M0I0 = EthereumAddress.random()
    const M0I1 = EthereumAddress.random()
    const M2I0 = EthereumAddress.random()
    const M3I0 = EthereumAddress.random()
    const M3I1 = EthereumAddress.random()

    const logs = [
      Upgraded(EMI0),
      ModuleAddressUpdated(modules[0]?.toString()!, M0I0, M0I1),
      ModuleAddressUpdated(modules[3]?.toString()!, M3I0, M3I1),
      Upgraded(MAIN_IMPLEMENTATION),
      ModuleAddressUpdated(
        modules[2]?.toString()!,
        M2I0,
        MODULE_IMPLEMENTATIONS[2]!,
      ),
      ModuleAddressUpdated(
        modules[0]?.toString()!,
        M0I1,
        MODULE_IMPLEMENTATIONS[0]!,
      ),
      ModuleAddressUpdated(
        modules[3]?.toString()!,
        M3I1,
        MODULE_IMPLEMENTATIONS[3]!,
      ),
    ]

    const provider = mockObject<IProvider>({
      callMethod: callMethodMock,
      getBlock: mockFn().resolvesTo({
        timestamp: 987234,
        transactionHash: Hash256.random(),
      }),
      getStorageAsAddress: mockFn()
        .given(ADDRESS, IMPLEMENTATION_SLOT)
        .resolvesToOnce(MAIN_IMPLEMENTATION),
      getLogs: getLogsStub(logs),
    })

    // NOTE(radomski): It would be a real hassle to configure timestamps for
    // each mocked event, so we just assume that the date is an error
    const expectedDate = 'ERROR'
    const result = await getEverclearProxy(provider, ADDRESS)
    expect(result).toEqual({
      type: 'Everclear proxy',
      values: {
        $admin: ADMIN.toString(),
        $implementation: [MAIN_IMPLEMENTATION, ...MODULE_IMPLEMENTATIONS],
        $pastUpgrades: [
          [
            expectedDate,
            txHashes[0]!,
            [
              EMI0,
              M0I0,
              MODULE_IMPLEMENTATIONS[1]!,
              M2I0,
              M3I0,
              MODULE_IMPLEMENTATIONS[4]!,
            ],
          ],
          [
            expectedDate,
            txHashes[1]!,
            [
              EMI0,
              M0I1,
              MODULE_IMPLEMENTATIONS[1]!,
              M2I0,
              M3I0,
              MODULE_IMPLEMENTATIONS[4]!,
            ],
          ],
          [
            expectedDate,
            txHashes[2]!,
            [
              EMI0,
              M0I1,
              MODULE_IMPLEMENTATIONS[1]!,
              M2I0,
              M3I1,
              MODULE_IMPLEMENTATIONS[4]!,
            ],
          ],
          [
            expectedDate,
            txHashes[3]!,
            [
              MAIN_IMPLEMENTATION,
              M0I1,
              MODULE_IMPLEMENTATIONS[1]!,
              M2I0,
              M3I1,
              MODULE_IMPLEMENTATIONS[4]!,
            ],
          ],
          [
            expectedDate,
            txHashes[4]!,
            [
              MAIN_IMPLEMENTATION,
              M0I1,
              MODULE_IMPLEMENTATIONS[1]!,
              MODULE_IMPLEMENTATIONS[2]!,
              M3I1,
              MODULE_IMPLEMENTATIONS[4]!,
            ],
          ],
          [
            expectedDate,
            txHashes[5]!,
            [
              MAIN_IMPLEMENTATION,
              MODULE_IMPLEMENTATIONS[0]!,
              MODULE_IMPLEMENTATIONS[1]!,
              MODULE_IMPLEMENTATIONS[2]!,
              M3I1,
              MODULE_IMPLEMENTATIONS[4]!,
            ],
          ],
          [
            expectedDate,
            txHashes[6]!,
            [MAIN_IMPLEMENTATION, ...MODULE_IMPLEMENTATIONS],
          ],
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
        .resolvesToOnce(MODULE_IMPLEMENTATIONS[index])
    })

    const provider = mockObject<IProvider>({
      callMethod: callMethodMock,
      getStorageAsAddress: mockFn()
        .given(ADDRESS, IMPLEMENTATION_SLOT)
        .resolvesToOnce(MAIN_IMPLEMENTATION),
      getLogs: mockFn().resolvesTo([]),
    })

    const result = await getEverclearProxy(provider, ADDRESS)
    expect(result).toEqual({
      type: 'Everclear proxy',
      values: {
        $admin: ADMIN.toString(),
        $implementation: [MAIN_IMPLEMENTATION, ...MODULE_IMPLEMENTATIONS],
        $pastUpgrades: [],
        $upgradeCount: 0,
      },
    })
  })
})
