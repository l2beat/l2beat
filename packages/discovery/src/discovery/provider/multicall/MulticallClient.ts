import { Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type {
  MulticallConfig,
  MulticallRequest,
  MulticallResponse,
} from './types'

export interface CallProvider {
  call(
    address: EthereumAddress,
    data: Bytes,
    blockNumber: number,
  ): Promise<Bytes>
}

export class MulticallClient {
  constructor(
    private readonly provider: CallProvider,
    private readonly config?: MulticallConfig,
  ) {}

  async multicallNamed(
    requests: Record<string, MulticallRequest[]>,
    blockNumber: number,
  ): Promise<Record<string, MulticallResponse[]>> {
    const entries = Object.entries(requests)
    const calls = entries.map((x) => x[1]).flat()
    const results = await this.multicall(calls, blockNumber)
    const responses = new Map<string, MulticallResponse[]>()
    for (const entry of entries) {
      for (const _ of entry[1]) {
        const result = results.shift()
        if (!result) {
          throw new Error('Unexpected result')
        }
        const response = responses.get(entry[0])
        if (response) {
          response.push(result)
        } else {
          responses.set(entry[0], [result])
        }
      }
    }

    return Object.fromEntries(responses)
  }

  async multicall(
    requests: MulticallRequest[],
    blockNumber: number,
  ): Promise<MulticallResponse[]> {
    const config = this.config

    if (!config || config.sinceBlock > blockNumber) {
      return this.executeIndividual(requests, blockNumber)
    }
    const batches = toBatches(requests, config.batchSize)
    const batchedResults = await Promise.all(
      batches.map((batch) => this.executeBatch(batch, blockNumber, config)),
    )
    return batchedResults.flat()
  }

  private async executeIndividual(
    requests: MulticallRequest[],
    blockNumber: number,
  ): Promise<MulticallResponse[]> {
    const results = await Promise.all(
      requests.map(async (request) => {
        try {
          return await this.provider.call(
            request.address,
            request.data,
            blockNumber,
          )
        } catch {
          return Bytes.EMPTY
        }
      }),
    )
    return results.map(
      (result): MulticallResponse => ({
        success: result.length !== 0,
        data: result,
      }),
    )
  }

  private async executeBatch(
    requests: MulticallRequest[],
    blockNumber: number,
    config: MulticallConfig,
  ): Promise<MulticallResponse[]> {
    const encoded = config.encodeBatch(requests)
    try {
      const result = await this.provider.call(
        config.address,
        encoded,
        blockNumber,
      )
      return config.decodeBatch(result)
    } catch (e) {
      const parsed = ethersError.safeValidate(e)
      if (parsed.success) {
        // NOTE(radomski): If we batch a call that will execute an INVALID
        // opcode we have no way of knowing which call failed. Just execute
        // them individually.
        if (parsed.data.error.error.message.includes('out of gas')) {
          return await this.executeIndividual(requests, blockNumber)
        }
      }
      throw e
    }
  }
}

function toBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  return batches
}

const ethersError = v.object({
  error: v.object({
    code: v.string().optional(),
    reason: v.string().optional(),
    requestMethod: v.string().optional(),
    error: v.object({
      code: v.number(),
      message: v.string(),
    }),
    timeout: v.number().optional(),
    status: v.number().optional(),
  }),
})
