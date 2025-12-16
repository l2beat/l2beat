import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
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
    this.logger.info('Executing SQL...', { execution_id })
    let lastState: DuneExecutionState | undefined
    let queryCompleted = false
    while (!queryCompleted) {
      const status = await this.getExecutionStatus(execution_id)
      switch (status.state) {
        case 'QUERY_STATE_PENDING':
        case 'QUERY_STATE_EXECUTING':
          if (lastState !== status.state) {
            this.logger.info('Query in progress:', {
              executionId: status.execution_id,
              state: status.state,
            })
          }
          await new Promise((resolve) => setTimeout(resolve, 1000))
          break
        case 'QUERY_STATE_COMPLETED':
          if (lastState !== status.state) {
            this.logger.info('Query completed', {
              executionId: status.execution_id,
              state: status.state,
              executionCostCredits: status.execution_cost_credits,
              apiExportCost: status.result_metadata.datapoint_count / 5000,
            })
          }

          queryCompleted = true
          break
        case 'QUERY_STATE_FAILED':
        case 'QUERY_STATE_CANCELED':
        case 'QUERY_STATE_TIMED_OUT':
        case 'QUERY_STATE_COMPLETED_PARTIAL':
          this.logger.error('Query failed:', {
            executionId: status.execution_id,
            state: status.state,
          })
          throw new Error(`Query failed: ${status.state}`)
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
