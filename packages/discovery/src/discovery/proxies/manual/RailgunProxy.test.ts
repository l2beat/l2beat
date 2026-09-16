import {
  assert,
  type Bytes,
  ChainSpecificAddress,
  type EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { type providers, utils } from 'ethers'
import { describe, expect, it, vi } from 'vitest'
import type { IProvider } from '../../provider/IProvider'
import { ADMIN_SLOT, IMPLEMENTATION_SLOT } from '../auto/Eip1967Proxy'
import { getRailgunProxy, PAUSED_SLOT } from './RailgunProxy'

describe(getRailgunProxy.name, () => {
  const ADDRESS = ChainSpecificAddress.random()
  const IMPLEMENTATION = ChainSpecificAddress.random()
  const OLD_IMPLEMENTATION = ChainSpecificAddress.random()
  const ADMIN = ChainSpecificAddress.random()
  const OWNER = ChainSpecificAddress.random()

  const abi = new utils.Interface([
    'event ProxyUpgrade(address previousImplementation, address implementation)',
    'event ProxyOwnershipTransfer(address previousOwner, address newOwner)',
  ])

  const event =
    <T extends unknown[]>(name: string) =>
    (...args: T) =>
      abi.encodeEventLog(abi.getEvent(name), args) as providers.Log

  const ProxyUpgrade = event<[EthereumAddress, EthereumAddress]>('ProxyUpgrade')
  const ProxyOwnershipTransfer = event<[EthereumAddress, EthereumAddress]>(
    'ProxyOwnershipTransfer',
  )

  const FIRST_BLOCK_TIMESTAMP = 987234

  const getLogsStub =
    (logs: providers.Log[]) =>
    (
      _: ChainSpecificAddress,
      topics: (string | string[] | null)[],
    ): Promise<providers.Log[]> => {
      const topic0 = typeof topics[0] === 'string' ? [topics[0]] : topics[0]
      assert(topic0 !== null && topic0 !== undefined)
      return Promise.resolve(logs.filter((l) => topic0.includes(l.topics[0]!)))
    }

  const withBlocks = (logs: providers.Log[]) =>
    logs.map((log, index) => ({
      ...log,
      blockNumber: index + 1,
      transactionHash: Hash256.random().toString(),
    }))

  const blockDate = (blockNumber: number) =>
    UnixTime.toDate(FIRST_BLOCK_TIMESTAMP + blockNumber).toISOString()

  function mockProvider(opts: {
    implementation: ChainSpecificAddress
    admin: ChainSpecificAddress
    paused: bigint
    logs?: providers.Log[]
    owner?: EthereumAddress
  }): IProvider {
    const slotStub =
      <T>(values: [Bytes, T][]) =>
      async (address: ChainSpecificAddress, slot: number | bigint | Bytes) => {
        assert(address === ADDRESS, 'unexpected contract read')
        const match = values.find(([s]) => s.toString() === slot.toString())
        assert(match !== undefined, `unstubbed slot ${slot.toString()}`)
        return match[1]
      }

    return mockObject<IProvider>({
      chain: 'ethereum',
      getStorageAsAddress: slotStub([
        [IMPLEMENTATION_SLOT, opts.implementation],
        [ADMIN_SLOT, opts.admin],
      ]),
      getStorageAsBigint: slotStub([[PAUSED_SLOT, opts.paused]]),
      callMethod: opts.owner
        ? vi.fn(async (address, abi) => {
            assert(
              address === ADDRESS &&
                abi === 'function owner() view returns (address)',
              'unexpected method call',
            )
            return opts.owner
          })
        : vi.fn().mockResolvedValue(undefined),
      getLogs: getLogsStub(opts.logs ?? []),
      getBlock: vi.fn((blockNumber: number) =>
        Promise.resolve({
          number: blockNumber,
          timestamp: FIRST_BLOCK_TIMESTAMP + blockNumber,
        } as providers.Block),
      ),
    })
  }

  it('returns undefined when implementation is not set', async () => {
    const provider = mockProvider({
      implementation: ChainSpecificAddress.ZERO('ethereum'),
      admin: ADMIN,
      paused: 1n,
    })

    const result = await getRailgunProxy(provider, ADDRESS)
    expect(result).toStrictEqual(undefined)
  })

  it('detects unpaused proxy with no upgrades', async () => {
    const provider = mockProvider({
      implementation: IMPLEMENTATION,
      admin: ADMIN,
      paused: 0n,
    })

    const result = await getRailgunProxy(provider, ADDRESS)
    expect(result).toStrictEqual({
      type: 'Railgun proxy',
      values: {
        $admin: ADMIN.toString(),
        $implementation: IMPLEMENTATION.toString(),
        $paused: false,
        $pastUpgrades: [],
        $upgradeCount: 0,
      },
    })
  })

  it('detects paused proxy', async () => {
    const provider = mockProvider({
      implementation: IMPLEMENTATION,
      admin: ADMIN,
      paused: 1n,
    })

    const result = await getRailgunProxy(provider, ADDRESS)
    expect(result?.type).toStrictEqual('Railgun proxy')
    expect(result?.values.$paused).toStrictEqual(true)
  })

  it('falls back to owner() when admin slot is zero', async () => {
    const provider = mockProvider({
      implementation: IMPLEMENTATION,
      admin: ChainSpecificAddress.ZERO('ethereum'),
      paused: 0n,
      owner: ChainSpecificAddress.address(OWNER),
    })

    const result = await getRailgunProxy(provider, ADDRESS)
    expect(result?.values.$admin).toStrictEqual(OWNER.toString())
  })

  it('fetches past upgrades, ignoring unrelated events', async () => {
    const logs = withBlocks([
      ProxyUpgrade(
        ChainSpecificAddress.address(ChainSpecificAddress.ZERO('ethereum')),
        ChainSpecificAddress.address(OLD_IMPLEMENTATION),
      ),
      ProxyOwnershipTransfer(
        ChainSpecificAddress.address(ADMIN),
        ChainSpecificAddress.address(OWNER),
      ),
      ProxyUpgrade(
        ChainSpecificAddress.address(OLD_IMPLEMENTATION),
        ChainSpecificAddress.address(IMPLEMENTATION),
      ),
    ])
    const provider = mockProvider({
      implementation: IMPLEMENTATION,
      admin: ADMIN,
      paused: 0n,
      logs,
    })

    const result = await getRailgunProxy(provider, ADDRESS)
    expect(result?.values.$upgradeCount).toStrictEqual(2)
    expect(result?.values.$pastUpgrades).toStrictEqual([
      [blockDate(1), Hash256(logs[0]!.transactionHash), [OLD_IMPLEMENTATION]],
      [blockDate(3), Hash256(logs[2]!.transactionHash), [IMPLEMENTATION]],
    ])
  })
})
