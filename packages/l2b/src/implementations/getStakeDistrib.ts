import type { ProjectInclusionDelayChartStakeDistribution } from '@l2beat/config'
import { formatAsAsciiTable } from '@l2beat/shared-pure'
import fs from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'

export const STAKING_PROJECT_IDS = ['polygon', 'aztec'] as const

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
  stakeDecimals: number
  totalStakeBaseUnits: number
  entities: StakingEntity[]
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

type StakingApiFetcher = () => Promise<StakingDataset>

const POLYGON_VALIDATORS_URL =
  'https://staking-api.polygon.technology/api/v2/validators'
const AZTEC_PROVIDERS_URL = 'https://dashtec.xyz/api/providers'
const DEFAULT_AZTEC_PAGE_SIZE = 200

export class StakeDistributionFetcher {
  constructor(
    private readonly project: StakingProjectSelection,
    private readonly limit: number,
    private readonly outputFilePath: string,
  ) {}

  async fetchAndDisplay(): Promise<void> {
    const projects = this.getProjectsToFetch()
    const datasets = await Promise.all(
      projects.map((project) => stakingApiFetchers[project]()),
    )

    const extracted = datasets.map((dataset) =>
      this.extractProjectData(dataset),
    )

    await this.writeJsonOutput(extracted)

    for (const dataset of datasets) {
      console.log(`\n${dataset.displayName}`)
      console.log(
        `Total stake: ${formatInteger(
          toTokenAmount(dataset.totalStakeBaseUnits, dataset.stakeDecimals),
        )} ${dataset.stakeToken}`,
      )
      console.log(this.createConsoleTable(dataset))
    }

    console.log(`\nExtracted staking data saved to ${this.outputFilePath}`)
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
      totalStake: toRoundedTokenAmount(
        dataset.totalStakeBaseUnits,
        dataset.stakeDecimals,
      ),
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
  }

  private createConsoleTable(dataset: StakingDataset): string {
    const headers = [
      'Validator Name',
      `Stake (${dataset.stakeToken})`,
      '% Total Stake',
      'Cumulative %',
    ]
    let cumulativeStake = 0
    const rows = getLargestEntities(dataset.entities, this.limit).map(
      (entity) => {
        cumulativeStake += entity.stakeBaseUnits

        return [
          entity.name,
          formatInteger(
            toRoundedTokenAmount(entity.stakeBaseUnits, dataset.stakeDecimals),
          ),
          formatPercentage(entity.stakeBaseUnits, dataset.totalStakeBaseUnits),
          formatPercentage(cumulativeStake, dataset.totalStakeBaseUnits),
        ]
      },
    )

    return formatAsAsciiTable(headers, rows)
  }

  private async writeJsonOutput(
    data: ExtractedStakingProjectData[],
  ): Promise<void> {
    await fs.mkdir(path.dirname(this.outputFilePath), { recursive: true })
    await fs.writeFile(
      this.outputFilePath,
      `${JSON.stringify(this.getJsonOutput(data), null, 2)}\n`,
    )
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

    const { project: _, ...stakeDistribution } = projectData
    return stakeDistribution
  }
}

const stakingApiFetchers: Record<StakingProjectId, StakingApiFetcher> = {
  polygon: fetchPolygonValidators,
  aztec: fetchAztecProviders,
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
    project: 'polygon',
    displayName: 'Polygon staking',
    stakeToken: 'POL',
    stakeDecimals: 18,
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
  const remainingPages = Array.from(
    { length: Math.max(totalPages - 1, 0) },
    (_, index) => index + 2,
  )
  const remainingResponses = await Promise.all(
    remainingPages.map((page) =>
      fetchJson<AztecProvidersResponse>(
        getUrlWithParams(AZTEC_PROVIDERS_URL, {
          page: String(page),
          limit: String(DEFAULT_AZTEC_PAGE_SIZE),
        }),
      ),
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
    project: 'aztec',
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
