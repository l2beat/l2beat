import { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { v } from '@l2beat/validate'
import { expect, mockFn, mockObject } from 'earl'
import { DuneClient } from './DuneClient'

describe(DuneClient.name, () => {
  const apiKey = 'test-api-key'
  const mockLogger = Logger.SILENT

  function createClient(http: HttpClient): DuneClient {
    return new DuneClient({
      logger: mockLogger,
      http,
      apiKey,
      pollingIntervalMs: 10,
    })
  }

  describe('executeSql', () => {
    it('calls fetch with correct parameters and returns execution_id', async () => {
      const executionId = 'exec-123'
      const mockHttp = mockObject<HttpClient>({
        fetch: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_PENDING',
        }),
      })

      const client = createClient(mockHttp)
      const result = await client.executeSql('SELECT * FROM test', 'large')

      expect(mockHttp.fetch).toHaveBeenCalledWith(
        'https://api.dune.com/api/v1/sql/execute',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Dune-API-Key': apiKey,
          },
          body: JSON.stringify({
            sql: 'SELECT * FROM test',
            performance: 'large',
          }),
        },
      )
      expect(result.execution_id).toEqual(executionId)
    })
  })

  describe('getExecutionStatus', () => {
    it('calls fetch with correct execution ID and returns status', async () => {
      const executionId = 'exec-123'
      const statusResponse = {
        execution_id: executionId,
        state: 'QUERY_STATE_COMPLETED',
        result_metadata: {
          datapoint_count: 100,
          execution_time_millis: 500,
        },
        execution_cost_credits: 10,
      }

      const mockHttp = mockObject<HttpClient>({
        fetch: mockFn().resolvesTo(statusResponse),
      })

      const client = createClient(mockHttp)
      const result = await client.getExecutionStatus(executionId)

      expect(mockHttp.fetch).toHaveBeenCalledWith(
        `https://api.dune.com/api/v1/execution/${executionId}/status`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Dune-API-Key': apiKey,
          },
          body: undefined,
        },
      )
      expect(result.execution_id).toEqual(executionId)
      expect(result.state).toEqual('QUERY_STATE_COMPLETED')
    })
  })

  describe('getExecutionResult', () => {
    it('calls fetch with correct execution ID and returns result', async () => {
      const executionId = 'exec-123'
      const resultResponse = {
        result: {
          rows: [{ col1: 'value1' }, { col2: 'value2' }],
        },
      }

      const mockHttp = mockObject<HttpClient>({
        fetch: mockFn().resolvesTo(resultResponse),
      })

      const client = createClient(mockHttp)
      const result = await client.getExecutionResult(executionId)

      expect(mockHttp.fetch).toHaveBeenCalledWith(
        `https://api.dune.com/api/v1/execution/${executionId}/results`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Dune-API-Key': apiKey,
          },
          body: undefined,
        },
      )
      expect(result.result.rows).toEqual(resultResponse.result.rows)
    })
  })

  describe('query', () => {
    it('completes successfully when query finishes immediately', async () => {
      const executionId = 'exec-123'
      const resultRows = [{ col1: 'value1' }, { col1: 'value2' }]
      const resultSchema = v.array(v.object({ col1: v.string() }))

      const mockHttp = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_PENDING',
          })
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_COMPLETED',
            result_metadata: {
              datapoint_count: 100,
              execution_time_millis: 500,
            },
            execution_cost_credits: 10,
          })
          .resolvesToOnce({
            result: {
              rows: resultRows,
            },
          }),
      })

      const client = createClient(mockHttp)
      const result = await client.query(
        'SELECT * FROM test',
        'large',
        resultSchema,
      )

      expect(result).toEqual(resultRows)
      expect(mockHttp.fetch).toHaveBeenCalledTimes(3)
    })

    it('polls status when query is pending', async () => {
      const executionId = 'exec-123'
      const resultRows = [{ col1: 'value1' }, { col1: 'value2' }]
      const resultSchema = v.array(v.object({ col1: v.string() }))

      const mockHttp = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_PENDING',
          })
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_EXECUTING',
            execution_cost_credits: 5,
          })
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_COMPLETED',
            result_metadata: {
              datapoint_count: 50,
              execution_time_millis: 300,
            },
            execution_cost_credits: 10,
          })
          .resolvesToOnce({
            result: {
              rows: resultRows,
            },
          }),
      })

      const client = createClient(mockHttp)
      const result = await client.query(
        'SELECT * FROM test',
        'large',
        resultSchema,
      )

      expect(result).toEqual(resultRows)
      expect(mockHttp.fetch).toHaveBeenCalledTimes(4)
    })

    it('throws error when query fails', async () => {
      const executionId = 'exec-123'

      const mockHttp = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_PENDING',
          })
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_FAILED',
            execution_cost_credits: 5,
          }),
      })

      const client = createClient(mockHttp)
      const resultSchema = v.array(v.object({ col1: v.string() }))

      await expect(
        client.query('SELECT * FROM test', 'large', resultSchema),
      ).toBeRejectedWith('Query failed: QUERY_STATE_FAILED')
    })

    it('throws error when query is canceled', async () => {
      const executionId = 'exec-123'

      const mockHttp = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_PENDING',
          })
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_CANCELED',
            execution_cost_credits: 5,
          }),
      })

      const client = createClient(mockHttp)
      const resultSchema = v.array(v.object({ col1: v.string() }))

      await expect(
        client.query('SELECT * FROM test', 'large', resultSchema),
      ).toBeRejectedWith('Query failed: QUERY_STATE_CANCELED')
    })

    it('throws error when query times out', async () => {
      const executionId = 'exec-123'

      const mockHttp = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_PENDING',
          })
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_TIMED_OUT',
            execution_cost_credits: 5,
          }),
      })

      const client = createClient(mockHttp)
      const resultSchema = v.array(v.object({ col1: v.string() }))

      await expect(
        client.query('SELECT * FROM test', 'large', resultSchema),
      ).toBeRejectedWith('Query failed: QUERY_STATE_TIMED_OUT')
    })

    it('throws error when getExecutionStatus fails', async () => {
      const executionId = 'exec-123'

      const mockHttp = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_PENDING',
          })
          .rejectsWithOnce(new Error('Network error')),
      })

      const client = createClient(mockHttp)
      const resultSchema = v.array(v.object({ col1: v.string() }))

      await expect(
        client.query('SELECT * FROM test', 'large', resultSchema),
      ).toBeRejectedWith(/Failed to get execution status/)
    })

    it('parses result with schema', async () => {
      const executionId = 'exec-123'
      const resultRows = [{ col1: 'value1', col2: 123 }]
      const resultSchema = v.array(
        v.object({
          col1: v.string(),
          col2: v.number(),
        }),
      )

      const mockHttp = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_PENDING',
          })
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_COMPLETED',
            result_metadata: {
              datapoint_count: 1,
              execution_time_millis: 100,
            },
            execution_cost_credits: 1,
          })
          .resolvesToOnce({
            result: {
              rows: resultRows,
            },
          }),
      })

      const client = createClient(mockHttp)
      const result = await client.query(
        'SELECT * FROM test',
        'large',
        resultSchema,
      )

      expect(result).toEqual(resultRows)
    })
  })
})
