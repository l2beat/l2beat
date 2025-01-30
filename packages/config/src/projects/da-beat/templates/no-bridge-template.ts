import type { UnixTime } from '@l2beat/shared-pure'
import type { DaBridge, DaBridgeRisks } from '../../../types'
import { DaCommitteeSecurityRisk, DaUpgradeabilityRisk } from '../common'
import { DaRelayerFailureRisk } from '../common/DaRelayerFailureRisk'
import { linkByDA } from '../utils/link-by-da'

export interface TemplateVars {
  /** DA layer name to automatically match projects with */
  layer: string
  addedAt: UnixTime
  risks?: Partial<DaBridgeRisks>
  usedIn?: DaBridge['usedIn']
  description?: string
  technology?: DaBridge['technology']
  otherConsiderations?: DaBridge['otherConsiderations']
}

export function NO_BRIDGE(template: TemplateVars): DaBridge {
  const type = 'NoBridge'
  const description =
    template.description ??
    'This project does not have a DA bridge on Ethereum.'

  const technology = {
    description:
      template.technology?.description ?? 'There is no DA bridge on Ethereum.',
    risks: template.technology?.risks,
  }

  const usedIn =
    template.usedIn ??
    linkByDA({
      layer: (layer) => layer === template.layer,
      bridge: (bridge) => bridge === 'None',
    })

  const risks: DaBridgeRisks = {
    committeeSecurity: DaCommitteeSecurityRisk.NoBridge,
    upgradeability: DaUpgradeabilityRisk.NoBridge,
    relayerFailure: DaRelayerFailureRisk.NoBridge,
    ...template.risks,
  }

  return {
    type,
    addedAt: template.addedAt,
    display: {
      name: 'No bridge',
      slug: `no-bridge`,
      description,
    },
    risks,
    technology,
    usedIn,
    otherConsiderations: template.otherConsiderations,
  }
}
