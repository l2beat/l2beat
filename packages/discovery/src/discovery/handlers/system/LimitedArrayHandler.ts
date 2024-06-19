import { ContractValue } from '@l2beat/discovery-types'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { IProvider } from '../../provider/IProvider'
import { isRevert } from '../../utils/isRevert'
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
        provider
          .raw(
            `limitedArrayHandler.${address}.${this.fragment.name}.${provider.blockNumber}.${index}`,
            async ({ baseProvider }) => {
              const coder = new utils.Interface([
                this.fragment.format(utils.FormatTypes.full),
              ])
              const callData = Bytes.fromHex(
                coder.encodeFunctionData(this.fragment, [index]),
              )

              let decodedResult: utils.Result
              try {
                const result = Bytes.fromHex(
                  await baseProvider.call(
                    { to: address.toString(), data: callData.toString() },
                    provider.blockNumber,
                  ),
                )
                decodedResult = coder.decodeFunctionResult(
                  this.fragment,
                  result.toString(),
                )
              } catch (e) {
                if (isRevert(e)) {
                  return undefined
                }
                throw e
              }
              const extracted =
                decodedResult.length === 1 ? decodedResult[0] : decodedResult
              return extracted
            },
          )
          .then(
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
