import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { IProvider } from '../../../provider/IProvider.js'
import type { Handler, HandlerResult } from '../../Handler.js'
import {
  generateReferenceInput,
  getReferencedName,
  resolveReference,
} from '../../reference.js'
import { valueToAddress } from '../../utils/valueToAddress.js'
import { checkForBlobs } from './blobs-check.js'
import { checkForCelestia } from './celestia-verification.js'
import { checkForEigenDA } from './eigen-verification.js'

export type OpStackDAHandlerDefinition = v.infer<
  typeof OpStackDAHandlerDefinition
>
export const OpStackDAHandlerDefinition = v.strictObject({
  type: v.literal('opStackDA'),
  sequencerAddress: v.string(),
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
    currentContractAddress: ChainSpecificAddress,
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
    const isUsingCelestia = checkForCelestia(lastTxs)

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
