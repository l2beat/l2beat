import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
} from '../common'
import type {
  DaBridgeRisks,
  DacInfo,
  DaLayerRisks,
  DaTechnology,
  ProjectCustomDa,
  TableReadyValue,
} from '../types'
import { readMarkdown } from '../utils/readMarkdown'

export interface DacTemplateVars {
  name?: string
  type?: string
  dac: DacInfo
  technology: DaTechnology
  risks?: Partial<DaLayerRisks & DaBridgeRisks>
  fallback?: TableReadyValue
}

export function DAC(template: DacTemplateVars): ProjectCustomDa {
  const description =
    template.technology?.description ??
    readMarkdown('templates/dac/description.md', {
      requiredMembers: template.dac.requiredMembers,
      membersCount: template.dac.membersCount,
    })

  return {
    name: template.name,
    type: template.type ?? 'Data Availability Committee',
    description:
      'Set of parties responsible for signing and attesting to the availability of data.',
    dac: template.dac,
    technology: {
      ...template.technology,
      description: description,
    },
    risks: {
      committeeSecurity: DaCommitteeSecurityRisk.AutoDAC({
        requiredMembers: template.dac.requiredMembers,
        membersCount: template.dac.membersCount,
        knownMembers: template.dac.knownMembers,
      }),
      upgradeability: DaUpgradeabilityRisk.Immutable,
      relayerFailure: DaRelayerFailureRisk.NoMechanism,
      economicSecurity: DaEconomicSecurityRisk.Unknown,
      fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
      ...template.risks,
    },
    fallback: template.fallback,
  }
}
