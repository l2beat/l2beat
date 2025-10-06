import type { PlanExecutionResult } from './execution'
import type { Intent } from './intents'
import type { Plan, PlanningResult } from './planning'

export class HttpTokenService {
  constructor(private readonly baseUrl: string) {}

  generatePlan(intent: Intent): Promise<PlanningResult> {
    return this.postJson<PlanningResult>('generatePlan', intent)
  }

  executePlan(plan: Plan): Promise<PlanExecutionResult> {
    return this.postJson<PlanExecutionResult>('executePlan', plan)
  }

  private async postJson<T>(path: string, body: unknown): Promise<T> {
    const url = this.endpoint(path)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(
        `Request to ${url} failed with status ${response.status}: ${text}`,
      )
    }

    return (await response.json()) as T
  }

  private endpoint(path: string): string {
    const trimmedBase = this.baseUrl.replace(/\/+$/, '')
    const trimmedPath = path.replace(/^\/+/, '')
    return `${trimmedBase}/${trimmedPath}`
  }
}
