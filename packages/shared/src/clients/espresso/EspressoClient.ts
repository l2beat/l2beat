import type { json } from '@l2beat/shared-pure'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import { EspressoError, EspressoStakeTable } from './types'

interface Dependencies extends ClientCoreDependencies {
  apiUrl: string
  timeout?: number
}

export class EspressoClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super({ ...$ })
  }

  async getStakeTable(): Promise<EspressoStakeTable> {
    const url = `${this.$.apiUrl}/v0/node/stake-table/current`
    const response = await this.fetch(url, {
      method: 'GET',
      timeout: this.$.timeout,
    })

    const parsed = EspressoStakeTable.safeParse(response)

    if (!parsed.success) {
      this.$.logger.warn('Invalid response', {
        endpoint: 'stake-table/current',
        response: JSON.stringify(response),
      })
      throw new Error('Error during stake table parsing')
    }

    return parsed.data
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = EspressoError.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn('Response validation error', {
        error: parsedError.data,
      })
      return { success: false }
    }

    return { success: true }
  }
}
