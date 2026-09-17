import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { IProvider } from '../../provider/IProvider'
import { getZkLinkProxy } from './ZkLinkProxy'

describe(getZkLinkProxy.name, () => {
  const address = ChainSpecificAddress.random()
  const admin = ChainSpecificAddress.random()
  const implementation = ChainSpecificAddress.random()
  const periphery = ChainSpecificAddress.random()

  it('includes the periphery contract in the implementation', async () => {
    const provider = {
      chain: 'ethereum',
      callMethod: vi
        .fn()
        .mockResolvedValueOnce(
          ChainSpecificAddress.address(periphery) as EthereumAddress,
        ),
      getLogs: vi.fn().mockResolvedValueOnce([]),
      getStorageAsAddress: vi
        .fn()
        .mockResolvedValueOnce(implementation)
        .mockResolvedValueOnce(admin),
    } as unknown as IProvider

    const result = await getZkLinkProxy(provider, address)

    expect(provider.callMethod).toHaveBeenCalledExactlyOnceWith(
      address,
      'function periphery() view returns (address)',
      [],
    )
    expect(result).toStrictEqual({
      type: 'ZkLink proxy',
      values: {
        $admin: admin.toString(),
        $implementation: [implementation.toString(), periphery.toString()],
      },
    })
  })
})
