import {
  getPrivacyProjectChart,
  PrivacyProjectChartParams,
} from '~/server/features/privacy/getPrivacyProjectChart'
import { getPrivacySummaryChart } from '~/server/features/privacy/getPrivacySummaryChart'
import { PrivacyChartParams } from '~/server/features/privacy/privacyChartUtils'
import { procedure, router } from '../trpc'

export const privacyRouter = router({
  projectChart: procedure
    .input(PrivacyProjectChartParams)
    .query(({ input }) => getPrivacyProjectChart(input)),
  summaryChart: procedure
    .input(PrivacyChartParams)
    .query(({ input }) => getPrivacySummaryChart(input)),
})
