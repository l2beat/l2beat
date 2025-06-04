import type { Project, ProjectRisk } from '@l2beat/config'
import type { DaRiskSummarySectionProps } from '~/components/projects/sections/DaRiskSummarySection'
import type { ProjectSectionProps } from '~/components/projects/sections/types'
import { groupRisks } from '~/utils/project/risk-summary/groupRisks'

export function getDaProjectRiskSummarySection(
  layer: Project<'daLayer'>,
  bridge: Project<'daBridge', 'contracts' | 'permissions'> | undefined,
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

  const layerRisks: (ProjectRisk & { referencedId: string })[] = []

  for (const { id, value } of layerSections) {
    if (value.risks) {
      layerRisks.push(...value.risks.map((x) => ({ ...x, referencedId: id })))
    }
  }

  const bridgeRisks: (ProjectRisk & { referencedId: string })[] = []

  for (const { id, value } of bridgeSections) {
    if (value?.risks) {
      bridgeRisks.push(...value.risks.map((x) => ({ ...x, referencedId: id })))
    }
  }

  const areContractsNotVerified = Object.values(
    bridge?.contracts?.addresses ?? {},
  )
    .flat()
    .some((c) => !c.isVerified)

  const arePermissionsNotVerified = Object.values(bridge?.permissions ?? {})
    .flat()
    .flatMap((p) => [...(p.roles ?? []), ...(p.actors ?? [])])
    .flatMap((p) => p.accounts)
    .some((a) => !a.isVerified)

  return {
    layer: {
      name: layer.name,
      risks: groupRisks(layerRisks),
    },
    bridge: {
      name: bridge?.name ?? 'No DA Bridge',
      risks: groupRisks(bridgeRisks),
      isVerified: !arePermissionsNotVerified && !areContractsNotVerified,
    },
    isVerified,
    warning: undefined,
    redWarning: undefined,
  }
}
