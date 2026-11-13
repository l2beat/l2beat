import mapValues from 'lodash/mapValues'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { PRIVACY_ADVERSARIES_SECTION_ID } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import { ADVICE } from '~/pages/privacy/adviceUi'
import { ANONYMITY_SET_WINDOW_DAYS } from '~/server/features/privacy/anonymity-set/calculateAnonymitySets'
import { manifest } from '~/utils/Manifest'
import { getTrustedSetupsSectionFromTrustedSetups } from '~/utils/project/getTrustedSetupsSection'
import { optionToRange } from '~/utils/range/range'
import type { PrivacyProjectDetails } from '../getPrivacyProjectDetails'
import { getPrivacyReferenceApp } from '../utils/getPrivacyReferenceApp'
import { resolvePrivacySources } from '../utils/resolvePrivacySources'

// The sections only a privacy protocol has, each declared here once. A page
// lists the ones it shows: the privacy page all of them, the page of a scaling
// project that is also a privacy protocol the ones its own sections lack.

type Section<Type extends ProjectDetailsSection['type']> = Extract<
  ProjectDetailsSection,
  { type: Type }
>

export function getPrivacyDescriptionSection(
  details: PrivacyProjectDetails,
): Section<'DetailedDescriptionSection'> | undefined {
  if (!details.detailedDescription) return undefined
  return {
    type: 'DetailedDescriptionSection',
    props: {
      id: 'detailed-description',
      title: 'Protocol description',
      description: undefined,
      detailedDescription: details.detailedDescription,
    },
  }
}

/**
 * Its sources name sections of the page, which `linkPrivacySources` turns
 * into links once the page has all of them.
 */
export function getPrivacyAdversariesSection(
  details: PrivacyProjectDetails,
): Section<'PrivacyAdversariesSection'> {
  return {
    type: 'PrivacyAdversariesSection',
    props: {
      id: PRIVACY_ADVERSARIES_SECTION_ID,
      title: 'Privacy',
      isUnderReview: !!details.statuses.reviewStatus,
      adversaries: details.adversaries,
      referenceApp: getReferenceApp(details),
    },
  }
}

/**
 * Points the adversaries' sources at the sections the page has, so that no
 * link is dead. Run it last, and again after adding or removing a section.
 */
export function linkPrivacySources(
  sections: ProjectDetailsSection[],
  details: PrivacyProjectDetails,
): ProjectDetailsSection[] {
  const adversaries = resolvePrivacySources(details.adversaries, sections)
  return sections.map((section) =>
    section.type === 'PrivacyAdversariesSection'
      ? { ...section, props: { ...section.props, adversaries } }
      : section,
  )
}

/** Our advice for the reference app, when a step changes what an adversary learns. */
export function getPrivacyAdviceSection(
  details: PrivacyProjectDetails,
): Section<'PrivacyAdviceSection'> | undefined {
  const advice = details.adversaries.advice
  if (!advice) return undefined
  return {
    type: 'PrivacyAdviceSection',
    props: {
      id: ADVICE.sectionId,
      title: ADVICE.title,
      steps: advice,
      adversaries: details.adversaries.adversaries,
      sentiments: mapValues(
        details.adversaries.cells,
        (cell) => cell.sentiment,
      ),
      waitWindowDays: ANONYMITY_SET_WINDOW_DAYS,
    },
  }
}

export function getPrivacyAnonymitySetSection(
  details: PrivacyProjectDetails,
): Section<'PrivacyAnonymitySetSection'> | undefined {
  if (details.anonymitySetType === undefined) return undefined
  return {
    type: 'PrivacyAnonymitySetSection',
    props: {
      id: 'privacy-anonymity-set',
      title: 'Anonymity sets',
      defaultRange: optionToRange('1y'),
      project: getChartProject(details),
      milestones: details.milestones,
      anonymitySetType: details.anonymitySetType,
    },
  }
}

export function getPrivacyFlowsSection(
  details: PrivacyProjectDetails,
): Section<'PrivacyFlowsSection'> | undefined {
  if (details.assets.length === 0) return undefined
  return {
    type: 'PrivacyFlowsSection',
    props: {
      id: 'privacy-flows',
      title: 'Flows',
      defaultRange: optionToRange('1y'),
      project: getChartProject(details),
      milestones: details.milestones,
    },
  }
}

export function getPrivacyAssetsBreakdownSection(
  details: PrivacyProjectDetails,
): Section<'PrivacyAssetsBreakdownSection'> | undefined {
  if (details.assets.length === 0) return undefined
  return {
    type: 'PrivacyAssetsBreakdownSection',
    props: {
      id: 'privacy-assets-breakdown',
      title: 'Assets Breakdown',
      assets: details.assets,
      showTvl: details.hasTvl,
    },
  }
}

export function getPrivacyTrustedSetupsSection(
  details: PrivacyProjectDetails,
): Section<'TrustedSetupSection'> | undefined {
  if (details.trustedSetups.length === 0) return undefined
  return {
    type: 'TrustedSetupSection',
    props: {
      id: 'trusted-setups',
      title: 'Trusted setup',
      ...getTrustedSetupsSectionFromTrustedSetups(details.trustedSetups),
    },
  }
}

export function getChartProject(details: PrivacyProjectDetails) {
  return {
    id: details.id,
    name: details.name,
    shortName: details.shortName,
    iconUrl: manifest.getUrl(`/icons/${details.slug}.png`),
  }
}

export function getReferenceApp(details: PrivacyProjectDetails) {
  return (
    details.referenceApp &&
    getPrivacyReferenceApp(
      details.referenceApp,
      manifest.getUrl(`/icons/${details.slug}.png`),
    )
  )
}
