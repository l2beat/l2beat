import { Bytes } from '@l2beat/types'
import { providers } from 'ethers'

import { BlockTag, CallParameters } from './types'

export class EthereumClient {
  constructor(private provider: providers.Provider) {}

  async getBlockNumber() {
    const result = await this.provider.getBlockNumber()
    return BigInt(result) // TODO: probably could be a simple number
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
