import { DiscoveryProvider } from '../DiscoveryProvider'
import { MulticallConfig, MulticallRequest, MulticallResponse } from './types'

export class MulticallClient {
  constructor(
    private readonly provider: DiscoveryProvider,
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
    try {
      if (this.config.sinceBlock > blockNumber) {
        return this.executeIndividual(requests, blockNumber)
      } else {
        const batches = toBatches(requests, this.config.batchSize)
        const batchedResults = await Promise.all(
          batches.map((batch) => this.executeBatch(batch, blockNumber)),
        )
        return batchedResults.flat()
      }
    } catch (e) {
      throw new Error(
        `Ethereum multicall failed for block number:  ${blockNumber}. Call size was ${requests.length}.`,
      )
    }
  }

  private async executeIndividual(
    requests: MulticallRequest[],
    blockNumber: number,
  ): Promise<MulticallResponse[]> {
    const results = await Promise.all(
      requests.map((request) =>
        this.provider.call(request.address, request.data, blockNumber),
      ),
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
    const result = await this.provider.call(
      this.config.address,
      encoded,
      blockNumber,
    )
    return this.config.decodeBatch(result)
  }
}

export function toBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  return batches
}
