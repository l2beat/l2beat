import {
  assert,
  formatAsAsciiTable,
  formatNumberWithCommas,
} from '@l2beat/shared-pure'
import fs from 'fs/promises'
import path from 'path'
import {
  extractStakeDistribution,
  getLargestEntities,
  toRoundedTokenAmount,
  toTokenAmount,
} from './extractStakeDistribution'
import {
  planStakeDistributionOutput,
  type StakeDistributionOutputTarget,
} from './outputPlan'
import { createDuneQueryService } from './sources/ethereum'
import { stakingSources } from './sources/index'
import {
  STAKING_PROJECT_IDS,
  type StakingDataset,
  type StakingEntity,
  type StakingProjectId,
  type StakingProjectSelection,
  type StakingSourceDeps,
} from './types'

const DUNE_API_KEY_ENV_NAME = 'DUNE_API_KEY'
const MISSING_DUNE_API_KEY_MESSAGE = `${DUNE_API_KEY_ENV_NAME} is required to fetch Ethereum staking data. Set it in packages/backend/.env or the environment, or pass --project to fetch only projects that do not need it.`

export class StakeDistributionFetcher {
  constructor(
    private readonly project: StakingProjectSelection,
    private readonly limit: number,
    private readonly output: StakeDistributionOutputTarget,
  ) {}

  async fetchAndDisplay(): Promise<void> {
    const projects = this.getProjectsToFetch()
    // A missing Dune key fails here, before any network work is done.
    const deps: StakingSourceDeps = {
      dune: projects.includes('ethereum')
        ? createDuneQueryService(requireDuneApiKey())
        : undefined,
    }

    const datasets = await Promise.all(
      projects.map((project) => stakingSources[project](deps)),
    )
    const results = datasets.map((dataset) => ({
      project: dataset.project,
      distribution: extractStakeDistribution(dataset, this.limit),
    }))

    const plan = planStakeDistributionOutput(this.project, this.output, results)
    await Promise.all(plan.map(({ path, data }) => writeJsonFile(path, data)))

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
      `\nExtracted staking data saved to ${formatOutputFilePaths(
        plan.map(({ path }) => path),
      )}`,
    )
  }

  private getProjectsToFetch(): StakingProjectId[] {
    if (this.project === 'all') {
      return [...STAKING_PROJECT_IDS]
    }

    return [this.project]
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
}

function requireDuneApiKey(): string {
  const apiKey = process.env[DUNE_API_KEY_ENV_NAME]
  assert(apiKey, MISSING_DUNE_API_KEY_MESSAGE)
  return apiKey
}

async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`)
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

function formatPercentage(value: number, total: number): string {
  if (total === 0) {
    return '0.00%'
  }

  return `${((value / total) * 100).toFixed(2)}%`
}
