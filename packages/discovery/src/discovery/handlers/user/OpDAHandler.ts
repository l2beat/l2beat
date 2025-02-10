import type { EthereumAddress } from '@l2beat/shared-pure'
import * as z from 'zod'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import {
  generateReferenceInput,
  getReferencedName,
  resolveReference,
} from '../reference'
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
 * https://eips.ethereum.org/EIPS/eip-4844#parameters
 */
const BLOB_TX_TYPE = 3

/**
 * https://specs.optimism.io/experimental/alt-da.html#input-commitment-submission
 * These versioning prefixes are super weird.
 */
const PREFIX_SIZE = 6 // '0x' + 2 bytes
const EIGEN_DA_COMMITMENT_PREFIX = '0x01'
// to exclude keccak256 due to prefix overlap
const EIGEN_DA_COMMITMENT_MINIMUM_LENGTH = 64 + PREFIX_SIZE // 256 bits for keccak256
// arbitrary limit to exclude for example syndicate - yet another overlapping prefix
const EIGEN_DA_COMMITMENT_MAXIMUM_LENGTH = 2000 + PREFIX_SIZE

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

    const hasTxs = lastTxs.length > 0

    const isSomeTxsLengthEqualToCelestiaDAExample =
      hasTxs &&
      lastTxs.some(
        (tx) => tx.input.length === OP_STACK_CELESTIA_DA_EXAMPLE_INPUT.length,
      )

    const rpcTxs = await Promise.all(
      lastTxs.map((tx) => provider.getTransaction(tx.hash)),
    )
    const missingIndex = rpcTxs.findIndex((x) => x === undefined)
    if (missingIndex !== -1) {
      throw new Error(`Transaction ${lastTxs[missingIndex]?.hash} is missing`)
    }
    const isSequencerSendingBlobTx =
      hasTxs && rpcTxs.some((tx) => tx?.type === BLOB_TX_TYPE)

    const isUsingEigenDA =
      hasTxs &&
      lastTxs.some(
        (tx) =>
          tx.input.startsWith(EIGEN_DA_COMMITMENT_PREFIX) &&
          tx.input.length > EIGEN_DA_COMMITMENT_MINIMUM_LENGTH &&
          tx.input.length <= EIGEN_DA_COMMITMENT_MAXIMUM_LENGTH,
      )

    return {
      field: this.field,
      value: {
        isSomeTxsLengthEqualToCelestiaDAExample,
        isSequencerSendingBlobTx,
        isUsingEigenDA,
      },
    }
  }
}
