import { Layer2 } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'

import { TechnologyIncompleteProps } from '../../../../components/project/TechnologyIncomplete'
import {
  getProjectEditLink,
  getTwitterLink,
} from '../../../../utils/project/links'
import { makeTechnologyChoice } from '../../../../utils/project/makeTechnologyChoice'
import { ProjectDetailsTechnologySection } from '../../../types'

interface TechnologyOverview {
  incomplete?: TechnologyIncompleteProps
  sections: ProjectDetailsTechnologySection['props'][]
}

export function getTechnologyOverview(project: Layer2): TechnologyOverview {
  function makeSections() {
    const technology: ProjectDetailsTechnologySection['props'] = {
      id: 'technology',
      title: 'Technology',
      isUnderReview: project.isUnderReview ?? project.technology.isUnderReview,
      items: [
        makeTechnologyChoice(
          'state-correctness',
          project.technology.stateCorrectness,
        ),
        project.technology.newCryptography &&
          makeTechnologyChoice(
            'new-cryptography',
            project.technology.newCryptography,
          ),
        makeTechnologyChoice(
          'data-availability',
          project.technology.dataAvailability,
        ),
      ].filter(notUndefined),
    }

    const operator: ProjectDetailsTechnologySection['props'] = {
      id: 'operator',
      title: 'Operator',
      isUnderReview: project.isUnderReview ?? project.technology.isUnderReview,
      items: [
        makeTechnologyChoice('operator', project.technology.operator),
        makeTechnologyChoice(
          'force-transactions',
          project.technology.forceTransactions,
        ),
      ],
    }

    const withdrawals: ProjectDetailsTechnologySection['props'] = {
      id: 'withdrawals',
      title: 'Withdrawals',
      isUnderReview: project.isUnderReview ?? project.technology.isUnderReview,
      items: [
        ...project.technology.exitMechanisms.map((x, i) =>
          makeTechnologyChoice(`exit-mechanisms-${i + 1}`, x),
        ),
        project.technology.massExit &&
          makeTechnologyChoice('mass-exit', project.technology.massExit),
      ].filter(notUndefined),
    }

    const other: ProjectDetailsTechnologySection['props'] = {
      id: 'other-considerations',
      title: 'Other considerations',
      isUnderReview: project.isUnderReview ?? project.technology.isUnderReview,
      items:
        project.technology.otherConsiderations?.map((x, i) =>
          makeTechnologyChoice(`other-considerations-${i + 1}`, x),
        ) ?? [],
    }

    const filtered = [technology, operator, withdrawals, other].filter(
      (x) => x.items.length > 0,
    )

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
  const isIncomplete = sections.some((x) => x.items.some((x) => x.isIncomplete))

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
