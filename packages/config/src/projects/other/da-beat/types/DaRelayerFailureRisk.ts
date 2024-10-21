import { DaRiskViewOptions } from './DaRiskView'

export const DaRelayerFailureRisk = {
  SelfPropose: {
    type: 'SelfPropose',
    value: 'Self propose',
    sentiment: 'good',
  },
  Whitelist: {
    type: 'Whitelist',
    value: 'Whitelist',
    sentiment: 'warning',
  },
  Governance: {
    type: 'Governance',
    value: 'Governance',
    sentiment: 'warning',
  },
  NoMechanism: {
    type: 'NoMechanism',
    value: 'No mechanism',
    sentiment: 'bad',
  },
  NoBridge: {
    type: 'NoBridge',
    value: 'No bridge',
    sentiment: 'bad',
  },
} as const satisfies DaRiskViewOptions

export type DaRelayerFailureRisk =
  (typeof DaRelayerFailureRisk)[keyof typeof DaRelayerFailureRisk]
