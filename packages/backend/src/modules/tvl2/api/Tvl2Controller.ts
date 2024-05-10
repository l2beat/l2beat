import {
  assert,
  AmountConfigEntry,
  EthereumAddress,
  ProjectId,
  TvlApiChart,
  TvlApiCharts,
  TvlApiProject,
  TvlApiResponse,
  UnixTime,
  AssetId,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'

import { Tvl2Config } from '../../../config/Config'
import { ChainConverter } from '../../../tools/ChainConverter'
import {
  AmountRepository,
} from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ValueRepository } from '../repositories/ValueRepository'
import { calculateValue } from '../utils/calculateValue'
import { createAmountId } from '../utils/createAmountId'
import { createPriceId } from '../utils/createPriceId'

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

type PriceConfigIdMap = Map<string, { assetId: AssetId, priceId: string }>

type ValuesMap = Map<number, {
  canonical: bigint
  native: bigint
  external: bigint
}>

export class Tvl2Controller {
  private readonly amountConfig: AmountConfigMap
  private readonly currAmountConfigs: Map<
    string,
    AmountConfigEntry & { configId: string }
  >
  private readonly priceConfigs: PriceConfigIdMap
  private readonly projects: {
    id: ProjectId
    minTimestamp: UnixTime
  }[]

  constructor(
    private readonly amountRepository: AmountRepository,
    private readonly priceRepository: PriceRepository,
    private readonly valueRepository: ValueRepository,
    private readonly chainConverter: ChainConverter,
    projects: ProjectId[],
    config: Tvl2Config,
  ) {
    // We're calculating the configIds on startup to avoid doing it on every request.
    this.amountConfig = getAmountConfigMap(config)
    this.currAmountConfigs = new Map(
      [...this.amountConfig.values()]
        .flat()
        .filter((x) => !x.untilTimestamp)
        .map((x) => [x.configId, x]),
    )
    this.priceConfigs = getPriceConfigIds(config)
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
  }

  async getTvl(): Promise<Tvl2Result> {
    // TODO: we should return daily, sixHourly and hourly results.
    const result: Tvl2Result = {
      daily: [],
    }

    const projects = this.projects.map((x) => x.id)
    const dailyValues = await this.valueRepository.getForProjects(projects)
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

  async getOldTvl(lastHour: UnixTime): Promise<TvlApiResponse> {
    const projects = this.projects.map((x) => x.id)
    const values = await this.valueRepository.getForProjects(projects)

    const sixHourlyCutOff = getSixHourlyCutoff(lastHour)
    const hourlyCutOff = getHourlyCutoff(lastHour)

    const valuesByProject = groupBy(values, 'projectId')

    const chartsMap = new Map<string, TvlApiCharts>()
    for (const project of this.projects) {
      const values = valuesByProject[project.id.toString()]
      const valuesByTimestamp = groupBy(values, 'timestamp')


      const aggregatedValues = new Map()

      for (const [timestamp, value] of Object.entries(valuesByTimestamp)) {
        const result = value.reduce(
          (acc, curr) => {
            acc.canonical += curr.canonical
            acc.external += curr.external
            acc.native += curr.native
            return acc
          },
          { canonical: 0n, external: 0n, native: 0n },
        )
        aggregatedValues.set(Number(timestamp), result)
      }

      const minValueTimestamp = new UnixTime(
        Math.min(...aggregatedValues.keys()),
      )
      const maxValueTimestamp = new UnixTime(
        Math.max(...aggregatedValues.keys()),
      )

      const minTimestamp = UnixTime.max(minValueTimestamp, project.minTimestamp).toEndOf('day')
      const maxTimestamp = UnixTime.min(maxValueTimestamp, lastHour)

      const dailyData = getChartData(
        {
          start: minTimestamp,
          end: maxTimestamp,
          step: [1, 'days'],
          aggregatedValues,
          project: project.id,
        }
      )

      const sixHourlyData = getChartData(
        {
          start: UnixTime.max(sixHourlyCutOff, minTimestamp).toEndOf('day'),
          end: maxTimestamp,
          step: [6, 'hours'],
          aggregatedValues,
          project: project.id,
        }
      )

      const hourlyData = getChartData(
        {
          start: UnixTime.max(hourlyCutOff, minTimestamp),
          end: maxTimestamp,
          step: [1, 'hours'],
          aggregatedValues,
          project: project.id,
        }
      )

      chartsMap.set(project.id.toString(), {
        daily: getChart(dailyData),
        sixHourly: getChart(sixHourlyData),
        hourly: getChart(hourlyData),
      })
    }

    // Maybe we should have "TokenValueIndexer" that would calculate the values for each token
    // and keep only the current values in the database.
    const tokenAmounts = await this.amountRepository.getByConfigIdsAndTimestamp(
      [...this.currAmountConfigs.keys()],
      lastHour,
    )
    const prices = await this.priceRepository.getByConfigIdsAndTimestamp(
      [...this.priceConfigs.values()].map(x => x.priceId),
      lastHour,
    )

    const pricesMap = new Map(prices.map((x) => [x.configId, x.priceUsd]))
    const breakdownMap = new Map<string, TvlApiProject['tokens']>()
    for (const amount of tokenAmounts) {
      const config = this.currAmountConfigs.get(amount.configId)
      assert(config, 'Config not found for id ' + amount.configId)
      let breakdown = breakdownMap.get(config.project)
      if (!breakdown) {
        breakdown = {
          CBV: [],
          EBV: [],
          NMV: [],
        }
        breakdownMap.set(config.project, breakdown)
      }

      const priceConfig = this.priceConfigs.get(createAssetId(config))
      assert(priceConfig, 'PriceId not found for id ' + amount.configId)
      const price = pricesMap.get(priceConfig.priceId)
      assert(price, 'Price not found for id ' + amount.configId)

      const value = calculateValue({
        amount: amount.amount,
        priceUsd: price,
        decimals: config.decimals,
      })

      const source = convertSourceName(config.source)
      breakdown[source].push({
        assetId: priceConfig.assetId,
        chainId: this.chainConverter.toChainId(config.chain),
        assetType: source,
        usdValue: Number(value),
      })
    }

    const projectData: Record<string, TvlApiProject> = {}
    for (const [projectId, charts] of chartsMap.entries()) {
      const breakdown = breakdownMap.get(projectId)
      if (!breakdown) {
        projectData[projectId] = {
          tokens: {
            CBV: [],
            EBV: [],
            NMV: [],
          },
          charts,
        }
        continue
      }

      // The following is backward-compatibility layer
      // as AssetId does a worse job of identifying tokens
      // check for repetitions in breakdown 
      // and sum their values
      for (const value of Object.values(breakdown)) {
        const assetMap = new Map()
        for (const token of value) {
          const assetId = token.assetId.toString()
          const chainId = token.chainId.toString()
          const id = `${assetId}-${chainId}`
          const existing = assetMap.get(id)
          if (existing) {
            existing.usdValue += token.usdValue
          } else {
            assetMap.set(id, token)
          }
        }
        value.splice(0, value.length, ...assetMap.values())
      }

      projectData[projectId] = {
        tokens: breakdown,
        charts,
      }
    }

    // dirty hack to make it faster
    const fakeAggregates = chartsMap.get('arbitrum')
    assert(fakeAggregates, 'Fake aggregates not found')

    const result: TvlApiResponse = {
      bridges: fakeAggregates,
      layers2s: fakeAggregates,
      combined: fakeAggregates,
      projects: projectData,
    }

    return result
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
    const priceConfig = this.priceConfigs.get(assetId)
    assert(priceConfig, 'PriceId not found!')
    const prices = await this.priceRepository.getDailyByConfigId(priceConfig.priceId)
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

function getChartData({ start, end, step, aggregatedValues, project }:
  {
    start: UnixTime,
    end: UnixTime,
    step: [number, 'hours' | 'days'],
    aggregatedValues: ValuesMap,
    project: ProjectId
  }
) {
  const values = []
  for (let curr = start; curr.lte(end); curr = curr.add(...step)) {
    const value = aggregatedValues.get(curr.toNumber())
    assert(
      value,
      'Value not found for project ' +
      project.toString() +
      ' at timestamp ' +
      curr.toString(),
    )

    values.push(getChartPoint(curr, value))
  }
  return values
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
  const result = new Map<string, { assetId: AssetId, priceId: string }>()
  for (const p of config.prices) {
    result.set(createAssetId(p), { priceId: createPriceId(p), assetId: p.assetId })
  }

  return result
}

function convertSourceName(source: 'canonical' | 'external' | 'native') {
  switch (source) {
    case 'canonical':
      return 'CBV' as const
    case 'external':
      return 'EBV' as const
    case 'native':
      return 'NMV' as const
  }
}

function getSixHourlyCutoff(lastHour?: UnixTime) {
  return (lastHour ?? UnixTime.now()).toNext('day').add(-90, 'days')
}

function getHourlyCutoff(lastHour?: UnixTime) {
  return (lastHour ?? UnixTime.now()).add(-7, 'days')
}

function getChart(data: TvlApiChart['data']): TvlApiChart {
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
    data,
  }
}

function getChartPoint(
  timestamp: UnixTime,
  values: { canonical: bigint; external: bigint; native: bigint },
) {
  return [
    timestamp,
    Number(values.canonical + values.external + values.native),
    Number(values.canonical),
    Number(values.external),
    Number(values.native),
    0,
    0,
    0,
    0,
  ] as TvlApiChart['data'][0]
}
