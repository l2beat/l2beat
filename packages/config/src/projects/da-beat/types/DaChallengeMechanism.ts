import { DaAttributes } from './DaAttribute'

export type DaChallengeMechanism = typeof DaChallenges

const DaChallenges = {
  type: 'DaChallenges',
  value: 'DA Challenges',
  description: 'TODO',
} as const

export const DaChallengeMechanism = {
  DaChallenges,
} satisfies DaAttributes
