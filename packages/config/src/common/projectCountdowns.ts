import { UnixTime } from '@l2beat/shared-pure'
import { Bridge, Layer2, Layer3 } from '../projects'

interface ProjectCountdown {
  expiresAt: UnixTime
  filter: (project: Layer2 | Layer3 | Bridge) => boolean
  hasExpired: () => boolean
}

export type ProjectCountdowns = typeof PROJECT_COUNTDOWNS

export const PROJECT_COUNTDOWNS = {
  otherMigration: {
    expiresAt: new UnixTime(1735686000), // 2025-01-01T00:00:00Z
    filter: (project) => {
      return (
        project.type !== 'bridge' &&
        !!project.display.reasonsForBeingOther &&
        project.display.reasonsForBeingOther.length > 0
      )
    },
    hasExpired: function () {
      return this.expiresAt.toNumber() * 1000 < Date.now()
    },
  },
} satisfies Record<string, ProjectCountdown>
