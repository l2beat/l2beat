import {
  getPrivacyFlowsChart,
  PrivacyFlowsChartParams,
} from '~/server/features/privacy/getPrivacyFlowsChart'
import {
  getPrivacyTvlChart,
  PrivacyTvlChartParams,
} from '~/server/features/privacy/getPrivacyTvlChart'
import { procedure, router } from '../trpc'

export const privacyRouter = router({
  flowsChart: procedure
    .input(PrivacyFlowsChartParams)
    .query(({ input }) => getPrivacyFlowsChart(input)),
  tvlChart: procedure
    .input(PrivacyTvlChartParams)
    .query(({ input }) => getPrivacyTvlChart(input)),
})
