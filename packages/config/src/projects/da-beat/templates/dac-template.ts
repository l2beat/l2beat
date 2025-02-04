import type {
  CustomDa,
  DaBridgeRisks,
  DaLayerRisks,
  DaTechnology,
  DacInfo,
} from '../../../types'
import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaUpgradeabilityRisk,
} from '../common'
import { DaRelayerFailureRisk } from '../common/DaRelayerFailureRisk'

export interface DacTemplateVars {
  name?: string
  type?: string
  dac: DacInfo
  technology: DaTechnology
  risks?: Partial<DaLayerRisks & DaBridgeRisks>
}

export function DAC(template: DacTemplateVars): CustomDa {
  const description =
    template.technology?.description ??
    `
## Simple Committee

The Data Availability Committee (DAC) is a set of trusted parties responsible for storing data off-chain and serving it upon demand. The security guarantees of DACs depend on the specific setup and can vary significantly based on the criteria for selecting committee members, their operational transparency, and the mechanisms in place to handle disputes and failures.

## Simple DA Bridge

The DA bridge is a smart contract verifying a data availability claim from DAC Members via signature verification. The bridge requires a ${template.dac.requiredMembers}/${template.dac.membersCount} threshold of signatures to be met before the data commitment is accepted`

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
  }
}
