import { assert } from '@l2beat/backend-tools'
import * as z from 'zod'

import { EthereumAddress } from '../../../utils/EthereumAddress'
import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { ClassicHandler, HandlerResult } from '../Handler'
import { getReferencedName, resolveReference } from '../reference'
import { valueToAddress } from '../utils/valueToAddress'

export type OpStackSequencerInboxHandlerDefinition = z.infer<
  typeof OpStackSequencerInboxHandlerDefinition
>
export const OpStackSequencerInboxHandlerDefinition = z.strictObject({
  type: z.literal('opStackSequencerInbox'),
  sequencerAddress: z.string(),
})

export class OpStackSequencerInboxHandler implements ClassicHandler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: OpStackSequencerInboxHandlerDefinition,
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
    this.logger.logExecution(this.field, [
      'Checking OP Stack Sequencer Inbox Address',
    ])
    const resolved = resolveReference(
      this.definition.sequencerAddress,
      previousResults,
    )
    const sequencerAddress = valueToAddress(resolved)

    const last10Txs = await provider.getLast10Txs(sequencerAddress, blockNumber)

    // check if all last 10 txs have the same to address
    const toAddress = last10Txs[0]?.to
    assert(toAddress, 'No to address found')
    for (const tx of last10Txs) {
      assert(tx.to === toAddress, 'Different to address')
    }

    return {
      field: this.field,
      value: toAddress.toString(),
    }
  }
}
