import { expect, mockObject } from 'earl'
import { utils } from 'ethers'

import { Bytes } from '../../../utils/Bytes'
import { EthereumAddress } from '../../../utils/EthereumAddress'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { callMethod } from './callMethod'

describe('callMethod', () => {
  const ADDRESS = EthereumAddress.random()
  const BLOCK_NUMBER = 1234
  const encoder = utils.defaultAbiCoder

  it('decodes struct returns', async () => {
    const RESULT_VALUE = EthereumAddress.random().toString()

    const abi = new utils.Interface([
      'function testFunction() view returns (tuple(address r1, uint64 r2, address r3, uint64 r4))',
    ])

    const provider = mockObject<DiscoveryProvider>({
      call: async () =>
        Bytes.fromHex(
          encoder.encode(
            ['tuple(address r1, uint64 r2, address r3, uint64 r4)'],
            [[RESULT_VALUE, 1234, RESULT_VALUE, 5678]],
          ),
        ),
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
      BLOCK_NUMBER,
      ['r1', 'r4'],
    )

    expect(result.value).toEqual([RESULT_VALUE, 5678])
  })

  it('picks from multiple return values', async () => {
    const RESULT_VALUE = EthereumAddress.random().toString()

    const abi = new utils.Interface([
      'function testFunction() view returns (address r1, uint64 r2, address r3, uint64 r4)',
    ])

    const provider = mockObject<DiscoveryProvider>({
      call: async () =>
        Bytes.fromHex(
          encoder.encode(
            ['address r1', 'uint64 r2', 'address r3', 'uint64 r4'],
            [RESULT_VALUE, 1234, RESULT_VALUE, 5678],
          ),
        ),
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
      BLOCK_NUMBER,
      ['r1', 'r4'],
    )

    expect(result.value).toEqual([RESULT_VALUE, 5678])
  })

  it('decodes multiple return values', async () => {
    const RESULT_VALUE = EthereumAddress.random().toString()

    const abi = new utils.Interface([
      'function testFunction() view returns (address r1, uint64 r2, address r3, uint64 r4)',
    ])

    const provider = mockObject<DiscoveryProvider>({
      call: async () =>
        Bytes.fromHex(
          encoder.encode(
            ['address r1', 'uint64 r2', 'address r3', 'uint64 r4'],
            [RESULT_VALUE, 1234, RESULT_VALUE, 5678],
          ),
        ),
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
      BLOCK_NUMBER,
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

    const provider = mockObject<DiscoveryProvider>({
      call: async () =>
        Bytes.fromHex(encoder.encode(['address[]'], [RESULT_VALUES])),
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
      BLOCK_NUMBER,
      [1],
    )

    expect(result.value).toEqual(RESULT_VALUES[1])
  })

  it('decodes an array return value', async () => {
    const RESULT_VALUES = [
      EthereumAddress.random().toString(),
      EthereumAddress.random().toString(),
    ]

    const abi = new utils.Interface([
      'function testFunction() view returns (address[])',
    ])

    const provider = mockObject<DiscoveryProvider>({
      call: async () =>
        Bytes.fromHex(encoder.encode(['address[]'], [RESULT_VALUES])),
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
      BLOCK_NUMBER,
    )

    expect(result.value).toEqual(RESULT_VALUES)
  })

  it('throws on trying to pick from scalar return value', async () => {
    const abi = new utils.Interface([
      'function testFunction() view returns (uint256)',
    ])

    const provider = mockObject<DiscoveryProvider>({
      call: async () => Bytes.randomOfLength(32),
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
      BLOCK_NUMBER,
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

    const provider = mockObject<DiscoveryProvider>({
      call: async () => Bytes.fromHex(RETURN_VALUE.toString()).padStart(32),
    })

    const result = await callMethod(
      provider,
      ADDRESS,
      abi.getFunction('testFunction'),
      [],
      BLOCK_NUMBER,
    )

    expect(result.value).toEqual(RETURN_VALUE.toString())
  })
})
