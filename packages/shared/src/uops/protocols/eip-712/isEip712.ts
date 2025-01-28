import type { Transaction } from '@l2beat/shared-pure'
import { EIP712_TX_TYPE } from './const'

export function isEip712(tx: Transaction): boolean {
  // for zkSync Era EIP-712 is used for account abstraction
  return tx.type === EIP712_TX_TYPE
}
