import type { Project, ProjectRiskView } from '@l2beat/config'
import type { RosetteValueTuple } from '~/components/rosette/individual/IndividualRosetteIcon'

export interface Layer2sRosette {
  self: RosetteValueTuple
  host?: RosetteValueTuple
  stacked?: RosetteValueTuple
}

interface SectionsInfo {
  hasStateValidationSection: boolean
  hasDataAvailabilitySection: boolean
  hasWithdrawalsSection: boolean
  hasSequencingSection: boolean
  hasOperatorsSection: boolean
}

export function getLayer2sRosette(
  project: Project<'scalingRisks'>,
  sectionsInfo: SectionsInfo,
) {
  return {
    self: getLayer2sRosetteValues(
      project.scalingRisks.self,
      sectionsInfo,
      project.slug,
    ),
    host: project.scalingRisks.host
      ? getLayer2sRosetteValues(
          project.scalingRisks.host,
          sectionsInfo,
          project.slug,
        )
      : undefined,
    stacked: project.scalingRisks.stacked
      ? getLayer2sRosetteValues(
          project.scalingRisks.stacked,
          sectionsInfo,
          project.slug,
        )
      : undefined,
  }
}

function getLayer2sRosetteValues(
  risks: ProjectRiskView,
  sectionsInfo: SectionsInfo,
  projectSlug: string,
): RosetteValueTuple {
  const baseUrl = `/layer2s/projects/${projectSlug}`
  const fallbackHref = `${baseUrl}#risk-analysis`
  return [
    {
      name: 'Sequencer failure',
      ...risks.sequencerFailure,
      href: sectionsInfo.hasSequencingSection
        ? `${baseUrl}#sequencing`
        : sectionsInfo.hasOperatorsSection
          ? `${baseUrl}#operator`
          : fallbackHref,
    },
    {
      name: 'State validation',
      ...risks.stateValidation,
      href: sectionsInfo.hasStateValidationSection
        ? `${baseUrl}#state-validation`
        : fallbackHref,
    },
    {
      name: 'Data availability',
      ...risks.dataAvailability,
      href: sectionsInfo.hasDataAvailabilitySection
        ? `${baseUrl}#da-layer`
        : fallbackHref,
    },
    {
      name: 'Exit window',
      ...risks.exitWindow,
      href: sectionsInfo.hasWithdrawalsSection
        ? `${baseUrl}#withdrawals`
        : fallbackHref,
    },
    {
      name: 'Proposer failure',
      ...risks.proposerFailure,
      href: sectionsInfo.hasOperatorsSection
        ? `${baseUrl}#operator`
        : fallbackHref,
    },
  ]
}
