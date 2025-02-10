import type { Project, ScalingProjectRisk } from '@l2beat/config'
import type { DaRiskSummarySectionProps } from '~/components/projects/sections/da-risk-summary-section'
import type { ProjectSectionProps } from '~/components/projects/sections/types'
import { groupRisks } from '~/utils/project/risk-summary/group-risks'

export function getDaProjectRiskSummarySection(
  layer: Project<'daLayer'>,
  bridge: Project<'daBridge', 'contracts'> | undefined,
  isVerified: boolean,
): Omit<DaRiskSummarySectionProps, keyof ProjectSectionProps> {
  const bridgeSections = [
    {
      id: 'da-bridge-contracts',
      value: bridge?.contracts ?? { risks: [] },
    },
    {
      id: 'da-bridge-technology',
      value: bridge?.daBridge.technology,
    },
  ]

  const layerSections = [
    {
      id: 'da-layer-technology',
      value: layer.daLayer.technology,
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
    if (value?.risks) {
      bridgeRisks.push(...value.risks.map((x) => ({ ...x, referencedId: id })))
    }
  }

  return {
    layer: {
      name: layer.name,
      risks: groupRisks(layerRisks),
    },
    bridge: {
      name: bridge?.name ?? 'No DA Bridge',
      risks: groupRisks(bridgeRisks),
    },
    isVerified,
    warning: undefined,
    redWarning: undefined,
  }
}
