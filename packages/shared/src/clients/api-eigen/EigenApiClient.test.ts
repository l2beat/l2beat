import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { HttpClient } from '../http/HttpClient'
import { EigenApiClient } from './EigenApiClient'

describe(EigenApiClient.name, () => {
  describe(EigenApiClient.prototype.getMetricsV1.name, () => {
    it('should get metrics with successful response', async () => {
      const mockResponse = {
        throughput: 12345678,
      }

      const http = mockObject<HttpClient>({
        fetch: async () => mockResponse,
      })

      const client = mockClient({ http })
      const from = 1640995200 // 2022-01-01 00:00:00 UTC
      const to = 1641081600 // 2022-01-02 00:00:00 UTC

      const result = await client.getMetricsV1(from, to)

      expect(result).toEqual(12345678)
      expect(http.fetch).toHaveBeenOnlyCalledWith(
        'https://api.test.com/v1/metrics?start=1640995200&end=1641081600',
        {},
      )
    })

    it('should handle error response', async () => {
      const mockErrorResponse = {
        error: 'error message',
      }

      const http = mockObject<HttpClient>({
        fetch: async () => mockErrorResponse,
      })

      const client = mockClient({ http })
      const from = 1640995200
      const to = 1641081600

      await expect(client.getMetricsV1(from, to)).toBeRejected()
    })
  })

  describe(EigenApiClient.prototype.getMetricsV2.name, () => {
    it('should get metrics with successful response', async () => {
      const mockResponse = {
        total_bytes_posted: 12345678,
      }

      const http = mockObject<HttpClient>({
        fetch: async () => mockResponse,
      })

      const client = mockClient({ http })
      const from = 1640995200 // 2022-01-01 00:00:00 UTC
      const to = 1641081600 // 2022-01-02 00:00:00 UTC

      const result = await client.getMetricsV2(from, to)

      expect(result).toEqual(12345678)
      expect(http.fetch).toHaveBeenOnlyCalledWith(
        'https://api.test.com/v2/metrics/summary?start=1640995200&end=1641081600',
        {},
      )
    })

    it('should handle error response', async () => {
      const mockErrorResponse = {
        error: 'error message',
      }

      const http = mockObject<HttpClient>({
        fetch: async () => mockErrorResponse,
      })

      const client = mockClient({ http })
      const from = 1640995200
      const to = 1641081600

      await expect(client.getMetricsV2(from, to)).toBeRejected()
    })
  })

  describe(EigenApiClient.prototype.getByProjectData.name, () => {
    it('should parse newline-separated JSON objects successfully', async () => {
      const mockJsonLines = `{"datetime":"2022-01-01T12:00:00","customer_id":"project1","total_size_mb":100.5}
{"datetime":"2022-01-01T13:00:00","customer_id":"project2","total_size_mb":200.75}
{"datetime":"2022-01-01T14:00:00","customer_id":"project1","total_size_mb":150.25}`

      const http = mockObject<HttpClient>({
        fetchRaw: mockFn().resolvesTo({
          text: async () => mockJsonLines,
        }),
      })

      const client = mockClient({ http })
      const until = 1640995200 // 2022-01-01 00:00:00 UTC

      const result = await client.getByProjectData(until)

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({
        datetime: UnixTime.fromDate(new Date('2022-01-01T12:00:00Z')), // adds Z to ensure it's UTC time
        customer_id: 'project1',
        total_size_mb: 100.5,
      })
      expect(result[1].customer_id).toEqual('project2')
      expect(result[2].customer_id).toEqual('project1')

      expect(http.fetchRaw).toHaveBeenOnlyCalledWith(
        'https://project.test.com/v2/stats/2022-01-01.json',
        {},
      )
    })

    it('should throw error when response contains "The specified key does not exist"', async () => {
      const mockErrorResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Error>
  <Code>NoSuchKey</Code>
  <Message>The specified key does not exist.</Message>
</Error>`

      const http = mockObject<HttpClient>({
        fetchRaw: mockFn().resolvesTo({
          text: async () => mockErrorResponse,
        }),
      })

      const client = mockClient({ http })
      const until = 1640995200

      await expect(client.getByProjectData(until)).toBeRejectedWith(
        'Assertion Error: No EigenDA data for projects for 2022-01-01T00:00:00.000Z',
      )
    })

    it('should handle malformed JSON lines', async () => {
      const mockMalformedJson = `{"datetime":"2022-01-01T12:00:00","customer_id":"project1","total_size_mb":100.5}
{"date":"2022-01-01","customer_id":"project2"}
{"datetime":"2022-01-01T14:00:00","customer_id":"project2","total_size_mb":150.25}`

      const http = mockObject<HttpClient>({
        fetchRaw: mockFn().resolvesTo({
          text: async () => mockMalformedJson,
        }),
      })

      const client = mockClient({ http })
      const until = 1640995200

      // Should fail when trying to parse the malformed line
      await expect(client.getByProjectData(until)).toBeRejected()
    })
  })
})

function mockClient(deps: {
  http?: HttpClient
  url?: string
  perProjectUrl?: string
}) {
  return new EigenApiClient({
    url: deps.url ?? 'https://api.test.com',
    perProjectUrl: deps.perProjectUrl ?? 'https://project.test.com',
    http: deps.http ?? mockObject<HttpClient>({}),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    sourceName: 'test',
  })
}
