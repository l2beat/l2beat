import type { EthereumAddress } from '@l2beat/shared-pure'
import { z } from 'zod'
import type { IProvider } from '../../../provider/IProvider'
import type { Handler, HandlerResult } from '../../Handler'
import {
  generateReferenceInput,
  getReferencedName,
  resolveReference,
} from '../../reference'
import { valueToAddress } from '../../utils/valueToAddress'
import { checkForBlobs } from './blobs-check'
import { checkForCelestia } from './celestia-verification'
import { checkForEigenDA } from './eigen-verification'

export type OpStackDAHandlerDefinition = z.infer<
  typeof OpStackDAHandlerDefinition
>
export const OpStackDAHandlerDefinition = z.strictObject({
  type: z.literal('opStackDA'),
  sequencerAddress: z.string(),
})

/**
 * This is a OP Stack specific handler that is used to check if
 * the OP Stack project is still posting the transaction data on Ethereum.
 */
export class OpStackDAHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: OpStackDAHandlerDefinition,
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
    const lastTxs = await provider.raw(
      `optimism_sequencer_100.${sequencerAddress}.${provider.blockNumber}`,
      ({ etherscanClient }) =>
        etherscanClient.getAtMost10RecentOutgoingTxs(
          sequencerAddress,
          provider.blockNumber,
        ),
    )

    const isSequencerSendingBlobTx = await checkForBlobs(provider, lastTxs)
    const isUsingEigenDA = await checkForEigenDA(provider, lastTxs)
    const isUsingCelestia = await checkForCelestia(provider, lastTxs)

    return {
      field: this.field,
      value: {
        isSequencerSendingBlobTx,
        isUsingCelestia,
        isUsingEigenDA,
      },
    }
  }
}
