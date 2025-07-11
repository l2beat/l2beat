import type { json } from '@l2beat/shared-pure'

import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import { StarkexApiErrorResponse, StarkexApiSuccessResponse } from './types'

interface Dependencies extends ClientCoreDependencies {
  apiKey: string
}

export const STARKEX_BI_API_V2 = 'https://bi-cf-v2-gw-ddper8ah.uc.gateway.dev'
export const STARKEX_BI_API_V3 = 'https://bi-cf-v3-ddper8ah.uc.gateway.dev'

export class StarkexClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super({ ...$ })
  }

  async getDailyCount(day: number, product: string): Promise<number> {
    const body = getBody(day, product)

    const response =
      product === 'dydx'
        ? await this.query(STARKEX_BI_API_V2, '/aggregations/count', body)
        : await this.query(STARKEX_BI_API_V3, '/aggregations/count', body)

    const parsedResponse = StarkexApiSuccessResponse.safeParse(response)

    if (!parsedResponse.success) {
      throw new Error(`${product} - Day ${day}: Error during parsing`)
    }
    return parsedResponse.data.count
  }

  async query(apiUrl: string, path: string, body: json) {
    const url = apiUrl + path + `?key=${this.$.apiKey}`
    return await this.fetch(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      timeout: 10_000,
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = StarkexApiErrorResponse.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn('Response validation error', {
        message: parsedError.data.message,
      })
      return { success: false }
    }

    return { success: true }
  }
}

function getBody(day: number, product: string) {
  const bodyV3 = {
    day_start: day,
    day_end: day + 1,
    product,
  }

  if (product !== 'dydx') return bodyV3

  return {
    ...bodyV3,
    tx_type: '_all',
    token_id: '_all',
  }
}
