import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { HttpClient } from '../http/HttpClient'
import { VoyagerClient } from './VoyagerClient'

describe(VoyagerClient.name, () => {
  describe(VoyagerClient.prototype.getDailyUops.name, () => {
    it('fetches and parses daily uops data', async () => {
      const http = {
        fetch: vi.fn(async () => ({
          items: [
            { date: '2024-01-01', value: '1000' },
            { date: '2024-01-02', value: '2000' },
            { date: '2024-01-03', value: '3000' },
          ],
        })),
      } as unknown as HttpClient

      const client = mockClient({ http })
      const result = await client.getDailyUops()

      expect(result).toStrictEqual({
        [UnixTime.fromDate(new Date('2024-01-01'))]: 1000,
        [UnixTime.fromDate(new Date('2024-01-02'))]: 2000,
        [UnixTime.fromDate(new Date('2024-01-03'))]: 3000,
      })

      expect(http.fetch).toHaveBeenCalledWith(
        'https://api.voyager.online/beta/daily-stats?metrics=user_operations_count&timerange=max',
        { timeout: 10_000, headers: { 'x-api-key': 'test-api-key' } },
      )
    })

    it('handles empty response', async () => {
      const http = {
        fetch: vi.fn(async () => ({
          items: [],
        })),
      } as unknown as HttpClient

      const client = mockClient({ http })
      const result = await client.getDailyUops()

      expect(result).toStrictEqual({})
    })

    it('validates response structure', async () => {
      const http = {
        fetch: vi.fn(async () => ({
          invalid: 'structure',
        })),
      } as unknown as HttpClient

      const client = mockClient({ http })

      await expect(client.getDailyUops()).rejects.toThrow()
    })
  })

  describe(VoyagerClient.prototype.getDailyTxs.name, () => {
    it('fetches and parses daily txs data', async () => {
      const http = {
        fetch: vi.fn(async () => ({
          items: [
            { date: '2024-01-01', value: 5000 },
            { date: '2024-01-02', value: 6000 },
          ],
        })),
      } as unknown as HttpClient

      const client = mockClient({ http })
      const result = await client.getDailyTxs()

      expect(result).toStrictEqual({
        [UnixTime.fromDate(new Date('2024-01-01'))]: 5000,
        [UnixTime.fromDate(new Date('2024-01-02'))]: 6000,
      })

      expect(http.fetch).toHaveBeenCalledWith(
        'https://api.voyager.online/beta/daily-stats?metrics=transactions_count&timerange=max',
        { timeout: 10_000, headers: { 'x-api-key': 'test-api-key' } },
      )
    })

    it('handles empty response', async () => {
      const http = {
        fetch: vi.fn(async () => ({
          items: [],
        })),
      } as unknown as HttpClient

      const client = mockClient({ http })
      const result = await client.getDailyTxs()

      expect(result).toStrictEqual({})
    })
  })

  describe(VoyagerClient.prototype.query.name, () => {
    it('constructs correct url with query parameters', async () => {
      const http = {
        fetch: vi.fn(async () => ({ success: true })),
      } as unknown as HttpClient

      const client = mockClient({ http })
      await client.query('/test-endpoint', {
        param1: 'value1',
        param2: 'value2',
      })

      expect(http.fetch).toHaveBeenCalledWith(
        'https://api.voyager.online/beta/test-endpoint?param1=value1&param2=value2',
        { timeout: 10_000, headers: { 'x-api-key': 'test-api-key' } },
      )
    })

    it('constructs url without query parameters', async () => {
      const http = {
        fetch: vi.fn(async () => ({ success: true })),
      } as unknown as HttpClient

      const client = mockClient({ http })
      await client.query('/test-endpoint', {})

      expect(http.fetch).toHaveBeenCalledWith(
        'https://api.voyager.online/beta/test-endpoint',
        { timeout: 10_000, headers: { 'x-api-key': 'test-api-key' } },
      )
    })

    it('handles special characters in query parameters', async () => {
      const http = {
        fetch: vi.fn(async () => ({ success: true })),
      } as unknown as HttpClient

      const client = mockClient({ http })
      await client.query('/test-endpoint', {
        key: 'value with spaces',
      })

      expect(http.fetch).toHaveBeenCalledWith(
        'https://api.voyager.online/beta/test-endpoint?key=value+with+spaces',
        { timeout: 10_000, headers: { 'x-api-key': 'test-api-key' } },
      )
    })
  })

  describe(VoyagerClient.prototype.validateResponse.name, () => {
    it('returns success for valid response', () => {
      const client = mockClient({})
      const result = client.validateResponse({ data: 'test' })

      expect(result).toStrictEqual({ success: true })
    })

    it('returns failure for error response', () => {
      const client = mockClient({})
      const result = client.validateResponse({ message: 'Error occurred' })

      expect(result).toStrictEqual({ success: false })
    })
  })
})

function mockClient(deps: { http?: HttpClient }) {
  return new VoyagerClient({
    http:
      deps.http ??
      ({ fetch: vi.fn(async () => ({})) } as unknown as HttpClient),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    sourceName: 'voyager-test',
    apiKey: 'test-api-key',
  })
}
