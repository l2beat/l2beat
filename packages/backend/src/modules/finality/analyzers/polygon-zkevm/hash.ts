import { utils } from 'ethers'

import type { PolygonZkEvmTransaction } from './types'

const { keccak256, serializeTransaction } = utils

export { toTransactionHash }

function toTransactionHash(transaction: PolygonZkEvmTransaction): string {
  const rlp = serializeTransaction(
    {
      nonce: transaction.nonce.toNumber(),
      gasPrice: transaction.gasPrice,
      gasLimit: transaction.gasLimit,
      to: transaction.to,
      value: transaction.value,
      data: transaction.data,
      chainId: transaction.chainId ? transaction.chainId.toNumber() : undefined,
    },
    {
      v: transaction.v.toNumber(),
      r: transaction.r.toHexString(),
      s: transaction.s.toHexString(),
    },
  )

  return keccak256(rlp)
}
