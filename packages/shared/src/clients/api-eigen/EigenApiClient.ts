import type { Logger } from '@l2beat/backend-tools'
import { type json, UnixTime } from '@l2beat/shared-pure'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import { GetByProjectResponse, GetMetricsResponse } from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  perProjectUrl: string
}

export class EigenApiClient extends ClientCore {
  private readonly logger: Logger

  constructor(private readonly $: Dependencies) {
    super($)
    this.logger = $.logger.for(this)
  }

  async getMetrics(from: number, to: number): Promise<GetMetricsResponse> {
    const response = await this.fetch(
      `${this.$.url}/v2/metrics/summary?start=${from}&end=${to}`,
      {},
    )

    return GetMetricsResponse.parse(response)
  }

  /**
   * Every daily file is a full export of the usage table taken on the day in
   * its name, so the file dated `until` is just the earliest one that holds
   * the previous day in full. When it was never published (2026-09-23 is
   * missing) any later file has the same rows. Only today's file may still
   * be on its way, so a missing one is left for the retry.
   */
  async getByProjectData(until: number): Promise<GetByProjectResponse> {
    const requested = UnixTime.toStartOf(until, 'day')
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')

    for (let day = requested; day <= today; day += UnixTime.DAY) {
      const rawText = await this.fetchStatsFile(day)
      if (rawText === undefined) {
        continue
      }
      if (day !== requested) {
        this.logger.warn('Daily file missing, using a later one', {
          requested: UnixTime.toYYYYMMDD(requested),
          used: UnixTime.toYYYYMMDD(day),
        })
      }

      const parsed = rawText
        .trim()
        .split('\n')
        .map((line) => JSON.parse(line.trim()))

      return GetByProjectResponse.parse(parsed)
    }

    throw new Error(
      `No EigenDA data for projects for ${UnixTime.toDate(until).toISOString()}`,
    )
  }

  private async fetchStatsFile(day: UnixTime): Promise<string | undefined> {
    const response = await this.$.http.fetchRaw(
      `${this.$.perProjectUrl}/v2/stats/${UnixTime.toYYYYMMDD(day)}.json`,
      {},
    )
    const rawText = await response.text()

    if (rawText.includes('The specified key does not exist')) {
      return undefined
    }
    return rawText
  }

  override validateResponse(_response: json): {
    success: boolean
    message?: string
  } {
    return { success: true }
  }
}
