import { Logger } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'
import type { HttpClient } from '../http/HttpClient'
import { NearClient } from './NearClient'

describe(NearClient.name, () => {
  describe(NearClient.prototype.getValidatorsInfo.name, () => {
    it('returns validators info', async () => {
      const mockValidatorsResult = {
        result: {
          current_validators: [
            { stake: '1000000000000000000000000' },
            { stake: '2000000000000000000000000' },
          ],
        },
      }

      const http = mockObject<HttpClient>({
        fetch: async () => mockValidatorsResult,
      })
      const client = mockClient({ http })

      const result = await client.getValidatorsInfo()

      expect(result).toEqual(mockValidatorsResult)
      expect(http.fetch).toHaveBeenOnlyCalledWith('API_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: undefined,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'dontcare',
          method: 'validators',
          params: [null],
        }),
      })
    })

    it('throws error on invalid response', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          invalid: 'response',
        }),
      })
      const client = mockClient({ http })

      await expect(client.getValidatorsInfo()).toBeRejected()
    })
  })

  describe(NearClient.prototype.call.name, () => {
    it('makes JSON-RPC call with correct parameters', async () => {
      const mockResponse = { result: 'success' }
      const http = mockObject<HttpClient>({
        fetch: async () => mockResponse,
      })
      const client = mockClient({ http })

      const result = await client.call('test_method', ['param1', 'param2'])

      expect(result).toEqual(mockResponse)
      expect(http.fetch).toHaveBeenOnlyCalledWith('API_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: undefined,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'dontcare',
          method: 'test_method',
          params: ['param1', 'param2'],
        }),
      })
    })

    it('makes JSON-RPC call with custom timeout', async () => {
      const mockResponse = { result: 'success' }
      const http = mockObject<HttpClient>({
        fetch: async () => mockResponse,
      })
      const client = mockClient({ http, timeout: 5000 })

      const result = await client.call('test_method', [])

      expect(result).toEqual(mockResponse)
      expect(http.fetch).toHaveBeenOnlyCalledWith('API_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'dontcare',
          method: 'test_method',
          params: [],
        }),
      })
    })

    it('makes JSON-RPC call with null params', async () => {
      const mockResponse = { result: null }
      const http = mockObject<HttpClient>({
        fetch: async () => mockResponse,
      })
      const client = mockClient({ http })

      const result = await client.call('validators', [null])

      expect(result).toEqual(mockResponse)
      expect(http.fetch).toHaveBeenOnlyCalledWith('API_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: undefined,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'dontcare',
          method: 'validators',
          params: [null],
        }),
      })
    })
  })

  describe(NearClient.prototype.validateResponse.name, () => {
    it('returns false when response includes errors', () => {
      const client = mockClient({})
      const validationInfo = client.validateResponse({
        error: {
          code: -32700,
          message: 'Parse error',
          name: 'ParseError',
        },
      })

      expect(validationInfo.success).toEqual(false)
    })

    it('returns true for response without error', () => {
      const client = mockClient({})
      const validationInfo = client.validateResponse({
        jsonrpc: '2.0',
        id: 'dontcare',
        result: {
          current_validators: [],
        },
      })

      expect(validationInfo.success).toEqual(true)
    })
  })
})

function mockClient(deps: {
  http?: HttpClient
  nearApiUrl?: string
  timeout?: number
  generateId?: () => string
}) {
  return new NearClient({
    sourceName: 'near',
    nearApiUrl: deps.nearApiUrl ?? 'API_URL',
    http: deps.http ?? mockObject<HttpClient>({}),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    timeout: deps.timeout,
  })
}
