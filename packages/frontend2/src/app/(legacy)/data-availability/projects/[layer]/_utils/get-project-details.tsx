import { type ProjectDetailsSection } from '~/app/_components/projects/sections/types'
import { type DaProjectEntry } from '~/server/features/data-availability/get-da-project-entry'

export function getProjectDetails(project: DaProjectEntry) {
  const items: ProjectDetailsSection[] = []

  items.push({
    type: 'RiskAnalysisSection',
    props: {
      id: 'risk-analysis',
      title: 'Risk analysis',
      riskValues: project.risks,
      // TODO: Do we want to add these to DA projects?
      warning: undefined,
      redWarning: undefined,
      isVerified: undefined,
      isUnderReview: false,
    },
  })

  items.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-layer-technology',
      title: 'DA Layer technology',
      children: '## Some text\n### Next line',
    },
  })

  items.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-bridge-technology',
      title: 'DA Bridge technology',
      children: '## Some text\n### Next line',
    },
  })

  return items
}
