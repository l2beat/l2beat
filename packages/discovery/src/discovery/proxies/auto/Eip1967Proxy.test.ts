import { ChainSpecificAddress, Hash256, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { type providers, utils } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import { detectEip1967Proxy } from './Eip1967Proxy'

describe(detectEip1967Proxy.name, () => {
  it('reads ProxyUpgrade events', async () => {
    const address = ChainSpecificAddress.random()
    const admin = ChainSpecificAddress.random()
    const implementation = ChainSpecificAddress.random()
    const transactionHash = Hash256.random()
    const abi = new utils.Interface([
      'event ProxyUpgrade(address previousImplementation, address implementation)',
    ])
    const encoded = abi.encodeEventLog(abi.getEvent('ProxyUpgrade'), [
      ChainSpecificAddress.address(ChainSpecificAddress.random()),
      ChainSpecificAddress.address(implementation),
    ])
    const log = mockObject<providers.Log>({
      blockNumber: 123,
      transactionHash,
      topics: encoded.topics,
      data: encoded.data,
    })
    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      getStorageAsAddress: mockFn()
        .resolvesToOnce(implementation)
        .resolvesToOnce(admin),
      getLogs: mockFn().resolvesToOnce([log]),
      getBlock: mockFn().resolvesToOnce({
        number: 123,
        timestamp: UnixTime(1_000),
      } as providers.Block),
    })

    const result = await detectEip1967Proxy(provider, address)

    expect(result).toEqual({
      type: 'EIP1967 proxy',
      values: {
        $admin: admin.toString(),
        $implementation: implementation.toString(),
        $pastUpgrades: [
          ['1970-01-01T00:16:40.000Z', transactionHash, [implementation]],
        ],
        $upgradeCount: 1,
      },
    })
  })
})
