import { BigNumberish, BytesLike, utils } from 'ethers'

const { RLP, arrayify, hexlify, splitSignature, stripZeros } = utils

export { getTransactionHash }

type RawTransaction = {
  nonce: BigNumberish
  gasPrice: BigNumberish
  gasLimit: BigNumberish
  to?: string
  value: BigNumberish
  data: BytesLike
  chainId: number
}

type Signature = {
  v: number
  r: string
  s: string
}

function getTransactionHash(
  transaction: RawTransaction,
  signature: Signature,
): string {
  function handleNumeric(value: BigNumberish) {
    return stripZeros(arrayify(hexlify(value, { hexPad: 'left' })))
  }

  const legacyUnsignedFields = [
    handleNumeric(transaction.nonce),
    handleNumeric(transaction.gasPrice),
    handleNumeric(transaction.gasLimit),
    stripZeros(arrayify(hexlify(transaction.to ?? []))),
    handleNumeric(transaction.value),
    handleNumeric(transaction.data),
  ]

  // let the ethers take care of the v param and recovery param computation
  const sig = splitSignature(signature)

  // v part with respect to recovery param
  const { chainId } = transaction
  let v = 27 + sig.recoveryParam
  v += chainId * 2 + 8

  // If an EIP-155 v (directly or indirectly; maybe _vs) was provided, check it!
  if (sig.v > 28 && sig.v !== v) {
    throw new Error('transaction.chainId/signature.v mismatch')
  }

  if (sig.v !== v) {
    throw new Error('transaction.chainId/signature.v mismatch')
  }

  const sigFields = [
    hexlify(v),
    stripZeros(arrayify(sig.r)),
    stripZeros(arrayify(sig.s)),
  ]

  const fieldsWithSignature = [...legacyUnsignedFields, ...sigFields]

  return utils.keccak256(RLP.encode(fieldsWithSignature))
}
