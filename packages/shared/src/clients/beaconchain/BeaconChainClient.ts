import type { json } from '@l2beat/shared-pure'
import type { v } from '@l2beat/validate'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import {
  BeaconChainError,
  type Blob as BlobSchema,
  BlockSidecarSchema,
} from './types'

export type BeaconChainBlob = v.infer<typeof BlobSchema>

interface Dependencies extends ClientCoreDependencies {
  beaconApiUrl: string
  timeout?: number
  generateId?: () => string
}

export class BeaconChainClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super({ ...$ })
  }

  async getBlockSidecar(blockId: string): Promise<BeaconChainBlob[]> {
    const endpoint = `eth/v1/beacon/blob_sidecars/${blockId}`

    const response = await this.call(endpoint)
    const parsed = BlockSidecarSchema.safeParse(response)

    if (!parsed.success) {
      this.$.logger.warn('Invalid response', {
        endpoint,
        response: JSON.stringify(response),
      })
      throw new Error(`Block: ${blockId}: Error during sidecar parsing`)
    }

    return parsed.data.data.map((blob) => ({
      kzg_commitment: blob.kzg_commitment,
      data: blob.blob,
    }))
  }

  async call(endpoint: string): Promise<unknown> {
    const url = `${this.$.beaconApiUrl}${endpoint}`

    return await this.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'gzip',
      },
      timeout: this.$.timeout,
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = BeaconChainError.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn('Response validation error', {
        error: parsedError.data,
      })
      return { success: false }
    }

    return { success: true }
  }
}
