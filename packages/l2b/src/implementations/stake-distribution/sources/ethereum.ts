import { DuneClient, DuneQueryService, HttpClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getPlainLogger } from '../../common/getPlainLogger'
import type { StakingDataset, StakingSourceDeps } from '../types'
import { toFiniteNumber, toSnapshotDate } from './utils'

const DUNE_TIMEOUT_MS = 10 * 60 * 1000

// Dune returns numeric columns as numbers or strings depending on magnitude.
const DuneNumberSchema = v.union([v.number(), v.string()])

const EthereumStakingRowSchema = v.object({
  entity_name: v.string(),
  entity_stake: DuneNumberSchema,
  validator_count: DuneNumberSchema,
  total_stake: DuneNumberSchema,
  snapshot_date: v.string(),
})

const ETHEREUM_STAKING_DISTRIBUTION_QUERY = `
WITH latest_day AS (
  SELECT max(block_date) AS block_date
  FROM beacon.validator_day_summaries
), active_validators AS (
  SELECT validator_index, start_effective_balance
  FROM beacon.validator_day_summaries
  CROSS JOIN latest_day
  WHERE validator_day_summaries.block_date = latest_day.block_date
), deposit_entities AS (
  SELECT
    pubkey,
    max_by(entity, block_time) FILTER (WHERE entity IS NOT NULL) AS entity,
    max_by(sub_entity, block_time) FILTER (WHERE sub_entity IS NOT NULL) AS sub_entity
  FROM staking_ethereum.deposits
  GROUP BY 1
), lido_operators AS (
  SELECT public_key, max(operator_name) AS operator_name
  FROM beacon.operators
  GROUP BY 1
), attributed AS (
  SELECT
    active_validators.start_effective_balance,
    CASE
      WHEN lido_operators.operator_name IS NOT NULL
        THEN lido_operators.operator_name
      WHEN deposit_entities.entity = 'Lido' AND deposit_entities.sub_entity IS NOT NULL
        THEN deposit_entities.sub_entity
      WHEN deposit_entities.entity = 'Lido'
        THEN 'Lido / Unattributed'
      ELSE deposit_entities.entity
    END AS entity_name
  FROM active_validators
  JOIN beacon.validators
    ON active_validators.validator_index = beacon.validators.index
  LEFT JOIN deposit_entities
    ON beacon.validators.public_key = deposit_entities.pubkey
  LEFT JOIN lido_operators
    ON beacon.validators.public_key = lido_operators.public_key
), totals AS (
  SELECT
    count(*) AS validator_count,
    sum(start_effective_balance) / 1e9 AS total_stake
  FROM attributed
), entity_stakes AS (
  SELECT
    entity_name,
    sum(start_effective_balance) / 1e9 AS entity_stake
  FROM attributed
  WHERE entity_name IS NOT NULL
  GROUP BY 1
)
SELECT
  entity_name,
  entity_stake,
  validator_count,
  total_stake,
  (SELECT block_date FROM latest_day) AS snapshot_date
FROM entity_stakes
CROSS JOIN totals
ORDER BY entity_stake DESC
`

export function createDuneQueryService(apiKey: string): DuneQueryService {
  return new DuneQueryService({
    logger: getPlainLogger(),
    duneClient: new DuneClient({ http: new HttpClient(), apiKey }),
    timeoutMs: DUNE_TIMEOUT_MS,
  })
}

export async function fetchEthereumValidators({
  dune,
}: StakingSourceDeps): Promise<StakingDataset> {
  assert(dune, 'Ethereum staking data requires a Dune query service')
  const rows = await dune.query(
    ETHEREUM_STAKING_DISTRIBUTION_QUERY,
    'medium',
    v.array(EthereumStakingRowSchema),
  )
  const firstRow = rows[0]
  if (!firstRow) {
    throw new Error('Ethereum Dune result is empty')
  }

  return {
    project: 'ethereum',
    displayName: 'Ethereum staking',
    stakeToken: 'ETH',
    stakeDecimals: 0,
    snapshotDate: toSnapshotDate(
      firstRow.snapshot_date,
      'Ethereum snapshot_date',
    ),
    validatorCount: toFiniteNumber(
      firstRow.validator_count,
      'Ethereum validator_count',
    ),
    totalStakeBaseUnits: toFiniteNumber(
      firstRow.total_stake,
      'Ethereum total_stake',
    ),
    entities: rows.map((row) => ({
      name: row.entity_name,
      stakeBaseUnits: toFiniteNumber(
        row.entity_stake,
        `Ethereum entity ${row.entity_name} stake`,
      ),
    })),
  }
}
