import { Bridge } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'

import { TechnologySectionProps } from '../../../../components/project/TechnologySection'
import { makeTechnologyChoice } from '../../../../utils/project/makeTechnologyChoice'

export function getTechnologyOverview(
  project: Bridge,
): Omit<TechnologySectionProps, 'sectionOrder'>[] {
  const technology: Omit<TechnologySectionProps, 'sectionOrder'> = {
    id: 'technology',
    title: 'Technology',
    isUnderReview: project.isUnderReview ?? project.technology.isUnderReview,
    items: [
      project.technology.principleOfOperation &&
        makeTechnologyChoice(
          'principle-of-operation',
          project.technology.principleOfOperation,
        ),
      project.technology.validation &&
        makeTechnologyChoice('validation', project.technology.validation),
      project.technology.destinationToken &&
        makeTechnologyChoice(
          'destination-token',
          project.technology.destinationToken,
        ),
    ].filter(notUndefined),
  }
  const filtered = [technology].filter((x) => x.items.length > 0)

  return filtered.map((section) => {
    if (section.items.every((item) => item.isUnderReview)) {
      return { ...section, isUnderReview: true }
    }
    return section
  })
}
