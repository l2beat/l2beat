
import { type json, UnixTime } from "@l2beat/shared-pure"
import { RangeErrorResponse, type RangeStats, RangeStatsResponse } from "./types"
import { ClientCore, type ClientCoreDependencies } from "@l2beat/shared"

interface Dependencies extends ClientCoreDependencies {
  url: string
  apiKey: string
  generateId?: () => string
}

export class RangeClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getProtocolStats(
    protocol: string,
    begin: UnixTime,
    end: UnixTime,
  ): Promise<RangeStats> {
    const beginTimestamp = UnixTime.toDate(begin).toISOString()
    const endTimestamp = UnixTime.toDate(end).toISOString()

    const response = await this.query(
      '/protocols/stats',
      { protocol, beginTimestamp, endTimestamp },
    )

    const statsResponse = RangeStatsResponse.safeParse(response)

    if (!statsResponse.success) {
      this.$.logger.warn(`Invalid response`, {
        protocol,
        begin,
        end,
        response: JSON.stringify(statsResponse),
      })
      throw new Error('Error during parsing')
    }

    return statsResponse.data
  }

  async query(
    endpoint: string,
    params: Record<string, string>,
  ) {
    return await this.fetch(this.$.url + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.$.apiKey,
      },
      body: JSON.stringify(params),
      redirect: 'follow',
      timeout: 5_000,
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = RangeErrorResponse.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn(`Response validation error`, {
        ...parsedError.data.message,
      })
      return { success: false }
    }

    return { success: true }
  }
}
