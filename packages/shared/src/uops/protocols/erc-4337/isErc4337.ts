import { EVMTransaction } from '../../../clients/rpc/types'
import { ENTRY_POINT_ADDRESS_0_6_0, ENTRY_POINT_ADDRESS_0_7_0 } from './const'

export function isErc4337(tx: EVMTransaction): boolean {
  return (
    tx.to?.toLowerCase() === ENTRY_POINT_ADDRESS_0_6_0 ||
    tx.to?.toLowerCase() === ENTRY_POINT_ADDRESS_0_7_0
  )
}
