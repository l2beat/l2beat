import {
  getPrivacyFlowsChart,
  PrivacyFlowsChartParams,
} from '~/server/features/privacy/getPrivacyFlowsChart'
import {
  getPrivacyTvsChart,
  PrivacyTvsChartParams,
} from '~/server/features/privacy/getPrivacyTvsChart'
import { procedure, router } from '../trpc'

export const privacyRouter = router({
  flowsChart: procedure
    .input(PrivacyFlowsChartParams)
    .query(({ input }) => getPrivacyFlowsChart(input)),
  tvsChart: procedure
    .input(PrivacyTvsChartParams)
    .query(({ input }) => getPrivacyTvsChart(input)),
})
