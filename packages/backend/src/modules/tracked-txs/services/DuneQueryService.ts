import type { Logger } from '@l2beat/backend-tools'
import type {
  DuneClient,
  DuneExecutionState,
  DunePerformance,
} from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { Parser } from '@l2beat/validate'

type Dependencies = {
  logger: Logger
  duneClient: DuneClient
  timeoutMs?: number
  pollingIntervalMs?: number
  progressLogIntervalMs?: number
}

export class DuneQueryService {
  private logger: Logger
  private timeoutMs: number
  private progressLogIntervalMs: number = 30 * 1000
  private pollingIntervalMs: number

  constructor(private readonly $: Dependencies) {
    this.logger = $.logger.for(this)
    this.timeoutMs = $.timeoutMs ?? 2 * UnixTime.MINUTE * 1000
    this.pollingIntervalMs = $.pollingIntervalMs ?? 1000
  }

  async query<T>(
    sql: string,
    performance: DunePerformance,
    resultSchema: Parser<T>,
  ): Promise<T> {
    const { execution_id } = await this.$.duneClient.executeSql(
      sql,
      performance,
    )
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
          timeoutMs: this.timeoutMs,
        })
        throw new Error(
          `Query timeout: execution exceeded ${this.timeoutMs}ms (${Math.round(this.timeoutMs / 1000)}s)`,
        )
      }

      let status
      try {
        status = await this.$.duneClient.getExecutionStatus(execution_id)
      } catch (error) {
        this.logger.error('Failed to get execution status', {
          executionId: execution_id,
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
            })
          } else {
            // Log progress periodically even if state hasn't changed
            const timeSinceLastLog = Date.now() - lastProgressLogTime
            if (timeSinceLastLog >= this.progressLogIntervalMs) {
              this.logger.info('Query in progress:', {
                executionId: status.execution_id,
                state: status.state,
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
    const { result } = await this.$.duneClient.getExecutionResult(execution_id)
    return resultSchema.parse(result.rows)
  }
}
