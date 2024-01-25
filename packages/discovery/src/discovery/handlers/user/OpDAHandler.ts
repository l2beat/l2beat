import * as z from 'zod'

import { EthereumAddress } from '../../../utils/EthereumAddress'
import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { ClassicHandler, HandlerResult } from '../Handler'
import { getReferencedName, resolveReference } from '../reference'
import { valueToAddress } from '../utils/valueToAddress'

export type OpStackDAHandlerDefinition = z.infer<
  typeof OpStackDAHandlerDefinition
>
export const OpStackDAHandlerDefinition = z.strictObject({
  type: z.literal('opStackDA'),
  sequencerAddress: z.string(),
})

/**
 * This is an example of transaction data that is posted on Ethereum
 * when a project is using the OP Stack, but it is not posting the
 * transaction data on Ethereum.
 *
 * It is posted by Lyra sequencer, it's posting data to Celestia.
 * https://etherscan.io/tx/0xfd45a6ec27489c7d38957f6b17ad94b845605549e8d7bcf466ac436a7060eb81
 */
const OP_STACK_CELESTIA_DA_EXAMPLE_INPUT =
  '0xce62ae09000000000098e29cf2952f1f2de47a587994a1ab8eeacbe6e5725251873117fb675f63ac7c'

/**
 * This is a OP Stack specific handler that is used to check if
 * the OP Stack project is still posting the transaction data on Ethereum.
 */

export class OpStackDAHandler implements ClassicHandler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: OpStackDAHandlerDefinition,
    readonly logger: DiscoveryLogger,
  ) {
    const dependency = getReferencedName(this.definition.sequencerAddress)
    if (dependency) {
      this.dependencies.push(dependency)
    }
  }

  async execute(
    provider: DiscoveryProvider,
    _address: EthereumAddress,
    blockNumber: number,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, ['Checking OP Stack DA mode'])

    const resolved = resolveReference(
      this.definition.sequencerAddress,
      previousResults,
    )
    const sequencerAddress = valueToAddress(resolved)
    const last10Txs = await provider.getLast10Txs(sequencerAddress, blockNumber)

    const isAllTxsLengthEqualToCelestiaDAExample = last10Txs.every(
      (tx) => tx.input.length === OP_STACK_CELESTIA_DA_EXAMPLE_INPUT.length,
    )

    const isSomeTxsLengthEqualToCelestiaDAExample = last10Txs.some(
      (tx) => tx.input.length === OP_STACK_CELESTIA_DA_EXAMPLE_INPUT.length,
    )

    return {
      field: this.field,
      value: {
        isAllTxsLengthEqualToCelestiaDAExample,
        isSomeTxsLengthEqualToCelestiaDAExample,
      },
    }
  }
}
