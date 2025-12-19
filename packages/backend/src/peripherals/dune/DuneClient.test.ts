import type { HttpClient } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import { DuneClient } from './DuneClient'

describe(DuneClient.name, () => {
  const apiKey = 'test-api-key'

  function createClient(http: HttpClient): DuneClient {
    return new DuneClient({
      http,
      apiKey,
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
})
