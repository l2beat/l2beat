import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import { MulticallV3Client, multicallInterface } from './MulticallV3Client'

describe(MulticallV3Client.name, () => {
  const address = EthereumAddress.random()
  const sinceBlock = 1000
  const batchSize = 3

  let client: MulticallV3Client

  beforeEach(() => {
    client = new MulticallV3Client(address, sinceBlock, batchSize)
  })

  describe('encodeBatches', () => {
    it('encodes a single batch when requests are fewer than batch size', () => {
      const to1 = EthereumAddress.random()
      const to2 = EthereumAddress.random()
      const data1 = Bytes.fromHex('0x123456')
      const data2 = Bytes.fromHex('0xabcdef')

      const requests = [
        { to: to1, data: data1 },
        { to: to2, data: data2 },
      ]

      const result = client.encodeBatches(requests)

      expect(result.length).toEqual(1)

      const expectedCalldata = multicallInterface.encodeFunctionData(
        'tryAggregate',
        [
          false,
          [
            [to1.toString(), data1.toString()],
            [to2.toString(), data2.toString()],
          ],
        ],
      )

      expect(result[0].to).toEqual(address)
      expect(result[0].data).toEqual(Bytes.fromHex(expectedCalldata))
    })

    it('splits requests into multiple batches when exceeding batch size', () => {
      const requests = Array.from({ length: 7 }, () => ({
        to: EthereumAddress.random(),
        data: Bytes.fromHex('0x1234'),
      }))

      const result = client.encodeBatches(requests)

      expect(result.length).toEqual(3)

      // First batch should have 3 items
      const firstBatchCalldata = multicallInterface.encodeFunctionData(
        'tryAggregate',
        [
          false,
          requests.slice(0, 3).map((r) => [r.to.toString(), r.data.toString()]),
        ],
      )

      // Second batch should have 3 items
      const secondBatchCalldata = multicallInterface.encodeFunctionData(
        'tryAggregate',
        [
          false,
          requests.slice(3, 6).map((r) => [r.to.toString(), r.data.toString()]),
        ],
      )

      // Third batch should have 1 item
      const thirdBatchCalldata = multicallInterface.encodeFunctionData(
        'tryAggregate',
        [
          false,
          requests.slice(6, 7).map((r) => [r.to.toString(), r.data.toString()]),
        ],
      )

      expect(result[0].data).toEqual(Bytes.fromHex(firstBatchCalldata))
      expect(result[1].data).toEqual(Bytes.fromHex(secondBatchCalldata))
      expect(result[2].data).toEqual(Bytes.fromHex(thirdBatchCalldata))
    })

    it('returns empty array for empty requests', () => {
      const result = client.encodeBatches([])
      expect(result).toEqual([])
    })
  })

  describe('decode', () => {
    it('decodes successful responses', () => {
      // Create mock response data as it would come from the multicall contract
      const mockResponseData = utils.defaultAbiCoder.encode(
        ['tuple(bool success, bytes returnData)[]'],
        [
          [
            [
              true,
              '0x000000000000000000000000000000000000000000000000000000000001e240',
            ],
            [
              true,
              '0x00000000000000000000000000000000000000000000000000000000000f4240',
            ],
          ],
        ],
      )

      const result = client.decode(Bytes.fromHex(mockResponseData))

      expect(result).toEqual([
        {
          success: true,
          data: Bytes.fromHex(
            '0x000000000000000000000000000000000000000000000000000000000001e240',
          ),
        },
        {
          success: true,
          data: Bytes.fromHex(
            '0x00000000000000000000000000000000000000000000000000000000000f4240',
          ),
        },
      ])
    })

    it('handles failed responses', () => {
      const mockResponseData = utils.defaultAbiCoder.encode(
        ['tuple(bool success, bytes returnData)[]'],
        [
          [
            [false, '0x'], // Failed call with empty return data
            [
              true,
              '0x00000000000000000000000000000000000000000000000000000000000f4240',
            ],
          ],
        ],
      )

      const result = client.decode(Bytes.fromHex(mockResponseData))

      expect(result).toEqual([
        { success: false, data: Bytes.fromHex('0x') },
        {
          success: true,
          data: Bytes.fromHex(
            '0x00000000000000000000000000000000000000000000000000000000000f4240',
          ),
        },
      ])
    })

    it('marks successful calls with empty data as unsuccessful', () => {
      const mockResponseData = utils.defaultAbiCoder.encode(
        ['tuple(bool success, bytes returnData)[]'],
        [
          [
            [true, '0x'], // Successful call but with empty return data
          ],
        ],
      )

      const result = client.decode(Bytes.fromHex(mockResponseData))

      expect(result).toEqual([{ success: false, data: Bytes.fromHex('0x') }])
    })
  })

  describe('encodeGetEthBalance', () => {
    it('encodes getEthBalance call correctly', () => {
      const holder = '0x1234567890123456789012345678901234567890'

      const result = client.encodeGetEthBalance(holder)

      const expectedCalldata = multicallInterface.encodeFunctionData(
        'getEthBalance',
        [holder],
      )

      expect(result.to).toEqual(address)
      expect(result.data).toEqual(Bytes.fromHex(expectedCalldata))
    })
  })
})
