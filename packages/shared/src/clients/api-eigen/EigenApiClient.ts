import { assert, type json, UnixTime } from '@l2beat/shared-pure'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import { GetByProjectDataSuccessSchema, GetMetricsSuccessSchema } from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  perProjectUrl: string
}

export class EigenApiClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getMetrics(from: number, to: number): Promise<number> {
    const response = await this.fetch(
      `${this.$.url}/metrics?start=${from}&end=${to}`,
      {},
    )
    const json = GetMetricsSuccessSchema.parse(response)

    return json.throughput
  }

  async getByProjectData(until: number) {
    const date = new Date(until * 1000).toISOString().split('T')[0]
    const response = await this.$.http.fetchRaw(
      `${this.$.perProjectUrl}/stats/${date}.json`,
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
