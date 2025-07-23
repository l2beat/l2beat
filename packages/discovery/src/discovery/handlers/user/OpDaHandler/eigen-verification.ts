import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { RLP } from 'ethers/lib/utils'
import type { Transaction } from '../../../../utils/IEtherscanClient'
import type { IProvider } from '../../../provider/IProvider'

/**
 * https://specs.optimism.io/experimental/alt-da.html#input-commitment-submission
 * These versioning prefixes are super weird.
 */
const EIGEN_DA_CONSTANTS = {
  COMMITMENT_FIRST_BYTE: '01',
  COMMITMENT_THIRD_BYTE: '00',
  EIGEN_AVS: ChainSpecificAddress(
    'eth:0x870679e138bcdf293b7ff14dd44b70fc97e12fc0',
  ),
} as const

export async function checkForEigenDA(
  provider: IProvider,
  sequencerTxs: Transaction[],
) {
  const possibleCommitments = sequencerTxs.map(({ input }) =>
    reduceUntil(input),
  )

  // Byte-check step + RLP decode attempt
  const eigenBlobInfos =
    possibleCommitments.length > 0 &&
    possibleCommitments.flatMap((input) => {
      if (!input) {
        return []
      }

      const eigenBlobInfo = tryParsingEigenDaBlobInfo(input)

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
  const ethereumProvider = await provider.switchChain('ethereum')

  const logs = await ethereumProvider.getEvents(
    EIGEN_DA_CONSTANTS.EIGEN_AVS,
    'event BatchConfirmed(bytes32 indexed batchHeaderHash, uint32 batchId)',
    [],
  )

  return logs.map((log) => log.event.batchHeaderHash.toLowerCase())
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

// Some projects (yghm Mantle) prefixes commitment with some data
// So we reduce until we find the commitment start point.
function reduceUntil(input: string) {
  for (let i = 0; i < input.length; i++) {
    const slice = input.slice(i, input.length)

    const firstByte = slice.slice(0, 2)
    const thirdByte = slice.slice(4, 6)

    if (
      firstByte === EIGEN_DA_CONSTANTS.COMMITMENT_FIRST_BYTE &&
      thirdByte === EIGEN_DA_CONSTANTS.COMMITMENT_THIRD_BYTE
    ) {
      const commitment = slice.slice(6)
      // sometimes we still have 00 remaining
      return commitment.startsWith('00') ? commitment.slice(2) : commitment
    }
  }
}

function tryParsingEigenDaBlobInfo(
  possibleCommitment: string,
): EigenDaBlobInfo | null {
  try {
    const rlp = RLP.decode('0x' + possibleCommitment)

    return EigenDaBlobInfo.parse(rlp)
  } catch {
    return null
  }
}

/**
 * @see https://github.com/Layr-Labs/eigenda/blob/master/api/proto/disperser/disperser.proto
 * @commit 733bcbe
 */
type EigenDaBlobInfo = v.infer<typeof EigenDaBlobInfo>
const EigenDaBlobInfo = v.tuple([
  // Blob header
  v.tuple([
    // KZG commitment
    v.tuple([
      v.string(), // x
      v.string(), // y
    ]),
    v.string(), // data length
    // repeated BlobQuorumParams
    v.array(
      v.tuple([
        v.string(), // quorum number
        v.string(), // adversary threshold percentage
        v.string(), // confirmation threshold percentage
        v.string(), // chunk length
      ]),
    ),
  ]),
  // Blob verification proof
  v.tuple([
    v.string(), // batch id
    v.string(), // blob index
    // Batch metadata
    v.tuple([
      // Batch header
      v.tuple([
        v.string(), // batch root
        v.string(), // quorum numbers
        v.string(), // quorum signed
        v.string(), // reference block number
      ]),
      v.string(), // signatory record hash
      v.string(), // fee
      v.string(), // confirmation height
      v
        .string()
        .check((v) => v.length === 64 + 2), // batch header hash <---
    ]),
    v.string(), // inclusion proof
    v.string(), // quorum index
  ]),
])
