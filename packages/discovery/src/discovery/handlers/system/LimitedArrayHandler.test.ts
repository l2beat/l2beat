import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { IProvider, RawProviders } from '../../provider/IProvider'
import { toFunctionFragment } from '../utils/toFunctionFragment'
import { LimitedArrayHandler } from './LimitedArrayHandler'

describe(LimitedArrayHandler.name, () => {
  const method = 'function owners(uint256 index) view returns (address)'
  const returnFragment = toFunctionFragment(
    'function owners(uint256 index) view returns (address[])',
  )

  it('calls the passed method n times', async () => {
    const address = EthereumAddress.random()
    const owners = [
      EthereumAddress.random(),
      EthereumAddress.random(),
      EthereumAddress.random(),
    ]

    const provider = mockObject<IProvider>({
      async raw<T>(
        cacheKey: string,
        _fn: (providers: RawProviders) => Promise<T>,
      ) {
        const index = parseInt(cacheKey.split('.').pop()!)

        return owners[index]!.toString() as T
      },
      blockNumber: 1,
    })

    const handler = new LimitedArrayHandler(method, 3, DiscoveryLogger.SILENT)
    expect(handler.field).toEqual('owners')

    const result = await handler.execute(provider, address)
    expect(result).toEqual({
      field: 'owners',
      value: owners.map((x) => x.toString()),
      error: 'Too many values. Update configuration to explore fully',
      fragment: returnFragment,
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
      async raw<T>(
        cacheKey: string,
        _fn: (providers: RawProviders) => Promise<T>,
      ) {
        const index = parseInt(cacheKey.split('.').pop()!)
        if (index === 2) {
          return undefined as T
        }
        return owners[index]!.toString() as T
      },
      blockNumber: 1,
    })

    const handler = new LimitedArrayHandler(method, 3, DiscoveryLogger.SILENT)
    const result = await handler.execute(provider, address)
    expect(result).toEqual({
      field: 'owners',
      value: owners.map((x) => x.toString()).slice(0, 2),
      fragment: returnFragment,
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
      async raw<T>(
        cacheKey: string,
        _fn: (providers: RawProviders) => Promise<T>,
      ) {
        const index = parseInt(cacheKey.split('.').pop()!)
        if (index === 2) {
          throw 'foo bar'
        }
        return owners[index]!.toString() as T
      },
      blockNumber: 1,
    })

    const handler = new LimitedArrayHandler(method, 3, DiscoveryLogger.SILENT)
    const result = await handler.execute(provider, address)
    expect(result).toEqual({
      field: 'owners',
      error: 'foo bar',
      fragment: returnFragment,
    })
  })
})
