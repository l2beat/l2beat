import { ChainId, EthereumAddress } from '@l2beat/shared-pure'

import { EthereumClient } from '../../ethereum/EthereumClient'
import {
  MulticallEncoder,
  MulticallRequest,
  MulticallResponse,
} from './interfaces'
import { optimismMulticallEncoder } from './MulticallEncoder'

// TODO: Investigate if max batch size can be tweaked
/**
 * @see https://optimistic.etherscan.io/address/0xe295ad71242373c37c5fda7b57f26f9ea1088afe
 */
export const OPTIMISM_MULTICALL_BATCH_SIZE = 150
export const OPTIMISM_MULTICALL_BLOCK = 0
export const OPTIMISM_MULTICALL_ADDRESS = EthereumAddress(
  '0xE295aD71242373C37C5FdA7B57F26f9eA1088AFe',
)

export class OptimismMulticallClient {
  private readonly chainId = ChainId.OPTIMISM

  static forMainnet(optimismClient: EthereumClient) {
    return new OptimismMulticallClient(
      optimismClient,
      optimismMulticallEncoder,
      OPTIMISM_MULTICALL_ADDRESS,
      OPTIMISM_MULTICALL_BLOCK,
      OPTIMISM_MULTICALL_BATCH_SIZE,
    )
  }

  constructor(
    private readonly optimismClient: EthereumClient,
    private readonly encoder: MulticallEncoder,
    private readonly address: EthereumAddress,
    private readonly deployBlock: number,
    private readonly maxBatchSize: number,
  ) {}

  getAddress(): EthereumAddress {
    return this.address
  }

  canBeUsed(blockNumber: number): boolean {
    return blockNumber >= this.deployBlock
  }

  assertCanBeUsed(blockNumber: number): void | never {
    if (!this.canBeUsed(blockNumber)) {
      throw new Error(
        `Optimism multicall is not available for given block number: ${blockNumber}`,
      )
    }
  }

  async multicall(
    requests: MulticallRequest[],
    blockNumber: number,
  ): Promise<MulticallResponse[]> {
    this.assertCanBeUsed(blockNumber)

    const batches = toBatches(requests, this.maxBatchSize)

    try {
      const batchedResults = await Promise.all(
        batches.map((batch) => this.executeBatch(batch, blockNumber)),
      )

      return batchedResults.flat()
    } catch (e) {
      throw new Error(
        `Optimism multicall failed for block number ${blockNumber}}. Call size was ${requests.length} in ${batches.length} batches.`,
      )
    }
  }

  private async executeBatch(
    requests: MulticallRequest[],
    blockNumber: number,
  ): Promise<MulticallResponse[]> {
    const encoded = this.encoder.encode(requests)

    const result = await this.optimismClient.call(
      {
        to: this.address,
        data: encoded,
      },
      blockNumber,
    )

    return this.encoder.decode(result)
  }

  getChainId(): ChainId {
    return this.chainId
  }
}

export function toBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  return batches
}
