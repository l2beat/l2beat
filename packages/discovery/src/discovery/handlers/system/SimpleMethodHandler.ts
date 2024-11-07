import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { IProvider } from '../../provider/IProvider'
import { Handler, HandlerResult } from '../Handler'
import { callMethod } from '../utils/callMethod'
import { rewriteSolidityIdentifier } from '../utils/rewriteSolidityIdentifier'
import { toFunctionFragment } from '../utils/toFunctionFragment'

export class SimpleMethodHandler implements Handler {
  readonly field: string
  readonly dependencies = []

  private readonly fragment: utils.FunctionFragment

  constructor(fragment: string | utils.FunctionFragment) {
    this.fragment =
      typeof fragment === 'string' ? toFunctionFragment(fragment) : fragment
    this.field = rewriteSolidityIdentifier(this.fragment.name)
  }

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const callResult = await callMethod(provider, address, this.fragment, [])
    return { field: this.field, fragment: this.fragment, ...callResult }
  }
}
