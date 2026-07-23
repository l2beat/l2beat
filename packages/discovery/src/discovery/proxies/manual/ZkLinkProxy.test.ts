import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { IProvider } from '../../provider/IProvider'
import { getZkLinkProxy } from './ZkLinkProxy'

describe(getZkLinkProxy.name, () => {
  const address = ChainSpecificAddress.random()
  const admin = ChainSpecificAddress.random()
  const implementation = ChainSpecificAddress.random()
  const periphery = ChainSpecificAddress.random()

  it('includes the periphery contract in the implementation', async () => {
    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      callMethod: mockFn()
        .given(address, 'function periphery() view returns (address)', [])
        .resolvesToOnce(
          ChainSpecificAddress.address(periphery) as EthereumAddress,
        ),
      getLogs: mockFn().resolvesToOnce([]),
      getStorageAsAddress: mockFn()
        .resolvesToOnce(implementation)
        .resolvesToOnce(admin),
    })

    const result = await getZkLinkProxy(provider, address)

    expect(result).toEqual({
      type: 'ZkLink proxy',
      values: {
        $admin: admin.toString(),
        $implementation: [implementation.toString(), periphery.toString()],
      },
    })
  })
})
