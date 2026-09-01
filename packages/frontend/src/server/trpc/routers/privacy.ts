import {
  getPrivacyFlowsChart,
  PrivacyFlowsChartParams,
} from '~/server/features/privacy/getPrivacyFlowsChart'
import { procedure, router } from '../trpc'

export const privacyRouter = router({
  flowsChart: procedure
    .input(PrivacyFlowsChartParams)
    .query(({ input }) => getPrivacyFlowsChart(input)),
})
