import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { EthereumClient } from './EthereumClient'
import {
  encodeMulticallV1,
  encodeMulticallV2,
  MULTICALL_BATCH_SIZE,
  MULTICALL_V1_ADDRESS,
  MULTICALL_V1_BLOCK,
  MULTICALL_V2_ADDRESS,
  MULTICALL_V2_BLOCK,
  MulticallClient,
  multicallInterface,
} from './MulticallClient'
import { BlockTag } from './types'

describe(MulticallClient.name, () => {
  const ADDRESS_A = EthereumAddress('0x' + 'a'.repeat(40))
  const ADDRESS_B = EthereumAddress('0x' + 'b'.repeat(40))
  const ADDRESS_C = EthereumAddress('0x' + 'c'.repeat(40))

  interface Call {
    to?: EthereumAddress
    data?: Bytes
    blockTag: BlockTag
  }

  it('falls back to individual requests for old block numbers', async () => {
    const calls: Call[] = []
    const ethereumClient = mockObject<EthereumClient>({
      async call(parameters, blockTag) {
        calls.push({ to: parameters.to, data: parameters.data, blockTag })
        return parameters.data ?? Bytes.EMPTY
      },
    })

    const multicallClient = new MulticallClient(ethereumClient)
    const blockTag = MULTICALL_V1_BLOCK - 1

    const result = await multicallClient.multicall(
      [
        { address: ADDRESS_A, data: Bytes.fromHex('0x123456') },
        { address: ADDRESS_B, data: Bytes.fromHex('0x') },
        { address: ADDRESS_C, data: Bytes.fromHex('0xdeadbeef') },
      ],
      blockTag,
    )
    expect(result).toEqual([
      { success: true, data: Bytes.fromHex('0x123456') },
      // empty result is is treated as unsuccessful!
      { success: false, data: Bytes.fromHex('0x') },
      { success: true, data: Bytes.fromHex('0xdeadbeef') },
    ])
    expect(calls).toEqual([
      { to: ADDRESS_A, data: Bytes.fromHex('0x123456'), blockTag },
      { to: ADDRESS_B, data: Bytes.fromHex('0x'), blockTag },
      { to: ADDRESS_C, data: Bytes.fromHex('0xdeadbeef'), blockTag },
    ])
  })

  it('uses v1 for blocks without v2', async () => {
    const calls: Call[] = []
    const ethereumClient = mockObject<EthereumClient>({
      async call(parameters, blockTag) {
        calls.push({ to: parameters.to, data: parameters.data, blockTag })
        return Bytes.fromHex(
          multicallInterface.encodeFunctionResult('aggregate', [
            blockTag.toString(),
            ['0x12', '0x0f00', '0x'],
          ]),
        )
      },
    })

    const multicallClient = new MulticallClient(ethereumClient)
    const blockTag = MULTICALL_V2_BLOCK - 1

    const result = await multicallClient.multicall(
      [
        { address: ADDRESS_A, data: Bytes.fromHex('0x123456') },
        { address: ADDRESS_B, data: Bytes.fromHex('0x') },
        { address: ADDRESS_C, data: Bytes.fromHex('0xdeadbeef') },
      ],
      blockTag,
    )
    expect(result).toEqual([
      { success: true, data: Bytes.fromHex('0x12') },
      { success: true, data: Bytes.fromHex('0x0f00') },
      // empty result is is treated as unsuccessful!
      { success: false, data: Bytes.fromHex('0x') },
    ])
    expect(calls).toEqual([
      {
        to: MULTICALL_V1_ADDRESS,
        data: encodeMulticallV1([
          { address: ADDRESS_A, data: Bytes.fromHex('0x123456') },
          { address: ADDRESS_B, data: Bytes.fromHex('0x') },
          { address: ADDRESS_C, data: Bytes.fromHex('0xdeadbeef') },
        ]),
        blockTag,
      },
    ])
  })

  it('uses v2 for new blocks', async () => {
    const calls: Call[] = []
    const ethereumClient = mockObject<EthereumClient>({
      async call(parameters, blockTag) {
        calls.push({ to: parameters.to, data: parameters.data, blockTag })
        return Bytes.fromHex(
          multicallInterface.encodeFunctionResult('tryAggregate', [
            [
              [true, '0x12'],
              [false, '0x0f00'],
              [true, '0x'],
            ],
          ]),
        )
      },
    })

    const multicallClient = new MulticallClient(ethereumClient)
    const blockTag = MULTICALL_V2_BLOCK + 1

    const result = await multicallClient.multicall(
      [
        { address: ADDRESS_A, data: Bytes.fromHex('0x123456') },
        { address: ADDRESS_B, data: Bytes.fromHex('0x') },
        { address: ADDRESS_C, data: Bytes.fromHex('0xdeadbeef') },
      ],
      blockTag,
    )
    expect(result).toEqual([
      { success: true, data: Bytes.fromHex('0x12') },
      { success: false, data: Bytes.fromHex('0x0f00') },
      { success: false, data: Bytes.fromHex('0x') },
    ])
    expect(calls).toEqual([
      {
        to: MULTICALL_V2_ADDRESS,
        data: encodeMulticallV2([
          { address: ADDRESS_A, data: Bytes.fromHex('0x123456') },
          { address: ADDRESS_B, data: Bytes.fromHex('0x') },
          { address: ADDRESS_C, data: Bytes.fromHex('0xdeadbeef') },
        ]),
        blockTag,
      },
    ])
  })

  it(`batches calls in batches of ${MULTICALL_BATCH_SIZE}`, async () => {
    const calls: number[] = []
    const ethereumClient = mockObject<EthereumClient>({
      async call(parameters) {
        const callCount: number = multicallInterface.decodeFunctionData(
          'tryAggregate',
          parameters.data?.toString() ?? '',
        )[1].length
        calls.push(callCount)
        return Bytes.fromHex(
          multicallInterface.encodeFunctionResult('tryAggregate', [
            new Array(callCount).fill(0).map(() => [true, '0x1234']),
          ]),
        )
      },
    })

    const multicallClient = new MulticallClient(ethereumClient)
    const blockTag = MULTICALL_V2_BLOCK + 1

    const result = await multicallClient.multicall(
      new Array(MULTICALL_BATCH_SIZE * 2 + 1).fill(0).map(() => ({
        address: ADDRESS_A,
        data: Bytes.fromHex('0x123456'),
      })),
      blockTag,
    )
    expect(result.length).toEqual(MULTICALL_BATCH_SIZE * 2 + 1)
    expect(calls).toEqual([MULTICALL_BATCH_SIZE, MULTICALL_BATCH_SIZE, 1])
  })

  it('offers a named interface', async () => {
    const ethereumClient = mockObject<EthereumClient>({
      async call() {
        return Bytes.fromHex(
          multicallInterface.encodeFunctionResult('tryAggregate', [
            [
              [true, '0x1234'],
              [false, '0xdead'],
            ],
          ]),
        )
      },
    })

    const multicallClient = new MulticallClient(ethereumClient)
    const blockTag = MULTICALL_V2_BLOCK + 1

    const result = await multicallClient.multicallNamed(
      {
        foo: { address: ADDRESS_A, data: Bytes.fromHex('0x123456') },
        bar: { address: ADDRESS_B, data: Bytes.fromHex('0x') },
      },
      blockTag,
    )

    expect(result).toEqual({
      foo: { success: true, data: Bytes.fromHex('0x1234') },
      bar: { success: false, data: Bytes.fromHex('0xdead') },
    })
  })
})
