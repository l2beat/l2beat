import { getInteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { InteropDashboardParams } from '~/server/features/scaling/interop/types'
import { procedure, router } from '../trpc'

export const interopRouter = router({
  dashboard: procedure
    .input(InteropDashboardParams)
    .query(({ input }) => getInteropDashboardData(input)),
})
