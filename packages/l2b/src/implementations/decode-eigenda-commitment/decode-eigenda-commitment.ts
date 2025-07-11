import { v } from '@l2beat/validate'
import { ethers } from 'ethers'
import { RLP } from 'ethers/lib/utils'

const EIGEN_DA_CONSTANTS = {
  COMMITMENT_FIRST_BYTE: '01',
  COMMITMENT_THIRD_BYTE: '00',
}

export async function decodeEigenDACommitment(rpcUrl: string, txHash: string) {
  // Get transaction data
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  const tx = await provider.getTransaction(txHash)
  if (!tx) {
    console.error('Transaction not found')
    return
  }

  const input = tx.data.slice(2) // remove 0x prefix
  const commitment = reduceUntil(input)

  if (!commitment) {
    console.error('No EigenDA commitment found in transaction')
    return
  }

  const blobInfo = tryParsingEigenDaBlobInfo(commitment)
  if (!blobInfo) {
    console.error('Failed to parse EigenDA blob info')
    return
  }

  // Extract and display relevant information
  const verificationInfo = extractBlobVerificationInfo(blobInfo)
  const { batchHeaderHash } = extractBlobBatchHeaderHash(blobInfo)
  const quorumInfo = blobInfo[0][2] // From blob header

  console.log('\nEigenDA Commitment Details:')
  console.log('------------------------')
  console.log(`Batch Header Hash: ${batchHeaderHash}`)

  console.log('\nBlob Verification Proof:')
  console.log(
    JSON.stringify(
      {
        batch_id: verificationInfo.batch_id,
        blob_index: verificationInfo.blob_index,
        batch_metadata: {
          batch_header: {
            batch_root: {
              hex: verificationInfo.batch_metadata.batch_header.batch_root.hex,
              base64:
                verificationInfo.batch_metadata.batch_header.batch_root.base64,
            },
            quorum_numbers:
              verificationInfo.batch_metadata.batch_header.quorum_numbers
                .base64,
            quorum_signed_percentages:
              verificationInfo.batch_metadata.batch_header
                .quorum_signed_percentages.base64,
            reference_block_number:
              verificationInfo.batch_metadata.batch_header
                .reference_block_number,
          },
          signatory_record_hash:
            verificationInfo.batch_metadata.signatory_record_hash.base64,
          fee: verificationInfo.batch_metadata.fee.base64,
          confirmation_block_number:
            verificationInfo.batch_metadata.confirmation_block_number,
          batch_header_hash:
            verificationInfo.batch_metadata.batch_header_hash.base64,
        },
        inclusion_proof: verificationInfo.inclusion_proof.base64,
        quorum_indexes: verificationInfo.quorum_indexes.base64,
      },
      null,
      2,
    ),
  )

  console.log('\nQuorum Parameters:')
  quorumInfo.forEach((params, i) => {
    console.log(`\nQuorum ${i + 1}:`)
    console.log(`- Quorum Number: ${Number.parseInt(params[0], 16) || 0}`)
    console.log(
      `- Adversary Threshold: ${Number.parseInt(params[1], 16) || 0}%`,
    )
    console.log(
      `- Confirmation Threshold: ${Number.parseInt(params[2], 16) || 0}%`,
    )
    console.log(`- Chunk Length: ${Number.parseInt(params[3], 16) || 0}`)
  })
}

function reduceUntil(input: string): string | undefined {
  for (let i = 0; i < input.length; i++) {
    const slice = input.slice(i, input.length)
    const firstByte = slice.slice(0, 2)
    const thirdByte = slice.slice(4, 6)

    if (
      firstByte === EIGEN_DA_CONSTANTS.COMMITMENT_FIRST_BYTE &&
      thirdByte === EIGEN_DA_CONSTANTS.COMMITMENT_THIRD_BYTE
    ) {
      const commitment = slice.slice(6)
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

function extractBlobVerificationInfo(decoded: EigenDaBlobInfo) {
  const blobVerificationProof = decoded[1] // Blob verification proof index

  // Helper function to format both hex and base64
  const formatField = (hexValue: string) => ({
    hex: hexValue.startsWith('0x') ? hexValue : '0x' + hexValue,
    base64: Buffer.from(
      hexValue.startsWith('0x') ? hexValue.slice(2) : hexValue,
      'hex',
    ).toString('base64'),
  })

  return {
    batch_id: Number.parseInt(blobVerificationProof[0], 16),
    blob_index: Number.parseInt(blobVerificationProof[1], 16),
    batch_metadata: {
      batch_header: {
        batch_root: formatField(blobVerificationProof[2][0][0]),
        quorum_numbers: formatField(blobVerificationProof[2][0][1]),
        quorum_signed_percentages: formatField(blobVerificationProof[2][0][2]),
        reference_block_number: Number.parseInt(
          blobVerificationProof[2][0][3].slice(2),
          16,
        ),
      },
      signatory_record_hash: formatField(blobVerificationProof[2][1]),
      fee: formatField(blobVerificationProof[2][2]),
      confirmation_block_number: Number.parseInt(
        blobVerificationProof[2][3].slice(2),
        16,
      ),
      batch_header_hash: formatField(blobVerificationProof[2][4]),
    },
    inclusion_proof: formatField(blobVerificationProof[3]),
    quorum_indexes: formatField(blobVerificationProof[4]),
  }
}

function extractBlobBatchHeaderHash(decoded: EigenDaBlobInfo): {
  batchHeaderHash: string
  blobVerificationProof: [
    string, // batch id
    string, // blob index
    [
      [
        string, // batch root
        string, // quorum numbers
        string, // quorum signed
        string, // reference block number
      ],
      string, // signatory record hash
      string, // fee
      string, // confirmation height
      string, // batch header hash
    ],
    string, // inclusion proof
    string, // quorum index
  ]
} {
  const RLP_BLOB_VERIFICATION_HEADER_IDX = 1
  const RLP_BLOB_BATCH_METADATA_IDX = 2
  const RLP_BLOB_BATCH_HEADER_HASH_IDX = 4

  const blobVerificationProof = decoded[RLP_BLOB_VERIFICATION_HEADER_IDX]
  const batchHeaderHash =
    blobVerificationProof[RLP_BLOB_BATCH_METADATA_IDX][
      RLP_BLOB_BATCH_HEADER_HASH_IDX
    ]

  return {
    batchHeaderHash: batchHeaderHash.toLowerCase(),
    blobVerificationProof,
  }
}

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
        .check((v) => v.length === 64 + 2), // batch header hash
    ]),
    v.string(), // inclusion proof
    v.string(), // quorum index
  ]),
])
