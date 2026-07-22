import { Logger } from '@l2beat/backend-tools'
import { expect, mockFn, mockObject } from 'earl'
import type { HttpClient } from '../http/HttpClient'
import { AztecRpcClient } from './AztecRpcClient'

describe(AztecRpcClient.name, () => {
  describe(AztecRpcClient.prototype.getLatestBlockNumber.name, () => {
    it('returns the latest block number', async () => {
      const http = mockObject<HttpClient>({
        fetch: mockFn().resolvesToOnce({ result: 123 }),
      })
      const client = mockClient({ http })

      const result = await client.getLatestBlockNumber()

      expect(result).toEqual(123)
      expect(http.fetch).toHaveBeenOnlyCalledWith('RPC_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'aztec_getBlockNumber',
          params: [],
          id: 'unique-id',
        }),
        redirect: 'follow',
        timeout: 10_000,
      })
    })
  })

  describe(AztecRpcClient.prototype.getBlocks.name, () => {
    it('returns block timestamps and transaction effect counts', async () => {
      const http = mockObject<HttpClient>({
        fetch: mockFn().resolvesToOnce({
          result: [
            {
              number: 100,
              header: { globalVariables: { timestamp: '1234567890' } },
              body: { txEffects: [{}, {}] },
            },
          ],
        }),
      })
      const client = mockClient({ http })

      const result = await client.getBlocks(100, 1)

      expect(result).toEqual([
        { number: 100, timestamp: 1234567890, txEffectsCount: 2 },
      ])
    })

    it('requests blocks with transaction effects included', async () => {
      const http = mockObject<HttpClient>({
        fetch: mockFn().resolvesToOnce({ result: [] }),
      })
      const client = mockClient({ http })

      await client.getBlocks(100, 50)

      expect(http.fetch).toHaveBeenOnlyCalledWith('RPC_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'aztec_getBlocks',
          params: [100, 50, { includeTransactions: true }],
          id: 'unique-id',
        }),
        redirect: 'follow',
        timeout: 10_000,
      })
    })
  })

  describe(AztecRpcClient.prototype.getBlockHeaders.name, () => {
    it('returns block headers without transaction effects', async () => {
      const http = mockObject<HttpClient>({
        fetch: mockFn().resolvesToOnce({
          result: [
            {
              number: 100,
              header: { globalVariables: { timestamp: '1234567890' } },
            },
          ],
        }),
      })
      const client = mockClient({ http })

      const result = await client.getBlockHeaders(100, 1)

      expect(result).toEqual([{ number: 100, timestamp: 1234567890 }])
      expect(http.fetch).toHaveBeenOnlyCalledWith('RPC_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'aztec_getBlocks',
          params: [100, 1, { includeTransactions: false }],
          id: 'unique-id',
        }),
        redirect: 'follow',
        timeout: 10_000,
      })
    })
  })

  describe(AztecRpcClient.prototype.validateResponse.name, () => {
    it('rejects JSON-RPC errors', () => {
      const client = mockClient({})

      expect(
        client.validateResponse({
          error: { code: -32601, message: 'Method not found' },
        }),
      ).toEqual({ success: false })
    })
  })
})

function mockClient(deps: { http?: HttpClient }) {
  return new AztecRpcClient({
    sourceName: 'aztecnetwork',
    url: 'RPC_URL',
    http: deps.http ?? mockObject<HttpClient>({}),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    generateId: () => 'unique-id',
  })
}
