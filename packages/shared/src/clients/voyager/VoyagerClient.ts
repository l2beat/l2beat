import { type json, UnixTime } from '@l2beat/shared-pure'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import {
  DailyTxsResponse,
  DailyUopsResponse,
  VoyagerErrorResponse,
} from './types'

const API_URL = 'https://api.voyager.online/beta'

interface Dependencies extends ClientCoreDependencies {
  apiKey: string
}
export class VoyagerClient extends ClientCore {
  private readonly timeoutMs = 10_000
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getDailyUops(): Promise<Record<number, number>> {
    const response = await this.query('/daily-stats', {
      metrics: 'user_operations_count',
      timerange: 'max',
    })

    const parsed = DailyUopsResponse.parse(response)

    return Object.fromEntries(
      parsed.items.map((item) => [
        UnixTime.fromDate(new Date(item.date)),
        item.value,
      ]),
    )
  }

  async getDailyTxs(): Promise<Record<number, number>> {
    const response = await this.query('/daily-stats', {
      metrics: 'transactions_count',
      timerange: 'max',
    })

    const parsed = DailyTxsResponse.parse(response)

    return Object.fromEntries(
      parsed.items.map((item) => [
        UnixTime.fromDate(new Date(item.date)),
        item.value,
      ]),
    )
  }

  async query(endpoint: string, queryParams: Record<string, string>) {
    const query = new URLSearchParams(queryParams).toString()
    let url = `${API_URL}${endpoint}`
    if (query) {
      url += `?${query}`
    }
    return await this.fetch(url, {
      timeout: this.timeoutMs,
      headers: {
        'x-api-key': this.$.apiKey,
      },
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = VoyagerErrorResponse.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn('Response validation error', {
        message: parsedError.data.message,
      })
      return { success: false }
    }

    return { success: true }
  }
}
