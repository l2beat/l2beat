import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { describe, expect, it, vi } from 'vitest'

import type { IProvider } from '../../provider/IProvider'
import { callMethod } from './callMethod'

describe('callMethod', () => {
  const ADDRESS = ChainSpecificAddress.random()

  it('decodes multiple return values', async () => {
    const RESULT_VALUE = EthereumAddress.random().toString()

    const abi = new utils.Interface([
      'function testFunction() view returns (address r1, uint64 r2, address r3, uint64 r4)',
    ])

    const provider = {
      callMethod: vi.fn(
        async <T>() =>
          abi.decodeFunctionResult(
            'testFunction',
            abi.encodeFunctionResult('testFunction', [
              RESULT_VALUE,
              1234,
              RESULT_VALUE,
              5678,
            ]),
          ) as T,
      ),
    } as unknown as IProvider

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
    )

    expect(result.value).toStrictEqual([RESULT_VALUE, 1234, RESULT_VALUE, 5678])
  })

  it('decodes an array return value', async () => {
    const RESULT_VALUES = [
      EthereumAddress.random().toString(),
      EthereumAddress.random().toString(),
    ]

    const abi = new utils.Interface([
      'function testFunction() view returns (address[])',
    ])

    const provider = {
      callMethod: vi.fn(
        async () =>
          abi.decodeFunctionResult(
            'testFunction',
            abi.encodeFunctionResult('testFunction', [RESULT_VALUES]),
          )[0],
      ),
    } as unknown as IProvider

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
    )

    expect(result.value).toStrictEqual(RESULT_VALUES)
  })

  it('decodes a scalar return value', async () => {
    const RETURN_VALUE = EthereumAddress.random().toString()
    const abi = new utils.Interface([
      'function testFunction() view returns (address)',
    ])

    const provider = {
      callMethod: vi.fn(
        async () =>
          abi.decodeFunctionResult(
            'testFunction',
            abi.encodeFunctionResult('testFunction', [RETURN_VALUE]),
          )[0],
      ),
    } as unknown as IProvider

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
    )

    expect(result.value).toStrictEqual(RETURN_VALUE.toString())
  })
})
