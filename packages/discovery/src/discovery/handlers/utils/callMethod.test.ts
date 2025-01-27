import type { ContractValue } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { utils } from 'ethers'

import type { IProvider } from '../../provider/IProvider'
import { callMethod } from './callMethod'

describe('callMethod', () => {
  const ADDRESS = EthereumAddress.random()

  it('decodes struct returns', async () => {
    const RESULT_VALUE = EthereumAddress.random().toString()

    const abi = new utils.Interface([
      'function testFunction() view returns (tuple(address r1, uint64 r2, address r3, uint64 r4))',
    ])

    const provider = mockObject<IProvider>({
      callMethod: async () =>
        abi.decodeFunctionResult(
          'testFunction',
          abi.encodeFunctionResult('testFunction', [
            [RESULT_VALUE, 1234, RESULT_VALUE, 5678],
          ]),
        )[0],
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
      ['r1', 'r4'],
    )

    expect(result.value).toEqual([RESULT_VALUE, 5678])
  })

  it('decodes struct-in-struct returns', async () => {
    const RESULT_VALUE = EthereumAddress.random().toString()

    const abi = new utils.Interface([
      'function testFunction() view returns (tuple(tuple(address r1, uint64 r2) ra1, tuple(address r3, uint64 r4) rb1))',
    ])

    const provider = mockObject<IProvider>({
      callMethod: async () =>
        abi.decodeFunctionResult(
          'testFunction',
          abi.encodeFunctionResult('testFunction', [
            [
              [RESULT_VALUE, 1234],
              [RESULT_VALUE, 5678],
            ],
          ]),
        )[0],
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
      ['ra1.r1', 'rb1.r4'],
    )

    expect(result.value).toEqual([RESULT_VALUE, 5678])
  })

  it('picks from multiple return values', async () => {
    const RESULT_VALUE = EthereumAddress.random().toString()

    const abi = new utils.Interface([
      'function testFunction() view returns (address r1, uint64 r2, address r3, uint64 r4)',
    ])

    const provider = mockObject<IProvider>({
      callMethod: async <T>() =>
        abi.decodeFunctionResult(
          'testFunction',
          abi.encodeFunctionResult('testFunction', [
            RESULT_VALUE,
            1234,
            RESULT_VALUE,
            5678,
          ]),
        ) as T,
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
      ['r1', 'r4'],
    )

    expect(result.value).toEqual([RESULT_VALUE, 5678])
  })

  it('decodes multiple return values', async () => {
    const RESULT_VALUE = EthereumAddress.random().toString()

    const abi = new utils.Interface([
      'function testFunction() view returns (address r1, uint64 r2, address r3, uint64 r4)',
    ])

    const provider = mockObject<IProvider>({
      callMethod: async <T>() =>
        abi.decodeFunctionResult(
          'testFunction',
          abi.encodeFunctionResult('testFunction', [
            RESULT_VALUE,
            1234,
            RESULT_VALUE,
            5678,
          ]),
        ) as T,
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
    )

    expect(result.value).toEqual([RESULT_VALUE, 1234, RESULT_VALUE, 5678])
  })

  it('picks from array return value', async () => {
    const RESULT_VALUES = [
      EthereumAddress.random().toString(),
      EthereumAddress.random().toString(),
    ]

    const abi = new utils.Interface([
      'function testFunction() view returns (address[])',
    ])

    const provider = mockObject<IProvider>({
      callMethod: async () =>
        abi.decodeFunctionResult(
          'testFunction',
          abi.encodeFunctionResult('testFunction', [RESULT_VALUES]),
        )[0],
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
      ['1'],
    )

    expect((result.value as ContractValue[])[0]).toEqual(RESULT_VALUES[1])
  })

  it('decodes an array return value', async () => {
    const RESULT_VALUES = [
      EthereumAddress.random().toString(),
      EthereumAddress.random().toString(),
    ]

    const abi = new utils.Interface([
      'function testFunction() view returns (address[])',
    ])

    const provider = mockObject<IProvider>({
      callMethod: async () =>
        abi.decodeFunctionResult(
          'testFunction',
          abi.encodeFunctionResult('testFunction', [RESULT_VALUES]),
        )[0],
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
    )

    expect(result.value).toEqual(RESULT_VALUES)
  })

  it('picks from 3d array return value', async () => {
    const RESULT_VALUES = [
      [
        [
          EthereumAddress.random().toString(),
          EthereumAddress.random().toString(),
        ],
        [EthereumAddress.random().toString()],
      ],
      [
        [
          EthereumAddress.random().toString(),
          EthereumAddress.random().toString(),
          EthereumAddress.random().toString(),
        ],
      ],
    ]

    const abi = new utils.Interface([
      'function testFunction() view returns (address[][][])',
    ])

    const provider = mockObject<IProvider>({
      callMethod: async () =>
        abi.decodeFunctionResult(
          'testFunction',
          abi.encodeFunctionResult('testFunction', [RESULT_VALUES]),
        )[0],
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
      ['1.0.2'],
    )

    expect((result.value as ContractValue[])[0]).toEqual(
      RESULT_VALUES.at(1)?.at(0)?.at(2),
    )
  })

  it('throws on trying to pick from scalar return value', async () => {
    const abi = new utils.Interface([
      'function testFunction() view returns (uint256)',
    ])

    const provider = mockObject<IProvider>({
      callMethod: async () =>
        abi.decodeFunctionResult(
          'testFunction',
          abi.encodeFunctionResult('testFunction', [1234]),
        )[0],
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
      ['field'],
    )

    expect(result.error).toEqual(
      'Cannot pick fields from a non-struct-like return value',
    )
  })

  it('decodes a scalar return value', async () => {
    const RETURN_VALUE = EthereumAddress.random()
    const abi = new utils.Interface([
      'function testFunction() view returns (address)',
    ])

    const provider = mockObject<IProvider>({
      callMethod: async () =>
        abi.decodeFunctionResult(
          'testFunction',
          abi.encodeFunctionResult('testFunction', [RETURN_VALUE]),
        )[0],
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
    )

    expect(result.value).toEqual(RETURN_VALUE.toString())
  })
})
