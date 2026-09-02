import type { ProjectInclusionDelayChartStakeDistribution } from '@l2beat/config'
import { getDiscoveryPaths } from '@l2beat/discovery'
import { DuneClient, DuneQueryService, HttpClient } from '@l2beat/shared'
import {
  assert,
  formatAsAsciiTable,
  formatNumberWithCommas,
  isDateOnly,
} from '@l2beat/shared-pure'
import { type Parser, v } from '@l2beat/validate'
import fs from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'
import { getPlainLogger } from './common/getPlainLogger'

export const STAKING_PROJECT_IDS = [
  'aztecnetwork',
  'ethereum',
  'gnosis',
  'polygon-pos',
] as const

export type StakingProjectId = (typeof STAKING_PROJECT_IDS)[number]
export type StakingProjectSelection = StakingProjectId | 'all'

interface StakingEntity {
  name: string
  stakeBaseUnits: number
}

export interface StakingDataset {
  project: StakingProjectId
  displayName: string
  stakeToken: string
  stakeDecimals: number
  /** Data date reported by the source. Absent when the source has none. */
  snapshotDate?: string
  validatorCount?: number
  totalStakeBaseUnits: number
  /** Absent when the source only reports aggregate data. */
  entities?: StakingEntity[]
}

interface ExtractedStakingProjectData
  extends ProjectInclusionDelayChartStakeDistribution {
  project: StakingProjectId
}

// Stake amounts may arrive as numbers or numeric strings.
const StakeAmountSchema = v.union([v.number(), v.string()])

const PolygonValidatorSchema = v.object({
  id: v.number(),
  name: v.string(),
  totalStaked: StakeAmountSchema,
})
type PolygonValidator = v.infer<typeof PolygonValidatorSchema>

const PolygonValidatorsResponseSchema = v.object({
  result: v.array(PolygonValidatorSchema),
})

const AztecProviderSchema = v.object({
  identifier: v.string(),
  name: v.string(),
  totalStaked: StakeAmountSchema,
  metadata: v.object({ name: v.string().optional() }).optional(),
})
type AztecProvider = v.infer<typeof AztecProviderSchema>

const AztecProvidersResponseSchema = v.object({
  data: v.array(AztecProviderSchema),
  pagination: v.object({ totalPages: v.number() }).optional(),
  aggregates: v
    .object({ totalStaked: StakeAmountSchema.optional() })
    .optional(),
})

type StakingApiFetcher = () => Promise<StakingDataset>

const POLYGON_VALIDATORS_URL =
  'https://staking-api.polygon.technology/api/v2/validators'
const AZTEC_PROVIDERS_URL = 'https://dashtec.xyz/api/providers'
const GNOSIS_ACTIVE_VALIDATORS_URL =
  'https://api.analytics.gnosis.io/v1/consensus/validators_active_ongoing/latest'
const GNOSIS_STAKED_GNO_URL =
  'https://api.analytics.gnosis.io/v1/consensus/staked_gno/latest'
const DEFAULT_AZTEC_PAGE_SIZE = 200
const STAKE_DISTRIBUTION_FILE_NAME = 'stake-distribution.json'
const DUNE_API_KEY_ENV_NAME = 'DUNE_API_KEY'
const DUNE_TIMEOUT_MS = 10 * 60 * 1000
const MISSING_DUNE_API_KEY_MESSAGE = `${DUNE_API_KEY_ENV_NAME} is required to fetch Ethereum staking data. Set it in packages/backend/.env or the environment, or pass --project to fetch only projects that do not need it.`

const GnosisLatestMetricSchema = v.object({
  value: v.number(),
  as_of_date: v.string(),
})

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

export class StakeDistributionFetcher {
  constructor(
    private readonly project: StakingProjectSelection,
    private readonly limit: number,
    private readonly outputFilePath?: string,
  ) {}

  async fetchAndDisplay(): Promise<void> {
    const projects = this.getProjectsToFetch()
    // Resolve prerequisites (Dune credentials, output location) upfront so a
    // misconfigured environment fails before any network work is done.
    if (projects.includes('ethereum')) {
      assert(process.env[DUNE_API_KEY_ENV_NAME], MISSING_DUNE_API_KEY_MESSAGE)
    }
    const defaultOutputRoot =
      this.outputFilePath === undefined
        ? getDiscoveryPaths().discovery
        : undefined

    const datasets = await Promise.all(
      projects.map((project) => stakingApiFetchers[project]()),
    )

    const extracted = datasets.map((dataset) =>
      this.extractProjectData(dataset),
    )

    const outputFilePaths = await this.writeJsonOutput(
      extracted,
      defaultOutputRoot,
    )

    for (const dataset of datasets) {
      console.log(`\n${dataset.displayName}`)
      console.log(
        `Total stake: ${formatNumberWithCommas(
          toTokenAmount(dataset.totalStakeBaseUnits, dataset.stakeDecimals),
          { maximumFractionDigits: 0 },
        )} ${dataset.stakeToken}`,
      )
      if (dataset.entities !== undefined) {
        console.log(this.createConsoleTable(dataset, dataset.entities))
      }
    }

    console.log(
      `\nExtracted staking data saved to ${formatOutputFilePaths(outputFilePaths)}`,
    )
  }

  private getProjectsToFetch(): StakingProjectId[] {
    if (this.project === 'all') {
      return [...STAKING_PROJECT_IDS]
    }

    return [this.project]
  }

  private extractProjectData(
    dataset: StakingDataset,
  ): ExtractedStakingProjectData {
    return {
      project: dataset.project,
      ...extractStakeDistribution(dataset, this.limit),
    }
  }

  private createConsoleTable(
    dataset: StakingDataset,
    entities: StakingEntity[],
  ): string {
    const headers = [
      'Entity Name',
      `Stake (${dataset.stakeToken})`,
      '% Total Stake',
      'Cumulative %',
    ]
    let cumulativeStake = 0
    const rows = getLargestEntities(entities, this.limit).map((entity) => {
      cumulativeStake += entity.stakeBaseUnits

      return [
        entity.name,
        formatNumberWithCommas(
          toRoundedTokenAmount(entity.stakeBaseUnits, dataset.stakeDecimals),
          { maximumFractionDigits: 0 },
        ),
        formatPercentage(entity.stakeBaseUnits, dataset.totalStakeBaseUnits),
        formatPercentage(cumulativeStake, dataset.totalStakeBaseUnits),
      ]
    })

    return formatAsAsciiTable(headers, rows)
  }

  private async writeJsonOutput(
    data: ExtractedStakingProjectData[],
    defaultOutputRoot: string | undefined,
  ): Promise<string[]> {
    if (this.outputFilePath !== undefined) {
      await writeJsonFile(this.outputFilePath, this.getJsonOutput(data))
      return [this.outputFilePath]
    }

    assert(defaultOutputRoot !== undefined, 'Default output root not resolved')
    const outputs = data.map(async (projectData) => {
      const outputFilePath = path.join(
        defaultOutputRoot,
        projectData.project,
        STAKE_DISTRIBUTION_FILE_NAME,
      )
      await writeJsonFile(
        outputFilePath,
        getStakeDistributionOutput(projectData),
      )
      return outputFilePath
    })

    return await Promise.all(outputs)
  }

  private getJsonOutput(
    data: ExtractedStakingProjectData[],
  ):
    | ExtractedStakingProjectData[]
    | ProjectInclusionDelayChartStakeDistribution {
    if (this.project === 'all') {
      return data
    }

    const projectData = data[0]
    if (!projectData) {
      throw new Error(`No staking data fetched for ${this.project}`)
    }

    return getStakeDistributionOutput(projectData)
  }
}

export function extractStakeDistribution(
  dataset: StakingDataset,
  limit: number,
): ProjectInclusionDelayChartStakeDistribution {
  const date =
    dataset.snapshotDate !== undefined
      ? { dateType: 'snapshot' as const, date: dataset.snapshotDate }
      : { dateType: 'fetched' as const, date: new Date().toISOString() }

  const distribution: ProjectInclusionDelayChartStakeDistribution = {
    stakeToken: dataset.stakeToken,
    ...date,
    totalStake: toRoundedTokenAmount(
      dataset.totalStakeBaseUnits,
      dataset.stakeDecimals,
    ),
  }

  if (dataset.validatorCount !== undefined) {
    distribution.validatorCount = dataset.validatorCount
  }
  if (dataset.entities !== undefined) {
    distribution.entities = getLargestEntities(dataset.entities, limit).map(
      (entity) => ({
        name: entity.name,
        stake: toRoundedTokenAmount(
          entity.stakeBaseUnits,
          dataset.stakeDecimals,
        ),
      }),
    )
  }

  return distribution
}

async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`)
}

function getStakeDistributionOutput(
  projectData: ExtractedStakingProjectData,
): ProjectInclusionDelayChartStakeDistribution {
  const { project: _, ...stakeDistribution } = projectData
  // config re-validates these files with ProjectStakeDistributionSchema when
  // it loads them, so shape drift fails the config build.
  return stakeDistribution
}

function formatOutputFilePaths(outputFilePaths: string[]): string {
  if (outputFilePaths.length === 1) {
    return outputFilePaths[0] ?? ''
  }

  return [
    '',
    ...outputFilePaths.map((outputFilePath) => `- ${outputFilePath}`),
  ].join('\n')
}

const stakingApiFetchers: Record<StakingProjectId, StakingApiFetcher> = {
  aztecnetwork: fetchAztecProviders,
  ethereum: fetchEthereumValidators,
  gnosis: fetchGnosisValidators,
  'polygon-pos': fetchPolygonValidators,
}

async function fetchEthereumValidators(): Promise<StakingDataset> {
  const rows = await executeDuneSql(
    ETHEREUM_STAKING_DISTRIBUTION_QUERY,
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

async function fetchGnosisValidators(): Promise<StakingDataset> {
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

async function executeDuneSql<T>(sql: string, schema: Parser<T>): Promise<T> {
  const apiKey = process.env[DUNE_API_KEY_ENV_NAME]
  assert(apiKey, MISSING_DUNE_API_KEY_MESSAGE)

  const duneQueryService = new DuneQueryService({
    logger: getPlainLogger(),
    duneClient: new DuneClient({ http: new HttpClient(), apiKey }),
    timeoutMs: DUNE_TIMEOUT_MS,
  })
  return await duneQueryService.query(sql, 'medium', schema)
}

async function fetchPolygonValidators(): Promise<StakingDataset> {
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

async function fetchAztecProviders(): Promise<StakingDataset> {
  const firstPage = AztecProvidersResponseSchema.parse(
    await fetchJson(
      getUrlWithParams(AZTEC_PROVIDERS_URL, {
        page: '1',
        limit: String(DEFAULT_AZTEC_PAGE_SIZE),
      }),
    ),
  )

  const totalPages = firstPage.pagination?.totalPages ?? 1
  const remainingPages = Array.from(
    { length: Math.max(totalPages - 1, 0) },
    (_, index) => index + 2,
  )
  const remainingResponses = await Promise.all(
    remainingPages.map(async (page) =>
      AztecProvidersResponseSchema.parse(
        await fetchJson(
          getUrlWithParams(AZTEC_PROVIDERS_URL, {
            page: String(page),
            limit: String(DEFAULT_AZTEC_PAGE_SIZE),
          }),
        ),
      ),
    ),
  )

  const providers = [firstPage, ...remainingResponses].flatMap(
    (response) => response.data,
  )
  const entities = providers.map((provider) => ({
    name: getAztecProviderName(provider),
    stakeBaseUnits: toFiniteNumber(
      provider.totalStaked,
      `Aztec provider ${provider.identifier} totalStaked`,
    ),
  }))

  return {
    project: 'aztecnetwork',
    displayName: 'Aztec staking',
    stakeToken: 'AZTEC',
    stakeDecimals: 18,
    totalStakeBaseUnits:
      firstPage.aggregates?.totalStaked !== undefined
        ? toFiniteNumber(
            firstPage.aggregates.totalStaked,
            'Aztec aggregates.totalStaked',
          )
        : sumStake(entities),
    entities,
  }
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    )
  }

  return await response.json()
}

function getLargestEntities(
  entities: StakingEntity[],
  limit: number,
): StakingEntity[] {
  return [...entities]
    .sort((a, b) => b.stakeBaseUnits - a.stakeBaseUnits)
    .slice(0, limit)
}

function getPolygonValidatorName(validator: PolygonValidator): string {
  const name = validator.name.trim()
  return name.length > 0 ? name : `Anonymous ${validator.id}`
}

function getAztecProviderName(provider: AztecProvider): string {
  const name = provider.name.trim() || provider.metadata?.name?.trim()
  return name || `Provider ${provider.identifier}`
}

function getUrlWithParams(url: string, params: Record<string, string>): string {
  const parsed = new URL(url)

  for (const [key, value] of Object.entries(params)) {
    parsed.searchParams.set(key, value)
  }

  return parsed.toString()
}

function sumStake(entities: StakingEntity[]): number {
  return entities.reduce((sum, entity) => sum + entity.stakeBaseUnits, 0)
}

function toFiniteNumber(value: unknown, name: string): number {
  const numberValue =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value)
        : Number.NaN

  if (!Number.isFinite(numberValue)) {
    throw new Error(`${name} is not a finite number`)
  }

  return numberValue
}

function toSnapshotDate(value: string, name: string): string {
  const date = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
  if (!date || !isDateOnly(date)) {
    throw new Error(`${name} is not a valid date: ${value}`)
  }

  return date
}

function toTokenAmount(stakeBaseUnits: number, decimals: number): number {
  return stakeBaseUnits / 10 ** decimals
}

function toRoundedTokenAmount(
  stakeBaseUnits: number,
  decimals: number,
): number {
  return Math.round(toTokenAmount(stakeBaseUnits, decimals))
}

function formatPercentage(value: number, total: number): string {
  if (total === 0) {
    return '0.00%'
  }

  return `${((value / total) * 100).toFixed(2)}%`
}
