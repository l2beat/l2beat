import type { Database, InteropTransferTimeRange } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { TRPCError } from '@trpc/server'

export const INTEROP_TRANSFER_DATA_RANGES = [
  'last24h',
  'lastPromoted',
  'all',
] as const

export const InteropTransferDataRange = v.enum(INTEROP_TRANSFER_DATA_RANGES)

export type InteropTransferDataRange =
  (typeof INTEROP_TRANSFER_DATA_RANGES)[number]

export const InteropTransferDataRangeRequest = v
  .object({
    range: InteropTransferDataRange.optional(),
  })
  .optional()

export async function resolveInteropTransferTimeRange(
  db: Database,
  range: InteropTransferDataRange | undefined,
): Promise<InteropTransferTimeRange | undefined> {
  switch (range ?? 'last24h') {
    case 'all':
      return undefined
    case 'last24h': {
      const to = UnixTime.now()
      return { from: to - UnixTime.DAY, to }
    }
    case 'lastPromoted': {
      const to = await db.interopAggregateStatus.getLatestPromotedTimestamp()
      if (to === undefined) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No promoted aggregate snapshot is available.',
        })
      }
      return { from: to - UnixTime.DAY, to }
    }
  }
}
