import type { Project } from '@l2beat/config'
import { getDiagramParams } from '../getDiagramParams'
import { prepareInclusionDelay } from './inclusion-delay/calculateInclusionDelay'

export function getSequencingSection(
  project: Project<'statuses' | 'scalingTechnology'>,
) {
  const sequencing = project.scalingTechnology.sequencing
  if (!sequencing) return undefined
  return {
    projectName: project.name,
    name: sequencing.name,
    diagram: getDiagramParams(
      'sequencing',
      project.scalingTechnology.sequencingImage ?? project.slug,
    ),
    content: sequencing.description,
    sequencerSetSpec: sequencing.sequencerSetSpec,
    inclusionDelay: sequencing.inclusionDelayChart
      ? prepareInclusionDelay(sequencing.inclusionDelayChart)
      : undefined,
    inclusionDelayChartDescription: sequencing.inclusionDelayChartDescription,
    censorshipResistance: sequencing.censorshipResistance,
    isUnderReview: !!project.statuses.reviewStatus,
    risks: sequencing.risks.map((r) => ({
      text: `${r.category} ${r.text}`,
      isCritical: !!r.isCritical,
    })),
    references: sequencing.references,
  }
}
