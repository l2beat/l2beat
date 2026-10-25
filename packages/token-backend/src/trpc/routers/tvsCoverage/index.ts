import type { TvsCoverageService } from '../../../tvsCoverage/TvsCoverageService'
import { readOnlyProcedure, readWriteProcedure } from '../../procedures'
import { router } from '../../trpc'

export function tvsCoverageRouter({
  tvsCoverageService,
}: {
  tvsCoverageService: TvsCoverageService
}) {
  return router({
    get: readOnlyProcedure.query(() => tvsCoverageService.get()),
    refresh: readWriteProcedure.mutation(() => tvsCoverageService.refresh()),
  })
}
