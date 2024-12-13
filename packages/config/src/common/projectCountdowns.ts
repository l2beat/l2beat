import { UnixTime } from '@l2beat/shared-pure'
import { Bridge, Layer2, Layer3 } from '../projects'

export type ProjectCountdowns = typeof PROJECT_COUNTDOWNS

export const PROJECT_COUNTDOWNS = {
  otherMigration: {
    expiresAt: new UnixTime(1735686000), // 2025-01-01T00:00:00Z
    getContext: (project: Layer2 | Layer3 | Bridge) => {
      if (
        project.type === 'bridge' ||
        !project.display.reasonsForBeingOther ||
        project.display.reasonsForBeingOther.length === 0
      ) {
        return undefined
      }
      return {
        reasonsForBeingOther: project.display.reasonsForBeingOther,
      }
    },
  },
} as const
