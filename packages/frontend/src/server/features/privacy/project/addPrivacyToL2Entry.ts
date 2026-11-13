import compact from 'lodash/compact'
import type { RiskGroup } from '~/components/projects/sections/RiskSummarySection'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { ProjectL2Entry } from '~/server/features/layer2s/project/getL2ProjectEntry'
import { mergeRiskGroups } from '~/server/features/projects/mergeRiskGroups'
import {
  insertSectionsBefore,
  withSectionAlias,
} from '~/utils/project/editSections'
import type { PrivacyProjectDetails } from '../getPrivacyProjectDetails'
import { parsePrivacyRiskSummary } from '../utils/parsePrivacyRiskSummary'
import {
  getPrivacyAdversariesSection,
  getPrivacyAdviceSection,
  getPrivacyAnonymitySetSection,
  getPrivacyAssetsBreakdownSection,
  getPrivacyDescriptionSection,
  getPrivacyFlowsSection,
  getPrivacyTrustedSetupsSection,
  linkPrivacySources,
} from './privacySections'

/**
 * The page of a scaling project that is also a privacy protocol: the scaling
 * page, with what only the privacy page has.
 *
 * - The privacy sections go between the risk summary and the risk analysis.
 * - The page has one description: the scaling one if it has one.
 * - The page has one value section: the privacy page's Value Locked has the
 *   same TVS config, so links to it land on Value Secured.
 * - The privacy page's hand-written risks join the generated risk summary.
 */
export function addPrivacyToL2Entry(
  entry: ProjectL2Entry,
  privacy: PrivacyProjectDetails,
): ProjectL2Entry {
  const hasOwnDescription = entry.sections.some(
    (section) => section.props.id === 'detailed-description',
  )
  const privacySections = compact([
    !hasOwnDescription && getPrivacyDescriptionSection(privacy),
    getPrivacyAdversariesSection(privacy),
    getPrivacyAdviceSection(privacy),
    getPrivacyAnonymitySetSection(privacy),
    getPrivacyFlowsSection(privacy),
    getPrivacyAssetsBreakdownSection(privacy),
    getPrivacyTrustedSetupsSection(privacy),
  ])
  const hasDescription = hasOwnDescription || !!privacy.detailedDescription

  let sections = withSectionAlias(entry.sections, 'tvs', 'privacy-tvl')
  if (privacy.riskSummary) {
    sections = withRiskGroups(
      sections,
      parsePrivacyRiskSummary(privacy.riskSummary, { hasDescription }),
      entry,
    )
  }
  sections = insertSectionsBefore(sections, ['risk-analysis'], privacySections)
  return { ...entry, sections: linkPrivacySources(sections, privacy) }
}

function withRiskGroups(
  sections: ProjectDetailsSection[],
  groups: Omit<RiskGroup, 'start'>[],
  entry: ProjectL2Entry,
): ProjectDetailsSection[] {
  if (sections.some((section) => section.type === 'RiskSummarySection')) {
    return sections.map((section) =>
      section.type === 'RiskSummarySection'
        ? {
            ...section,
            props: {
              ...section.props,
              riskGroups: mergeRiskGroups(section.props.riskGroups, groups),
            },
          }
        : section,
    )
  }
  // The scaling page has a risk summary only when it has risks of its own.
  return insertSectionsBefore(
    sections,
    ['risk-analysis'],
    [
      {
        type: 'RiskSummarySection',
        props: {
          id: 'risk-summary',
          title: 'Risk summary',
          riskGroups: mergeRiskGroups([], groups),
          warning: undefined,
          redWarning: undefined,
          verificationWarnings: {
            programHashes: undefined,
            programHashesDescription: undefined,
          },
          unverifiedContracts: [],
          isUnderReview: !!entry.underReviewStatus,
        },
      },
    ],
  )
}
