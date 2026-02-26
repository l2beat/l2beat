import { UnixTime } from '@l2beat/shared-pure'

// Keep in sync with packages/config/src/global/countdowns.ts.
const PROJECT_STAGE_CHANGES = UnixTime.fromDate(
  new Date('2026-08-17T12:00:00Z'),
)

export const featureFlags = {
  stageOneRequirementsChanged: () => PROJECT_STAGE_CHANGES < UnixTime.now(),
}
