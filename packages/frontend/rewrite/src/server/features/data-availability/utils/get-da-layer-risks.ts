import type {
  ProjectCustomDa,
  ProjectDaLayer,
  TableReadyValue,
} from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'

export interface AdjustedDaLayerRisks {
  economicSecurity?: TableReadyValue
  daLayer?: TableReadyValue
  fraudDetection?: TableReadyValue
}

/**
 * DA Layer risks *might* be adjusted based on the total value secured and the economic security of the project.
 * This is done by the `adjustSecurityRisk` flag in the config.
 * It will yield an error if the values are required yet missing.
 */
export function getDaLayerRisks(
  daLayer: ProjectDaLayer | ProjectCustomDa,
  totalValueSecured?: number,
  economicSecurity?: number,
): AdjustedDaLayerRisks {
  return {
    ...daLayer.risks,
    economicSecurity: getEconomicSecurity(
      daLayer,
      totalValueSecured,
      economicSecurity,
    ),
  }
}

function getEconomicSecurity(
  daLayer: ProjectDaLayer | ProjectCustomDa,
  totalValueSecured: number | undefined,
  economicSecurity: number | undefined,
): TableReadyValue | undefined {
  if (!daLayer.risks.economicSecurity) {
    return
  }

  const shouldCalculate = daLayer.risks.economicSecurity.adjustSecurityRisk

  if (!shouldCalculate) {
    return daLayer.risks.economicSecurity.value
  }

  assert(
    economicSecurity !== undefined && totalValueSecured !== undefined,
    'Economic security value and total value secured must be defined in order to evaluate DA Layer risks - double check `adjustSecurityRisk` flag in the config or the project data',
  )

  const sentiment = adjustSentiment(totalValueSecured, economicSecurity)

  return {
    ...daLayer.risks.economicSecurity.value,
    sentiment,
  }
}

function adjustSentiment(totalValueSecured: number, slashableFunds: number) {
  // If economic security > total value secured -> we score green
  if (slashableFunds > totalValueSecured) return 'good'
  // If economic security > 1/3 of total value secured -> we score yellow
  if (slashableFunds > totalValueSecured / 3) return 'warning'
  // If economic security < 1/3 of total value secured -> we score red
  return 'bad'
}
