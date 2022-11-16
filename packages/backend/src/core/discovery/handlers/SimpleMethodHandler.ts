import { EthereumAddress } from '@l2beat/types'
import { utils } from 'ethers'

import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { Handler, HandlerResult } from './Handler'
import { callMethod } from './utils/callMethod'
import { toFunctionFragment } from './utils/toFunctionFragment'

export class SimpleMethodHandler implements Handler {
  readonly name: string
  private readonly fragment: utils.FunctionFragment

  constructor(fragment: string | utils.FunctionFragment) {
    this.fragment =
      typeof fragment === 'string' ? toFunctionFragment(fragment) : fragment
    this.name = this.fragment.name
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const callResult = await callMethod(provider, address, this.fragment, [])
    return { name: this.name, ...callResult }
  }
}
