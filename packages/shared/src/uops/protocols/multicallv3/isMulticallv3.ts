import type { Transaction } from '@l2beat/shared-pure'
import { MULTICALL_V3, MULTICALL_V3_ZKSYNCERA } from './const'

export function isMulticallv3(tx: Transaction): boolean {
  return (
    tx.to?.toLowerCase() === MULTICALL_V3 ||
    tx.to?.toLowerCase() === MULTICALL_V3_ZKSYNCERA
  )
}
