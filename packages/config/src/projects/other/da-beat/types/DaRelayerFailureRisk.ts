import { formatSeconds } from '@l2beat/shared-pure'
import { DaRiskViewOptions } from './DaRiskView'

export const DaRelayerFailureRisk = {
  SelfPropose: {
    type: 'SelfPropose' as const,
    value: 'Self propose',
    sentiment: 'good' as const,
    description: `Anyone can relay data availability commitments to the DA bridge. In case of current relayer failure, users can collect attestations from committee members and propose new data availability commitments to the DA bridge.`,
  },
  Whitelist: {
    type: 'Whitelist' as const,
    value: 'Whitelist',
    sentiment: 'warning' as const,
  },
  Governance: (delaySeconds: number) => ({
    type: 'Governance' as const,
    value: 'Governance',
    sentiment: 'warning' as const,
    description: `The DA bridge has a Security Council or a governance mechanism to propose new relayers. In case of relayer failure, the DA bridge liveness can be restored by proposing a new relayer after a delay of ${formatSeconds(delaySeconds)} via governance upgrade, or through a Security Council without delay.`,
  }),
  NoMechanism: {
    type: 'NoMechanism' as const,
    value: 'No mechanism',
    sentiment: 'bad' as const,
    description: `The DA bridge does not have a Security Council or a governance mechanism to propose new relayers. In case of relayer failure, the DA bridge will halt and be unable to recover without the intervention of a centralized entity.`,
  },
  NoBridge: {
    type: 'NoBridge' as const,
    value: 'N/A',
    sentiment: 'bad' as const,
    description:
      "The relayer does not contribute to the DA bridge liveness since data availability attestations are not integrated in the scaling solution's proof system.",
  },
} as const satisfies DaRiskViewOptions

export type DaRelayerFailureRisk =
  | (typeof DaRelayerFailureRisk)['SelfPropose']
  | (typeof DaRelayerFailureRisk)['Whitelist']
  | ReturnType<(typeof DaRelayerFailureRisk)['Governance']>
  | (typeof DaRelayerFailureRisk)['NoMechanism']
  | (typeof DaRelayerFailureRisk)['NoBridge']
