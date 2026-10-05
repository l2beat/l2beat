import {
  AuditsUnitDetailsParams,
  getAuditsUnitDetails,
} from '~/server/features/audits/getAuditsUnitDetails'
import {
  AuditsValueSeriesParams,
  getAuditsValueSeries,
} from '~/server/features/audits/getAuditsValueSeries'
import { procedure, router } from '../trpc'

export const auditsRouter = router({
  unitDetails: procedure
    .input(AuditsUnitDetailsParams)
    .query(({ input }) => getAuditsUnitDetails(input) ?? null),
  valueSeries: procedure
    .input(AuditsValueSeriesParams)
    .query(({ input }) => getAuditsValueSeries(input)),
})
