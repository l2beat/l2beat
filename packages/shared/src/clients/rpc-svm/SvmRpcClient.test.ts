import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { HttpClient } from '../http/HttpClient'
import { SvmRpcClient } from './SvmRpcClient'

describe(SvmRpcClient.name, () => {
  describe(SvmRpcClient.prototype.getLatestSlotNumber.name, () => {
    it('returns the latest slot number', async () => {
      const mockSlotNumber = 123
      const mockResponse = {
        result: {
          context: {
            apiVersion: '1.17.31',
            slot: mockSlotNumber,
          },
          value: {
            blockhash: '2YPFQZ2DqNhZ1FT7wsyRu1EdvGx1AgTyCFucKWrUzcEL',
            lastValidBlockHeight: 122,
          },
        },
      }

      const http = mockObject<HttpClient>({
        fetch: mockFn().resolvesToOnce(mockResponse),
      })

      const client = mockClient({ http, generateId: () => 'unique-id' })
      const result = await client.getLatestSlotNumber()

      expect(result).toEqual(Number(mockSlotNumber))
    })
  })

  describe(SvmRpcClient.prototype.getBlockWithTransactions.name, () => {
    it('returns block with transactions for given slot', async () => {
      const blockTime = UnixTime.now()
      const mockResponse = {
        result: {
          blockHeight: 123,
          blockTime,
          blockhash: 'EEnTYznmKb9S1k3kbE9qa7RabkUUj3Q49H1Yp4DfJq6C',
          parentSlot: 122,
          previousBlockhash: 'HkJB6MxiLbac3U9dbTcNGBhjk1CUXQTjVpXsbXVk9trr',
          transactions: [
            {
              version: 'legacy',
            },
          ],
        },
      }

      const http = mockObject<HttpClient>({
        fetch: mockFn().resolvesToOnce(mockResponse),
      })

      const client = mockClient({ http, generateId: () => 'unique-id' })
      const result = await client.getBlockWithTransactions(123)

      expect(result).toEqual({
        number: 123,
        hash: 'EEnTYznmKb9S1k3kbE9qa7RabkUUj3Q49H1Yp4DfJq6C',
        timestamp: blockTime,
        transactionsCount: 1,
      })
    })

    it('returns undefined if slot was skipped', async () => {
      const mockResponse = {
        error: {
          code: -32009,
          message: 'Slot 2621692 was skipped, <explanation here>',
        },
      }

      const http = mockObject<HttpClient>({
        fetch: mockFn().resolvesToOnce(mockResponse),
      })

      const client = mockClient({ http, generateId: () => 'unique-id' })
      const result = await client.getBlockWithTransactions(123)

      expect(result).toEqual(undefined)
    })
  })

  describe(SvmRpcClient.prototype.getSlotTime.name, () => {
    it('returns the time of nearest non-empty slot', async () => {
      const mockTime = UnixTime.now()

      const http = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce({ result: null })
          .resolvesToOnce({ result: mockTime }),
      })

      const client = mockClient({ http, generateId: () => 'unique-id' })
      const result = await client.getSlotTime(123)

      expect(result).toEqual({ timestamp: mockTime })
    })
  })

  describe(SvmRpcClient.prototype.query.name, () => {
    it('calls http client with correct params and returns data', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => 'data-returned-from-api',
      })

      const client = mockClient({ http, generateId: () => 'unique-id' })

      const result = await client.query('rpc_method', ['a', 1, true])

      expect(result).toEqual('data-returned-from-api')
      expect(http.fetch).toHaveBeenOnlyCalledWith('API_URL', {
        body: JSON.stringify({
          method: 'rpc_method',
          params: ['a', 1, true],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        timeout: 5000,
      })
    })
  })

  describe(SvmRpcClient.prototype.validateResponse.name, () => {
    it('returns false when response includes errors', async () => {
      const client = mockClient({})
      const validationInfo = client.validateResponse({
        error: {
          code: -32700,
          message: 'Parse error',
        },
      })

      expect(validationInfo.success).toEqual(false)
    })

    it('returns true otherwise', async () => {
      const rpc = mockClient({})
      const validationInfo = rpc.validateResponse({
        result: 'success',
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
  return new SvmRpcClient({
    sourceName: 'chain',
    url: deps.url ?? 'API_URL',
    http: deps.http ?? mockObject<HttpClient>({}),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    generateId: deps.generateId,
  })
}
