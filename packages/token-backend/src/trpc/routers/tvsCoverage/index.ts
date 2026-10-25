import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { TRPCError } from '@trpc/server'
import { DISMISSAL_REASONS, toDismissal } from '../../../tvsCoverage/dismissals'
import type { TvsCoverageService } from '../../../tvsCoverage/TvsCoverageService'
import { normalizeTokenAddress } from '../../../tvsCoverage/tokens'
import { readOnlyProcedure, readWriteProcedure } from '../../procedures'
import { router } from '../../trpc'

// Lengths match the TvsCoverageDismissal columns.
const RowKey = {
  projectId: maxLength(255),
  chain: maxLength(32),
  address: maxLength(255),
}

export function tvsCoverageRouter(service: TvsCoverageService | undefined) {
  return router({
    get: readOnlyProcedure.query(() => enabled(service).state()),
    // A build can take minutes, so this starts one and returns. The page polls
    // `get` while `building` is true.
    refresh: readWriteProcedure.mutation(() => {
      enabled(service).refreshInBackground()
    }),
    // Dismissals are their own small query that the page joins onto rows, so a
    // decision doesn't download the snapshot again.
    dismissals: readOnlyProcedure.query(async ({ ctx }) =>
      (await ctx.tokenDb.tvsCoverageDismissal.getAll()).map(toDismissal),
    ),
    dismiss: readWriteProcedure
      .input(
        v.object({
          ...RowKey,
          reason: v.enum(DISMISSAL_REASONS),
          comment: v.string().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        await ctx.tokenDb.tvsCoverageDismissal.upsert({
          projectId: input.projectId,
          chain: input.chain,
          address: normalizeTokenAddress(input.address),
          reason: input.reason,
          comment: input.comment?.trim() || undefined,
          dismissedBy: ctx.session.email,
          dismissedAt: UnixTime.now(),
        })
      }),
    restore: readWriteProcedure
      .input(v.object(RowKey))
      .mutation(async ({ ctx, input }) => {
        await ctx.tokenDb.tvsCoverageDismissal.delete({
          ...input,
          address: normalizeTokenAddress(input.address),
        })
      }),
  })
}

function enabled(service: TvsCoverageService | undefined): TvsCoverageService {
  if (!service) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'TVS coverage is disabled',
    })
  }
  return service
}

function maxLength(limit: number) {
  return v
    .string()
    .check(
      (value) => value.length <= limit,
      `Must be at most ${limit} characters`,
    )
}
