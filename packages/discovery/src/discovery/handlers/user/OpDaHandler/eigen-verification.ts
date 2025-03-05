import { assert, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { RLP } from 'ethers/lib/utils'
import { z } from 'zod'
import type { Transaction } from '../../../../utils/IEtherscanClient'
import type { IProvider } from '../../../provider/IProvider'

/**
 * https://specs.optimism.io/experimental/alt-da.html#input-commitment-submission
 * These versioning prefixes are super weird.
 */
const EIGEN_DA_CONSTANTS = {
  COMMITMENT_PREFIX: '0x01',
  COMMITMENT_THIRD_BYTE: '00',
  EIGEN_AVS: EthereumAddress('0x870679e138bcdf293b7ff14dd44b70fc97e12fc0'),
} as const

export async function checkForEigenDA(
  provider: IProvider,
  sequencerTxs: Transaction[],
) {
  // Byte-check step + RLP decode attempt
  const eigenBlobInfos =
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

      const eigenBlobInfo = tryParsingEigenDaBlobInfo(tx.input)

      if (!eigenBlobInfo) {
        return []
      }

      return { eigenBlobInfo }
    })

  // If we have no Eigen-like transactions, we can return false immediately
  if (!eigenBlobInfos || eigenBlobInfos.length === 0) {
    return false
  }

  // Decode step - decode the commitment from the transaction input
  const outgoingBatchHeaderHashes = eigenBlobInfos.map(({ eigenBlobInfo }) =>
    extractBlobBatchHeaderHash(eigenBlobInfo),
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

  const timestamp = UnixTime(currentBlock.timestamp)

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

function extractBlobBatchHeaderHash(decoded: EigenDaBlobInfo): string {
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

function tryParsingEigenDaBlobInfo(inputData: string): EigenDaBlobInfo | null {
  try {
    // strip three commitment type bytes + 0x
    const eigenCommitment = inputData.slice(4 * 2)
    // Sometimes it's prefixed with 00, sometimes it's not.
    const noTypeCommitment = eigenCommitment.startsWith('00')
      ? eigenCommitment.slice(2)
      : eigenCommitment

    const rlp = RLP.decode('0x' + noTypeCommitment)

    return EigenDaBlobInfo.parse(rlp)
  } catch {
    return null
  }
}

/**
 * @see https://github.com/Layr-Labs/eigenda/blob/master/api/proto/disperser/disperser.proto
 * @commit 733bcbe
 */
type EigenDaBlobInfo = z.infer<typeof EigenDaBlobInfo>
const EigenDaBlobInfo = z.tuple([
  // Blob header
  z.tuple([
    // KZG commitment
    z.tuple([
      z.string(), // x
      z.string(), // y
    ]),
    z.string(), // data length
    // repeated BlobQuorumParams
    z.array(
      z.tuple([
        z.string(), // quorum number
        z.string(), // adversary threshold percentage
        z.string(), // confirmation threshold percentage
        z.string(), // chunk length
      ]),
    ),
  ]),
  // Blob verification proof
  z.tuple([
    z.string(), // batch id
    z.string(), // blob index
    // Batch metadata
    z.tuple([
      // Batch header
      z.tuple([
        z.string(), // batch root
        z.string(), // quorum numbers
        z.string(), // quorum signed
        z.string(), // reference block number
      ]),
      z.string(), // signatory record hash
      z.string(), // fee
      z.string(), // confirmation height
      z
        .string()
        .length(64 + 2), // batch header hash <---
    ]),
    z.string(), // inclusion proof
    z.string(), // quorum index
  ]),
])
