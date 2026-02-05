// TODO: Figure out how to what to do about it
import { PROJECT_COUNTDOWNS } from '@l2beat/config/build/global/countdowns'
import { UnixTime } from '@l2beat/shared-pure'

export const featureFlags = {
  stageOneRequirementsChanged: () =>
    PROJECT_COUNTDOWNS.stageChanges < UnixTime.now(),
}
