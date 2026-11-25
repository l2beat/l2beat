import type { ProjectRiskView } from '@l2beat/config'
import { getL2Risks } from '@l2beat/config/build/utils/scalingAssessment'
import type { RosetteValue } from '~/components/rosette/types'

/**
 * Table rosettes show each risk's value and sentiment but never its
 * description, so the description stays on the server instead of being copied
 * into every row of the page payload.
 */
export function getL2TableRisks(riskView: ProjectRiskView): RosetteValue[] {
  return getL2Risks(riskView).map(({ description: _, ...risk }) => risk)
}
