import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { HttpClient } from '../http/HttpClient'
import { VoyagerClient } from './VoyagerClient'

describe(VoyagerClient.name, () => {
  describe(VoyagerClient.prototype.getDailyUops.name, () => {
    it('fetches and parses daily uops data', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          items: [
            { date: '2024-01-01', value: 1000 },
            { date: '2024-01-02', value: 2000 },
            { date: '2024-01-03', value: 3000 },
          ],
        }),
      })

      const client = mockClient({ http })
      const result = await client.getDailyUops()

      expect(result).toEqual({
        [UnixTime.fromDate(new Date('2024-01-01'))]: 1000,
        [UnixTime.fromDate(new Date('2024-01-02'))]: 2000,
        [UnixTime.fromDate(new Date('2024-01-03'))]: 3000,
      })

      expect(http.fetch).toHaveBeenCalledWith(
        'https://voyager.online/api/daily-stats?metrics=user_operations_per_second&timerange=max',
        { timeout: 10_000 },
      )
    })

    it('handles empty response', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          items: [],
        }),
      })

      const client = mockClient({ http })
      const result = await client.getDailyUops()

      expect(result).toEqual({})
    })

    it('validates response structure', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          invalid: 'structure',
        }),
      })

      const client = mockClient({ http })

      await expect(client.getDailyUops()).toBeRejected()
    })
  })

  describe(VoyagerClient.prototype.getDailyTxs.name, () => {
    it('fetches and parses daily txs data', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          items: [
            { date: '2024-01-01', value: 5000 },
            { date: '2024-01-02', value: 6000 },
          ],
        }),
      })

      const client = mockClient({ http })
      const result = await client.getDailyTxs()

      expect(result).toEqual({
        [UnixTime.fromDate(new Date('2024-01-01'))]: 5000,
        [UnixTime.fromDate(new Date('2024-01-02'))]: 6000,
      })

      expect(http.fetch).toHaveBeenCalledWith(
        'https://voyager.online/api/daily-stats?metrics=transactions_per_second&timerange=max',
        { timeout: 10_000 },
      )
    })

    it('handles empty response', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          items: [],
        }),
      })

      const client = mockClient({ http })
      const result = await client.getDailyTxs()

      expect(result).toEqual({})
    })
  })

  describe(VoyagerClient.prototype.query.name, () => {
    it('constructs correct url with query parameters', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ success: true }),
      })

      const client = mockClient({ http })
      await client.query('/test-endpoint', {
        param1: 'value1',
        param2: 'value2',
      })

      expect(http.fetch).toHaveBeenCalledWith(
        'https://voyager.online/api/test-endpoint?param1=value1&param2=value2',
        { timeout: 10_000 },
      )
    })

    it('constructs url without query parameters', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ success: true }),
      })

      const client = mockClient({ http })
      await client.query('/test-endpoint', {})

      expect(http.fetch).toHaveBeenCalledWith(
        'https://voyager.online/api/test-endpoint',
        { timeout: 10_000 },
      )
    })

    it('handles special characters in query parameters', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ success: true }),
      })

      const client = mockClient({ http })
      await client.query('/test-endpoint', {
        key: 'value with spaces',
      })

      expect(http.fetch).toHaveBeenCalledWith(
        'https://voyager.online/api/test-endpoint?key=value+with+spaces',
        { timeout: 10_000 },
      )
    })
  })
})

function mockClient(deps: { http?: HttpClient }) {
  return new VoyagerClient({
    http: deps.http ?? mockObject<HttpClient>({ fetch: async () => ({}) }),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    sourceName: 'voyager-test',
    apiKey: 'test-api-key',
  })
}
