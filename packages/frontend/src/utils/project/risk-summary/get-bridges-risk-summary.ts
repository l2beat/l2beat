import type { Project, ScalingProjectRisk } from '@l2beat/config'
import type { RiskSummarySectionProps } from '../../../components/projects/sections/risk-summary-section'
import type { ProjectSectionProps } from '../../../components/projects/sections/types'
import { groupRisks } from './group-risks'

export function getBridgesRiskSummarySection(
  project: Project<'statuses' | 'bridgeTechnology', 'contracts'>,
  isVerified: boolean,
): Omit<RiskSummarySectionProps, keyof ProjectSectionProps> {
  const sections = [
    {
      id: 'principle-of-operation',
      value: project.bridgeTechnology.principleOfOperation,
    },
    { id: 'validation', value: project.bridgeTechnology.validation },
    {
      id: 'destination-token',
      value: project.bridgeTechnology.destinationToken,
    },
  ]

  const risks: (ScalingProjectRisk & { referencedId: string })[] = []
  for (const { id, value } of sections) {
    if (value) {
      risks.push(...value.risks.map((x) => ({ ...x, referencedId: id })))
    }
  }
  for (const risk of project.contracts?.risks ?? []) {
    risks.push({ ...risk, referencedId: 'contracts' })
  }

  return {
    riskGroups: groupRisks(risks),
    warning: project.statuses.yellowWarning,
    isVerified,
    redWarning: undefined,
  }
}
