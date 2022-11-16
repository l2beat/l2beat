import { EthereumAddress } from '@l2beat/types'
import { utils } from 'ethers'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { callMethod } from './callMethod'
import { Handler, HandlerResult } from './Handler'

export class SimpleMethodHandler implements Handler {
  readonly name: string

  constructor(private fragment: utils.FunctionFragment) {
    this.name = fragment.name
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const callResult = await callMethod(provider, address, this.fragment, [])
    return { name: this.name, ...callResult }
  }
}
