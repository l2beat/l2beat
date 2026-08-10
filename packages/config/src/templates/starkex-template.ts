import { assert } from '@l2beat/shared-pure'
import { DaRelayerFailureRisk, DaUpgradeabilityRisk } from '../common'
import type { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { type CommitteeResult, getCommittee } from '../discovery/starkware'
import type {
  DaBridgeRisks,
  DacInfo,
  DaLayerRisks,
  DaTechnology,
  ProjectCustomDa,
} from '../types'
import { readMarkdown } from '../utils/readMarkdown'
import { DAC } from './dac-template'

interface TemplateVars {
  dac?: Partial<DacInfo>
  risks?: Partial<DaLayerRisks & DaBridgeRisks>
  discovery?: ProjectDiscovery
}

export function StarkexDAC(template: TemplateVars): ProjectCustomDa {
  const { committeePermission, minSigners }: Partial<CommitteeResult> =
    template.discovery ? getCommittee(template.discovery) : {}

  const membersCount =
    committeePermission?.accounts.length ?? template.dac?.membersCount
  const requiredMembers = minSigners ?? template.dac?.requiredMembers

  assert(
    membersCount,
    'Members count is required, provide either discovery or dac.membersCount',
  )
  assert(
    requiredMembers,
    'Required members is required, provide either discovery or dac.requiredMembers',
  )

  const technology: DaTechnology = {
    description: readMarkdown('templates/starkex/daTechnology.md'),
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'a malicious committee signs a data availability attestation for an unavailable transaction batch.',
      },
    ],
    references: [
      {
        title: 'StarkEx Committee Service - Source Code',
        url: 'https://github.com/starkware-libs/starkex-data-availability-committee',
      },
    ],
  }

  return DAC({
    ...template,
    technology,
    dac: {
      membersCount: membersCount,
      requiredMembers: requiredMembers,
    },
    risks: {
      upgradeability: DaUpgradeabilityRisk.ImmutableNoSecurity,
      relayerFailure: DaRelayerFailureRisk.SelfPropose,
      ...template.risks,
    },
  })
}
