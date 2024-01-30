import { Bridge } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'

import { TechnologyIncompleteProps } from '../../../../components/project/TechnologyIncomplete'
import { TechnologySectionProps } from '../../../../components/project/TechnologySection'
import {
  getProjectEditLink,
  getTwitterLink,
} from '../../../../utils/project/links'
import { makeTechnologyChoice } from '../../../../utils/project/makeTechnologyChoice'

interface TechnologyOverview {
  incomplete?: TechnologyIncompleteProps
  sections: Omit<TechnologySectionProps, 'sectionOrder'>[]
}

export function getTechnologyOverview(project: Bridge): TechnologyOverview {
  function makeSections() {
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
        return {
          ...section,
          isUnderReview: true,
        }
      }
      return section
    })
  }

  const sections = makeSections()
  const isIncomplete =
    !!project.contracts?.isIncomplete ||
    sections[0]?.items.length !== 3 ||
    sections.some((x) => x.items.some((x) => x.isIncomplete))

  const incomplete = isIncomplete
    ? {
        editLink: getProjectEditLink(project),
        twitterLink: getTwitterLink(project),
      }
    : undefined

  return {
    incomplete,
    sections,
  }
}
