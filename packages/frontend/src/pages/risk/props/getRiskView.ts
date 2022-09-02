import { Project } from '@l2beat/config'

import { RiskViewEntry, RiskViewProps } from '../view/RiskView'

export function getRiskView(projects: Project[]): RiskViewProps {
  return { items: projects.map(getRiskViewEntry) }
}

export function getRiskViewEntry(project: Project): RiskViewEntry {
  return {
    name: project.name,
    slug: project.slug,
    provider: project.details.provider,
    ...project.details.riskView,
  }
}
