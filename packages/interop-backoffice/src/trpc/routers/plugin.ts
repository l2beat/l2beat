import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { PluginStatus, ProcessorStatus } from '../embeddings'
import { publicProcedure } from '../procedures'
import { router } from '../trpc'

type Dependencies = {
  getPluginSyncStatus: () => Promise<PluginStatus[]>
  getInteropProcessorStatuses: () => Promise<ProcessorStatus[]>
  requestInteropResync: (input: {
    pluginName: string
    resyncRequestedFrom: Record<string, number>
  }) => Promise<{
    updatedChains: string[]
  }>
  restartInteropPluginFromNow: (input: { pluginName: string }) => Promise<{
    updatedChains: string[]
  }>
  wipeInteropFinancials: () => Promise<{
    updatedTransfers: number
  }>
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

const RestartFromNowRequest = v.object({
  pluginName: v.string(),
})

export const createPluginRouter = (deps: Dependencies) =>
  router({
    status: publicProcedure.query(() => {
      return deps.getPluginSyncStatus()
    }),
    processorStatus: publicProcedure.query(() => {
      return deps.getInteropProcessorStatuses()
    }),
    requestResync: publicProcedure
      .input(ResyncRequest)
      .mutation(({ input }) => {
        return deps.requestInteropResync(input)
      }),
    restartFromNow: publicProcedure
      .input(RestartFromNowRequest)
      .mutation(({ input }) => {
        return deps.restartInteropPluginFromNow(input)
      }),
    wipeFinancials: publicProcedure.mutation(() => {
      return deps.wipeInteropFinancials()
    }),
  })
