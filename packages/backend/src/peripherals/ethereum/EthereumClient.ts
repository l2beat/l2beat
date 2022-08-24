import { Bytes, EthereumAddress } from '@l2beat/common'
import { providers } from 'ethers'

import { BlockTag, CallParameters } from './types'

export class EthereumClient {
  constructor(private provider: providers.Provider) {}

  async getBlockNumber() {
    const result = await this.provider.getBlockNumber()
    return BigInt(result) // TODO: probably could be a simple number
  }

  async getLogs(
    address: EthereumAddress,
    topics: string[],
    fromBlock: number,
    toBlock: number,
  ): Promise<providers.Log[]> {
    const logs = await this.provider.getLogs({
      address: address.toString(),
      topics,
      fromBlock,
      toBlock,
    })
    return logs
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
}
