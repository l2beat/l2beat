import { assert, EthereumAddress } from '@l2beat/shared-pure'
import * as z from 'zod'

import { Transaction } from '../../../utils/IEtherscanClient'
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

  // NOTE(radomski): Let's just say that it needs to 8/10 transactions to a
  // single address. Saying that all transactions need to go to the same
  // address is a little too extreme. If the sequencer EOA wants to move ETH
  // funds or anything else this fails
  readonly qualificationThreshold: number = 0.8

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

    return {
      field: this.field,
      value: this.getInboxAddress(last10Txs),
    }
  }

  getInboxAddress(lastTxs: Transaction[]): string {
    const toAddresses = lastTxs.map((tx) => tx.to)
    const occurrence = toAddresses.reduce(
      (acc, address) => {
        const str = address.toString()
        acc[str] ??= 0
        acc[str] += 1
        return acc
      },
      {} as Record<string, number>,
    )
    const entries = Object.entries(occurrence).sort((a, b) => {
      return b[1] - a[1]
    })

    // biome-ignore lint/style/noNonNullAssertion: we know it's there
    const [inboxAddress, addressFrequency] = entries[0]!
    assert(
      addressFrequency / lastTxs.length >= this.qualificationThreshold,
      'Sequencer posts too many different addresses',
    )

    return inboxAddress
  }
}
