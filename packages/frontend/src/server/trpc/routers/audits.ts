import {
  AuditsUnitDetailsParams,
  getAuditsUnitDetails,
} from '~/server/features/audits/getAuditsUnitDetails'
import { procedure, router } from '../trpc'

export const auditsRouter = router({
  unitDetails: procedure
    .input(AuditsUnitDetailsParams)
    .query(({ input }) => getAuditsUnitDetails(input) ?? null),
})
