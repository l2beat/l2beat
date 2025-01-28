import { formatSeconds } from '@l2beat/shared-pure'
import type { DaRisk } from '../types'

const SelfPropose: DaRisk = {
  type: 'SelfPropose',
  value: 'Self propose',
  sentiment: 'good',
  description:
    'Anyone can relay data availability commitments to the DA bridge. In case of current relayer failure, users can collect attestations from committee members and propose new data availability commitments to the DA bridge.',
}

const Whitelist: DaRisk = {
  type: 'Whitelist',
  value: 'Whitelist',
  sentiment: 'warning',
  description: '',
}

const NoMechanism: DaRisk = {
  type: 'NoMechanism',
  value: 'No mechanism',
  sentiment: 'bad',
  description:
    'The relayer role is permissioned, and the DA bridge does not have a Security Council or a governance mechanism to propose new relayers. In case of relayer failure, the DA bridge will halt and be unable to recover without the intervention of a centralized entity.',
}

const NoBridge: DaRisk = {
  type: 'NoBridge',
  value: 'N/A',
  sentiment: 'bad',
  description:
    "The relayer does not contribute to the DA bridge liveness since data availability attestations are not integrated in the scaling solution's proof system.",
}

function Governance(delaySeconds: number): DaRisk {
  return {
    type: 'Governance',
    value: 'Governance',
    sentiment: 'warning',
    description: `The relayer role is permissioned, but the DA bridge has a Security Council or a governance mechanism to propose new relayers. In case of relayer failure, the DA bridge liveness can be restored by proposing a new relayer after a delay of ${formatSeconds(delaySeconds)} via governance upgrade, or through a Security Council without delay.`,
  }
}

export const DaRelayerFailureRisk = {
  SelfPropose,
  Whitelist,
  Governance,
  NoMechanism,
  NoBridge,
}
