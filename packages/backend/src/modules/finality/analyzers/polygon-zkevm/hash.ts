import { BigNumber, BigNumberish, Signature, utils } from 'ethers'

import { PolygonZkEvmTransaction } from './types'

const { RLP, arrayify, hexlify, splitSignature, stripZeros } = utils

export { toTransactionHash }

function toTransactionHash(transaction: PolygonZkEvmTransaction): string {
  function alignNumeric(value: BigNumberish): Uint8Array {
    return stripZeros(arrayify(hexlify(value, { hexPad: 'left' })))
  }

  const alignedFields = [
    transaction.nonce,
    transaction.gasPrice,
    transaction.gasLimit,
    transaction.value,
    transaction.data,
  ].map(alignNumeric)

  const alignedTo = stripZeros(arrayify(hexlify(transaction.to ?? [])))

  const legacyUnsignedFields = [
    ...alignedFields.slice(0, 3),
    alignedTo,
    ...alignedFields.slice(3),
  ]

  // Extract and align signature parts
  const signatureParts = getAlignedSignatureParts(transaction)

  // Recompute v and recovery param
  const v = coerceVParam(transaction.chainId, signatureParts)

  const fieldsWithSignature = [
    ...legacyUnsignedFields,
    hexlify(v),
    stripZeros(arrayify(signatureParts.r)),
    stripZeros(arrayify(signatureParts.s)),
  ]

  return utils.keccak256(RLP.encode(fieldsWithSignature))
}

function getAlignedSignatureParts(transaction: PolygonZkEvmTransaction) {
  return splitSignature({
    v: +transaction.v,
    r: transaction.r.toHexString(),
    s: transaction.s.toHexString(),
  })
}

/**
 * @see EIP-155
 */
function coerceVParam(chainId: BigNumber, signatureParts: Signature): number {
  let v = 27 + signatureParts.recoveryParam
  v += Number(chainId) * 2 + 8

  const expectedV = signatureParts.v
  if (expectedV > 28 && expectedV !== v) {
    throw new Error('Transaction chainId/signature v mismatch')
  }

  return v
}
