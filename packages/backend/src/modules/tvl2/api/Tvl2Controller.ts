import {
  assert,
  AmountConfigEntry,
  EthereumAddress,
  ProjectId,
  TvlApiCharts,
  UnixTime,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'

import { Tvl2Config } from '../../../config/Config'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ValueRecord, ValueRepository } from '../repositories/ValueRepository'
import { calculateValue } from '../utils/calculateValue'
import { createAmountId } from '../utils/createAmountId'
import { createPriceId } from '../utils/createPriceId'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export interface Tvl2Project {
  id: ProjectId
  indexers: { get safeHeight(): number }[]
}

interface Tvl2Result {
  daily: Tvl2TimestampedResult[]
}

interface Tvl2TimestampedResult {
  timestamp: number
  projects: Record<string, Tvl2ProjectResult>
}

interface Tvl2ProjectResult {
  canonical: string
  external: string
  native: string
}

type AmountConfigMap = Map<
  ProjectId,
  (AmountConfigEntry & { configId: string })[]
>

type PriceConfigIdMap = Map<string, string>

export class Tvl2Controller {
  private readonly amountConfig: AmountConfigMap
  private readonly priceConfigIds: PriceConfigIdMap
  private readonly projects: {
    id: ProjectId
    minTimestamp: UnixTime
  }[]
  private readonly minTimestamp: UnixTime

  constructor(
    private readonly amountRepository: AmountRepository,
    private readonly priceRepository: PriceRepository,
    private readonly valueRepository: ValueRepository,
    private readonly syncOptimizer: SyncOptimizer,
    projects: ProjectId[],
    config: Tvl2Config,
  ) {
    // We're calculating the configIds on startup to avoid doing it on every request.
    this.amountConfig = getAmountConfigMap(config)
    this.priceConfigIds = getPriceConfigIds(config)
    this.projects = projects.flatMap((id) => {
      const config = this.amountConfig.get(id)
      if (!config) {
        return []
      }
      assert(config, 'Config not found: ' + id.toString())
      const minTimestamp = config
        .map((x) => x.sinceTimestamp)
        .reduce((a, b) => UnixTime.min(a, b))
      return { id, minTimestamp }
    })
    this.minTimestamp = this.projects
      .map((x) => x.minTimestamp)
      .reduce((a, b) => UnixTime.min(a, b))
      .toEndOf('day')
  }

  async getTvl(): Promise<Tvl2Result> {
    // TODO: we should return daily, sixHourly and hourly results.
    const result: Tvl2Result = {
      daily: [],
    }

    const projects = this.projects.map((x) => x.id)
    const dailyValues = await this.valueRepository.getDailyForProjects(projects)
    const dailyValuesByTimestamp = groupBy(dailyValues, 'timestamp')
    for (const [timestamp, values] of Object.entries(dailyValuesByTimestamp)) {
      const valuesByProject = groupBy(values, 'projectId')
      const projects: Record<string, Tvl2ProjectResult> = {}
      for (const [projectId, values] of Object.entries(valuesByProject)) {
        const result = values.reduce(
          (acc, curr) => {
            acc.canonical += curr.canonical
            acc.external += curr.external
            acc.native += curr.native
            return acc
          },
          { canonical: 0n, external: 0n, native: 0n },
        )
        projects[projectId] = {
          canonical: result.canonical.toString(),
          external: result.external.toString(),
          native: result.native.toString(),
        }
      }
      result.daily.push({
        timestamp: Number(timestamp),
        projects,
      })
    }

    return result
  }
  async getOldTvl() {
    const projects = this.projects.map((x) => x.id)
    const dailyValues = await this.valueRepository.getDailyForProjects(projects)
    const sixHourlyCutOff = this.syncOptimizer.sixHourlyCutOff
    const sixHourlyValues = await this.valueRepository.getSixHourlyForProjects(
      projects,
      sixHourlyCutOff,
    )
    const hourlyCutOff = this.syncOptimizer.hourlyCutOff
    const hourlyValues = await this.valueRepository.getHourlyForProjects(
      projects,
      hourlyCutOff,
    )

    const dailyValuesByProject = groupBy(dailyValues, 'projectId')
    const sixHourlyValuesByProject = groupBy(sixHourlyValues, 'projectId')
    const hourlyValuesByProject = groupBy(hourlyValues, 'projectId')

    const result: Record<string, TvlApiCharts> = {}
    for (const project of this.projects) {
      const dailyValues = dailyValuesByProject[project.id]
      const sixHourlyValues = sixHourlyValuesByProject[project.id]
      const hourlyValues = hourlyValuesByProject[project.id]

      if (!dailyValues || !sixHourlyValues || !hourlyValues) {
        continue
      }
      const dailyResult = this.getTvlApiCharts(dailyValues)
      const sixHourlyResult = this.getTvlApiCharts(sixHourlyValues)
      const hourlyResult = this.getTvlApiCharts(hourlyValues)

      result[project.id.toString()] = {
        daily: dailyResult,
        sixHourly: sixHourlyResult,
        hourly: hourlyResult,
      }
    }

    return result
  }

  private getTvlApiCharts(values: ValueRecord[]) {
    return {
      types: [
        'timestamp',
        'valueUsd',
        'cbvUsd',
        'ebvUsd',
        'nmvUsd',
        'valueEth',
        'cbvEth',
        'ebvEth',
        'nmvEth',
      ] as [
          'timestamp',
          'valueUsd',
          'cbvUsd',
          'ebvUsd',
          'nmvUsd',
          'valueEth',
          'cbvEth',
          'ebvEth',
          'nmvEth',
        ],
      data: values.map<
        [
          UnixTime,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
        ]
      >((x) => [
        x.timestamp,
        Number(x.canonical + x.external + x.native),
        Number(x.canonical),
        Number(x.external),
        Number(x.native),
        0,
        0,
        0,
        0,
      ]),
    }
  }

  async getTokenChart(
    token: { address: EthereumAddress | 'native'; chain: string },
    project: ProjectId,
  ) {
    const projectAmounts = this.amountConfig.get(project)
    if (!projectAmounts) return

    const assetId = createAssetId(token)
    const amountConfigs = projectAmounts.filter(
      (x) => createAssetId(x) === assetId,
    )

    const amounts = await this.amountRepository.getDailyByConfigId(
      amountConfigs.map((x) => x.configId),
    )
    const priceId = this.priceConfigIds.get(assetId)
    assert(priceId, 'PriceId not found!')
    const prices = await this.priceRepository.getDailyByConfigId(priceId)
    const pricesMap = new Map(
      prices.map((x) => [x.timestamp.toNumber(), x.priceUsd]),
    )

    const amountsByTimestamp = groupBy(amounts, 'timestamp')

    const values: [number, number][] = []
    for (const [timestamp, amounts] of Object.entries(amountsByTimestamp)) {
      const price = pricesMap.get(Number(timestamp))
      assert(price, 'Programmer error ' + timestamp)
      const value = amounts.reduce((acc, curr) => {
        // not a fan of this solution,
        // but sometimes there's multiple amountConfigs
        const amountConfig = amountConfigs.find(
          (x) => x.configId === curr.configId,
        )
        assert(amountConfig, 'Amount config not found')
        const value = calculateValue({
          amount: curr.amount,
          priceUsd: price,
          decimals: amountConfig.decimals,
        })
        return acc + value
      }, 0n)
      values.push([Number(timestamp), Number(value)])
    }

    return values
  }
}

function getAmountConfigMap(config: Tvl2Config) {
  const groupedEntries = Object.entries(groupBy(config.amounts, 'project'))
  const amountConfigEntries = groupedEntries.map(([k, v]) => {
    const projectId = ProjectId(k)
    const amountWithIds = v.map((x) => ({ ...x, configId: createAmountId(x) }))

    return [projectId, amountWithIds] as const
  })

  return new Map(amountConfigEntries)
}

function createAssetId(price: {
  address: EthereumAddress | 'native'
  chain: string
}): string {
  return `${price.chain}-${price.address.toString()}`
}

function getPriceConfigIds(config: Tvl2Config): PriceConfigIdMap {
  const result = new Map<string, string>()
  for (const p of config.prices) {
    result.set(createAssetId(p), createPriceId(p))
  }

  return result
}
