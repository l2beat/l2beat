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
    type: 'RiskAnalysisSection2',
    props: {
      id: 'risk-analysis2',
      title: 'Risk analysis 2',
      riskValues: project.risks,
      // TODO: Do we want to add these to DA projects?
      warning: undefined,
      redWarning: undefined,
      isVerified: undefined,
      isUnderReview: false,
    },
  })

  return items
}
