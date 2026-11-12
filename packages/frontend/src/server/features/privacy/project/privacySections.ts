import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { PRIVACY_ADVERSARIES_SECTION_ID } from '~/pages/privacy/adversaries/privacyAdversaryUi'
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
 * Takes the page's other sections, so that its source links point only at
 * sections the page renders.
 */
export function getPrivacyAdversariesSection(
  details: PrivacyProjectDetails,
  pageSections: ProjectDetailsSection[],
): Section<'PrivacyAdversariesSection'> {
  return {
    type: 'PrivacyAdversariesSection',
    props: {
      id: PRIVACY_ADVERSARIES_SECTION_ID,
      title: 'Privacy',
      isUnderReview: !!details.statuses.reviewStatus,
      adversaries: resolvePrivacySources(details.adversaries, pageSections),
      referenceApp: getReferenceApp(details),
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
