import {
  AmountConfigEntry,
  assert,
  ProjectId,
  Tvl2ApiResponse,
  TvlApiChart,
  TvlApiChartPoint,
  TvlApiCharts,
  UnixTime,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'

import { Tvl2Config } from '../../../config/Config'
import { asNumber } from '../../tvl/api/asNumber'
import {
  AmountRecord,
  AmountRepository,
} from '../repositories/AmountRepository'
import { PriceRecord, PriceRepository } from '../repositories/PriceRepository'
import { createPriceId } from '../utils/createPriceId'

interface Project {
  id: ProjectId
  type: 'layer2' | 'bridge'
  sinceTimestamp: UnixTime
}

interface AggregateCharts {
  layer2s: TvlApiCharts
  bridges: TvlApiCharts
  combined: TvlApiCharts
}
interface AssetPrices {
  decimals: number
  prices: {
    hourly: PriceRecord[]
    sixHourly: PriceRecord[]
    daily: PriceRecord[]
  }
}
type PricesMap = Map<string, AssetPrices>

export class Tvl2Controller {
  amountConfig: [ProjectId, AmountConfigEntry[]][]
  priceConfig: [string, number][]

  constructor(
    private readonly priceRepo: PriceRepository,
    private readonly amountRepo: AmountRepository,
    private readonly projects: Project[],
    config: Tvl2Config,
  ) {
    this.amountConfig = Object.entries(
      groupBy(config.amounts, 'projectId'),
    ).map(([k, v]) => [ProjectId(k), v])
    this.priceConfig = config.prices.map((x) => [createPriceId(x), x.decimals])
  }

  async getTvl(timestamp: UnixTime): Promise<Tvl2ApiResponse> {
    const projectCharts = generateProjectCharts(this.projects, timestamp)
    const aggregateCharts = generateAggregateCharts(this.projects, timestamp)

    const prices = await this.getPricesGroupedById(timestamp)

    for (const [projectId, amountConfig] of this.amountConfig) {
      const projectType = this.projects.find((x) => x.id === projectId)?.type
      assert(projectType, 'Project type not found')
      const typeIndex = `${projectType}s` as const
      const projectChart = projectCharts.get(projectId)
      assert(projectChart, 'Project chart not found')
      const configIds = amountConfig.map((_) => '_.configId')

      const hourlyAmounts = await this.amountRepo.getHourly(
        timestamp.add(-7, 'days'),
        timestamp,
        configIds,
      )

      fillCharts(
        amountConfig,
        hourlyAmounts,
        prices,
        projectChart,
        aggregateCharts,
        'hourly',
        typeIndex,
      )

      const projectSixHourlyData = await this.amountRepo.getSixHourly(
        timestamp.add(-90, 'days'),
        timestamp,
        configIds,
      )
      fillCharts(
        amountConfig,
        projectSixHourlyData,
        prices,
        projectChart,
        aggregateCharts,
        'sixHourly',
        typeIndex,
      )

      const projectDailyData = await this.amountRepo.getDaily(
        timestamp,
        configIds,
      )
      fillCharts(
        amountConfig,
        projectDailyData,
        prices,
        projectChart,
        aggregateCharts,
        'daily',
        typeIndex,
      )
    }

    return {
      ...aggregateCharts,
      projects: Object.fromEntries(projectCharts.entries()),
    }
  }

  async getPricesGroupedById(timestamp: UnixTime) {
    // maybe we should get prices per priceID.
    // this can also be heavy on memory
    const pricesRecords = {
      hourly: await this.priceRepo.getHourly(
        timestamp.add(-7, 'days'),
        timestamp,
      ),
      sixHourly: await this.priceRepo.getSixHourly(
        timestamp.add(-90, 'days'),
        timestamp,
      ),
      daily: await this.priceRepo.getDaily(timestamp),
    }

    const prices = new Map<string, AssetPrices>()

    for (const [priceId, decimals] of this.priceConfig) {
      const pricesPerId = {
        hourly: pricesRecords.hourly.filter(
          (x) => createPriceId(x) === priceId,
        ),
        sixHourly: pricesRecords.sixHourly.filter(
          (x) => createPriceId(x) === priceId,
        ),
        daily: pricesRecords.daily.filter((x) => createPriceId(x) === priceId),
      }
      prices.set(priceId, { decimals, prices: pricesPerId })
    }

    return prices
  }
}

export const TYPE_LABELS: TvlApiChart['types'] = [
  'timestamp',
  'valueUsd',
  'cbvUsd',
  'ebvUsd',
  'nmvUsd',
  'valueEth',
  'cbvEth',
  'ebvEth',
  'nmvEth',
]

const USD_INDEX = {
  TVL: 1,
  CBV: 2,
  EBV: 3,
  NMV: 4,
} as const

const ETH_INDEX = {
  TVL: 5,
  CBV: 6,
  EBV: 7,
  NMV: 8,
} as const

const PERIODS = [
  ['hourly', 60 * 60],
  ['sixHourly', 6 * 60 * 60],
  ['daily', 24 * 60 * 60],
] as const

function fillCharts(
  amountConfig: AmountConfigEntry[],
  amounts: AmountRecord[],
  prices: PricesMap,
  projectChart: TvlApiCharts,
  aggregateCharts: AggregateCharts,
  granularity: 'hourly' | 'sixHourly' | 'daily',
  typeIndex: 'layer2s' | 'bridges',
) {
  for (const [i, amount] of amounts.entries()) {
    const config = amountConfig.find((x) =>  === amount.configId)
    // const assetConfig
    // { id: chain::address, decimals: number}
    assert(config, 'Config not found')

    const priceId = createPriceId(config)
    const assetPrices = prices.get(priceId)
    assert(assetPrices, 'Asset price not found')
    const decimals = assetPrices.decimals
    const price = assetPrices.prices[granularity][i]
    const valueUsd = asNumber(amount.amount, decimals) * price.priceUsd

    // TODO: we need to calculate this
    const valueEth = valueUsd

    // we could use map instead of array to make this faster
    const point = projectChart[granularity].data[i]
    assert(point, 'Point not found')
    // not sure which one is better:
    // - first calculate the individual values and then add them to the aggregate
    // - calculate aggregates on the fly (as implemented here)
    const typeAggPoint = aggregateCharts[typeIndex][granularity].data[i]
    assert(typeAggPoint, 'Type agg point not found')
    const combinedAggPoint = aggregateCharts.combined[granularity].data[i]
    assert(combinedAggPoint, 'Combined agg point not found')

    point[USD_INDEX.TVL] += valueUsd
    point[ETH_INDEX.TVL] += valueEth
    typeAggPoint[USD_INDEX.TVL] += valueUsd
    typeAggPoint[ETH_INDEX.TVL] += valueEth
    combinedAggPoint[USD_INDEX.TVL] += valueUsd
    combinedAggPoint[ETH_INDEX.TVL] += valueEth
    switch (config.source) {
      case 'canonical':
        point[USD_INDEX.CBV] += valueUsd
        point[ETH_INDEX.CBV] += valueEth
        typeAggPoint[USD_INDEX.CBV] += valueUsd
        typeAggPoint[ETH_INDEX.CBV] += valueEth
        combinedAggPoint[USD_INDEX.CBV] += valueUsd
        combinedAggPoint[ETH_INDEX.CBV] += valueEth
        break
      case 'external':
        point[USD_INDEX.EBV] += valueUsd
        point[ETH_INDEX.EBV] += valueEth
        typeAggPoint[USD_INDEX.EBV] += valueUsd
        typeAggPoint[ETH_INDEX.EBV] += valueEth
        combinedAggPoint[USD_INDEX.EBV] += valueUsd
        combinedAggPoint[ETH_INDEX.EBV] += valueEth
        break
      case 'native':
        point[USD_INDEX.NMV] += valueUsd
        point[ETH_INDEX.NMV] += valueEth
        typeAggPoint[USD_INDEX.NMV] += valueUsd
        typeAggPoint[ETH_INDEX.NMV] += valueEth
        combinedAggPoint[USD_INDEX.NMV] += valueUsd
        combinedAggPoint[ETH_INDEX.NMV] += valueEth
        break
    }
  }
}

function generateProjectCharts(
  projects: { id: ProjectId; sinceTimestamp: UnixTime }[],
  untilTimestamp: UnixTime,
) {
  return new Map<ProjectId, TvlApiCharts>(
    projects.map((p) => [
      p.id,
      getEmptyChart(p.sinceTimestamp, untilTimestamp),
    ]),
  )
}

function generateAggregateCharts(
  projects: Project[],
  untilTimestamp: UnixTime,
): AggregateCharts {
  const minLayer2Timestamp = projects
    .filter((p) => p.type === 'layer2')
    .map((x) => x.sinceTimestamp)
    .reduce((min, current) => UnixTime.min(min, current), untilTimestamp)

  const minBridgeTimestamp = projects
    .filter((p) => p.type === 'bridge')
    .map((x) => x.sinceTimestamp)
    .reduce((min, current) => UnixTime.min(min, current), untilTimestamp)

  const minTimestamp = UnixTime.min(minLayer2Timestamp, minBridgeTimestamp)

  const aggregates = {
    layer2s: getEmptyChart(minLayer2Timestamp, untilTimestamp),
    bridges: getEmptyChart(minBridgeTimestamp, untilTimestamp),
    combined: getEmptyChart(minTimestamp, untilTimestamp),
  }
  return aggregates
}

function getEmptyChart(
  sinceTimestamp: UnixTime,
  untilTimestamp: UnixTime,
): TvlApiCharts {
  return {
    hourly: {
      types: TYPE_LABELS,
      data: generateZeroes(
        UnixTime.max(
          sinceTimestamp,
          untilTimestamp.add(-7, 'days').add(1, 'hours'),
        ),
        untilTimestamp,
        1,
      ),
    },
    sixHourly: {
      types: TYPE_LABELS,
      data: generateZeroes(
        UnixTime.max(
          sinceTimestamp,
          untilTimestamp.add(-90, 'days').add(6, 'hours'),
        ),
        untilTimestamp,
        6,
      ),
    },
    daily: {
      types: TYPE_LABELS,
      data: generateZeroes(sinceTimestamp, untilTimestamp, 24),
    },
  }
}

function generateZeroes(
  since: UnixTime,
  until: UnixTime,
  offsetHours: number,
): TvlApiChartPoint[] {
  const adjusted = new UnixTime(
    since.toNumber() - (since.toNumber() % (offsetHours * 60 * 60)),
  )

  const zeroes: TvlApiChartPoint[] = []
  for (
    let timestamp = adjusted;
    timestamp.lte(until);
    timestamp = timestamp.add(offsetHours, 'hours')
  ) {
    zeroes.push([timestamp, 0, 0, 0, 0, 0, 0, 0, 0])
  }
  return zeroes
}
