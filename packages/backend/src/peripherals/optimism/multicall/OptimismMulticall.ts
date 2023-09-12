import { ChainId, EthereumAddress } from '@l2beat/shared-pure'

import { EthereumClient } from '../../ethereum/EthereumClient'
import {
  MulticallEncoder,
  MulticallRequest,
  MulticallResponse,
} from './interfaces'
import { optimismMulticallEncoder } from './MulticallEncoder'

// TODO: Investigate if max batch size can be tweaked
// ! CHECK THOSE VALUES
/**
 * @see https://arbiscan.io/address/0x842eC2c7D803033Edf55E478F461FC547Bc54EB2
 */
export const OPTIMISM_MULTICALL_BATCH_SIZE = 150
export const OPTIMISM_MULTICALL_BLOCK = 821923
export const OPTIMISM_MULTICALL_ADDRESS = EthereumAddress(
  '0x842eC2c7D803033Edf55E478F461FC547Bc54EB2',
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
