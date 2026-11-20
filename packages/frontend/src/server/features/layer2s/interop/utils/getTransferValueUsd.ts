import type { InteropTransferRecord } from '@l2beat/database'

/**
 * The value a transfer is listed and sorted by: what was sent, or what was
 * received when the sent side has no price. The database sorts by the same
 * rule, so a page cursor built from this stays in step with it.
 */
export function getTransferValueUsd(
  transfer: Pick<InteropTransferRecord, 'srcValueUsd' | 'dstValueUsd'>,
): number | undefined {
  return transfer.srcValueUsd ?? transfer.dstValueUsd
}
