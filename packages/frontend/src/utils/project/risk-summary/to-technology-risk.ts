import type { ScalingProjectRisk } from '@l2beat/config'
import type { TechnologyRisk } from '~/components/projects/sections/risk-list'

export function toTechnologyRisk(risk: ScalingProjectRisk): TechnologyRisk {
  return {
    text: `${risk.category} ${risk.text}`,
    isCritical: !!risk.isCritical,
  }
}
