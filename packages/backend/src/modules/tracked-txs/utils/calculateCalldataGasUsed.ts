import type { UnixTime } from '@l2beat/shared-pure'
import {
  getGlamsterdamCalldataGasUsed,
  getGlamsterdamIntrinsicBase,
  isGlamsterdam,
} from './glamsterdam'

const PECTRA_START_BLOCK = 22431084

export interface CalldataTx {
  block_number: number
  block_time: UnixTime
  data_length: number
  non_zero_bytes: number
  gas_used: number
  is_self_transfer: boolean
  has_value: boolean
}

export function calculateCalldataGasUsed(tx: CalldataTx) {
  if (isGlamsterdam(tx.block_time)) {
    return getGlamsterdamCalldataGasUsed(
      tx.data_length,
      tx.non_zero_bytes,
      tx.gas_used,
      getGlamsterdamIntrinsicBase(tx.is_self_transfer, tx.has_value),
    )
  }

  const zeroBytes = tx.data_length - tx.non_zero_bytes
  const standardCalldata = 16 * tx.non_zero_bytes + 4 * zeroBytes

  if (tx.block_number < PECTRA_START_BLOCK) {
    return standardCalldata
  }

  const compute = tx.gas_used - standardCalldata - 21_000

  if (compute >= 1.5 * standardCalldata) {
    return standardCalldata
  }

  return 40 * tx.non_zero_bytes + 10 * zeroBytes
}
