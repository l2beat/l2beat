import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { HttpClient } from '../http/HttpClient'
import { CelestiaRpcClient } from './CelestiaRpcClient'

describe(CelestiaRpcClient.name, () => {
  describe(CelestiaRpcClient.prototype.getLatestBlockNumber.name, () => {
    it('returns the latest block number', async () => {
      const mockBlockHeight = '12345'
      const http = {
        fetch: vi.fn(async () => ({
          result: {
            block: {
              header: {
                time: '2024-02-07T10:00:00Z',
                height: mockBlockHeight,
              },
            },
          },
        })),
      } as unknown as HttpClient
      const rpc = mockClient({ http })

      const result = await rpc.getLatestBlockNumber()

      expect(result).toStrictEqual(Number(mockBlockHeight))
      expect(http.fetch).toHaveBeenCalledExactlyOnceWith('API_URL/block', {
        method: 'GET',
        redirect: 'follow',
      })
    })
  })

  describe(CelestiaRpcClient.prototype.getBlockWithTransactions.name, () => {
    it('returns block with transactions for a specific block number', async () => {
      const mockBlockHeight = '12345'
      const mockTimestamp = '2024-02-07T10:00:00Z'

      const http = {
        fetch: vi.fn(async () => ({
          result: {
            block: {
              header: {
                time: mockTimestamp,
                height: mockBlockHeight,
              },
            },
          },
        })),
      } as unknown as HttpClient
      const rpc = mockClient({ http })

      const result = await rpc.getBlockWithTransactions(Number(mockBlockHeight))

      expect(result).toStrictEqual({
        number: Number(mockBlockHeight),
        hash: 'UNSUPPORTED',
        logsBloom: 'UNSUPPORTED',
        timestamp: UnixTime.fromDate(new Date(mockTimestamp)),
        transactions: [],
      })

      expect(http.fetch).toHaveBeenCalledExactlyOnceWith(
        'API_URL/block?height=12345',
        {
          method: 'GET',
          redirect: 'follow',
        },
      )
    })

    it('returns block with transactions for the latest block', async () => {
      const mockBlockHeight = '12345'
      const mockTimestamp = '2024-02-07T10:00:00Z'

      const http = {
        fetch: vi.fn(async () => ({
          result: {
            block: {
              header: {
                time: mockTimestamp,
                height: mockBlockHeight,
              },
            },
          },
        })),
      } as unknown as HttpClient
      const rpc = mockClient({ http })

      const result = await rpc.getBlockWithTransactions('latest')

      expect(result).toStrictEqual({
        number: Number(mockBlockHeight),
        hash: 'UNSUPPORTED',
        logsBloom: 'UNSUPPORTED',
        timestamp: UnixTime.fromDate(new Date(mockTimestamp)),
        transactions: [],
      })

      expect(http.fetch).toHaveBeenCalledExactlyOnceWith('API_URL/block', {
        method: 'GET',
        redirect: 'follow',
      })
    })
  })

  describe(CelestiaRpcClient.prototype.getBlockTimestamp.name, () => {
    it('returns block timestamp', async () => {
      const mockTimestamp = '2024-02-06T12:00:00Z'
      const http = {
        fetch: vi.fn(async () => ({
          result: {
            block: {
              header: {
                time: mockTimestamp,
                height: '100',
              },
            },
          },
        })),
      } as unknown as HttpClient
      const rpc = mockClient({ http })

      const result = await rpc.getBlockTimestamp(100)

      expect(result).toStrictEqual(UnixTime.fromDate(new Date(mockTimestamp)))
      expect(http.fetch).toHaveBeenCalledExactlyOnceWith(
        'API_URL/block?height=100',
        {
          method: 'GET',
          redirect: 'follow',
        },
      )
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

      const http = {
        fetch: vi.fn(async () => ({
          result: {
            height: '100',
            txs_results: mockResults,
          },
        })),
      } as unknown as HttpClient
      const rpc = mockClient({ http })

      const result = await rpc.getBlockResult(100)

      expect(result).toStrictEqual({
        height: '100',
        txs_results: mockResults,
      })
      expect(http.fetch).toHaveBeenCalledExactlyOnceWith(
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
      const http = {
        fetch: vi.fn(async () => ({ result: 'success' })),
      } as unknown as HttpClient
      const rpc = mockClient({ http })

      const result = await rpc.query('test_method', {
        param1: 'value1',
        param2: 'value2',
      })

      expect(result).toStrictEqual({ result: 'success' })
      expect(http.fetch).toHaveBeenCalledExactlyOnceWith(
        'API_URL/test_method?param1=value1&param2=value2',
        {
          method: 'GET',
          redirect: 'follow',
        },
      )
    })

    it('passes configured timeout', async () => {
      const http = {
        fetch: vi.fn(async () => ({ result: 'success' })),
      } as unknown as HttpClient
      const rpc = mockClient({ http, timeout: 30_000 })

      await rpc.query('test_method', {})

      expect(http.fetch).toHaveBeenCalledExactlyOnceWith(
        'API_URL/test_method',
        {
          method: 'GET',
          redirect: 'follow',
          timeout: 30_000,
        },
      )
    })
  })

  describe(CelestiaRpcClient.prototype.getValidatorsInfo.name, () => {
    it('returns validators info with default parameters', async () => {
      const mockValidatorsResult = {
        validators: [
          {
            voting_power: '1000000',
          },
        ],
        count: '1',
        total: '1',
      }

      const http = {
        fetch: vi.fn(async () => ({
          result: mockValidatorsResult,
        })),
      } as unknown as HttpClient
      const rpc = mockClient({ http })

      const result = await rpc.getValidatorsInfo({ page: 1 })

      expect(result).toStrictEqual({
        validators: [
          {
            voting_power: 1000000,
          },
        ],
        count: 1,
        total: 1,
      })
      expect(http.fetch).toHaveBeenCalledExactlyOnceWith(
        'API_URL/validators?page=1&per_page=100',
        {
          method: 'GET',
          redirect: 'follow',
        },
      )
    })

    it('returns validators info with custom page and perPage parameters', async () => {
      const mockValidatorsResult = {
        validators: [],
        count: '0',
        total: '50',
      }

      const http = {
        fetch: vi.fn(async () => ({
          result: mockValidatorsResult,
        })),
      } as unknown as HttpClient
      const rpc = mockClient({ http })

      const result = await rpc.getValidatorsInfo({
        page: 2,
        perPage: 50,
      })

      expect(result).toStrictEqual({
        validators: [],
        count: 0,
        total: 50,
      })
      expect(http.fetch).toHaveBeenCalledExactlyOnceWith(
        'API_URL/validators?page=2&per_page=50',
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

      expect(validationInfo.success).toStrictEqual(false)
    })

    it('returns true for valid response', () => {
      const rpc = mockClient({})
      const validationInfo = rpc.validateResponse({
        result: {
          some: 'data',
        },
      })

      expect(validationInfo.success).toStrictEqual(true)
    })
  })
})

function mockClient(deps: {
  http?: HttpClient
  url?: string
  timeout?: number
  generateId?: () => string
}) {
  return new CelestiaRpcClient({
    sourceName: 'celestia',
    url: deps.url ?? 'API_URL/',
    http: deps.http ?? ({} as unknown as HttpClient),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    timeout: deps.timeout,
    generateId: deps.generateId,
  })
}
