import { assert, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { RLP } from 'ethers/lib/utils'
import { z } from 'zod'
import type { Transaction } from '../../../utils/IEtherscanClient'
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
const EIGEN_DA_CONSTANTS = {
  COMMITMENT_PREFIX: '0x01',
  COMMITMENT_THIRD_BYTE: '00',
  EIGEN_AVS: EthereumAddress('0x870679e138bcdf293b7ff14dd44b70fc97e12fc0'),
} as const

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

    const isUsingEigenDA = await checkForEigenDA(provider, lastTxs)

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

export async function checkForEigenDA(
  provider: IProvider,
  sequencerTxs: Transaction[],
) {
  // Byte-check step - filter out non-Eigen-like transactions
  const eigenCommitments =
    sequencerTxs.length > 0 &&
    sequencerTxs.flatMap((tx) => {
      const thirdByte = tx.input.slice(6, 8)

      const prefixMatch = tx.input.startsWith(
        EIGEN_DA_CONSTANTS.COMMITMENT_PREFIX,
      )
      const thirdByteMatch =
        thirdByte === EIGEN_DA_CONSTANTS.COMMITMENT_THIRD_BYTE

      const hasByteMatch = prefixMatch && thirdByteMatch

      if (!hasByteMatch) {
        return []
      }

      const decodedCommitment = tryRlpDecode(tx.input)

      if (!decodedCommitment) {
        console.log('No decoded commitment', tx.hash, tx.input)
        return []
      }

      return { decodedCommitment }
    })

  // If we have no Eigen-like transactions, we can return false immediately
  if (!eigenCommitments || eigenCommitments.length === 0) {
    return false
  }

  // Decode step - decode the commitment from the transaction input
  const outgoingBatchHeaderHashes = eigenCommitments.map(
    ({ decodedCommitment }) => extractBlobBatchHeaderHash(decodedCommitment),
  )

  // Get step - get the confirmed batch header hashes from ethereum
  const confirmedBatchHeaderHashes =
    await getConfirmedBatchHeaderHashes(provider)

  // Filter step - filter out the confirmed batch header hashes that are not in the list of outgoing batch header hashes
  const successfulVerificationsCount = outgoingBatchHeaderHashes.filter(
    (hash) => confirmedBatchHeaderHashes.includes(hash),
  ).length

  // require 100% success rate
  return successfulVerificationsCount === sequencerTxs.length
}

async function getConfirmedBatchHeaderHashes(
  provider: IProvider,
): Promise<string[]> {
  const blockToSwitch = await getEthereumBlock(provider)

  const ethereumProvider = provider.switchChain('ethereum', blockToSwitch)

  const logs = await ethereumProvider.getEvents(
    EIGEN_DA_CONSTANTS.EIGEN_AVS,
    'event BatchConfirmed(bytes32 indexed batchHeaderHash, uint32 batchId)',
    [],
  )

  return logs.map((log) => log.event.batchHeaderHash.toLowerCase())
}

async function getEthereumBlock(provider: IProvider) {
  if (provider.chain === 'ethereum') {
    return provider.blockNumber
  }

  const currentBlock = await provider.getBlock(provider.blockNumber)
  assert(currentBlock, 'Current block is undefined')

  const timestamp = new UnixTime(currentBlock.timestamp)

  // We need to switch to ethereum to get the block number.
  // Eigen AVS lives there.
  // Yet we need to pass 'some' block number to the provider to perform the switch.
  // Can't do. You get the idea. That's why we pass 0. It doesn't matter.
  const ethereumProvider = provider.switchChain('ethereum', 0)

  const correspondingEthereumBlock = await ethereumProvider.raw(
    `optimism_eigen_cross_chain_translate_${provider.blockNumber}_${provider.chain}`,
    ({ etherscanClient }) =>
      etherscanClient.getBlockNumberAtOrBefore(timestamp),
  )

  return correspondingEthereumBlock
}

function extractBlobBatchHeaderHash(
  decoded: EigenDABlobVerificationProof,
): string {
  /**
   * @see https://github.com/Layr-Labs/eigenda/blob/master/api/proto/disperser/disperser.proto
   * @commit 733bcbe
   */
  // see: disperser.BlobInfo.blob_verification_proof
  const RLP_BLOB_VERIFICATION_HEADER_IDX = 1
  // see: disperser.BlobVerificationProof.batch_metadata
  const RLP_BLOB_BATCH_METADATA_IDX = 2
  // see: disperser.BlobVerificationProof.batch_metadata.batch_header_hash
  const RLP_BLOB_BATCH_HEADER_HASH_IDX = 4

  const blobVerificationProof = decoded[RLP_BLOB_VERIFICATION_HEADER_IDX]
  const blobBatchHeaderHash =
    blobVerificationProof[RLP_BLOB_BATCH_METADATA_IDX][
      RLP_BLOB_BATCH_HEADER_HASH_IDX
    ]

  return blobBatchHeaderHash.toLowerCase()
}

function tryRlpDecode(inputData: string): EigenDABlobVerificationProof | null {
  try {
    // strip three commitment type bytes + 0x
    const eigenCommitment = inputData.slice(4 * 2)
    // Sometimes it's prefixed with 00, sometimes it's not.
    const noTypeCommitment = eigenCommitment.startsWith('00')
      ? eigenCommitment.slice(2)
      : eigenCommitment

    const rlp = RLP.decode('0x' + noTypeCommitment)

    return EigenDABlobVerificationProofSchema.parse(rlp)
  } catch (e) {
    console.log('Error decoding commitment', inputData, e)
    return null
  }
}

/**
 * @see https://github.com/Layr-Labs/eigenda/blob/master/api/proto/disperser/disperser.proto
 * @commit 733bcbe
 */
type EigenDABlobVerificationProof = z.infer<
  typeof EigenDABlobVerificationProofSchema
>
const EigenDABlobVerificationProofSchema = z.tuple([
  z.tuple([
    z.tuple([
      z.string(), // hash1
      z.string(), // hash2
    ]),
    z.string(), // version
    z.array(
      z.tuple([
        z.string(), // byte1
        z.string(), // byte2
        z.string(), // byte3
        z.string(), // byte4
      ]),
    ),
  ]),
  z.tuple([
    z.string(), // size
    z.string(), // count
    z.tuple([
      z.tuple([
        z.string(), // hash
        z.string(), // version
        z.string(), // size
        z.string(), // timestamp
      ]),
      z
        .string()
        .length(64 + 2), // batchHeaderHash
      z.string(), // referenceBlockNumber
      z.string(), // timestamp
      z.string(), // batchRoot
    ]),
    z.string(), // signature
    z.string(), // version
  ]),
])
