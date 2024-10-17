import { Transaction } from '../../types'
import {
  SAFE_EXEC_TRANSACTION_SELECTOR,
  SAFE_MULTI_SEND_CALL_ONLY_1_3_0,
} from './const'

export function isGnosisSafe(tx: Transaction): boolean {
  const selector = tx.data.slice(0, 10)

  return (
    selector === SAFE_EXEC_TRANSACTION_SELECTOR ||
    tx.to?.toLowerCase() === SAFE_MULTI_SEND_CALL_ONLY_1_3_0
  )
}
