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
    description: `The DA bridge does not have a Security Council or a governance mechanism to propose new relayers. In case of relayer failure, the DA bridge will halt and be unable to recover without the intervention of a centralized entity.`,
  },
  NoBridge: {
    type: 'NoBridge',
    value: 'N/A',
    sentiment: 'bad',
    description:
      "The relayer does not contribute to the DA bridge liveness since data availability attestations are not integrated in the scaling solution's proof system.",
  },
} as const satisfies DaRiskViewOptions

export type DaRelayerFailureRisk =
  (typeof DaRelayerFailureRisk)[keyof typeof DaRelayerFailureRisk]
