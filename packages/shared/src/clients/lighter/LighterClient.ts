import type { json } from '@l2beat/shared-pure'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import { HourlyStatsResponse, LighterErrorResponse } from './types'

const API_URL = 'https://explorer.elliot.ai/api'

export class LighterClient extends ClientCore {
  private readonly timeoutMs = 10_000
  constructor(private readonly $: ClientCoreDependencies) {
    super($)
  }

  async getHourlyStats(): Promise<
    Array<{ timestamp: number; count: number; uopsCount: number }>
  > {
    const response = await this.query('/stats/tx', {
      aggregation_period: '1h',
    })

    const parsed = HourlyStatsResponse.parse(response)

    return parsed.data.chart.data.map(([timestamp, count, uopsCount]) => ({
      timestamp,
      count,
      uopsCount,
    }))
  }

  async query(path: string, queryParams: Record<string, string>) {
    const query = new URLSearchParams(queryParams).toString()
    let url = API_URL + path
    if (query) {
      url += `?${query}`
    }
    return await this.fetch(url, {
      timeout: this.timeoutMs,
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = LighterErrorResponse.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn('Response validation error', {
        message: parsedError.data.message,
      })
      return { success: false }
    }

    return { success: true }
  }
}
