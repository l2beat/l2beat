import type { Layer2, Layer3 } from '@l2beat/config'
import type { DiagramType } from '../get-diagram-params'

export function getSequencingSection(project: Layer2 | Layer3) {
  if (!project.technology.sequencing) return undefined
  return {
    name: project.technology.sequencing.name,
    diagram: {
      type: 'sequencing' as DiagramType,
      slug: project.display.sequencingImage ?? project.display.slug,
    },
    content: project.technology.sequencing.description,
    isUnderReview: project.isUnderReview,
    risks: project.technology.sequencing.risks.map((r) => ({
      text: `${r.category} ${r.text}`,
      isCritical: !!r.isCritical,
    })),
    references: project.technology.sequencing.references,
  }
}
