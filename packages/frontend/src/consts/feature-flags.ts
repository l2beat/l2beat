// TODO: Figure out how to what to do about it
import { PROJECT_COUNTDOWNS } from '@l2beat/config/build/src/common/projectCountdowns'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'

export const featureFlags = {
  othersMigrated: () => PROJECT_COUNTDOWNS.otherMigration.lt(UnixTime.now()),
  stageOneRequirementsChanged: () =>
    PROJECT_COUNTDOWNS.stageChanges.lt(UnixTime.now()),
  stageSorting: env.NEXT_PUBLIC_FEATURE_FLAG_STAGE_SORTING,
  daThroughput: env.NEXT_PUBLIC_FEATURE_FLAG_DA_THROUGHPUT,
}
