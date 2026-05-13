import {
  getPrivacyProjectChart,
  PrivacyProjectChartParams,
} from '~/server/features/privacy/getPrivacyProjectChart'
import { getPrivacySummaryChart } from '~/server/features/privacy/getPrivacySummaryChart'
import { PrivacyFlowsChartParams } from '~/server/features/privacy/utils/buildPrivacyFlowsChart'
import { procedure, router } from '../trpc'

export const privacyRouter = router({
  projectCharts: procedure
    .input(PrivacyProjectChartParams)
    .query(({ input }) => getPrivacyProjectChart(input)),
  summaryCharts: procedure
    .input(PrivacyFlowsChartParams)
    .query(({ input }) => getPrivacySummaryChart(input)),
})
