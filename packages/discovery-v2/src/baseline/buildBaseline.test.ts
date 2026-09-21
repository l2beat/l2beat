import type { IProvider } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { BigNumber, type utils } from 'ethers'
import { buildBaseline, selectGetters } from './buildBaseline'

/**
 * Feeds an ABI with every kind of function through a mocked provider that
 * answers by method name, and checks which ones were called and how they
 * landed. The selection must equal V1's system handlers minus the array
 * probe, since 93% of V1 fields come from exactly these getters.
 */
describe(buildBaseline.name, () => {
  const address = ChainSpecificAddress.fromLong(
    'ethereum',
    '0x1111111111111111111111111111111111111111',
  )
  const abi = [
    'function owner() view returns (address)',
    'function paused() view returns (bool)',
    'function VERSION() pure returns (string)',
    'function $admin() view returns (address)',
    'function getConfig() view returns (tuple(address admin, uint256 delay) config)',
    'function nothing() view',
    'function balanceOf(address account) view returns (uint256)',
    'function validatorAt(uint256 index) view returns (address)',
    'function setOwner(address newOwner)',
    'function claim() returns (bool)',
    'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
  ]

  const answers: Record<string, unknown> = {
    owner: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
    paused: undefined,
    VERSION: '1.2.3',
    $admin: '0x3333333333333333333333333333333333333333',
    getConfig: [
      '0x2222222222222222222222222222222222222222',
      BigNumber.from(86400),
    ],
  }

  function providerRecording(called: string[]): IProvider {
    return mockObject<IProvider>({
      chain: 'ethereum',
      callMethod: async (_address, fragment) => {
        const name = (fragment as utils.FunctionFragment).name
        called.push(name)
        if (!(name in answers)) {
          throw new Error(`unexpected call to ${name}`)
        }
        return answers[name] as never
      },
    })
  }

  it('selects exactly the constant, 0-input, ≥1-output functions', () => {
    expect(selectGetters(abi).map((f) => f.name)).toEqual([
      'owner',
      'paused',
      'VERSION',
      '$admin',
      'getConfig',
    ])
  })

  it('calls only the selected getters and formats values and reverts as V1 fields', async () => {
    const called: string[] = []
    const baseline = await buildBaseline(providerRecording(called), {
      abi,
      address,
    })

    expect(called.sort()).toEqual(
      ['owner', 'paused', 'VERSION', '$admin', 'getConfig'].sort(),
    )
    expect(baseline).toEqual({
      fields: {
        _$admin: {
          fragment: 'function $admin() view returns (address)',
          value: 'eth:0x3333333333333333333333333333333333333333',
        },
        getConfig: {
          fragment:
            'function getConfig() view returns (tuple(address admin, uint256 delay) config)',
          value: {
            admin: 'eth:0x2222222222222222222222222222222222222222',
            delay: 86400,
          },
        },
        owner: {
          fragment: 'function owner() view returns (address)',
          value: 'eth:0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
        },
        paused: {
          fragment: 'function paused() view returns (bool)',
          error: 'Execution reverted',
        },
        VERSION: {
          fragment: 'function VERSION() pure returns (string)',
          value: '1.2.3',
        },
      },
    })
  })

  it('issues every call before awaiting any, so the provider can multicall them', async () => {
    const started: string[] = []
    const resolvers: (() => void)[] = []
    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      callMethod: (_address, fragment) =>
        new Promise((resolve) => {
          started.push((fragment as utils.FunctionFragment).name)
          resolvers.push(() => resolve(undefined))
        }),
    })

    const running = buildBaseline(provider, { abi, address })
    await Promise.resolve()
    expect(started).toHaveLength(5)
    for (const resolve of resolvers) {
      resolve()
    }
    const baseline = await running
    expect(Object.keys(baseline.fields)).toHaveLength(5)
  })

  it('produces no fields for an empty ABI without touching the provider', async () => {
    const provider = mockObject<IProvider>({ chain: 'ethereum' })
    expect(await buildBaseline(provider, { abi: [], address })).toEqual({
      fields: {},
    })
  })
})
