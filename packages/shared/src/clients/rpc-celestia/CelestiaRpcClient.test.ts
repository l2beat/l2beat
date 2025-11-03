import { Logger } from '@l2beat/backend-tools'
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
            last_height: mockBlockHeight,
          },
        }),
      })
      const rpc = mockClient({ http })

      const result = await rpc.getLatestBlockNumber()

      expect(result).toEqual(Number(mockBlockHeight))
      expect(http.fetch).toHaveBeenOnlyCalledWith('API_URL/blockchain', {
        method: 'GET',
        redirect: 'follow',
      })
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

      const http = mockObject<HttpClient>({
        fetch: async () => ({
          result: mockValidatorsResult,
        }),
      })
      const rpc = mockClient({ http })

      const result = await rpc.getValidatorsInfo({ page: 1 })

      expect(result).toEqual({
        validators: [
          {
            voting_power: 1000000,
          },
        ],
        count: 1,
        total: 1,
      })
      expect(http.fetch).toHaveBeenOnlyCalledWith(
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

      const http = mockObject<HttpClient>({
        fetch: async () => ({
          result: mockValidatorsResult,
        }),
      })
      const rpc = mockClient({ http })

      const result = await rpc.getValidatorsInfo({
        page: 2,
        perPage: 50,
      })

      expect(result).toEqual({
        validators: [],
        count: 0,
        total: 50,
      })
      expect(http.fetch).toHaveBeenOnlyCalledWith(
        'API_URL/validators?page=2&per_page=50',
        {
          method: 'GET',
          redirect: 'follow',
        },
      )
    })
  })

  describe(CelestiaRpcClient.prototype.getBlobsForNamespaces.name, () => {
    it('returns blobs for the given namespaces', async () => {
      const mockBlobs = [
        {
          namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
          data: 'SGVsbG8=',
        },
        {
          namespace: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=',
          data: 'V29ybGQ=',
        },
      ]

      const http = mockObject<HttpClient>({
        fetch: async () => ({
          result: mockBlobs,
        }),
      })
      const rpc = mockClient({ http })

      const namespaces = [
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
        'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=',
      ]
      const result = await rpc.getBlobsForNamespaces(67890, namespaces)

      expect(result).toEqual(mockBlobs)
      expect(http.fetch).toHaveBeenOnlyCalledWith('API_URL/', {
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify({
          id: '1',
          jsonrpc: '2.0',
          method: 'blob.GetAll',
          params: [67890, namespaces],
        }),
      })
    })

    it('returns empty array when result is null', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          result: null,
        }),
      })
      const rpc = mockClient({ http })

      const result = await rpc.getBlobsForNamespaces(12345, [
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
      ])

      expect(result).toEqual([])
    })

    it('throws error when response is invalid', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          invalid: 'response',
        }),
      })
      const rpc = mockClient({ http })

      await expect(
        rpc.getBlobsForNamespaces(12345, [
          'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
        ]),
      ).toBeRejectedWith(
        'Blobs for namespaces AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=: Error during parsing',
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
