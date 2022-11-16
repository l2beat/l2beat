import { EthereumAddress } from '@l2beat/types'
import { utils } from 'ethers'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { ContractValue } from '../types'
import { callMethod } from './callMethod'
import { Handler, HandlerResult } from './Handler'

export class LimitedArrayHandler implements Handler {
  readonly name: string

  constructor(private fragment: utils.FunctionFragment, private limit = 5) {
    this.name = fragment.name
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const results = await Promise.all(
      Array.from({ length: this.limit }).map((_, index) =>
        callMethod(provider, address, this.fragment, [index]),
      ),
    )
    const value: ContractValue[] = []
    let error: string | undefined
    for (const result of results) {
      if (result.error !== undefined) {
        if (result.error !== 'Execution reverted') {
          error = result.error
        }
        break
      } else {
        value.push(result.value)
      }
    }

    if (!error && value.length === this.limit) {
      error = 'Too many values. Update configuration explore fully'
    }

    return { name: this.name, value, error }
  }
}
