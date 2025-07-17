import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { type CallProvider, MulticallClient } from './MulticallClient'
import {
  decodeMulticall3,
  encodeMulticall3,
  multicallInterface,
} from './MulticallConfig'
import type { MulticallConfig } from './types'

describe(MulticallClient.name, () => {
  const ADDRESS_A = EthereumAddress('0x' + 'a'.repeat(40))
  const ADDRESS_B = EthereumAddress('0x' + 'b'.repeat(40))
  const ADDRESS_C = EthereumAddress('0x' + 'c'.repeat(40))

  const ADDRESS_3 = EthereumAddress('0x' + '3'.repeat(40))

  const MULTICALL3_BLOCK = 3_333
  const BATCH_SIZE = 3
  const TEST_MULTICALL_CONFIG: MulticallConfig = {
    sinceBlock: MULTICALL3_BLOCK,
    batchSize: BATCH_SIZE,
    address: ADDRESS_3,
    encodeBatch: encodeMulticall3,
    decodeBatch: decodeMulticall3,
  }

  interface Call {
    address?: EthereumAddress
    data?: Bytes
  }

  it('falls back to individual requests for old block numbers', async () => {
    const calls: Call[] = []
    const discoveryProvider = mockObject<CallProvider>({
      async call(address, data) {
        calls.push({ address: address, data })
        return data
      },
    })

    const multicallClient = new MulticallClient(
      discoveryProvider,
      TEST_MULTICALL_CONFIG,
    )
    const blockNumber = MULTICALL3_BLOCK - 1
    const result = await multicallClient.multicall(
      [
        { address: ADDRESS_A, data: Bytes.fromHex('0x123456') },
        { address: ADDRESS_B, data: Bytes.fromHex('0x') },
        { address: ADDRESS_C, data: Bytes.fromHex('0xdeadbeef') },
      ],
      blockNumber,
    )
    expect(result).toEqual([
      { success: true, data: Bytes.fromHex('0x123456') },
      // empty result is treated as unsuccessful!
      { success: false, data: Bytes.fromHex('0x') },
      { success: true, data: Bytes.fromHex('0xdeadbeef') },
    ])
    expect(calls).toEqual([
      { address: ADDRESS_A, data: Bytes.fromHex('0x123456') },
      { address: ADDRESS_B, data: Bytes.fromHex('0x') },
      { address: ADDRESS_C, data: Bytes.fromHex('0xdeadbeef') },
    ])
  })

  it('uses multicall for new blocks', async () => {
    const calls: Call[] = []
    const discoveryProvider = mockObject<CallProvider>({
      async call(address, data) {
        calls.push({ address, data })
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

    const multicallClient = new MulticallClient(
      discoveryProvider,
      TEST_MULTICALL_CONFIG,
    )
    const blockNumber = MULTICALL3_BLOCK + 1

    const result = await multicallClient.multicall(
      [
        { address: ADDRESS_A, data: Bytes.fromHex('0x123456') },
        { address: ADDRESS_B, data: Bytes.fromHex('0x') },
        { address: ADDRESS_C, data: Bytes.fromHex('0xdeadbeef') },
      ],
      blockNumber,
    )
    expect(result).toEqual([
      { success: true, data: Bytes.fromHex('0x12') },
      { success: false, data: Bytes.fromHex('0x0f00') },
      { success: false, data: Bytes.fromHex('0x') },
    ])
    expect(calls).toEqual([
      {
        address: ADDRESS_3,
        data: encodeMulticall3([
          { address: ADDRESS_A, data: Bytes.fromHex('0x123456') },
          { address: ADDRESS_B, data: Bytes.fromHex('0x') },
          { address: ADDRESS_C, data: Bytes.fromHex('0xdeadbeef') },
        ]),
      },
    ])
  })

  it('batches calls', async () => {
    const calls: number[] = []
    const discoveryProvider = mockObject<CallProvider>({
      async call(_, data) {
        const callCount: number = multicallInterface.decodeFunctionData(
          'tryAggregate',
          data.toString(),
        )[1].length
        calls.push(callCount)
        return Bytes.fromHex(
          multicallInterface.encodeFunctionResult('tryAggregate', [
            new Array(callCount).fill(0).map(() => [true, '0x1234']),
          ]),
        )
      },
    })

    const multicallClient = new MulticallClient(
      discoveryProvider,
      TEST_MULTICALL_CONFIG,
    )
    const blockNumber = MULTICALL3_BLOCK + 1

    const result = await multicallClient.multicall(
      new Array(BATCH_SIZE * 2 + 1).fill(0).map(() => ({
        address: ADDRESS_A,
        data: Bytes.fromHex('0x123456'),
      })),
      blockNumber,
    )
    expect(result.length).toEqual(BATCH_SIZE * 2 + 1)
    expect(calls).toEqual([BATCH_SIZE, BATCH_SIZE, 1])
  })

  it('offers a named interface', async () => {
    const discoveryProvider = mockObject<CallProvider>({
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

    const multicallClient = new MulticallClient(
      discoveryProvider,
      TEST_MULTICALL_CONFIG,
    )
    const blockNumber = MULTICALL3_BLOCK + 1

    const result = await multicallClient.multicallNamed(
      {
        foo: [{ address: ADDRESS_A, data: Bytes.fromHex('0x123456') }],
        bar: [{ address: ADDRESS_B, data: Bytes.fromHex('0x') }],
      },
      blockNumber,
    )

    expect(result).toEqual({
      foo: [{ success: true, data: Bytes.fromHex('0x1234') }],
      bar: [{ success: false, data: Bytes.fromHex('0xdead') }],
    })
  })

  const outOfGasMessage = [
    'out of gas', // normal
    'out of gas: out of gas', // whatever QucikNode is doing...
  ]

  for (const message of outOfGasMessage) {
    it(`recalls everything individually if [${message}]`, async () => {
      // NOTE(radomski): Amazing gambit ethers
      const error = new Error('bad') as any
      error['error'] = { error: { code: 123, message } }

      const discoveryProvider = mockObject<CallProvider>({
        call: mockFn().throwsOnce(error).returns(Bytes.fromHex('0x42ab')),
      })

      const multicallClient = new MulticallClient(
        discoveryProvider,
        TEST_MULTICALL_CONFIG,
      )
      const blockNumber = MULTICALL3_BLOCK + 1
      const result = await multicallClient.multicall(
        [
          { address: ADDRESS_A, data: Bytes.fromHex('0x123456') },
          { address: ADDRESS_B, data: Bytes.fromHex('0x') },
          { address: ADDRESS_C, data: Bytes.fromHex('0xdeadbeef') },
        ],
        blockNumber,
      )

      expect(result).toEqual([
        { success: true, data: Bytes.fromHex('0x42ab') },
        { success: true, data: Bytes.fromHex('0x42ab') },
        { success: true, data: Bytes.fromHex('0x42ab') },
      ])
    })
  }
})
