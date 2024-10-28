import { EVMTransaction } from '../../../clients'
import { EIP712_TX_TYPE } from './const'

export function isEip712(tx: EVMTransaction): boolean {
  // for zkSync Era EIP-712 is used for account abstraction
  return tx.type === EIP712_TX_TYPE
}
