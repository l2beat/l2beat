// TODO: Figure out how to what to do about it
import { PROJECT_COUNTDOWNS } from '@l2beat/config/build/src/common/projectCountdowns'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'

export const featureFlags = {
  othersMigrated: () =>
    PROJECT_COUNTDOWNS.otherMigration.expiresAt.lt(UnixTime.now()),
  internalTools: env.NEXT_PUBLIC_FEATURE_FLAG_INTERNAL_TOOLS,
  stageSorting: env.NEXT_PUBLIC_FEATURE_FLAG_STAGE_SORTING,
}
