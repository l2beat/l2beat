import { Logger } from '@l2beat/backend-tools'
import { Bytes, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { getBlockNumberAtOrBefore } from '../getBlockNumberAtOrBefore'
import { RateLimitedProvider } from './RateLimitedProvider'
import { BlockTag, CallParameters } from './types'

export class RpcClient {
  private readonly provider: RateLimitedProvider

  constructor(
    provider: providers.Provider,
    private readonly logger: Logger,
    callsPerMinute = Infinity,
  ) {
    this.logger = this.logger.for(this)
    this.provider = new RateLimitedProvider(provider, callsPerMinute)
  }

  static create(
    services: { logger: Logger },
    options: { url: string; callsPerMinute: number | undefined },
  ) {
    const provider = new providers.StaticJsonRpcProvider({
      url: options.url,
      timeout: 15_000,
    })
    return new RpcClient(provider, services.logger, options.callsPerMinute)
  }

  async getBlockNumber() {
    //  eth_blockNumber
    const result = await this.provider.getBlockNumber()
    return result
  }

  async getBalance(holder: EthereumAddress, blockTag: BlockTag) {
    // eth_getBalance
    return await this.provider.getBalance(holder.toString(), blockTag)
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime, start = 0) {
    const end = await this.getBlockNumber()

    return await getBlockNumberAtOrBefore(
      timestamp,
      start,
      end,
      this.getBlock.bind(this),
    )
  }

  async getBlock(blockNumber: number) {
    // eth_getBlockByNumber
    return await this.provider.getBlock(blockNumber)
  }

  async getTransaction(txHash: string) {
    // eth_getTransactionByHash
    return await this.provider.getTransaction(txHash)
  }

  async call(parameters: CallParameters, blockTag: BlockTag) {
    // eth_call
    const bytes = await this.provider.call(
      {
        from: parameters.from?.toString(),
        to: parameters.to.toString(),
        gasLimit: parameters.gas,
        gasPrice: parameters.gasPrice,
        value: parameters.value,
        data: parameters.data?.toString(),
      },
      blockTag,
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
    this.logger.debug('Getting all logs', {
      address: address.toString(),
      topic,
      fromBlock,
      toBlock,
    })

    if (fromBlock === toBlock) {
      // eth_getLogs
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
