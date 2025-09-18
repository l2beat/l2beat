import { RLP } from 'ethers/lib/utils'
import {
  EIGEN_DA_CONSTANTS,
  type EigenCommitment,
  EigenV1BlobInfo,
  EigenV2BlobInfo,
} from '@l2beat/discovery/dist/discovery/handlers/user/OpDaHandler/eigen-types'

export function parseEigenDACommitment(input: string) {
  // Remove 0x prefix if present
  const cleanInput = input.startsWith('0x') ? input.slice(2) : input

  console.log(`\nParsing EigenDA commitment: ${input}`)
  console.log('=' .repeat(50))

  // Extract commitment from input
  const commitment = extractCommitment(cleanInput)

  if (!commitment) {
    console.log('❌ No valid EigenDA commitment found in input')
    console.log('\nExpected format:')
    console.log(`- First byte: ${EIGEN_DA_CONSTANTS.COMMITMENT_FIRST_BYTE}`)
    console.log(`- Third byte: ${EIGEN_DA_CONSTANTS.COMMITMENT_THIRD_BYTE}`)
    console.log(`- Version bytes: ${EIGEN_DA_CONSTANTS.VERSION_BYTE_V1} (v1) or ${EIGEN_DA_CONSTANTS.VERSION_BYTE_V2} (v2)`)
    return
  }

  console.log(`\n✅ Found ${commitment.version} commitment`)
  console.log(`📝 Commitment body: ${commitment.body}`)

  // Show first few bytes for debugging
  console.log(`🔍 First 20 bytes: ${commitment.body.slice(0, 40)}...`)

  // Try to parse the commitment
  if (commitment.version === 'v1') {
    console.log('\n🔄 Attempting V1 parsing...')
    const parsed = parseEigenV1(commitment.body)
    if (parsed) {
      console.log('\n🎯 Successfully parsed V1 commitment')
      printV1BlobInfo(parsed)
    } else {
      console.log('\n❌ Failed to parse V1 commitment - invalid RLP or structure')

      // Try V2 as fallback in case detection was wrong
      console.log('\n🔄 Trying V2 parsing as fallback...')
      const parsedV2 = parseEigenV2(commitment.body)
      if (parsedV2) {
        console.log('\n🎯 Successfully parsed as V2 commitment (fallback)')
        printV2BlobInfo(parsedV2)
      } else {
        console.log('\n❌ Failed to parse as V2 as well')
      }
    }
  } else {
    console.log('\n🔄 Attempting V2 parsing...')
    const parsed = parseEigenV2(commitment.body)
    if (parsed) {
      console.log('\n🎯 Successfully parsed V2 commitment')
      printV2BlobInfo(parsed)
    } else {
      console.log('\n❌ Failed to parse V2 commitment - invalid RLP or structure')

      // Try V1 as fallback in case detection was wrong
      console.log('\n🔄 Trying V1 parsing as fallback...')
      const parsedV1 = parseEigenV1(commitment.body)
      if (parsedV1) {
        console.log('\n🎯 Successfully parsed as V1 commitment (fallback)')
        printV1BlobInfo(parsedV1)
      } else {
        console.log('\n❌ Failed to parse as V1 as well')
      }
    }
  }
}

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

function parseEigenV1(possibleCommitment: string): any | null {
  try {
    const rlp = RLP.decode('0x' + possibleCommitment)
    return EigenV1BlobInfo.parse(rlp)
  } catch {
    return null
  }
}

function parseEigenV2(possibleCommitment: string): any | null {
  try {
    const rlp = RLP.decode('0x' + possibleCommitment)
    return EigenV2BlobInfo.parse(rlp)
  } catch {
    return null
  }
}

function printV1BlobInfo(blobInfo: any) {
  const [blobHeader, blobVerificationProof] = blobInfo

  console.log('\n📋 Blob Header:')
  console.log(`  KZG Commitment:`)
  console.log(`    X: ${blobHeader[0][0]}`)
  console.log(`    Y: ${blobHeader[0][1]}`)
  console.log(`  Data Length: ${parseInt(blobHeader[1], 16)}`)
  console.log(`  Quorum Parameters (${blobHeader[2].length} quorums):`)

  blobHeader[2].forEach((params: any, i: number) => {
    console.log(`    Quorum ${i + 1}:`)
    console.log(`      Number: ${parseInt(params[0], 16)}`)
    console.log(`      Adversary Threshold: ${parseInt(params[1], 16)}%`)
    console.log(`      Confirmation Threshold: ${parseInt(params[2], 16)}%`)
    console.log(`      Chunk Length: ${parseInt(params[3], 16)}`)
  })

  console.log('\n🔍 Blob Verification Proof:')
  console.log(`  Batch ID: ${parseInt(blobVerificationProof[0], 16)}`)
  console.log(`  Blob Index: ${parseInt(blobVerificationProof[1], 16)}`)

  const batchMetadata = blobVerificationProof[2]
  const batchHeader = batchMetadata[0]

  console.log('  Batch Metadata:')
  console.log('    Batch Header:')
  console.log(`      Batch Root: ${batchHeader[0]}`)
  console.log(`      Quorum Numbers: ${batchHeader[1]}`)
  console.log(`      Quorum Signed: ${batchHeader[2]}`)
  console.log(`      Reference Block: ${parseInt(batchHeader[3], 16)}`)
  console.log(`    Signatory Record Hash: ${batchMetadata[1]}`)
  console.log(`    Fee: ${batchMetadata[2]}`)
  console.log(`    Confirmation Block: ${parseInt(batchMetadata[3], 16)}`)
  console.log(`    Batch Header Hash: ${batchMetadata[4]}`)
  console.log(`  Inclusion Proof: ${blobVerificationProof[3]}`)
  console.log(`  Quorum Indexes: ${blobVerificationProof[4]}`)
}

function printV2BlobInfo(blobInfo: any) {
  const [blobInclusionInfo, batchHeader, nonSignerStakesAndSig, signedQuorumNumbers] = blobInfo
  const [blobCertificate, blobIndex, inclusionProof] = blobInclusionInfo
  const [blobHeaderV2, signature, relayKeys] = blobCertificate
  const [version, quorumNumbers, commitments, paymentHeaderHash] = blobHeaderV2

  console.log('\n📋 Blob Certificate:')
  console.log('  Blob Header:')
  console.log(`    Version: ${parseInt(version, 16)}`)
  console.log(`    Quorum Numbers: ${quorumNumbers}`)
  console.log(`    Payment Header Hash: ${paymentHeaderHash}`)

  const [commitment, lengthCommitment, lengthProof, dataLength] = commitments
  console.log('    Commitments:')
  console.log(`      Commitment G1: (${commitment[0]}, ${commitment[1]})`)
  console.log(`      Length Commitment G2: ((${lengthCommitment[0][0]}, ${lengthCommitment[0][1]}), (${lengthCommitment[1][0]}, ${lengthCommitment[1][1]}))`)
  console.log(`      Length Proof G2: ((${lengthProof[0][0]}, ${lengthProof[0][1]}), (${lengthProof[1][0]}, ${lengthProof[1][1]}))`)
  console.log(`      Data Length: ${parseInt(dataLength, 16)}`)

  console.log(`  Signature: ${signature}`)
  console.log(`  Relay Keys (${relayKeys.length}): [${relayKeys.map((k: any) => parseInt(k, 16)).join(', ')}]`)

  console.log(`\n🔍 Blob Inclusion Info:`)
  console.log(`  Blob Index: ${parseInt(blobIndex, 16)}`)
  console.log(`  Inclusion Proof: ${inclusionProof}`)

  console.log(`\n📦 Batch Header:`)
  console.log(`  Batch Root: ${batchHeader[0]}`)
  console.log(`  Reference Block Number: ${parseInt(batchHeader[1], 16)}`)

  console.log(`\n✍️  Non-Signer Stakes and Signature:`)
  console.log(`  Non-Signer Quorum Bitmap Indices: [${nonSignerStakesAndSig[0].map((x: any) => parseInt(x, 16)).join(', ')}]`)
  console.log(`  Non-Signer Pubkeys: ${nonSignerStakesAndSig[1].length} entries`)
  console.log(`  Quorum APKs: ${nonSignerStakesAndSig[2].length} entries`)
  console.log(`  APK G2: ((${nonSignerStakesAndSig[3][0][0]}, ${nonSignerStakesAndSig[3][0][1]}), (${nonSignerStakesAndSig[3][1][0]}, ${nonSignerStakesAndSig[3][1][1]}))`)
  console.log(`  Sigma G1: (${nonSignerStakesAndSig[4][0]}, ${nonSignerStakesAndSig[4][1]})`)
  console.log(`  Quorum APK Indices: [${nonSignerStakesAndSig[5].map((x: any) => parseInt(x, 16)).join(', ')}]`)
  console.log(`  Total Stake Indices: [${nonSignerStakesAndSig[6].map((x: any) => parseInt(x, 16)).join(', ')}]`)
  console.log(`  Non-Signer Stake Indices: ${nonSignerStakesAndSig[7].length} arrays`)

  console.log(`\n🎯 Signed Quorum Numbers: ${signedQuorumNumbers}`)
}