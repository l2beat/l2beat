import { RLP } from 'ethers/lib/utils'
import type { Transaction } from '../../../../utils/IEtherscanClient'
import type { IProvider } from '../../../provider/IProvider'
import {
  EIGEN_DA_CONSTANTS,
  type EigenCommitment,
  EigenV1BlobInfo,
  EigenV2BlobInfo,
  EigenV3BlobInfo,
} from './eigen-types'

export async function checkForEigenDA(
  provider: IProvider,
  sequencerTxs: Transaction[],
) {
  const possibleCommitments = sequencerTxs
    .map(({ input }) => decodeCommitment(input))
    .filter((c) => c !== null)

  if (
    possibleCommitments.length === 0 ||
    possibleCommitments.length !== sequencerTxs.length
  ) {
    return false
  }

  const v3Commitments = possibleCommitments.filter((c) => c.version === 'v3')
  const v2Commitments = possibleCommitments.filter((c) => c.version === 'v2')
  const v1Commitments = possibleCommitments.filter((c) => c.version === 'v1')

  if (verifyV3Commitments(v3Commitments)) {
    return 'v3'
  }
  if (verifyV2Commitments(v2Commitments)) {
    return 'v2'
  }
  if (await verifyV1Commitments(provider, v1Commitments)) {
    return 'v1'
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
  return (
    v2Commitments.length > 0 &&
    v2Commitments.every((input) => parseEigenV2(input.body) !== null)
  )
}

function verifyV3Commitments(v3Commitments: EigenCommitment[]) {
  return (
    v3Commitments.length > 0 &&
    v3Commitments.every((input) => parseEigenV3(input.body) !== null)
  )
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

function parseEigenV3(possibleCommitment: string): EigenV3BlobInfo | null {
  try {
    const rlp = RLP.decode('0x' + possibleCommitment)
    return EigenV3BlobInfo.parse(rlp)
  } catch {
    return null
  }
}

function classicExtractCommitment(input: string) {
  const regex = /01[0-9a-f]{2}00(?:00|01|02)/

  const match = regex.exec(input)

  if (!match) {
    return null
  }

  const idx = match.index + '00000000'.length

  return input.slice(idx)
}

function customExtractCommitment(input: string) {
  // pattern: 01 ?? (00|01|02) -- no version byte
  const regex = /01[0-9a-f]{2}(?:00|01|02)/

  const match = regex.exec(input)

  if (!match) {
    return null
  }

  const idx = match.index + '000000'.length

  return input.slice(idx)
}

function decodeCommitment(input: string): EigenCommitment | null {
  const clean = input.startsWith('0x') ? input.slice(2) : input
  const commitment =
    classicExtractCommitment(clean) ?? customExtractCommitment(clean)

  if (!commitment) {
    return null
  }

  const maybeV3 = parseEigenV3(commitment)

  if (maybeV3) {
    return {
      version: 'v3',
      body: commitment,
    }
  }

  const maybeV2 = parseEigenV2(commitment)

  if (maybeV2) {
    return {
      version: 'v2',
      body: commitment,
    }
  }

  const maybeV1 = parseEigenV1(commitment)

  if (maybeV1) {
    return {
      version: 'v1',
      body: commitment,
    }
  }

  return null
}
