import type { json } from '@l2beat/shared-pure'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import { NearError, ValidatorsList } from './types'

interface Dependencies extends ClientCoreDependencies {
  nearApiUrl: string
  timeout?: number
}

export class NearClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super({ ...$ })
  }

  async getValidatorsInfo(): Promise<ValidatorsList> {
    const response = await this.call('validators', [null])
    const parsed = ValidatorsList.safeParse(response)

    if (!parsed.success) {
      this.$.logger.warn('Invalid response', {
        endpoint: 'validators',
        response: JSON.stringify(response),
      })
      throw new Error('Error during validators parsing')
    }

    return parsed.data
  }

  async call(method: string, params: unknown[]): Promise<unknown> {
    return await this.fetch(this.$.nearApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: this.$.timeout,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'dontcare',
        method,
        params,
      }),
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = NearError.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn('Response validation error', {
        error: parsedError.data,
      })
      return { success: false }
    }

    return { success: true }
  }
}
