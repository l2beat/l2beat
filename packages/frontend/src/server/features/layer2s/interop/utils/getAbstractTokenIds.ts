import type { InteropTransferRecord } from '@l2beat/database'

export function getAbstractTokenIds(
  transfers: InteropTransferRecord[],
): string[] {
  return [
    ...new Set(
      transfers
        .flatMap((transfer) => [
          transfer.srcAbstractTokenId,
          transfer.dstAbstractTokenId,
        ])
        .filter((id): id is string => id !== undefined),
    ),
  ]
}
