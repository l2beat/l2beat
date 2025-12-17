import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { Parser } from '@l2beat/validate'
import {
  DuneExecuteSqlResponse,
  DuneExecutionResultResponse,
  type DuneExecutionState,
  DuneExecutionStatusResponse,
} from './types'

type Performance = 'small' | 'medium' | 'large'

export class DuneClient {
  private logger: Logger
  private baseUrl = 'https://api.dune.com/api/'
  private timeoutMs = 2 * UnixTime.MINUTE * 1000
  private pollingIntervalMs = 1000
  private progressLogIntervalMs = 30 * 1000

  constructor(
    logger: Logger,
    private readonly httpClient: HttpClient,
    private readonly apiKey: string,
  ) {
    this.logger = logger.for(this)
  }

  static create(
    services: { httpClient: HttpClient; logger: Logger },
    options: { apiKey: string },
  ) {
    return new DuneClient(services.logger, services.httpClient, options.apiKey)
  }

  async query<T>(
    sql: string,
    performance: Performance,
    resultSchema: Parser<T>,
  ): Promise<T> {
    const { execution_id } = await this.executeSql(sql, performance)
    const startTime = Date.now()
    this.logger.info('Executing SQL...', { execution_id })

    let lastState: DuneExecutionState | undefined
    let queryCompleted = false
    let lastProgressLogTime = startTime

    while (!queryCompleted) {
      const elapsedMs = Date.now() - startTime

      if (elapsedMs >= this.timeoutMs) {
        this.logger.error('Query timeout exceeded', {
          executionId: execution_id,
          elapsedMs,
          timeoutMs: this.timeoutMs,
        })
        throw new Error(
          `Query timeout: execution exceeded ${this.timeoutMs}ms (${Math.round(this.timeoutMs / 1000)}s)`,
        )
      }

      let status
      try {
        status = await this.getExecutionStatus(execution_id)
      } catch (error) {
        this.logger.error('Failed to get execution status', {
          executionId: execution_id,
          elapsedMs,
          error: error instanceof Error ? error.message : String(error),
        })
        throw new Error(
          `Failed to get execution status after ${Math.round(elapsedMs / 1000)}s: ${error instanceof Error ? error.message : String(error)}`,
        )
      }

      switch (status.state) {
        case 'QUERY_STATE_PENDING':
        case 'QUERY_STATE_EXECUTING':
          if (lastState !== status.state) {
            this.logger.info('Query in progress:', {
              executionId: status.execution_id,
              state: status.state,
              elapsedMs,
            })
          } else {
            // Log progress periodically even if state hasn't changed
            const timeSinceLastLog = Date.now() - lastProgressLogTime
            if (timeSinceLastLog >= this.progressLogIntervalMs) {
              this.logger.info('Query in progress:', {
                executionId: status.execution_id,
                state: status.state,
                elapsedMs,
              })
              lastProgressLogTime = Date.now()
            }
          }
          await new Promise((resolve) =>
            setTimeout(resolve, this.pollingIntervalMs),
          )
          break
        case 'QUERY_STATE_COMPLETED': {
          if (lastState !== status.state) {
            this.logger.info('Query completed', {
              executionId: status.execution_id,
              state: status.state,
              elapsedMs,
              executionCostCredits: status.execution_cost_credits,
              apiExportCostCredits:
                status.result_metadata.datapoint_count / 5000,
              executionTimeMillis: status.result_metadata.execution_time_millis,
            })
          }

          queryCompleted = true
          break
        }
        case 'QUERY_STATE_FAILED':
        case 'QUERY_STATE_CANCELED':
        case 'QUERY_STATE_TIMED_OUT':
        case 'QUERY_STATE_COMPLETED_PARTIAL': {
          this.logger.error('Query failed:', {
            executionId: status.execution_id,
            state: status.state,
            elapsedMs,
          })
          throw new Error(`Query failed: ${status.state}`)
        }
      }
      lastState = status.state
    }
    const { result } = await this.getExecutionResult(execution_id)
    return resultSchema.parse(result.rows)
  }

  async executeSql(sql: string, performance: Performance) {
    const response = await this.fetch('v1/sql/execute', 'POST', {
      sql,
      performance,
    })

    return DuneExecuteSqlResponse.parse(response)
  }

  async getExecutionStatus(executionId: string) {
    const response = await this.fetch(
      `v1/execution/${executionId}/status`,
      'GET',
    )

    return DuneExecutionStatusResponse.parse(response)
  }

  async getExecutionResult(executionId: string) {
    const response = await this.fetch(
      `v1/execution/${executionId}/results`,
      'GET',
    )

    return DuneExecutionResultResponse.parse(response)
  }

  fetch(path: string, method: 'GET' | 'POST', body?: unknown) {
    return this.httpClient.fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Dune-API-Key': this.apiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  }
}
