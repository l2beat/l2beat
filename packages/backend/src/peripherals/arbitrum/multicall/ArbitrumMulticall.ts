import { ChainId, EthereumAddress } from '@l2beat/shared-pure'

import { EthereumClient } from '../../ethereum/EthereumClient'
import {
  MulticallEncoder,
  MulticallRequest,
  MulticallResponse,
} from './interfaces'
import { arbitrumMulticallEncoder } from './MulticallEncoder'

// TODO: Investigate if max batch size can be tweaked
/**
 * @see https://arbiscan.io/address/0x842eC2c7D803033Edf55E478F461FC547Bc54EB2
 */
export const ARBITRUM_MULTICALL_BATCH_SIZE = 150
export const ARBITRUM_MULTICALL_BLOCK = 821923
export const ARBITRUM_MULTICALL_ADDRESS = EthereumAddress(
  '0x842eC2c7D803033Edf55E478F461FC547Bc54EB2',
)

export class ArbitrumMulticallClient {
  private readonly chainId = ChainId.ARBITRUM

  static forMainnet(arbitrumClient: EthereumClient) {
    return new ArbitrumMulticallClient(
      arbitrumClient,
      arbitrumMulticallEncoder,
      ARBITRUM_MULTICALL_ADDRESS,
      ARBITRUM_MULTICALL_BLOCK,
      ARBITRUM_MULTICALL_BATCH_SIZE,
    )
  }

  constructor(
    private readonly arbitrumClient: EthereumClient,
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
        `Arbitrum multicall is not available for given block number: ${blockNumber}`,
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
        `Arbitrum multicall failed for block number ${blockNumber}}. Call size was ${requests.length} in ${batches.length} batches.`,
      )
    }
  }

  private async executeBatch(
    requests: MulticallRequest[],
    blockNumber: number,
  ): Promise<MulticallResponse[]> {
    const encoded = this.encoder.encode(requests)

    const result = await this.arbitrumClient.call(
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
