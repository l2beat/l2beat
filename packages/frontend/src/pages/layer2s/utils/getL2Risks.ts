import type { ProjectRiskView } from '@l2beat/config'
import { SCALING_RISKS } from '@l2beat/shared-pure'
import type { RosetteValue } from '~/components/rosette/types'

export function getL2Risks(riskView: ProjectRiskView): RosetteValue[] {
  return SCALING_RISKS.map(({ key, name }) => {
    const risk = riskView[key]
    return {
      name,
      value: risk.value,
      sentiment: risk.sentiment,
      ...(key === 'exitWindow' && { regular: riskView.exitWindow.regular }),
      warning: risk.warning,
      description: risk.description,
    }
  })
}

/**
 * Table rosettes show each risk's value and sentiment but never its
 * description, so the description stays on the server instead of being copied
 * into every row of the page payload.
 */
export function getL2TableRisks(riskView: ProjectRiskView): RosetteValue[] {
  return getL2Risks(riskView).map(({ description: _, ...risk }) => risk)
}
