import { DA_LAYERS, DaUpgradeabilityRisk } from '../common'
import type { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import type {
  DaBridgeRisks,
  DacInfo,
  DaLayerRisks,
  DaTechnology,
  ProjectCustomDa,
  TableReadyValue,
} from '../types'
import { readMarkdown } from '../utils/readMarkdown'
import { DAC } from './dac-template'

interface TemplateVars {
  dac?: {
    knownMembers?: DacInfo['knownMembers']
  }
  risks?: Partial<DaLayerRisks & DaBridgeRisks>
  fallback?: TableReadyValue
  discovery: ProjectDiscovery
  hostChain: string
}

export function AnytrustDAC(template: TemplateVars): ProjectCustomDa {
  const dac = template.discovery.getContractValue<{
    membersCount: number
    requiredSignatures: number
  }>('SequencerInbox', 'dacKeyset')

  const isL2 = template.hostChain === 'ethereum'
  const diagramType = isL2 ? 'L2' : 'L3'

  const technology: DaTechnology = {
    description: readMarkdown('templates/anytrust/daTechnology.md', {
      membersCount: dac.membersCount,
      diagramType,
    }),
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'a malicious committee attests to an invalid data availability certificate.',
      },
      {
        category: 'Funds can be lost if',
        text: 'the bridge contract or its dependencies receive a malicious code upgrade. There is no delay on code upgrades.',
      },
    ],
    references: [
      {
        title: 'Inside AnyTrust - Arbitrum Docs',
        url: 'https://docs.arbitrum.io/how-arbitrum-works/inside-anytrust',
      },
    ],
  }

  return DAC({
    ...template,
    technology,
    dac: {
      membersCount: dac.membersCount,
      requiredMembers: dac.requiredSignatures,
      knownMembers: template.dac?.knownMembers,
    },
    risks: {
      upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(),
      ...template.risks,
    },
    fallback: DA_LAYERS.ETH_CALLDATA,
  })
}
