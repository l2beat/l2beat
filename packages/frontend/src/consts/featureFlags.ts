// TODO: Figure out how to what to do about it
import { PROJECT_COUNTDOWNS } from '@l2beat/config/build/global/countdowns'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'

export const featureFlags = {
  stageOneRequirementsChanged: () =>
    PROJECT_COUNTDOWNS.stageChanges < UnixTime.now(),
  stageSorting: env.CLIENT_SIDE_FEATURE_FLAG_STAGE_SORTING,
}
