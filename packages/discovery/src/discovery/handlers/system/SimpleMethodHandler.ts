import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { ContractValue } from '@l2beat/discovery-types'
import { DiscoveryLogger } from '../../DiscoveryLogger'
import { IProvider } from '../../provider/IProvider'
import { Handler, HandlerResult } from '../Handler'
import { toFunctionFragment } from '../utils/toFunctionFragment'

export class SimpleMethodHandler implements Handler {
  readonly field: string
  readonly dependencies = []

  private readonly fragment: utils.FunctionFragment

  constructor(
    fragment: string | utils.FunctionFragment,
    readonly logger: DiscoveryLogger,
  ) {
    this.fragment =
      typeof fragment === 'string' ? toFunctionFragment(fragment) : fragment
    this.field = this.fragment.name
  }

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, [
      'Calling ',
      this.fragment.name + '()',
    ])
    const value = await provider.callMethod(address, this.fragment, [])
    if (value === undefined) {
      return {
        field: this.field,
        error: 'Execution reverted',
      }
    }
    return { field: this.field, value: value as ContractValue }
  }
}
