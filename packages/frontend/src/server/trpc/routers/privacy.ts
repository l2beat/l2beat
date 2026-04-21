import {
  getPrivacyProjectChart,
  PrivacyProjectChartParams,
} from '~/server/features/privacy/getPrivacyProjectChart'
import { procedure, router } from '../trpc'

export const privacyRouter = router({
  projectChart: procedure
    .input(PrivacyProjectChartParams)
    .query(({ input }) => getPrivacyProjectChart(input)),
})
