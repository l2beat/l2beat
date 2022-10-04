import { Bridge, ProjectRisk } from '@l2beat/config'

import { RiskSectionProps } from '../../../components/project/RiskSection'
import { groupRisks } from '../../../utils/project/groupRisks'

export function getRiskSection(project: Bridge): RiskSectionProps {
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

  return { riskGroups: groupRisks(risks) }
}
