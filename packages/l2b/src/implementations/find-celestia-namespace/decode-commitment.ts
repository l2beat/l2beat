export function decodeCommitment(commitment: string) {
  const byteDerivationVersion = commitment.slice(2, 4)
  const heightHex = commitment.slice(4, 20)
  const heightBuffer = Buffer.from(heightHex, 'hex')
  const blockHeightDecimal = heightBuffer.readUInt32LE(0)

  const blobCommitment = Buffer.from(commitment.slice(20), 'hex').toString(
    'base64',
  )

  return {
    byteDerivationVersion,
    blockHeight: blockHeightDecimal,
    blobCommitment,
  }
}
