import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { utils } from 'ethers'
import type { ContractValue } from '../../output/types.js'

import type { IProvider } from '../../provider/IProvider.js'
import type { Handler, HandlerResult } from '../Handler.js'
import { rewriteSolidityIdentifier } from '../utils/rewriteSolidityIdentifier.js'
import { toContractValue } from '../utils/toContractValue.js'
import { toFunctionFragment } from '../utils/toFunctionFragment.js'

export class LimitedArrayHandler implements Handler {
  readonly field: string
  readonly dependencies = []
  private readonly fragment: utils.FunctionFragment

  constructor(
    fragment: string | utils.FunctionFragment,
    private readonly limit = 5,
  ) {
    this.fragment =
      typeof fragment === 'string' ? toFunctionFragment(fragment) : fragment
    this.field = rewriteSolidityIdentifier(this.fragment.name)
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
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
      }
      if (result.value !== undefined) {
        values.push(toContractValue(result.value))
      }
    }

    if (!error) {
      if (values.length === this.limit) {
        return {
          field: this.field,
          value: values,
          error: 'Too many values. Update configuration to explore fully',
        }
      }
      return { field: this.field, value: values }
    }

    return { field: this.field, error }
  }
}
