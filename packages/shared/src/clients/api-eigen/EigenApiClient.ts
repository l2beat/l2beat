import { assert, type json, UnixTime } from '@l2beat/shared-pure'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import {
  GetByProjectDataSuccessSchema,
  GetMetricsV1SuccessSchema,
  GetMetricsV2SuccessSchema,
} from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  perProjectUrl: string
}

export class EigenApiClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getMetricsV1(from: number, to: number): Promise<number> {
    const response = await this.fetch(
      `${this.$.url}/v1/metrics?start=${from}&end=${to}`,
      {},
    )
    const json = GetMetricsV1SuccessSchema.parse(response)

    return json.throughput
  }

  async getMetricsV2(from: number, to: number): Promise<number> {
    const response = await this.fetch(
      `${this.$.url}/v2/metrics/summary?start=${from}&end=${to}`,
      {},
    )
    const json = GetMetricsV2SuccessSchema.parse(response)

    return json.total_bytes_posted
  }

  async getByProjectData(until: number) {
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

    return GetByProjectDataSuccessSchema.parse(parsed)
  }

  override validateResponse(_response: json): {
    success: boolean
    message?: string
  } {
    return { success: true }
  }
}
