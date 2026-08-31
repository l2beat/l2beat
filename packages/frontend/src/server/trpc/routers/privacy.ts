import {
  getPrivacyAnonymitySetChart,
  PrivacyAnonymitySetChartParams,
} from '~/server/features/privacy/getPrivacyAnonymitySetChart'
import {
  getPrivacyFlowsChart,
  PrivacyFlowsChartParams,
} from '~/server/features/privacy/getPrivacyFlowsChart'
import { procedure, router } from '../trpc'

export const privacyRouter = router({
  anonymitySetChart: procedure
    .input(PrivacyAnonymitySetChartParams)
    .query(({ input }) => getPrivacyAnonymitySetChart(input)),
  flowsChart: procedure
    .input(PrivacyFlowsChartParams)
    .query(({ input }) => getPrivacyFlowsChart(input)),
})
