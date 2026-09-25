import { Logger } from '@l2beat/backend-tools'
import { v } from '@l2beat/validate'
import { expect, mockFn, mockObject } from 'earl'
import type { DuneClient } from './DuneClient'
import { DuneQueryService } from './DuneQueryService'

describe(DuneQueryService.name, () => {
  const mockLogger = Logger.SILENT

  function createService(
    duneClient: DuneClient,
    timeoutMs?: number,
  ): DuneQueryService {
    return new DuneQueryService({
      logger: mockLogger,
      duneClient,
      pollingIntervalMs: 5,
      timeoutMs,
    })
  }

  describe(DuneQueryService.prototype.query.name, () => {
    it('completes successfully when query finishes immediately', async () => {
      const executionId = 'exec-123'
      const resultRows = [{ col1: 'value1' }, { col1: 'value2' }]
      const resultSchema = v.array(v.object({ col1: v.string() }))

      const mockDuneClient = mockObject<DuneClient>({
        executeSql: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_PENDING',
        }),
        getExecutionStatus: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_COMPLETED',
          result_metadata: {
            datapoint_count: 100,
            execution_time_millis: 500,
            total_result_set_bytes: 1000,
          },
          execution_cost_credits: 10,
        }),
        getExecutionResult: mockFn().resolvesTo({
          result: {
            rows: resultRows,
          },
        }),
      })

      const service = createService(mockDuneClient)
      const result = await service.query(
        'SELECT * FROM test',
        'large',
        resultSchema,
      )

      expect(result).toEqual(resultRows)
      expect(mockDuneClient.executeSql).toHaveBeenCalledWith(
        'SELECT * FROM test',
        'large',
      )
      expect(mockDuneClient.getExecutionStatus).toHaveBeenCalledWith(
        executionId,
      )
      expect(mockDuneClient.getExecutionResult).toHaveBeenCalledWith(
        executionId,
        undefined,
      )
    })

    it('polls status when query is pending', async () => {
      const executionId = 'exec-123'
      const resultRows = [{ col1: 'value1' }, { col1: 'value2' }]
      const resultSchema = v.array(v.object({ col1: v.string() }))

      const mockDuneClient = mockObject<DuneClient>({
        executeSql: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_PENDING',
        }),
        getExecutionStatus: mockFn()
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_PENDING',
            execution_cost_credits: 0,
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
              total_result_set_bytes: 1000,
            },
            execution_cost_credits: 10,
          }),
        getExecutionResult: mockFn().resolvesTo({
          result: {
            rows: resultRows,
          },
        }),
      })

      const service = createService(mockDuneClient)
      const result = await service.query(
        'SELECT * FROM test',
        'large',
        resultSchema,
      )

      expect(result).toEqual(resultRows)
      expect(mockDuneClient.getExecutionStatus).toHaveBeenCalledTimes(3)
    })

    it('throws error when query fails', async () => {
      const executionId = 'exec-123'

      const mockDuneClient = mockObject<DuneClient>({
        executeSql: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_PENDING',
        }),
        getExecutionStatus: mockFn()
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_PENDING',
            execution_cost_credits: 0,
          })
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_FAILED',
            execution_cost_credits: 5,
          }),
      })

      const service = createService(mockDuneClient)
      const resultSchema = v.array(v.object({ col1: v.string() }))

      await expect(
        service.query('SELECT * FROM test', 'large', resultSchema),
      ).toBeRejectedWith('Query failed: QUERY_STATE_FAILED')
    })

    it('throws error when query is canceled', async () => {
      const executionId = 'exec-123'

      const mockDuneClient = mockObject<DuneClient>({
        executeSql: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_PENDING',
        }),
        getExecutionStatus: mockFn()
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_PENDING',
            execution_cost_credits: 0,
          })
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_CANCELED',
            execution_cost_credits: 5,
          }),
      })

      const service = createService(mockDuneClient)
      const resultSchema = v.array(v.object({ col1: v.string() }))

      await expect(
        service.query('SELECT * FROM test', 'large', resultSchema),
      ).toBeRejectedWith('Query failed: QUERY_STATE_CANCELED')
    })

    it('throws error when query times out', async () => {
      const executionId = 'exec-123'

      const mockDuneClient = mockObject<DuneClient>({
        executeSql: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_PENDING',
        }),
        getExecutionStatus: mockFn()
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_PENDING',
            execution_cost_credits: 0,
          })
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_TIMED_OUT',
            execution_cost_credits: 5,
          }),
      })

      const service = createService(mockDuneClient)
      const resultSchema = v.array(v.object({ col1: v.string() }))

      await expect(
        service.query('SELECT * FROM test', 'large', resultSchema),
      ).toBeRejectedWith('Query failed: QUERY_STATE_TIMED_OUT')
    })

    it('throws error when query completes partially', async () => {
      const executionId = 'exec-123'

      const mockDuneClient = mockObject<DuneClient>({
        executeSql: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_PENDING',
        }),
        getExecutionStatus: mockFn()
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_PENDING',
            execution_cost_credits: 0,
          })
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_COMPLETED_PARTIAL',
            execution_cost_credits: 5,
          }),
      })

      const service = createService(mockDuneClient)
      const resultSchema = v.array(v.object({ col1: v.string() }))

      await expect(
        service.query('SELECT * FROM test', 'large', resultSchema),
      ).toBeRejectedWith('Query failed: QUERY_STATE_COMPLETED_PARTIAL')
    })

    it('throws error when getExecutionStatus fails', async () => {
      const executionId = 'exec-123'

      const mockDuneClient = mockObject<DuneClient>({
        executeSql: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_PENDING',
        }),
        getExecutionStatus: mockFn()
          .resolvesToOnce({
            execution_id: executionId,
            state: 'QUERY_STATE_PENDING',
            execution_cost_credits: 0,
          })
          .rejectsWithOnce(new Error('Network error')),
      })

      const service = createService(mockDuneClient)
      const resultSchema = v.array(v.object({ col1: v.string() }))

      await expect(
        service.query('SELECT * FROM test', 'large', resultSchema),
      ).toBeRejectedWith(/Failed to get execution status/)
    })

    it('throws error when execution timeout is exceeded', async () => {
      const executionId = 'exec-123'

      const mockDuneClient = mockObject<DuneClient>({
        executeSql: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_PENDING',
        }),
        getExecutionStatus: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_EXECUTING',
          execution_cost_credits: 5,
        }),
      })

      const service = createService(mockDuneClient, 5)
      const resultSchema = v.array(v.object({ col1: v.string() }))

      await expect(
        service.query('SELECT * FROM test', 'large', resultSchema),
      ).toBeRejectedWith(/Query timeout: execution exceeded/)
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

      const mockDuneClient = mockObject<DuneClient>({
        executeSql: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_PENDING',
        }),
        getExecutionStatus: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_COMPLETED',
          result_metadata: {
            datapoint_count: 1,
            execution_time_millis: 100,
            total_result_set_bytes: 1000,
          },
          execution_cost_credits: 1,
        }),
        getExecutionResult: mockFn().resolvesTo({
          result: {
            rows: resultRows,
          },
        }),
      })

      const service = createService(mockDuneClient)
      const result = await service.query(
        'SELECT * FROM test',
        'large',
        resultSchema,
      )

      expect(result).toEqual(resultRows)
    })

    it('fetches every page until next_offset is absent', async () => {
      const executionId = 'exec-123'
      const resultSchema = v.array(v.object({ col1: v.string() }))

      const mockDuneClient = mockObject<DuneClient>({
        executeSql: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_PENDING',
        }),
        getExecutionStatus: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_COMPLETED',
          result_metadata: {
            datapoint_count: 3,
            execution_time_millis: 500,
            total_result_set_bytes: 1000,
          },
          execution_cost_credits: 10,
        }),
        getExecutionResult: mockFn()
          .resolvesToOnce({
            result: { rows: [{ col1: 'a' }, { col1: 'b' }] },
            next_offset: 2,
            next_uri: `https://api.dune.com/api/v1/execution/${executionId}/results?offset=2`,
          })
          .resolvesToOnce({
            result: { rows: [{ col1: 'c' }] },
          }),
      })

      const service = createService(mockDuneClient)
      const result = await service.query(
        'SELECT * FROM test',
        'large',
        resultSchema,
      )

      expect(result).toEqual([{ col1: 'a' }, { col1: 'b' }, { col1: 'c' }])
      expect(mockDuneClient.getExecutionResult).toHaveBeenCalledTimes(2)
      expect(mockDuneClient.getExecutionResult).toHaveBeenNthCalledWith(
        1,
        executionId,
        undefined,
      )
      expect(mockDuneClient.getExecutionResult).toHaveBeenNthCalledWith(
        2,
        executionId,
        2,
      )
    })

    it('throws when the reported next_offset does not advance', async () => {
      const executionId = 'exec-123'
      const resultSchema = v.array(v.object({ col1: v.string() }))

      const mockDuneClient = mockObject<DuneClient>({
        executeSql: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_PENDING',
        }),
        getExecutionStatus: mockFn().resolvesTo({
          execution_id: executionId,
          state: 'QUERY_STATE_COMPLETED',
          result_metadata: {
            datapoint_count: 1,
            execution_time_millis: 100,
            total_result_set_bytes: 1000,
          },
          execution_cost_credits: 1,
        }),
        getExecutionResult: mockFn().resolvesTo({
          result: { rows: [{ col1: 'a' }] },
          next_offset: 0,
        }),
      })

      const service = createService(mockDuneClient)

      await expect(
        service.query('SELECT * FROM test', 'large', resultSchema),
      ).toBeRejectedWith('Dune pagination did not advance: offset 0 -> 0')
    })
  })
})
