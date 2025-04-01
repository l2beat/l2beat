import type { Transaction } from '@l2beat/shared-pure'
import {
  ENTRY_POINT_ADDRESS_0_6_0,
  ENTRY_POINT_ADDRESS_0_7_0,
  ENTRY_POINT_ADDRESS_0_8_0,
} from './const'

export function isErc4337(tx: Transaction): boolean {
  return (
    tx.to?.toLowerCase() === ENTRY_POINT_ADDRESS_0_6_0 ||
    tx.to?.toLowerCase() === ENTRY_POINT_ADDRESS_0_7_0 ||
    tx.to?.toLowerCase() === ENTRY_POINT_ADDRESS_0_8_0
  )
}
