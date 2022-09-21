import { Layer2 } from '@l2beat/config'

import { RiskViewEntry, RiskViewProps } from '../view/RiskView'

export function getRiskView(projects: Layer2[]): RiskViewProps {
  return { items: projects.map(getRiskViewEntry) }
}

export function getRiskViewEntry(project: Layer2): RiskViewEntry {
  return {
    name: project.name,
    slug: project.slug,
    provider: project.details.provider,
    ...project.details.riskView,
  }
}
