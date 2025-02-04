import type { Bridge, ScalingProjectRisk } from '@l2beat/config'
import { CONTRACTS } from '@l2beat/config'
import type { RiskSummarySectionProps } from '../../../components/projects/sections/risk-summary-section'
import type { ProjectSectionProps } from '../../../components/projects/sections/types'
import { groupRisks } from './group-risks'

export function getBridgesRiskSummarySection(
  project: Bridge,
  isVerified: boolean,
): Omit<RiskSummarySectionProps, keyof ProjectSectionProps> {
  const sections = [
    {
      id: 'principle-of-operation',
      value: project.technology.principleOfOperation,
    },
    { id: 'validation', value: project.technology.validation },
    { id: 'destination-token', value: project.technology.destinationToken },
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
  // Explicit comparison to false because project might not exists in verification map at all.
  if (!isVerified) {
    if (!risks.find((r) => r.text === CONTRACTS.UNVERIFIED_RISK.text)) {
      risks.push({ ...CONTRACTS.UNVERIFIED_RISK, referencedId: 'contracts' })
    }
  }

  return {
    riskGroups: groupRisks(risks),
    warning: project.display.warning,
    isVerified,
    redWarning: undefined,
  }
}
