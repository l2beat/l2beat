import type { ProjectInclusionDelayChartStakeDistribution } from '@l2beat/config'
import { getDiscoveryPaths } from '@l2beat/discovery'
import { DuneClient, DuneQueryService, HttpClient } from '@l2beat/shared'
import { assert, formatAsAsciiTable } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
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

interface StakingDataset {
  project: StakingProjectId
  displayName: string
  stakeToken: string
  snapshotDate?: string
  stakeDecimals: number
  validatorCount?: number
  totalStakeBaseUnits: number
  entities?: StakingEntity[]
}

interface ExtractedStakingProjectData
  extends ProjectInclusionDelayChartStakeDistribution {
  project: StakingProjectId
}

interface PolygonValidator {
  id: number
  name: string
  totalStaked: number
}

interface PolygonValidatorsResponse {
  result: PolygonValidator[]
}

interface AztecProvider {
  identifier: string
  name: string
  totalStaked: number
  metadata?: {
    name?: string
  }
}

interface AztecProvidersResponse {
  data: AztecProvider[]
  pagination?: {
    page: number
    limit: number
    totalPages: number
  }
  aggregates?: {
    totalStaked?: number
  }
}

interface GnosisLatestMetric {
  value: number
  as_of_date: string
}

type StakingApiFetcher = () => Promise<StakingDataset>

const POLYGON_VALIDATORS_URL =
  'https://staking-api.polygon.technology/api/v2/validators'
const AZTEC_PROVIDERS_URL = 'https://dashtec.xyz/api/providers'
const GNOSIS_ACTIVE_VALIDATORS_URL =
  'https://api.analytics.gnosis.io/v1/consensus/validators_active_ongoing/latest'
const GNOSIS_STAKED_GNO_URL =
  'https://api.analytics.gnosis.io/v1/consensus/staked_gno/latest'
const DUNE_API_KEY_ENV_NAME = 'DUNE_API_KEY'
const DUNE_TIMEOUT_MS = 10 * 60 * 1000
const MISSING_DUNE_API_KEY_MESSAGE = `${DUNE_API_KEY_ENV_NAME} is required to fetch Ethereum staking data. Set it in packages/backend/.env or the environment, or pass --project to fetch only projects that do not need it.`
const DEFAULT_AZTEC_PAGE_SIZE = 200
const AZTEC_MAX_PAGES = 100
const AZTEC_PAGE_CONCURRENCY = 5
const STAKE_DISTRIBUTION_FILE_NAME = 'stake-distribution.json'

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
      this.outputFilePath === undefined ? getDefaultOutputRoot() : undefined

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
        `Total stake: ${formatInteger(
          toTokenAmount(dataset.totalStakeBaseUnits, dataset.stakeDecimals),
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
      stakeToken: dataset.stakeToken,
      ...(dataset.snapshotDate !== undefined
        ? { snapshotDate: dataset.snapshotDate }
        : {}),
      ...(dataset.validatorCount !== undefined
        ? { validatorCount: dataset.validatorCount }
        : {}),
      totalStake: toRoundedTokenAmount(
        dataset.totalStakeBaseUnits,
        dataset.stakeDecimals,
      ),
      ...(dataset.entities !== undefined
        ? {
            entities: getLargestEntities(dataset.entities, this.limit).map(
              (entity) => ({
                name: entity.name,
                stake: toRoundedTokenAmount(
                  entity.stakeBaseUnits,
                  dataset.stakeDecimals,
                ),
              }),
            ),
          }
        : {}),
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
        formatInteger(
          toRoundedTokenAmount(entity.stakeBaseUnits, dataset.stakeDecimals),
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
      const outputFilePath = getDefaultOutputFilePath(
        defaultOutputRoot,
        projectData.project,
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

async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`)
}

function getDefaultOutputRoot(): string {
  try {
    return getDiscoveryPaths().discovery
  } catch {
    throw new Error(
      'Could not locate the l2beat repository for the default output location. Run the command from inside the repository or pass --output-path.',
    )
  }
}

function getDefaultOutputFilePath(
  outputRoot: string,
  project: StakingProjectId,
): string {
  return path.join(outputRoot, project, STAKE_DISTRIBUTION_FILE_NAME)
}

function getStakeDistributionOutput(
  projectData: ExtractedStakingProjectData,
): ProjectInclusionDelayChartStakeDistribution {
  const { project: _, ...stakeDistribution } = projectData
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

async function fetchPolygonValidators(): Promise<StakingDataset> {
  const response = await fetchJson<PolygonValidatorsResponse>(
    POLYGON_VALIDATORS_URL,
  )

  assertArray(response.result, 'Polygon validators response is missing result')

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
  const firstPage = await fetchJson<AztecProvidersResponse>(
    getUrlWithParams(AZTEC_PROVIDERS_URL, {
      page: '1',
      limit: String(DEFAULT_AZTEC_PAGE_SIZE),
    }),
  )

  assertArray(firstPage.data, 'Aztec providers response is missing data')

  const totalPages = firstPage.pagination?.totalPages ?? 1
  if (
    !Number.isInteger(totalPages) ||
    totalPages < 1 ||
    totalPages > AZTEC_MAX_PAGES
  ) {
    throw new Error(
      `Aztec providers response reports an unreasonable totalPages: ${totalPages}`,
    )
  }
  const remainingPages = Array.from(
    { length: totalPages - 1 },
    (_, index) => index + 2,
  )
  const remainingResponses = await fetchInBatches(
    remainingPages,
    AZTEC_PAGE_CONCURRENCY,
    (page) =>
      fetchJson<AztecProvidersResponse>(
        getUrlWithParams(AZTEC_PROVIDERS_URL, {
          page: String(page),
          limit: String(DEFAULT_AZTEC_PAGE_SIZE),
        }),
      ),
  )

  const providers = [firstPage, ...remainingResponses].flatMap((response) => {
    assertArray(response.data, 'Aztec providers response is missing data')
    return response.data
  })
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

async function fetchEthereumValidators(): Promise<StakingDataset> {
  const rows = await executeDuneSql(ETHEREUM_STAKING_DISTRIBUTION_QUERY)
  const firstRow = getRecord(rows[0], 'Ethereum Dune result is empty')

  const validatorCount = toFiniteNumber(
    firstRow.validator_count,
    'Ethereum validator_count',
  )
  const totalStake = toFiniteNumber(
    firstRow.total_stake,
    'Ethereum total_stake',
  )
  const snapshotDate = toSnapshotDate(
    firstRow.snapshot_date,
    'Ethereum snapshot_date',
  )
  const entities = rows.map((row, index) => {
    const record = getRecord(row, `Ethereum Dune row ${index}`)
    if (typeof record.entity_name !== 'string') {
      throw new Error(`Ethereum Dune row ${index} has no entity_name`)
    }

    return {
      name: record.entity_name,
      stakeBaseUnits: toFiniteNumber(
        record.entity_stake,
        `Ethereum Dune row ${index} entity_stake`,
      ),
    }
  })

  return {
    project: 'ethereum',
    displayName: 'Ethereum staking',
    stakeToken: 'ETH',
    snapshotDate,
    stakeDecimals: 0,
    validatorCount,
    totalStakeBaseUnits: totalStake,
    entities,
  }
}

async function fetchGnosisValidators(): Promise<StakingDataset> {
  const [validatorResponse, stakeResponse] = await Promise.all([
    fetchJson<GnosisLatestMetric[]>(GNOSIS_ACTIVE_VALIDATORS_URL),
    fetchJson<GnosisLatestMetric[]>(GNOSIS_STAKED_GNO_URL),
  ])
  const validatorSnapshot = validatorResponse[0]
  const stakeSnapshot = stakeResponse[0]
  if (!validatorSnapshot || !stakeSnapshot) {
    throw new Error('Gnosis Analytics response is empty')
  }
  if (validatorSnapshot.as_of_date !== stakeSnapshot.as_of_date) {
    throw new Error(
      `Gnosis Analytics snapshots are not aligned: ${validatorSnapshot.as_of_date} and ${stakeSnapshot.as_of_date}`,
    )
  }
  const validatorCount = toFiniteNumber(
    validatorSnapshot.value,
    'Gnosis active validator count',
  )
  const totalStake = toFiniteNumber(
    stakeSnapshot.value,
    'Gnosis total staked GNO',
  )

  return {
    project: 'gnosis',
    displayName: 'Gnosis staking',
    stakeToken: 'GNO',
    snapshotDate: toSnapshotDate(
      validatorSnapshot.as_of_date,
      'Gnosis as_of_date',
    ),
    stakeDecimals: 0,
    validatorCount,
    totalStakeBaseUnits: totalStake,
  }
}

async function executeDuneSql(sql: string): Promise<unknown[]> {
  const apiKey = process.env[DUNE_API_KEY_ENV_NAME]
  assert(apiKey, MISSING_DUNE_API_KEY_MESSAGE)

  const duneQueryService = new DuneQueryService({
    logger: getPlainLogger(),
    duneClient: new DuneClient({ http: new HttpClient(), apiKey }),
    timeoutMs: DUNE_TIMEOUT_MS,
  })
  return await duneQueryService.query(sql, 'medium', v.array(v.unknown()))
}

function getRecord(value: unknown, message: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(message)
  }

  return value as Record<string, unknown>
}

async function fetchInBatches<T, R>(
  items: T[],
  batchSize: number,
  fetchItem: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = []
  for (let index = 0; index < items.length; index += batchSize) {
    const batch = items.slice(index, index + batchSize)
    results.push(...(await Promise.all(batch.map(fetchItem))))
  }
  return results
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    )
  }

  return (await response.json()) as T
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

function assertArray(
  value: unknown,
  message: string,
): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(message)
  }
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

function toSnapshotDate(value: unknown, name: string): string {
  if (typeof value !== 'string') {
    throw new Error(`${name} is not a date string`)
  }

  const date = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
  if (!date || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    throw new Error(`${name} is not a valid date`)
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

function formatInteger(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercentage(value: number, total: number): string {
  if (total === 0) {
    return '0.00%'
  }

  return `${((value / total) * 100).toFixed(2)}%`
}
