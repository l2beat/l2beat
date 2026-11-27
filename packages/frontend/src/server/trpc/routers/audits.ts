import {
  AuditsUnitDetailsParams,
  getAuditsUnitDetails,
} from '~/server/features/audits/getAuditsUnitDetails'
import { procedure, router } from '../trpc'

export const auditsRouter = router({
  unitDetails: procedure
    .input(AuditsUnitDetailsParams)
    .query(async ({ input }) => (await getAuditsUnitDetails(input)) ?? null),
})
