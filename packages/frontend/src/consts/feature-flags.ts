// TODO: Figure out how to what to do about it
import { PROJECT_COUNTDOWNS } from '@l2beat/config/build/src/global/countdowns'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'

export const featureFlags = {
  othersMigrated: () => PROJECT_COUNTDOWNS.otherMigration < UnixTime.now(),
  stageOneRequirementsChanged: () =>
    PROJECT_COUNTDOWNS.stageChanges < UnixTime.now(),
  stageSorting: env.NEXT_PUBLIC_FEATURE_FLAG_STAGE_SORTING,
  daThroughput: env.NEXT_PUBLIC_FEATURE_FLAG_DA_THROUGHPUT,
}
