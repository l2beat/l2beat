import { RLP } from 'ethers/lib/utils'
import type { Transaction } from '../../../../utils/IEtherscanClient'
import type { IProvider } from '../../../provider/IProvider'
import {
  EIGEN_DA_CONSTANTS,
  type EigenCommitment,
  EigenV1BlobInfo,
  EigenV2BlobInfo,
} from './eigen-types'

export async function checkForEigenDA(
  provider: IProvider,
  sequencerTxs: Transaction[],
) {
  const possibleCommitments = sequencerTxs
    .map(({ input }) => extractCommitment(input))
    .filter((c) => c !== undefined)

  if (
    possibleCommitments.length === 0 ||
    possibleCommitments.length !== sequencerTxs.length
  ) {
    return false
  }

  const v1Commitments = possibleCommitments.filter((c) => c.version === 'v1')
  const v2Commitments = possibleCommitments.filter((c) => c.version === 'v2')

  const v1Verification = await verifyV1Commitments(provider, v1Commitments)
  const v2Verification = verifyV2Commitments(v2Commitments)

  if (v1Verification || v2Verification) {
    return {
      version: v2Verification ? 'v2' : 'v1',
    }
  }

  return false
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

function extractBlobBatchHeaderHash(decoded: EigenV1BlobInfo): string {
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
function extractCommitment(input: string): EigenCommitment | undefined {
  for (let i = 0; i < input.length; i++) {
    const slice = input.slice(i, input.length)

    const firstByte = slice.slice(0, 2)
    const thirdByte = slice.slice(4, 6)

    if (
      firstByte === EIGEN_DA_CONSTANTS.COMMITMENT_FIRST_BYTE &&
      thirdByte === EIGEN_DA_CONSTANTS.COMMITMENT_THIRD_BYTE
    ) {
      const commitment = slice.slice(6)
      const commitmentVersionByte = commitment.slice(0, 2)

      if (commitmentVersionByte === EIGEN_DA_CONSTANTS.VERSION_BYTE_V1) {
        return {
          body: commitment.slice(2),
          version: 'v1',
        }
      }

      if (commitmentVersionByte === EIGEN_DA_CONSTANTS.VERSION_BYTE_V2) {
        return {
          body: commitment.slice(2),
          version: 'v2',
        }
      }

      // legacy
      return {
        body: commitment,
        version: 'v1',
      }
    }
  }
}

async function verifyV1Commitments(
  provider: IProvider,
  v1Commitments: EigenCommitment[],
) {
  const eigenBlobInfos = v1Commitments.flatMap((input) => {
    const eigenBlobInfo = parseEigenV1(input.body)

    if (!eigenBlobInfo) {
      return []
    }

    return { eigenBlobInfo }
  })

  if (eigenBlobInfos.length === 0) {
    return false
  }

  const outgoingBatchHeaderHashes = eigenBlobInfos.map(({ eigenBlobInfo }) =>
    extractBlobBatchHeaderHash(eigenBlobInfo),
  )

  const confirmedBatchHeaderHashes =
    await getConfirmedBatchHeaderHashes(provider)

  return (
    outgoingBatchHeaderHashes.filter((hash) =>
      confirmedBatchHeaderHashes.includes(hash),
    ).length === v1Commitments.length
  )
}

function verifyV2Commitments(v2Commitments: EigenCommitment[]) {
  return v2Commitments.every((input) => parseEigenV2(input.body) !== null)
}

function parseEigenV1(possibleCommitment: string): EigenV1BlobInfo | null {
  try {
    const rlp = RLP.decode('0x' + possibleCommitment)

    return EigenV1BlobInfo.parse(rlp)
  } catch {
    return null
  }
}

function parseEigenV2(possibleCommitment: string): EigenV2BlobInfo | null {
  try {
    const rlp = RLP.decode('0x' + possibleCommitment)

    return EigenV2BlobInfo.parse(rlp)
  } catch {
    return null
  }
}
