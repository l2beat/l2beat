import { v } from '@l2beat/validate'
import type { StakingDataset } from '../types'
import { fetchJson, StakeAmountSchema, sumStake, toFiniteNumber } from './utils'

const POLYGON_VALIDATORS_URL =
  'https://staking-api.polygon.technology/api/v2/validators'

const PolygonValidatorSchema = v.object({
  id: v.number(),
  name: v.string(),
  totalStaked: StakeAmountSchema,
})
type PolygonValidator = v.infer<typeof PolygonValidatorSchema>

const PolygonValidatorsResponseSchema = v.object({
  result: v.array(PolygonValidatorSchema),
})

export async function fetchPolygonValidators(): Promise<StakingDataset> {
  const response = PolygonValidatorsResponseSchema.parse(
    await fetchJson(POLYGON_VALIDATORS_URL),
  )

  const entities = response.result.map((validator) => ({
    name: getPolygonValidatorName(validator),
    stakeBaseUnits: toFiniteNumber(
      validator.totalStaked,
      `Polygon validator ${validator.id} totalStaked`,
    ),
  }))

  return {
    project: 'polygon-pos',
    displayName: 'Polygon staking',
    stakeToken: 'POL',
    stakeDecimals: 18,
    validatorCount: response.result.length,
    totalStakeBaseUnits: sumStake(entities),
    entities,
  }
}

function getPolygonValidatorName(validator: PolygonValidator): string {
  const name = validator.name.trim()
  return name.length > 0 ? name : `Anonymous ${validator.id}`
}
