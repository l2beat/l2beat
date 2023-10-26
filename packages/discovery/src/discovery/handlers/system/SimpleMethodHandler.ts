import { assert } from '@l2beat/backend-tools'
import { utils } from 'ethers'

import { Bytes } from '../../../utils/Bytes'
import { EthereumAddress } from '../../../utils/EthereumAddress'
import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import {
  MulticallRequest,
  MulticallResponse,
} from '../../provider/multicall/types'
import { HandlerResult, MulticallableHandler } from '../Handler'
import { callMethod, decodeMethodResult } from '../utils/callMethod'
import { toFunctionFragment } from '../utils/toFunctionFragment'

export class SimpleMethodHandler implements MulticallableHandler {
  multicallable = true as const
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
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, [
      'Calling ',
      this.fragment.name + '()',
    ])
    const callResult = await callMethod(
      provider,
      address,
      this.fragment,
      [],
      blockNumber,
    )
    return { field: this.field, ...callResult }
  }

  encode(address: EthereumAddress): MulticallRequest[] {
    this.logger.logExecution(this.field, [
      'Encoding for multicall ',
      this.fragment.name + '()',
    ])
    const iface = new utils.Interface([this.fragment])
    const encoded = iface.encodeFunctionData(this.fragment.name)

    return [{ address, data: Bytes.fromHex(encoded) }]
  }

  decode(result: MulticallResponse[]): HandlerResult {
    const response = result[0]
    assert(response, 'Multicall response not found')
    if (!response.success) {
      return { field: this.field, error: 'Multicall failed' }
    }

    this.logger.logExecution(this.field, [
      'Decoding from multicall ',
      this.fragment.name + '()',
    ])
    const abi = new utils.Interface([this.fragment])

    return {
      field: this.field,
      value: decodeMethodResult(abi, this.fragment, response.data),
    }
  }
}
