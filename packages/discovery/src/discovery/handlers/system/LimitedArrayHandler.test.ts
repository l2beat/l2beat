import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { IProvider } from '../../provider/IProvider'
import { LimitedArrayHandler } from './LimitedArrayHandler'

describe(LimitedArrayHandler.name, () => {
  const method = 'function owners(uint256 index) view returns (address)'

  it('calls the passed method n times', async () => {
    const address = EthereumAddress.random()
    const owners = [
      EthereumAddress.random(),
      EthereumAddress.random(),
      EthereumAddress.random(),
    ]

    const provider = mockObject<IProvider>({
      async callMethod<T>(a: EthereumAddress, _abi: string, data: unknown[]) {
        expect(a).toEqual(address)
        const index = data[0] as number
        expect(data).toEqual([index])
        return owners[index]!.toString() as T
      },
    })

    const handler = new LimitedArrayHandler(method, 3, DiscoveryLogger.SILENT)
    expect(handler.field).toEqual('owners')

    const result = await handler.execute(provider, address)
    expect(result).toEqual({
      field: 'owners',
      value: owners.map((x) => x.toString()),
      error: 'Too many values. Update configuration to explore fully',
    })
  })

  it('handles a revert', async () => {
    const address = EthereumAddress.random()
    const owners = [
      EthereumAddress.random(),
      EthereumAddress.random(),
      EthereumAddress.random(),
    ]

    const provider = mockObject<IProvider>({
      async callMethod<T>(a: EthereumAddress, _abi: string, data: unknown[]) {
        expect(a).toEqual(address)

        const index = data[0] as number
        expect(data).toEqual([index])
        if (index === 2) {
          return undefined as T
        }

        return owners[index]!.toString() as T
      },
    })

    const handler = new LimitedArrayHandler(method, 3, DiscoveryLogger.SILENT)
    const result = await handler.execute(provider, address)
    expect(result).toEqual({
      field: 'owners',
      value: owners.map((x) => x.toString()).slice(0, 2),
    })
  })

  it('handles other errors', async () => {
    const address = EthereumAddress.random()
    const owners = [
      EthereumAddress.random(),
      EthereumAddress.random(),
      EthereumAddress.random(),
    ]

    const provider = mockObject<IProvider>({
      async callMethod<T>(a: EthereumAddress, _abi: string, data: unknown[]) {
        expect(a).toEqual(address)

        const index = data[0] as number
        expect(data).toEqual([index])
        if (index === 2) {
          throw 'foo bar'
        }

        return owners[index]!.toString() as T
      },
    })

    const handler = new LimitedArrayHandler(method, 3, DiscoveryLogger.SILENT)
    const result = await handler.execute(provider, address)
    expect(result).toEqual({
      field: 'owners',
      error: 'foo bar',
    })
  })

  it('rewrites $foo to _$foo', async () => {
    const address = EthereumAddress.random()
    const provider = mockObject<IProvider>({
      async callMethod<T>(a: EthereumAddress, _abi: string, data: unknown[]) {
        expect(a).toEqual(address)
        const index = data[0] as number
        expect(data).toEqual([index])
        if (index === 1) {
          return undefined
        }
        return 1 as T
      },
    })

    const handler = new LimitedArrayHandler(
      'function $foo(uint256 index) view returns (uint)',
      2,
      DiscoveryLogger.SILENT,
    )
    const result = await handler.execute(provider, address)
    expect(result).toEqual({
      field: '_$foo',
      value: [1],
    })
  })
})
