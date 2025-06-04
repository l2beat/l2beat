import { EthereumAddress } from '@l2beat/shared-pure'
import { ethers } from 'ethers'
import { RLP } from 'ethers/lib/utils'
import { z } from 'zod'

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
  const batchHeaderHash = extractBlobBatchHeaderHash(blobInfo)
  const batchId = blobInfo[1][0] // From blob verification proof
  const blobIndex = blobInfo[1][1]
  const quorumInfo = blobInfo[0][2] // From blob header

  console.log('EigenDA Commitment Details:')
  console.log('------------------------')
  console.log(`Batch Header Hash: ${batchHeaderHash}`)
  console.log(`Batch ID: ${batchId}`)
  console.log(`Blob Index: ${blobIndex}`)
  console.log('\nQuorum Parameters:')
  quorumInfo.forEach((params, i) => {
    console.log(`\nQuorum ${i + 1}:`)
    console.log(`- Quorum Number: ${params[0]}`)
    console.log(`- Adversary Threshold: ${params[1]}%`)
    console.log(`- Confirmation Threshold: ${params[2]}%`)
    console.log(`- Chunk Length: ${params[3]}`)
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

function tryParsingEigenDaBlobInfo(possibleCommitment: string): EigenDaBlobInfo | null {
  try {
    const rlp = RLP.decode('0x' + possibleCommitment)
    return EigenDaBlobInfo.parse(rlp)
  } catch {
    return null
  }
}

function extractBlobBatchHeaderHash(decoded: EigenDaBlobInfo): string {
  const RLP_BLOB_VERIFICATION_HEADER_IDX = 1
  const RLP_BLOB_BATCH_METADATA_IDX = 2
  const RLP_BLOB_BATCH_HEADER_HASH_IDX = 4

  const blobVerificationProof = decoded[RLP_BLOB_VERIFICATION_HEADER_IDX]
  const blobBatchHeaderHash =
    blobVerificationProof[RLP_BLOB_BATCH_METADATA_IDX][RLP_BLOB_BATCH_HEADER_HASH_IDX]

  return blobBatchHeaderHash.toLowerCase()
}

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
      z.string().length(64 + 2), // batch header hash
    ]),
    z.string(), // inclusion proof
    z.string(), // quorum index
  ]),
])
