import type { DataAvailabilityRecord } from '@l2beat/database'

/**
 * The fees of the records that carry one. Null when none does: an hour
 * indexed before fees were tracked, or a layer that charges none
 */
export function sumFees(
  records: Pick<DataAvailabilityRecord, 'totalFeeEth'>[],
): number | null {
  let sum: number | null = null
  for (const record of records) {
    if (record.totalFeeEth === null) continue
    sum = (sum ?? 0) + record.totalFeeEth
  }
  return sum
}
