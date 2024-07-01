import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { z } from 'zod'
import { MulticallConfig, MulticallRequest, MulticallResponse } from './types'

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
    private readonly config: MulticallConfig,
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
    if (this.config.sinceBlock > blockNumber) {
      return this.executeIndividual(requests, blockNumber)
    } else {
      const batches = toBatches(requests, this.config.batchSize)
      const batchedResults = await Promise.all(
        batches.map((batch) => this.executeBatch(batch, blockNumber)),
      )
      return batchedResults.flat()
    }
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
  ): Promise<MulticallResponse[]> {
    const encoded = this.config.encodeBatch(requests)
    try {
      const result = await this.provider.call(
        this.config.address,
        encoded,
        blockNumber,
      )
      return this.config.decodeBatch(result)
    } catch (e) {
      const parsed = ethersError.safeParse(e)
      if (parsed.success) {
        // NOTE(radomski): If we batch a call that will execute an INVALID
        // opcode we have no way of knowing which call failed. Just execute
        // them individually.
        if (parsed.data.error.error.message === 'out of gas') {
          return await this.executeIndividual(requests, blockNumber)
        }
      }
      throw e
    }
  }
}

export function toBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  return batches
}

export function parseEthersError(e: unknown): Error | undefined {
  const parsed = ethersError.safeParse(e)

  if (parsed.success) {
    return new Error(JSON.stringify(parsed.data))
  }

  return undefined
}

const ethersError = z.object({
  error: z.object({
    code: z.string().optional(),
    reason: z.string().optional(),
    requestMethod: z.string().optional(),
    error: z.object({
      code: z.number(),
      message: z.string(),
    }),
    timeout: z.number().optional(),
    status: z.number().optional(),
  }),
})
