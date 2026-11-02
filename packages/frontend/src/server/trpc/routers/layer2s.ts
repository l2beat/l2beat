import { v } from '@l2beat/validate'
import { L2Tab } from '~/pages/layer2s/utils/lazyL2Tabs'
import { getCachedL2SummaryEntries } from '~/server/features/layer2s/summary/getL2SummaryEntries'
import { procedure, router } from '../trpc'

export const layer2sRouter = router({
  summaryTabEntries: procedure
    .input(v.object({ tab: L2Tab }))
    .query(async ({ input }) => (await getCachedL2SummaryEntries())[input.tab]),
})
