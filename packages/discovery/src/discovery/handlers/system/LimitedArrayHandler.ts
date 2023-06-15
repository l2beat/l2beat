import { ContractValue, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { Handler, HandlerResult } from '../Handler'
import { callMethod } from '../utils/callMethod'
import { toFunctionFragment } from '../utils/toFunctionFragment'

export class LimitedArrayHandler implements Handler {
  readonly field: string
  readonly dependencies = []
  private readonly fragment: utils.FunctionFragment

  constructor(
    fragment: string | utils.FunctionFragment,
    private readonly limit = 5,
    readonly logger: DiscoveryLogger,
  ) {
    this.fragment =
      typeof fragment === 'string' ? toFunctionFragment(fragment) : fragment
    this.field = this.fragment.name
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, [
      'Calling array (max: ',
      this.limit.toString(),
      ') ',
      this.fragment.name + '(i)',
    ])
    const results = await Promise.all(
      Array.from({ length: this.limit }).map((_, index) =>
        callMethod(provider, address, this.fragment, [index], blockNumber),
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

    if (!error) {
      if (value.length === this.limit) {
        return {
          field: this.field,
          value,
          error: 'Too many values. Update configuration explore fully',
        }
      } else {
        return { field: this.field, value }
      }
    }

    return { field: this.field, error }
  }
}
