import { ScalingProjectTechnologyChoice } from '@l2beat/config'

import { TechnologyChoice } from '../../pages/project/components/sections/TechnologySection'

export function makeTechnologyChoice(
  id: string,
  item: ScalingProjectTechnologyChoice,
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
