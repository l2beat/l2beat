import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'

/** How many recent snapshots the backoffice promotion view lists (newest first). */
const RECENT_SNAPSHOTS_LIMIT = 200

/** A single rule violation as displayed to the operator (subset of `RuleViolation`). */
export interface PromotionReasonDto {
  rule: string
  scope: string
  value: number | undefined
  threshold: number | undefined
  message: string
}

export interface PromotionSnapshotDto {
  /** Aggregation `to` timestamp (seconds). */
  timestamp: number
  status: 'promoted' | 'blocked'
  /** 'auto' for engine verdicts, operator email for manual flips. */
  promotedBy: string | undefined
  reasons: PromotionReasonDto[]
  checkedAt: number
  updatedAt: number
}

// `reasons` is stored as opaque JSON; normalize defensively rather than trusting the shape.
function toReasonDto(reason: unknown): PromotionReasonDto {
  const r = (reason ?? {}) as Record<string, unknown>
  return {
    rule: typeof r.rule === 'string' ? r.rule : 'unknown',
    scope: typeof r.scope === 'string' ? r.scope : '*',
    value: typeof r.value === 'number' ? r.value : undefined,
    threshold: typeof r.threshold === 'number' ? r.threshold : undefined,
    message: typeof r.message === 'string' ? r.message : '',
  }
}

function toReasonsDto(reasons: unknown): PromotionReasonDto[] {
  return Array.isArray(reasons) ? reasons.map(toReasonDto) : []
}

const PromoteRequest = v.object({
  timestamp: v.number().check((value) => {
    try {
      UnixTime(value)
      return true
    } catch (error) {
      return error instanceof Error ? error.message : 'Invalid timestamp'
    }
  }),
})

export function createPromotionRouter() {
  return router({
    listRecent: protectedProcedure.query(async ({ ctx }) => {
      const rows = await ctx.db.interopAggregateStatus.getRecent(
        RECENT_SNAPSHOTS_LIMIT,
      )
      return rows.map(
        (row) =>
          ({
            timestamp: row.timestamp,
            status: row.status,
            promotedBy: row.promotedBy,
            reasons: toReasonsDto(row.reasons),
            checkedAt: row.checkedAt,
            updatedAt: row.updatedAt,
          }) satisfies PromotionSnapshotDto,
      )
    }),
    promote: protectedProcedure
      .input(PromoteRequest)
      .mutation(async ({ ctx, input }) => {
        const timestamp = UnixTime(input.timestamp)
        // Preserve the engine's `reasons` as an audit trail of why it was blocked;
        // the human verdict (non-`auto`) is sticky, so the engine won't revert it.
        const existing =
          await ctx.db.interopAggregateStatus.getByTimestamp(timestamp)
        await ctx.db.interopAggregateStatus.upsert({
          timestamp,
          status: 'promoted',
          promotedBy: ctx.session.email,
          reasons: existing?.reasons,
        })
        return { timestamp: input.timestamp }
      }),
  })
}
