import {
  type DaBridge,
  type DaLayer,
  type ScalingProjectRisk,
} from '@l2beat/config'
import { type RiskSummarySectionProps } from '~/components/projects/sections/risk-summary-section'
import { type ProjectSectionProps } from '~/components/projects/sections/types'
import { groupRisks } from '~/utils/project/risk-summary/group-risks'

export function getDaProjectRiskSummarySection(
  layer: DaLayer,
  bridge: DaBridge,
  isVerified: boolean,
): Omit<RiskSummarySectionProps, keyof ProjectSectionProps> {
  const sections = [
    {
      id: 'contracts',
      value:
        bridge.type === 'OnChainBridge' || bridge.type === 'DAC'
          ? bridge.contracts
          : { risks: [] },
    },
    {
      id: 'da-layer-technology',
      value: layer.technology,
    },
    {
      id: 'da-bridge-technology',
      value: bridge.technology,
    },
  ]

  const risks: (ScalingProjectRisk & { referencedId: string })[] = []

  for (const { id, value } of sections) {
    if (value.risks) {
      risks.push(...value.risks.map((x) => ({ ...x, referencedId: id })))
    }
  }

  return {
    riskGroups: groupRisks(risks),
    warning: bridge.display.warning,
    isVerified,
    redWarning: undefined,
  }
}
