import { Layer2 } from '@l2beat/config'

import { RiskViewEntry, RiskViewProps } from '../view/RiskView'

export function getRiskView(projects: Layer2[]): RiskViewProps {
  return { items: projects.map(getRiskViewEntry) }
}

export function getRiskViewEntry(project: Layer2): RiskViewEntry {
  return {
    name: project.display.name,
    slug: project.display.slug,
    provider: project.technology.provider,
    ...project.riskView,
  }
}
