import { RpcClient } from '../rpcclient/RpcClient'
import {
  MulticallConfigEntry,
  MulticallRequest,
  MulticallResponse,
} from './types'

export class MulticallClient {
  constructor(
    private readonly ethereumClient: RpcClient,
    private readonly config: MulticallConfigEntry[],
  ) {}

  isNativeBalanceSupported(blockNumber: number): boolean {
    const config = this.config.find((x) => blockNumber > x.sinceBlock)
    return config?.isNativeBalanceSupported ?? false
  }

  async multicall(requests: MulticallRequest[], blockNumber: number) {
    // We use strictly greater than because contracts are deployed during the block
    const config = this.config.find((x) => blockNumber > x.sinceBlock)
    try {
      if (!config || requests.length === 1) {
        return this.executeIndividual(requests, blockNumber)
      } else {
        const batches = toBatches(requests, config.batchSize)
        const batchedResults = await Promise.all(
          batches.map((batch) => this.executeBatch(config, batch, blockNumber)),
        )
        return batchedResults.flat()
      }
    } catch {
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
        this.ethereumClient.call(
          {
            to: request.address,
            data: request.data,
          },
          blockNumber,
        ),
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
    config: MulticallConfigEntry,
    requests: MulticallRequest[],
    blockNumber: number,
  ): Promise<MulticallResponse[]> {
    const encoded = config.encodeBatch(requests)
    const result = await this.ethereumClient.call(
      { to: config.address, data: encoded },
      blockNumber,
    )
    return config.decodeBatch(result)
  }
}

export function toBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  return batches
}
