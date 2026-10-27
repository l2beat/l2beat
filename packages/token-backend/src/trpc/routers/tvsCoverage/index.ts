import { TRPCError } from '@trpc/server'
import type { TvsCoverageService } from '../../../tvsCoverage/TvsCoverageService'
import { readOnlyProcedure, readWriteProcedure } from '../../procedures'
import { router } from '../../trpc'

export function tvsCoverageRouter(service: TvsCoverageService | undefined) {
  return router({
    get: readOnlyProcedure.query(() => enabled(service).get()),
    refresh: readWriteProcedure.mutation(async () => {
      await enabled(service).refresh()
    }),
  })
}

function enabled(service: TvsCoverageService | undefined): TvsCoverageService {
  if (!service) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'TVS coverage is disabled',
    })
  }
  return service
}
