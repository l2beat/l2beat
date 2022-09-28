import { Layer2 } from '@l2beat/config'

import { TechnologyIncompleteProps } from '../../../components/project/TechnologyIncomplete'
import { TechnologySectionProps } from '../../../components/project/TechnologySection'
import { getTwitterLink } from '../../../utils/project/getTwitterLink'
import { makeTechnologyChoice } from '../../../utils/project/makeTechnologyChoice'
import { getEditLink } from './links'

interface TechnologyOverview {
  incomplete?: TechnologyIncompleteProps
  sections: TechnologySectionProps[]
}

export function getTechnologyOverview(project: Layer2): TechnologyOverview {
  function makeSections() {
    const technology: TechnologySectionProps = {
      id: 'technology',
      title: 'Technology',
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
      ].filter(noUndefined),
    }

    const operator: TechnologySectionProps = {
      id: 'operator',
      title: 'Operator',
      items: [
        makeTechnologyChoice('operator', project.technology.operator),
        makeTechnologyChoice(
          'force-transactions',
          project.technology.forceTransactions,
        ),
      ],
    }

    const withdrawals: TechnologySectionProps = {
      id: 'withdrawals',
      title: 'Withdrawals',
      items: [
        ...project.technology.exitMechanisms.map((x, i) =>
          makeTechnologyChoice(`exit-mechanisms-${i + 1}`, x),
        ),
        project.technology.massExit &&
          makeTechnologyChoice('mass-exit', project.technology.massExit),
      ].filter(noUndefined),
    }

    const other: TechnologySectionProps = {
      id: 'other-considerations',
      title: 'Other considerations',
      items: [
        project.technology.additionalPrivacy &&
          makeTechnologyChoice(
            'additional-privacy',
            project.technology.additionalPrivacy,
          ),
        project.technology.smartContracts &&
          makeTechnologyChoice(
            'smart-contracts',
            project.technology.smartContracts,
          ),
      ].filter(noUndefined),
    }

    return [technology, operator, withdrawals, other].filter(
      (x) => x.items.length > 0,
    )
  }

  const sections = makeSections()
  const isIncomplete = sections.some((x) => x.items.some((x) => x.isIncomplete))

  const incomplete = isIncomplete
    ? {
        editLink: getEditLink(project),
        twitterLink: getTwitterLink(project),
      }
    : undefined

  return {
    incomplete,
    sections,
  }
}

function noUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}
