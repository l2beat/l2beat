import { ContractValue } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { IProvider } from '../../provider/IProvider'
import { Handler, HandlerResult } from '../Handler'
import { toContractValue } from '../utils/toContractValue'
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
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, [
      'Calling array (max: ',
      this.limit.toString(),
      ') ',
      this.fragment.name + '(i)',
    ])

    const results = await Promise.all(
      Array.from({ length: this.limit }).map((_, index) =>
        provider.callMethod(address, this.fragment, [index]).then(
          (value) => ({ type: 'success' as const, value }),
          (error) => ({ type: 'error' as const, error }),
        ),
      ),
    )
    const values: ContractValue[] = []
    let error: string | undefined
    for (const result of results) {
      if (result.type === 'error') {
        error = result.error
        break
      } else {
        if (result.value !== undefined) {
          values.push(toContractValue(result.value))
        }
      }
    }

    if (!error) {
      if (values.length === this.limit) {
        return {
          field: this.field,
          value: values,
          error: 'Too many values. Update configuration to explore fully',
        }
      } else {
        return { field: this.field, value: values }
      }
    }

    return { field: this.field, error }
  }
}
