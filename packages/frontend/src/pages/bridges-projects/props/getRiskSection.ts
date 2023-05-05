import { Bridge, CONTRACTS, ProjectRisk } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/shared'

import { RiskSectionProps } from '../../../components/project/RiskSection'
import { groupRisks } from '../../../utils/project/groupRisks'

export function getRiskSection(
  project: Bridge,
  verificationStatus: VerificationStatus,
): RiskSectionProps {
  const sections = [
    {
      id: 'principle-of-operation',
      value: project.technology.principleOfOperation,
    },
    { id: 'validation', value: project.technology.validation },
    { id: 'destination-token', value: project.technology.destinationToken },
  ]

  const risks: (ProjectRisk & { referencedId: string })[] = []
  for (const { id, value } of sections) {
    if (value) {
      risks.push(...value.risks.map((x) => ({ ...x, referencedId: id })))
    }
  }
  for (const risk of project.contracts?.risks ?? []) {
    risks.push({ ...risk, referencedId: 'contracts' })
  }
  // Explicit comparison to false because project might not exists in verification map at all.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
  if (verificationStatus.projects[project.id.toString()] === false) {
    if (!risks.find((r) => r.text === CONTRACTS.UNVERIFIED_RISK.text)) {
      risks.push({ ...CONTRACTS.UNVERIFIED_RISK, referencedId: 'contracts' })
    }
  }

  return { id: 'risks', title: 'Risk summary', riskGroups: groupRisks(risks) }
}
