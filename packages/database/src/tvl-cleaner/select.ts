import { TvlCleaner } from '../kysely/generated/types'

export const selectTvlCleaner = [
  'repository_name',
  'hourly_cleaned_until',
  'six_hourly_cleaned_until',
] as const satisfies (keyof TvlCleaner)[]
