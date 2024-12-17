import { UnixTime } from '@l2beat/shared-pure'
import { Layer2, Layer3 } from '../projects'

export type ProjectCountdowns = typeof PROJECT_COUNTDOWNS

export const PROJECT_COUNTDOWNS = {
  otherMigration: {
    expiresAt: new UnixTime(1751320800), // 2025-07-01T00:00:00Z
    getContext: (project: Layer2 | Layer3) => {
      if (
        project.display.category === 'Other' ||
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
