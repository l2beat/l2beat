import { Layer2 } from '@l2beat/config'

import {
  ScalingRiskViewEntry,
  ScalingRiskViewProps,
} from '../view/ScalingRiskView'

export function getRiskView(projects: Layer2[]): ScalingRiskViewProps {
  return { items: projects.map(getRiskViewEntry) }
}

export function getRiskViewEntry(project: Layer2): ScalingRiskViewEntry {
  return {
    name: project.display.name,
    slug: project.display.slug,
    provider: project.technology.provider,
    warning: project.display.warning,
    ...project.riskView,
  }
}
