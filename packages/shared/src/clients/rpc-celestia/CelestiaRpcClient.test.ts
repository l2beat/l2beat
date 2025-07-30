import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { HttpClient } from '../http/HttpClient'
import { CelestiaRpcClient } from './CelestiaRpcClient'

describe(CelestiaRpcClient.name, () => {
  describe(CelestiaRpcClient.prototype.getLatestBlockNumber.name, () => {
    it('returns the latest block number', async () => {
      const mockBlockHeight = '12345'
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          result: {
            height: mockBlockHeight,
            txs_results: [],
          },
        }),
      })
      const rpc = mockClient({ http })

      const result = await rpc.getLatestBlockNumber()

      expect(result).toEqual(Number(mockBlockHeight))
      expect(http.fetch).toHaveBeenOnlyCalledWith('API_URL/block_results', {
        method: 'GET',
        redirect: 'follow',
      })
    })
  })

  describe(CelestiaRpcClient.prototype.getBlockWithTransactions.name, () => {
    it('returns block with transactions for a specific block number', async () => {
      const mockBlockHeight = '12345'
      const mockTimestamp = '2024-02-07T10:00:00Z'

      const http = mockObject<HttpClient>({
        fetch: async (url: string) => {
          if (url.includes('block_results')) {
            return {
              result: {
                height: mockBlockHeight,
                txs_results: [],
              },
            }
          }
          return {
            result: {
              block: {
                header: {
                  time: mockTimestamp,
                },
              },
            },
          }
        },
      })
      const rpc = mockClient({ http })

      const result = await rpc.getBlockWithTransactions(Number(mockBlockHeight))

      expect(result).toEqual({
        number: Number(mockBlockHeight),
        hash: 'UNSUPPORTED',
        timestamp: UnixTime.fromDate(new Date(mockTimestamp)),
        transactions: [],
      })

      expect(http.fetch).toHaveBeenCalledTimes(2)
      expect(http.fetch).toHaveBeenNthCalledWith(
        1,
        'API_URL/block_results?height=12345',
        {
          method: 'GET',
          redirect: 'follow',
        },
      )
      expect(http.fetch).toHaveBeenNthCalledWith(
        2,
        'API_URL/block?height=12345',
        {
          method: 'GET',
          redirect: 'follow',
        },
      )
    })

    it('returns block with transactions for latest block', async () => {
      const mockBlockHeight = '12345'
      const mockTimestamp = '2024-02-07T10:00:00Z'

      const http = mockObject<HttpClient>({
        fetch: async (url: string) => {
          if (url.includes('block_results')) {
            return {
              result: {
                height: mockBlockHeight,
                txs_results: [],
              },
            }
          }
          return {
            result: {
              block: {
                header: {
                  time: mockTimestamp,
                },
              },
            },
          }
        },
      })
      const rpc = mockClient({ http })

      const result = await rpc.getBlockWithTransactions('latest')

      expect(result).toEqual({
        number: Number(mockBlockHeight),
        hash: 'UNSUPPORTED',
        timestamp: UnixTime.fromDate(new Date(mockTimestamp)),
        transactions: [],
      })

      expect(http.fetch).toHaveBeenCalledTimes(2)
      expect(http.fetch).toHaveBeenNthCalledWith(1, 'API_URL/block_results', {
        method: 'GET',
        redirect: 'follow',
      })
      expect(http.fetch).toHaveBeenNthCalledWith(2, 'API_URL/block', {
        method: 'GET',
        redirect: 'follow',
      })
    })
  })

  describe(CelestiaRpcClient.prototype.getBlockTimestamp.name, () => {
    it('returns block timestamp', async () => {
      const mockTimestamp = '2024-02-06T12:00:00Z'
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          result: {
            block: {
              header: {
                time: mockTimestamp,
              },
            },
          },
        }),
      })
      const rpc = mockClient({ http })

      const result = await rpc.getBlockTimestamp(100)

      expect(result).toEqual(UnixTime.fromDate(new Date(mockTimestamp)))
      expect(http.fetch).toHaveBeenOnlyCalledWith('API_URL/block?height=100', {
        method: 'GET',
        redirect: 'follow',
      })
    })
  })

  describe(CelestiaRpcClient.prototype.getBlockResult.name, () => {
    it('returns block result', async () => {
      const mockResults = [
        {
          events: [
            {
              type: 'celestia.blob.v1.EventPayForBlobs',
              attributes: [
                {
                  key: 'blob_sizes',
                  value: '[355]',
                },
              ],
            },
          ],
        },
      ]

      const http = mockObject<HttpClient>({
        fetch: async () => ({
          result: {
            height: '100',
            txs_results: mockResults,
          },
        }),
      })
      const rpc = mockClient({ http })

      const result = await rpc.getBlockResult(100)

      expect(result).toEqual({
        height: '100',
        txs_results: mockResults,
      })
      expect(http.fetch).toHaveBeenOnlyCalledWith(
        'API_URL/block_results?height=100',
        {
          method: 'GET',
          redirect: 'follow',
        },
      )
    })
  })

  describe(CelestiaRpcClient.prototype.query.name, () => {
    it('constructs correct URL with params', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ result: 'success' }),
      })
      const rpc = mockClient({ http })

      const result = await rpc.query('test_method', {
        param1: 'value1',
        param2: 'value2',
      })

      expect(result).toEqual({ result: 'success' })
      expect(http.fetch).toHaveBeenOnlyCalledWith(
        'API_URL/test_method?param1=value1&param2=value2',
        {
          method: 'GET',
          redirect: 'follow',
        },
      )
    })
  })

  describe(CelestiaRpcClient.prototype.validateResponse.name, () => {
    it('returns false when response includes errors', () => {
      const rpc = mockClient({})
      const validationInfo = rpc.validateResponse({
        error: {
          code: 1,
          message: 'Test error',
          data: 'Error data',
        },
      })

      expect(validationInfo.success).toEqual(false)
    })

    it('returns true for valid response', () => {
      const rpc = mockClient({})
      const validationInfo = rpc.validateResponse({
        result: {
          some: 'data',
        },
      })

      expect(validationInfo.success).toEqual(true)
    })
  })
})

function mockClient(deps: {
  http?: HttpClient
  url?: string
  generateId?: () => string
}) {
  return new CelestiaRpcClient({
    sourceName: 'celestia',
    url: deps.url ?? 'API_URL/',
    http: deps.http ?? mockObject<HttpClient>({}),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    generateId: deps.generateId,
  })
}
