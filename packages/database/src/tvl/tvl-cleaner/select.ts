import type { TvlCleaner } from '../../kysely/generated/types'

export const selectTvlCleaner = [
  'repositoryName',
  'hourlyCleanedUntil',
  'sixHourlyCleanedUntil',
] as const satisfies (keyof TvlCleaner)[]
