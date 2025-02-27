/**
 * @see https://github.com/celestiaorg/optimism/blob/9931de7ebf78564062383d5d680458e750a0cb52/op-celestia/da.go#L10
 */
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
