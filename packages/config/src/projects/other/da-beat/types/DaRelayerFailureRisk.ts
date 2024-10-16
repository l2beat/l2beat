import { Sentiment } from '@l2beat/shared-pure'

export const DaRelayerFailureRisk = {
  selfPropose: {
    name: 'Self propose',
    sentiment: 'good',
  },
  whitelist: {
    name: 'Whitelist',
    sentiment: 'warning',
  },
  governance: {
    name: 'Governance',
    sentiment: 'warning',
  },
  noMechanism: {
    name: 'No mechanism',
    sentiment: 'bad',
  },
  noBridge: {
    name: 'No bridge',
    sentiment: 'bad',
  },
} as const satisfies Record<string, { name: string; sentiment: Sentiment }>

export type DaRelayerFailureRisk = keyof typeof DaRelayerFailureRisk
