import type { HttpClient } from '../http/HttpClient'
import {
  DuneExecuteSqlResponse,
  DuneExecutionResultResponse,
  DuneExecutionStatusResponse,
} from './types'

/*
  Dune has three query engine sizes: small, medium, and large. 
  The query engine size determines the amount of resources allocated to your query. 
  This means that queries executed on a larger query engine will run faster and are less likely to time out.
*/
export type DunePerformance = 'small' | 'medium' | 'large'
type Dependencies = {
  http: HttpClient
  apiKey: string
}

export class DuneClient {
  private baseUrl = 'https://api.dune.com/api/'

  constructor(private readonly $: Dependencies) {}

  async executeSql(sql: string, performance: DunePerformance) {
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

  private fetch(path: string, method: 'GET' | 'POST', body?: unknown) {
    return this.$.http.fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Dune-API-Key': this.$.apiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  }
}
