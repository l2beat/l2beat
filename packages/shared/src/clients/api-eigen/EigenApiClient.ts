import { assert, type json, UnixTime } from '@l2beat/shared-pure'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import { GetByProjectResponse, GetMetricsResponse } from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  perProjectUrl: string
}

export class EigenApiClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getMetrics(from: number, to: number): Promise<GetMetricsResponse> {
    const response = await this.fetch(
      `${this.$.url}/v2/metrics/summary?start=${from}&end=${to}`,
      {},
    )

    return GetMetricsResponse.parse(response)
  }

  async getByProjectData(until: number): Promise<GetByProjectResponse> {
    const date = new Date(until * 1000).toISOString().split('T')[0]
    const response = await this.$.http.fetchRaw(
      `${this.$.perProjectUrl}/v2/stats/${date}.json`,
      {},
    )

    const rawText = await response.text()

    assert(
      !rawText.includes('The specified key does not exist'),
      `No EigenDA data for projects for ${UnixTime.toDate(until).toISOString()}`,
    )

    const lines = rawText.trim().split('\n')
    const parsed = lines
      .map((line) => line.trim())
      .map((line) => JSON.parse(line))

    return GetByProjectResponse.parse(parsed)
  }

  override validateResponse(_response: json): {
    success: boolean
    message?: string
  } {
    return { success: true }
  }
}
