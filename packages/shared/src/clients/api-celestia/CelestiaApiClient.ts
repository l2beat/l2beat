import type { json } from '@l2beat/shared-pure'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import {
  type CelestiaEvent,
  GetBlobResponseSchema,
  GetBlockResultsResponseSchema,
} from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
}

/**
 * Yes, we already have a CelestiaRPCClient - used heavily by DA tracking.
 * Yes, I could extend it, but then I'd have to change the validation logic to also handle JSON RPC and what not.
 * It's a bit of a mess and this version is a lighter for purpose of OpDaHandler and l2b.
 */
export class CelestiaApiClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getBlockResultEvents(height: number): Promise<CelestiaEvent[]> {
    const url = `${this.$.url}/block_results?height=${height}`
    const response = await this.fetch(url, {})

    const json = GetBlockResultsResponseSchema.parse(response)

    return json.result.txs_results.flatMap((tx) => tx.events)
  }

  async blobExists(height: number, namespace: string, commitment: string) {
    const body = {
      id: '1',
      jsonrpc: '2.0',
      method: 'blob.Get',
      params: [height, namespace, commitment],
    }

    const response = await this.fetch(this.$.url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    const json = GetBlobResponseSchema.parse(response)

    if ('error' in json) {
      return false
    }

    return true
  }

  override validateResponse(_response: json): {
    success: boolean
    message?: string
  } {
    return { success: true }
  }
}
