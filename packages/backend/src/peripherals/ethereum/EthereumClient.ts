import { Bytes, EthereumAddress } from '@l2beat/types'
import { providers } from 'ethers'

import { RateLimitedProvider } from './RateLimitedProvider'
import { BlockTag, CallParameters } from './types'

export class EthereumClient {
  private provider: RateLimitedProvider

  constructor(provider: providers.Provider, callsPerMinute = Infinity) {
    this.provider = new RateLimitedProvider(provider, callsPerMinute)
  }

  async getBlockNumber() {
    const result = await this.provider.getBlockNumber()
    return BigInt(result) // TODO: probably could be a simple number
  }

  async getBlock(blockNumber: number) {
    return await this.provider.getBlock(blockNumber)
  }

  async call(parameters: CallParameters, blockTag: BlockTag) {
    const bytes = await this.provider.call(
      {
        from: parameters.from?.toString(),
        to: parameters.to.toString(),
        gasLimit: parameters.gas,
        gasPrice: parameters.gasPrice,
        value: parameters.value,
        data: parameters.data?.toString(),
      },
      // TODO: probably could be a simple number
      typeof blockTag === 'bigint' ? Number(blockTag) : blockTag,
    )
    return Bytes.fromHex(bytes)
  }

  /**
   * Handles large block ranges by splitting them into smaller ones when necessary
   */
  async getAllLogs(
    address: EthereumAddress,
    topic: string,
    fromBlock: number,
    toBlock: number,
  ): Promise<providers.Log[]> {
    if (fromBlock === toBlock) {
      return await this.provider.getLogs({
        address: address.toString(),
        topics: [topic],
        fromBlock,
        toBlock,
      })
    }
    try {
      return await this.provider.getLogs({
        address: address.toString(),
        topics: [topic],
        fromBlock,
        toBlock,
      })
    } catch (e) {
      if (
        e instanceof Error &&
        e.message.includes('Log response size exceeded')
      ) {
        const midPoint = fromBlock + Math.floor((toBlock - fromBlock) / 2)
        const [a, b] = await Promise.all([
          this.getAllLogs(address, topic, fromBlock, midPoint),
          this.getAllLogs(address, topic, midPoint + 1, toBlock),
        ])
        return a.concat(b)
      } else {
        throw e
      }
    }
  }
}
