import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import type { IProvider } from '../../provider/IProvider'
import { toFunctionFragment } from '../utils/toFunctionFragment'
import { SimpleMethodHandler } from './SimpleMethodHandler'

describe(SimpleMethodHandler.name, () => {
  it('can correctly call balanceOf', async () => {
    const address = ChainSpecificAddress.random()
    const provider = mockObject<IProvider>({
      async callMethod<T>(
        a: ChainSpecificAddress,
        _abi: string,
        _data: unknown[],
      ) {
        expect(a).toEqual(address)
        return 291 as T
      },
    })

    const method = 'function balanceOf() view returns (uint256)'
    const fragment = toFunctionFragment(method)
    const handler = new SimpleMethodHandler(method)
    expect(handler.field).toEqual('balanceOf')

    const result = await handler.execute(provider, address)
    expect(result).toEqual({
      field: 'balanceOf',
      value: 0x123,
      fragment,
    })
  })

  it('handles a revert', async () => {
    const method = 'function balanceOf() view returns (uint256)'
    const fragment = toFunctionFragment(method)
    const handler = new SimpleMethodHandler(method)

    const provider = mockObject<IProvider>({
      async callMethod() {
        throw new Error('Execution reverted')
      },
    })
    const address = ChainSpecificAddress.random()
    const result = await handler.execute(provider, address)
    expect(result).toEqual({
      field: 'balanceOf',
      error: 'Execution reverted',
      fragment,
    })
  })

  it('handles any other error', async () => {
    const method = 'function balanceOf() view returns (uint256)'
    const fragment = toFunctionFragment(method)
    const handler = new SimpleMethodHandler(method)

    const provider = mockObject<IProvider>({
      async callMethod() {
        throw new Error('foo bar')
      },
    })
    const address = ChainSpecificAddress.random()
    const result = await handler.execute(provider, address)
    expect(result).toEqual({
      field: 'balanceOf',
      error: 'foo bar',
      fragment,
    })
  })

  it('rewrites $foo as _$foo', async () => {
    const method = 'function $foo() view returns (uint256)'
    const fragment = toFunctionFragment(method)
    const handler = new SimpleMethodHandler(method)

    const provider = mockObject<IProvider>({
      async callMethod<T>() {
        return 1 as T
      },
    })
    const address = ChainSpecificAddress.random()
    const result = await handler.execute(provider, address)
    expect(result).toEqual({
      field: '_$foo',
      fragment,
      value: 1,
    })
  })
})
