import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import type { PluginSyncStatus } from '../../../sync/InteropSyncersManager'
import { getMemoryUsage } from '../../impls/memory'
import type { ProcessorStatus } from '../../impls/processors'

type Dependencies = {
  getChainsForPlugin: (pluginName: string) => string[]
  getPluginSyncStatuses: () => Promise<PluginSyncStatus[]>
  getProcessorStatuses: () => ProcessorStatus[]
}

const ResyncRequest = v.object({
  pluginName: v.string(),
  resyncRequestedFrom: v.record(
    v.string(),
    v.number().check((value) => {
      try {
        UnixTime(value)
        return true
      } catch (error) {
        return error instanceof Error ? error.message : 'Invalid timestamp'
      }
    }),
  ),
})

export function createStatusRouter(deps: Dependencies) {
  return router({
    memory: protectedProcedure.query(() => {
      return getMemoryUsage()
    }),
    pluginSyncStatuses: protectedProcedure.query(async () => {
      const rows = await deps.getPluginSyncStatuses()

      return rows.map((row) => ({
        ...row,
        toBlock: row.toBlock?.toString(),
      }))
    }),
    resync: protectedProcedure
      .input(ResyncRequest)
      .mutation(async ({ ctx, input }) => {
        const defaultFrom = input.resyncRequestedFrom['*']
        const chains = deps.getChainsForPlugin(input.pluginName)
        const updatedChains = new Set<string>()

        await ctx.db.transaction(async () => {
          for (const chain of chains) {
            const resyncFrom = input.resyncRequestedFrom[chain] ?? defaultFrom
            if (resyncFrom) {
              await ctx.db.interopPluginSyncState.setResyncRequestedFrom(
                input.pluginName,
                chain,
                UnixTime(resyncFrom),
              )
              updatedChains.add(chain)
            }
          }
        })

        return { updatedChains: Array.from(updatedChains) }
      }),
    restartFromNow: protectedProcedure
      .input(v.object({ pluginName: v.string() }))
      .mutation(async ({ ctx, input }) => {
        const chains = deps.getChainsForPlugin(input.pluginName)

        await ctx.db.transaction(async () => {
          for (const chain of chains) {
            await ctx.db.interopPluginSyncState.upsert({
              pluginName: input.pluginName,
              chain,
              lastError: null,
              resyncRequestedFrom: null,
              wipeRequired: true,
            })
          }
        })

        return { updatedChains: chains }
      }),
    processors: protectedProcedure.query(() => {
      return deps.getProcessorStatuses()
    }),
  })
}
