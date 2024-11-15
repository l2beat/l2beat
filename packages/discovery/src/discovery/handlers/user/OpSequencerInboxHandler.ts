import { assert, EthereumAddress } from '@l2beat/shared-pure'
import * as z from 'zod'

import { IProvider } from '../../provider/IProvider'
import { Handler, HandlerResult } from '../Handler'
import {
  generateReferenceInput,
  getReferencedName,
  resolveReference,
} from '../reference'
import { valueToAddress } from '../utils/valueToAddress'

export type OpStackSequencerInboxHandlerDefinition = z.infer<
  typeof OpStackSequencerInboxHandlerDefinition
>
export const OpStackSequencerInboxHandlerDefinition = z.strictObject({
  type: z.literal('opStackSequencerInbox'),
  sequencerAddress: z.string(),
})

export class OpStackSequencerInboxHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: OpStackSequencerInboxHandlerDefinition,
  ) {
    const dependency = getReferencedName(this.definition.sequencerAddress)
    if (dependency) {
      this.dependencies.push(dependency)
    }
  }

  async execute(
    provider: IProvider,
    currentContractAddress: EthereumAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    const referenceInput = generateReferenceInput(
      previousResults,
      provider,
      currentContractAddress,
    )
    const resolved = resolveReference(
      this.definition.sequencerAddress,
      referenceInput,
    )
    const sequencerAddress = valueToAddress(resolved)

    const last10Txs = await provider.raw(
      `optimism_sequencer_100.${sequencerAddress}.${provider.blockNumber}`,
      ({ etherscanClient }) =>
        etherscanClient.getLast10OutgoingTxs(
          sequencerAddress,
          provider.blockNumber,
        ),
    )

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
