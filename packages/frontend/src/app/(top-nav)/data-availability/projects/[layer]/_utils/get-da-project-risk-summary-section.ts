import type { DaBridge, DaLayer, ScalingProjectRisk } from '@l2beat/config'
import type { DaRiskSummarySectionProps } from '~/components/projects/sections/da-risk-summary-section'
import type { ProjectSectionProps } from '~/components/projects/sections/types'
import { groupRisks } from '~/utils/project/risk-summary/group-risks'

export function getDaProjectRiskSummarySection(
  layer: DaLayer,
  bridge: DaBridge,
  isVerified: boolean,
): Omit<DaRiskSummarySectionProps, keyof ProjectSectionProps> {
  const bridgeSections = [
    {
      id: 'da-bridge-contracts',
      value:
        bridge.type === 'OnChainBridge' || bridge.type === 'StandaloneDacBridge'
          ? bridge.contracts
          : { risks: [] },
    },
    {
      id: 'da-bridge-technology',
      value: bridge.technology,
    },
  ]

  const layerSections = [
    {
      id: 'da-layer-technology',
      value: layer.technology,
    },
  ]

  const layerRisks: (ScalingProjectRisk & { referencedId: string })[] = []

  for (const { id, value } of layerSections) {
    if (value.risks) {
      layerRisks.push(...value.risks.map((x) => ({ ...x, referencedId: id })))
    }
  }

  const bridgeRisks: (ScalingProjectRisk & { referencedId: string })[] = []

  for (const { id, value } of bridgeSections) {
    if (value.risks) {
      bridgeRisks.push(...value.risks.map((x) => ({ ...x, referencedId: id })))
    }
  }

  return {
    layer: {
      name: layer.display.name,
      risks: groupRisks(layerRisks),
    },
    bridge: {
      name: bridge.display.name,
      risks: groupRisks(bridgeRisks),
    },
    warning: bridge.display.warning,
    isVerified,
    redWarning: undefined,
  }
}
