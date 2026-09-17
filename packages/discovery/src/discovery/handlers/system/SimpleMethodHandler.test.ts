import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'

import type { IProvider } from '../../provider/IProvider'
import { toFunctionFragment } from '../utils/toFunctionFragment'
import { SimpleMethodHandler } from './SimpleMethodHandler'

describe(SimpleMethodHandler.name, () => {
  it('can correctly call balanceOf', async () => {
    const address = ChainSpecificAddress.random()
    const provider = {
      callMethod: vi.fn(
        async <T>(a: ChainSpecificAddress, _abi: string, _data: unknown[]) => {
          expect(a).toStrictEqual(address)
          return 291 as T
        },
      ),
    } as unknown as IProvider

    const method = 'function balanceOf() view returns (uint256)'
    const fragment = toFunctionFragment(method)
    const handler = new SimpleMethodHandler(method)
    expect(handler.field).toStrictEqual('balanceOf')

    const result = await handler.execute(provider, address)
    expect(result).toStrictEqual({
      field: 'balanceOf',
      value: 0x123,
      fragment,
    })
  })

  it('handles a revert', async () => {
    const method = 'function balanceOf() view returns (uint256)'
    const fragment = toFunctionFragment(method)
    const handler = new SimpleMethodHandler(method)

    const provider = {
      callMethod: vi.fn(async () => {
        throw new Error('Execution reverted')
      }),
    } as unknown as IProvider
    const address = ChainSpecificAddress.random()
    const result = await handler.execute(provider, address)
    expect(result).toStrictEqual({
      field: 'balanceOf',
      error: 'Execution reverted',
      fragment,
    })
  })

  it('handles any other error', async () => {
    const method = 'function balanceOf() view returns (uint256)'
    const fragment = toFunctionFragment(method)
    const handler = new SimpleMethodHandler(method)

    const provider = {
      callMethod: vi.fn(async () => {
        throw new Error('foo bar')
      }),
    } as unknown as IProvider
    const address = ChainSpecificAddress.random()
    const result = await handler.execute(provider, address)
    expect(result).toStrictEqual({
      field: 'balanceOf',
      error: 'foo bar',
      fragment,
    })
  })

  it('rewrites $foo as _$foo', async () => {
    const method = 'function $foo() view returns (uint256)'
    const fragment = toFunctionFragment(method)
    const handler = new SimpleMethodHandler(method)

    const provider = {
      callMethod: vi.fn(async <T>() => {
        return 1 as T
      }),
    } as unknown as IProvider
    const address = ChainSpecificAddress.random()
    const result = await handler.execute(provider, address)
    expect(result).toStrictEqual({
      field: '_$foo',
      fragment,
      value: 1,
    })
  })
})
