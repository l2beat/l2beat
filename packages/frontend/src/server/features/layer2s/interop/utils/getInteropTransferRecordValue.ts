import { getInteropTransferValue } from '@l2beat/shared-pure'
import type { InteropTransferWithTokens } from '../types'

export function getInteropTransferRecordValue(
  record: InteropTransferWithTokens,
): number | undefined {
  if ('volume' in record) {
    return record.volume
  }

  return getInteropTransferValue(record)
}
