import { getInteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { getInteropSubpageData } from '~/server/features/scaling/interop/getInteropSubpageData'
import {
  InteropDashboardParams,
  InteropSubpageParams,
} from '~/server/features/scaling/interop/types'
import { procedure, router } from '../trpc'

export const interopRouter = router({
  dashboard: procedure
    .input(InteropDashboardParams)
    .query(({ input }) => getInteropDashboardData(input)),
  subpage: procedure
    .input(InteropSubpageParams)
    .query(({ input }) => getInteropSubpageData(input)),
})
