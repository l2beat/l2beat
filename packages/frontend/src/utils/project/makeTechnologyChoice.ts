import { ProjectTechnologyChoice } from '@l2beat/config'

import { TechnologyChoice } from '../../components/project/TechnologySection'

export function makeTechnologyChoice(
  id: string,
  item: ProjectTechnologyChoice,
): TechnologyChoice {
  const risks = item.risks.map((risk) => ({
    text: `${risk.category} ${risk.text}`,
    isCritical: !!risk.isCritical,
  }))

  return {
    id,
    name: item.name,
    description: item.description,
    isIncomplete: !!item.isIncomplete,
    isUnderReview: !!item.isUnderReview,
    references: item.references,
    risks,
  }
}
