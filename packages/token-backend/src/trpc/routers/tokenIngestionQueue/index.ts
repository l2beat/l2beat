import type { TokenIngestionQueueRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { TRPCError } from '@trpc/server'
import {
  toIngestionOutcomeView,
  toIngestionTraceView,
} from '../../../ingestion/formatIngestionTrace'
import type { IngestionOutcomeView } from '../../../ingestion/IngestionTrace'
import { COINGECKO_SYMBOL_CONFLICT_MESSAGE_PREFIX } from '../../../ingestion/TokenIngestionProcessor'
import { readOnlyProcedure, readWriteProcedure } from '../../procedures'
import { router } from '../../trpc'

const QueueEntryAddress = v.object({
  chain: v.string(),
  address: v.string(),
})

const QueuePageInput = v.object({
  page: v.number(),
  pageSize: v.number(),
  chains: v.array(v.string()).optional(),
})

const ResolveConflictInput = v.object({
  chain: v.string(),
  address: v.string(),
  symbol: v.string(),
})

export interface QueuePageRow {
  entry: TokenIngestionQueueRecord
  predictedOutcome: IngestionOutcomeView
  deployedTokenExists: boolean
  /** True when this entry is a CoinGecko-symbol conflict that the UI can
   * offer to resolve via the `resolveConflict` mutation. Computed here so the
   * UI does not need to know the conflict message format. */
  resolvableSymbolConflict: boolean
}

export const tokenIngestionQueueRouter = router({
  getAll: readOnlyProcedure.query(({ ctx }) => {
    return ctx.tokenDb.tokenIngestionQueue.getAll()
  }),
  getPage: readOnlyProcedure
    .input(QueuePageInput)
    .query(async ({ ctx, input }) => {
      const page = Math.max(1, Math.floor(input.page))
      const pageSize = Math.min(500, Math.max(1, Math.floor(input.pageSize)))

      const result = await ctx.tokenDb.tokenIngestionQueue.getPage({
        offset: (page - 1) * pageSize,
        limit: pageSize,
        chains: input.chains,
      })

      const transferIndex =
        await ctx.tokenIngestionProcessor.getInteropTransferIndex()
      const rows: QueuePageRow[] = []
      for (const entry of result.entries) {
        const trace = await ctx.tokenIngestionProcessor.plan(
          entry,
          transferIndex,
        )
        rows.push({
          entry,
          predictedOutcome: toIngestionOutcomeView(trace.outcome),
          deployedTokenExists: trace.existingDeployedToken !== undefined,
          resolvableSymbolConflict:
            entry.state === 'conflict' &&
            (entry.message?.startsWith(
              COINGECKO_SYMBOL_CONFLICT_MESSAGE_PREFIX,
            ) ??
              false),
        })
      }

      return { rows, totalCount: result.totalCount }
    }),
  approve: readWriteProcedure
    .input(QueueEntryAddress)
    .mutation(async ({ ctx, input }) => {
      const approved = await ctx.tokenDb.tokenIngestionQueue.approve(input)
      if (approved !== 1) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Queue entry is not staged',
        })
      }

      return { success: true }
    }),
  approveMany: readWriteProcedure
    .input(v.array(QueueEntryAddress))
    .mutation(async ({ ctx, input }) => {
      let approved = 0
      for (const entry of input) {
        approved += await ctx.tokenDb.tokenIngestionQueue.approve(entry)
      }

      return { success: true, approved }
    }),
  retry: readWriteProcedure
    .input(QueueEntryAddress)
    .mutation(async ({ ctx, input }) => {
      const retried = await ctx.tokenDb.tokenIngestionQueue.retry(input)
      if (retried !== 1) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Queue entry is not in conflict or error state',
        })
      }

      return { success: true }
    }),
  retryMany: readWriteProcedure
    .input(v.array(QueueEntryAddress))
    .mutation(async ({ ctx, input }) => {
      let retried = 0
      for (const entry of input) {
        retried += await ctx.tokenDb.tokenIngestionQueue.retry(entry)
      }

      return { success: true, retried }
    }),
  resolveConflict: readWriteProcedure
    .input(ResolveConflictInput)
    .mutation(async ({ ctx, input }) => {
      const symbol = input.symbol.trim()
      if (symbol.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Symbol must not be empty',
        })
      }

      const entry = await ctx.tokenDb.tokenIngestionQueue.findByChainAndAddress(
        { chain: input.chain, address: input.address },
      )
      if (!entry || entry.state !== 'conflict') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Queue entry is not in conflict state',
        })
      }

      const trace = await ctx.tokenIngestionProcessor.resolveSymbolConflict(
        entry,
        { chosenSymbol: symbol, user: ctx.session.email },
      )
      return toIngestionTraceView(trace)
    }),
  preview: readOnlyProcedure
    .input(QueueEntryAddress)
    .mutation(async ({ ctx, input }) => {
      const transferIndex =
        await ctx.tokenIngestionProcessor.getInteropTransferIndex()
      const entry = {
        chain: input.chain,
        address: input.address,
        state: 'pending' as const,
        message: null,
        createdAt: UnixTime.now(),
        updatedAt: UnixTime.now(),
      }
      const planned = await ctx.tokenIngestionProcessor.plan(
        entry,
        transferIndex,
      )
      const trace = await ctx.tokenIngestionProcessor.fetch(planned)
      return toIngestionTraceView(trace)
    }),
})
