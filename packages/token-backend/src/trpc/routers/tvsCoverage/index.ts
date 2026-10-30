import { TRPCError } from '@trpc/server'
import type { TvsCoverageService } from '../../../tvsCoverage/TvsCoverageService'
import { readOnlyProcedure, readWriteProcedure } from '../../procedures'
import { router } from '../../trpc'

export function tvsCoverageRouter(service: TvsCoverageService | undefined) {
  return router({
    get: readOnlyProcedure.query(() => enabled(service).state()),
    // A build can take minutes, so this starts one and returns. The page polls
    // `get` while `building` is true.
    refresh: readWriteProcedure.mutation(() => {
      enabled(service).refreshInBackground()
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
