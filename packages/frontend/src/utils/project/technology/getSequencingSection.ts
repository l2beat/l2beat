import type { Project } from '@l2beat/config'
import { getDiagramParams } from '../getDiagramParams'

export function getSequencingSection(
  project: Project<'statuses' | 'scalingTechnology'>,
) {
  if (!project.scalingTechnology.sequencing) return undefined
  return {
    name: project.scalingTechnology.sequencing.name,
    diagram: getDiagramParams(
      'sequencing',
      project.scalingTechnology.sequencingImage ?? project.slug,
    ),
    content: project.scalingTechnology.sequencing.description,
    isUnderReview: !!project.statuses.reviewStatus,
    risks: project.scalingTechnology.sequencing.risks.map((r) => ({
      text: `${r.category} ${r.text}`,
      isCritical: !!r.isCritical,
    })),
    references: project.scalingTechnology.sequencing.references,
  }
}
