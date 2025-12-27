import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { IProvider } from '../../provider/IProvider'
import { getSimpleTargetProxy } from './SimpleTargetProxy'

describe(getSimpleTargetProxy.name, () => {
  const address = ChainSpecificAddress.random()
  const owner = ChainSpecificAddress.random()
  const target = ChainSpecificAddress.random()

  it('detects simple target proxy', async () => {
    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      callMethod: mockFn()
        .given(address, 'function owner() view returns (address)', [])
        .resolvesToOnce(ChainSpecificAddress.address(owner))
        .given(address, 'function target() view returns (address)', [])
        .resolvesToOnce(ChainSpecificAddress.address(target)),
    })

    const result = await getSimpleTargetProxy(provider, address)

    expect(result).toEqual({
      type: 'simple target proxy',
      values: {
        $admin: owner.toString(),
        $implementation: target.toString(),
      },
    })
  })

  it('returns undefined when target is zero', async () => {
    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      callMethod: mockFn()
        .given(address, 'function owner() view returns (address)', [])
        .resolvesToOnce(ChainSpecificAddress.address(owner))
        .given(address, 'function target() view returns (address)', [])
        .resolvesToOnce(EthereumAddress.ZERO),
    })

    const result = await getSimpleTargetProxy(provider, address)

    expect(result).toEqual(undefined)
  })
})
