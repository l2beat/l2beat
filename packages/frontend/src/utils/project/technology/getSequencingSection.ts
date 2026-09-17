import type { Project } from '@l2beat/config'
import { getDiagramParams } from '../getDiagramParams'
import { prepareInclusionDelay } from './inclusion-delay/calculateInclusionDelay'

export function getSequencingSection(
  project: Project<'statuses' | 'scalingTechnology'>,
) {
  const sequencing = project.scalingTechnology.sequencing
  if (!sequencing) return undefined
  const sequencerSetSpec =
    sequencing.sequencingSpec?.type === 'sequencer-set'
      ? sequencing.sequencingSpec
      : undefined
  const chart = sequencerSetSpec?.inclusionDelayChart
  return {
    projectName: project.name,
    name: sequencing.name,
    diagram: getDiagramParams(
      'sequencing',
      project.scalingTechnology.sequencingImage ?? project.slug,
    ),
    content: sequencing.description,
    sequencingSpec: sequencing.sequencingSpec,
    inclusionDelay: chart ? prepareInclusionDelay(chart) : undefined,
    inclusionDelayChartDescription:
      sequencerSetSpec?.inclusionDelayChartDescription,
    censorshipResistance: sequencing.censorshipResistance,
    isUnderReview: !!project.statuses.reviewStatus,
    risks: sequencing.risks.map((r) => ({
      text: `${r.category} ${r.text}`,
      isCritical: !!r.isCritical,
    })),
    references: sequencing.references,
  }
}
