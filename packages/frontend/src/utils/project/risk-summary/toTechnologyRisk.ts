import type { ProjectRisk } from '@l2beat/config'
import type { TechnologyRisk } from '~/components/projects/sections/RiskList'

export function toTechnologyRisk(risk: ProjectRisk): TechnologyRisk {
  return {
    text: `${risk.category} ${risk.text}`,
    isCritical: !!risk.isCritical,
  }
}
