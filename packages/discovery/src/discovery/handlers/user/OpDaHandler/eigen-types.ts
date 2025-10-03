import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

/**
 * https://specs.optimism.io/experimental/alt-da.html#input-commitment-submission
 * These versioning prefixes are super weird.
 */
export const EIGEN_DA_CONSTANTS = {
  COMMITMENT_FIRST_BYTE: '01',
  COMMITMENT_THIRD_BYTE: '00',
  EIGEN_AVS: ChainSpecificAddress(
    'eth:0x870679e138bcdf293b7ff14dd44b70fc97e12fc0',
  ),
  VERSION_BYTE_V1: '00',
  VERSION_BYTE_V2: '01',
  VERSION_BYTE_V3: '02',
} as const

export type EigenCommitment = {
  version: 'v1' | 'v2' | 'v3'
  body: string
}

// V1

/**
 * @see https://github.com/Layr-Labs/eigenda/blob/master/api/proto/disperser/disperser.proto
 * @commit 733bcbe
 */
export type EigenV1BlobInfo = v.infer<typeof EigenV1BlobInfo>
export const EigenV1BlobInfo = v.tuple([
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

// V2

const g1 = v.tuple([v.string(), v.string()]) // (X, Y)
const g2 = v.tuple([g1, g1]) // ((X1,X0),(Y1,Y0))

const commitment = v.tuple([
  g1, // commitment
  g2, // lengthCommitment
  g2, // lengthProof
  v.string(), // dataLength (uint32) – still v.string()-encoded
])

const blobHeader = v.tuple([
  v.string(), // version  (uint32)
  v.string(), // quorumNumbers (packed bytes)
  commitment, // commitments
  v.string(), // paymentHeaderHash (bytes32)
])

/* ───────────────── certificate parts ─────── */
const blobCertificate = v.tuple([
  blobHeader, // header
  v.string(), // signature
  v.array(v.string()), // relayKeys (uint32[]) – still array
])

const blobInclusionInfo = v.tuple([
  blobCertificate, // certificate
  v.string(), // blobIndex   (uint32)
  v.string(), // inclusionProof (bytes)
])

const batchHeader = v.tuple([
  v.string(), // batchRoot  (bytes32)
  v.string(), // referenceBlockNumber (uint64)
])

const nonSignerStakesAndSig = v.tuple([
  v.array(v.string()), // 0  nonSignerQuorumBitmapIndices
  v.array(g1), // 1  nonSignerPubkeys
  v.array(g1), // 2  quorumApks
  g2, // 3  apkG2
  g1, // 4  sigma
  v.array(v.string()), // 5  quorumApkIndices
  v.array(v.string()), // 6  totalStakeIndices
  v.array(v.array(v.string())), // 7  nonSignerStakeIndices
])

export type EigenV2BlobInfo = v.infer<typeof EigenV2BlobInfo>
export const EigenV2BlobInfo = v.tuple([
  blobInclusionInfo, // [0]
  batchHeader, // [1]
  nonSignerStakesAndSig, // [2]
  v.string(), // [3] signedQuorumNumbers
])

export type EigenV3BlobInfo = v.infer<typeof EigenV3BlobInfo>
export const EigenV3BlobInfo = v.tuple([
  batchHeader, // [0]
  blobInclusionInfo, // [1]
  nonSignerStakesAndSig, // [2]
  v.string(), // [3] signedQuorumNumbers
])
