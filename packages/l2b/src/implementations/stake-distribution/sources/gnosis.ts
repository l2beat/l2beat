import { v } from '@l2beat/validate'
import type { StakingDataset } from '../types'
import { fetchJson, toSnapshotDate } from './utils'

const GNOSIS_ACTIVE_VALIDATORS_URL =
  'https://api.analytics.gnosis.io/v1/consensus/validators_active_ongoing/latest'
const GNOSIS_STAKED_GNO_URL =
  'https://api.analytics.gnosis.io/v1/consensus/staked_gno/latest'

const GnosisLatestMetricSchema = v.object({
  value: v.number(),
  as_of_date: v.string(),
})

export async function fetchGnosisValidators(): Promise<StakingDataset> {
  const [validatorMetrics, stakeMetrics] = await Promise.all([
    fetchJson(GNOSIS_ACTIVE_VALIDATORS_URL),
    fetchJson(GNOSIS_STAKED_GNO_URL),
  ])
  const validatorSnapshot = v
    .array(GnosisLatestMetricSchema)
    .parse(validatorMetrics)[0]
  const stakeSnapshot = v.array(GnosisLatestMetricSchema).parse(stakeMetrics)[0]
  if (!validatorSnapshot || !stakeSnapshot) {
    throw new Error('Gnosis Analytics response is empty')
  }
  if (validatorSnapshot.as_of_date !== stakeSnapshot.as_of_date) {
    throw new Error(
      `Gnosis Analytics snapshots are not aligned: ${validatorSnapshot.as_of_date} and ${stakeSnapshot.as_of_date}`,
    )
  }

  return {
    project: 'gnosis',
    displayName: 'Gnosis staking',
    stakeToken: 'GNO',
    stakeDecimals: 0,
    snapshotDate: toSnapshotDate(
      validatorSnapshot.as_of_date,
      'Gnosis as_of_date',
    ),
    validatorCount: validatorSnapshot.value,
    totalStakeBaseUnits: stakeSnapshot.value,
  }
}
