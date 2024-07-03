import {
  assert,
  TvlApiCharts,
  TvlApiProject,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'
import { ChainConverter } from '../../../../tools/ChainConverter'
import { ConfigMapping } from '../../utils/ConfigMapping'
import { asNumber } from '../../utils/asNumber'
import { calculateValue } from '../../utils/calculateValue'

import { Clock } from '../../../../tools/Clock'
import {
  ValuesForSource,
  getChart,
  getChartData,
  subtractTokenCharts,
  sumCharts,
  sumValuesPerSource,
} from '../utils/chartsUtils'
import { ApiProject, AssociatedToken } from '../utils/types'
import { TokenService } from './TokenService'
import { AmountsDataService } from './data/AmountsDataService'
import { PricesDataService } from './data/PricesDataService'
import { ValuesDataService } from './data/ValuesDataService'

interface Dependencies {
  valuesDataService: ValuesDataService
  pricesDataService: PricesDataService
  amountsDataService: AmountsDataService
  clock: Clock
  tokenService: TokenService
  configMapping: ConfigMapping
  chainConverter: ChainConverter
}

export class TvlService {
  constructor(private readonly $: Dependencies) {}

  async getTvl(
    targetTimestamp: UnixTime,
    projects: ApiProject[],
  ): Promise<TvlApiResponse> {
    const ethPrices =
      await this.$.pricesDataService.getEthPrices(targetTimestamp)

    const valuesByProjectByTimestamp =
      await this.$.valuesDataService.getValuesForProjects(
        projects,
        targetTimestamp,
      )

    const projectsMinTimestamp = projects
      .map((x) => x.minTimestamp)
      .reduce((acc, curr) => UnixTime.min(acc, curr), UnixTime.now())

    const minTimestamp = projectsMinTimestamp.toEndOf('day')

    const dailyStart = minTimestamp
    const sixHourlyStart = this.$.clock.getSixHourlyCutoff(targetTimestamp, {
      minTimestampOverride: minTimestamp,
    })
    const hourlyStart = this.$.clock.getHourlyCutoff(targetTimestamp, {
      minTimestampOverride: minTimestamp,
    })

    const aggregates = {
      layer3: new Map<number, ValuesForSource>(),
      layer2: new Map<number, ValuesForSource>(),
      bridge: new Map<number, ValuesForSource>(),
    }

    const chartsMap = new Map<string, TvlApiCharts>()
    for (const project of projects) {
      const valuesByTimestamp =
        valuesByProjectByTimestamp.valuesByTimestampForProjects[
          project.id.toString()
        ]

      if (!valuesByTimestamp) {
        continue
      }

      const valueSums = new Map<number, ValuesForSource>()
      for (const [timestamp, values] of Object.entries(valuesByTimestamp)) {
        const sum = sumValuesPerSource(values)
        valueSums.set(Number(timestamp), sum)

        const resultForTotal = values.reduce(
          (acc, curr) => {
            acc.canonical += curr.canonicalForTotal
            acc.external += curr.externalForTotal
            acc.native += curr.nativeForTotal
            return acc
          },
          { canonical: 0n, external: 0n, native: 0n },
        )

        const aggregateSums = aggregates[project.type]
        const aggregateSum = aggregateSums.get(Number(timestamp))
        if (!aggregateSum) {
          aggregateSums.set(Number(timestamp), resultForTotal)
        } else {
          aggregateSum.canonical += resultForTotal.canonical
          aggregateSum.external += resultForTotal.external
          aggregateSum.native += resultForTotal.native
        }
      }

      const dailyData = getChartData({
        start: UnixTime.max(dailyStart, project.minTimestamp).toEndOf('day'),
        end: targetTimestamp,
        step: [1, 'days'],
        aggregatedValues: valueSums,
        ethPrices: ethPrices.prices,
        chartId: project.id,
      })

      const sixHourlyData = getChartData({
        start: UnixTime.max(sixHourlyStart, project.minTimestamp).toEndOf(
          'six hours',
        ),
        end: targetTimestamp,
        step: [6, 'hours'],
        aggregatedValues: valueSums,
        ethPrices: ethPrices.prices,
        chartId: project.id,
      })

      const hourlyData = getChartData({
        start: UnixTime.max(hourlyStart, project.minTimestamp).toEndOf('hour'),
        end: targetTimestamp,
        step: [1, 'hours'],
        aggregatedValues: valueSums,
        ethPrices: ethPrices.prices,
        chartId: project.id,
      })

      chartsMap.set(project.id.toString(), {
        daily: getChart(dailyData),
        sixHourly: getChart(sixHourlyData),
        hourly: getChart(hourlyData),
      })
    }

    const minTimestamps = {
      layer2: getMinTimestamp(projects, 'layer2'),
      bridge: getMinTimestamp(projects, 'bridge'),
      layer3: getMinTimestamp(projects, 'layer3'),
    }

    for (const type of ['layer2', 'layer3', 'bridge'] as const) {
      const value = aggregates[type]
      const minTimestamp = minTimestamps[type]
      const dailyData = getChartData({
        start: UnixTime.max(dailyStart, minTimestamp).toEndOf('day'),
        end: targetTimestamp,
        step: [1, 'days'],
        aggregatedValues: value,
        ethPrices: ethPrices.prices,
        chartId: type,
      })
      const sixHourlyData = getChartData({
        start: UnixTime.max(sixHourlyStart, minTimestamp).toEndOf('six hours'),
        end: targetTimestamp,
        step: [6, 'hours'],
        aggregatedValues: value,
        ethPrices: ethPrices.prices,
        chartId: type,
      })
      const hourlyData = getChartData({
        start: UnixTime.max(hourlyStart, minTimestamp).toEndOf('hour'),
        end: targetTimestamp,
        step: [1, 'hours'],
        aggregatedValues: value,
        ethPrices: ethPrices.prices,
        chartId: type,
      })

      chartsMap.set(type, {
        daily: getChart(dailyData),
        sixHourly: getChart(sixHourlyData),
        hourly: getChart(hourlyData),
      })
    }

    const breakdownMap = await this.getBreakdownMap(targetTimestamp)

    const projectData: Record<string, TvlApiProject> = {}
    // TODO: we should rethink how we use chartsMap here
    // to avoid sending 'bridge', 'layer2', 'layer3' as projects
    for (const [projectId, charts] of chartsMap.entries()) {
      const breakdown = breakdownMap.get(projectId)
      if (!breakdown) {
        projectData[projectId] = {
          tokens: {
            canonical: [],
            external: [],
            native: [],
          },
          charts,
        }
        continue
      }

      // The following is backward-compatibility layer
      // as AssetId does a worse job of identifying tokens
      // This loop will check for repetitions in breakdown
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

    const bridges = chartsMap.get('bridge')
    assert(bridges, 'Bridges not found')
    const layers2s = chartsMap.get('layer2')
    assert(layers2s, 'Layer2s not found')
    const layer3s = chartsMap.get('layer3')
    assert(layer3s, 'Layer3s not found')

    const layer2sTotal = {
      hourly: sumCharts(layers2s.hourly, layer3s.hourly),
      sixHourly: sumCharts(layers2s.sixHourly, layer3s.sixHourly),
      daily: sumCharts(layers2s.daily, layer3s.daily),
    }

    const combined = {
      hourly: sumCharts(bridges.hourly, layer2sTotal.hourly),
      sixHourly: sumCharts(bridges.sixHourly, layer2sTotal.sixHourly),
      daily: sumCharts(bridges.daily, layer2sTotal.daily),
    }

    const result: TvlApiResponse = {
      bridges,
      layers2s: layer2sTotal,
      combined,
      projects: projectData,
    }

    return result
  }

  async getExcludedTvl(
    targetTimestamp: UnixTime,
    projects: ApiProject[],
    associatedTokens: AssociatedToken[],
  ): Promise<TvlApiResponse> {
    const tvl = await this.getTvl(targetTimestamp, projects)

    // TODO: it is slow an can be optimized via querying for all tokens in one batch
    const excluded = await Promise.all(
      associatedTokens.map(async (x) => {
        const project = projects.find((p) => p.id === x.project)
        assert(project, 'Project not found!')

        return {
          ...x,
          data: await this.$.tokenService.getTokenChart(
            targetTimestamp,
            project,
            x,
          ),
        }
      }),
    )

    const ethPrices =
      await this.$.pricesDataService.getEthPrices(targetTimestamp)

    for (const e of excluded) {
      if (e.includeInTotal) {
        tvl.combined = subtractTokenCharts(
          tvl.combined,
          e.data,
          e.type,
          ethPrices.prices,
        )

        tvl[e.projectType] = subtractTokenCharts(
          tvl[e.projectType],
          e.data,
          e.type,
          ethPrices.prices,
        )
      }

      const project = tvl.projects[e.project.toString()]
      assert(project, `No TVL entry for project ${e.project.toString()}`)

      project.charts = subtractTokenCharts(
        project.charts,
        e.data,
        e.type,
        ethPrices.prices,
      )

      // Remove token from breakdown
      switch (e.type) {
        case 'canonical':
          project.tokens.canonical = project.tokens.canonical.filter(
            (c) => !(c.address === e.address && c.chain === e.chain),
          )
          break
        case 'external':
          project.tokens.external = project.tokens.external.filter(
            (c) => !(c.address === e.address && c.chain === e.chain),
          )
          break
        case 'native':
          project.tokens.native = project.tokens.native.filter(
            (c) => !(c.address === e.address && c.chain === e.chain),
          )
          break
      }
    }
    return tvl
  }

  // Maybe we should have "TokenValueIndexer" that would calculate the values for each token
  // and keep only the current values in the database.
  private async getBreakdownMap(targetTimestamp: UnixTime) {
    const tokenAmounts = await this.$.amountsDataService.getLatestAmount(
      this.$.configMapping.amounts,
      targetTimestamp,
    )

    const prices = await this.$.pricesDataService.getLatestPrice(
      this.$.configMapping.prices,
      targetTimestamp,
    )

    const pricesMap = new Map(
      prices.prices.map((x) => [x.configId, x.priceUsd]),
    )
    const breakdownMap = new Map<string, TvlApiProject['tokens']>()
    for (const amount of tokenAmounts.amounts) {
      const config = this.$.configMapping.getAmountConfig(amount.configId)
      if (config.untilTimestamp && config.untilTimestamp.lt(targetTimestamp)) {
        continue
      }

      let breakdown = breakdownMap.get(config.project)
      if (!breakdown) {
        breakdown = {
          canonical: [],
          external: [],
          native: [],
        }
        breakdownMap.set(config.project, breakdown)
      }

      const priceConfig =
        this.$.configMapping.getPriceConfigFromAmountConfig(config)
      const price = pricesMap.get(priceConfig.configId)
      assert(price, 'Price not found for id ' + amount.configId)

      const value = calculateValue({
        amount: amount.amount,
        priceUsd: price,
        decimals: config.decimals,
      })

      breakdown[config.source].push({
        assetId: priceConfig.assetId,
        address: config.address.toString(),
        chain: config.chain,
        chainId: this.$.chainConverter.toChainId(config.chain),
        source: config.source,
        usdValue: asNumber(value, 2),
      })
    }
    return breakdownMap
  }
}

function getMinTimestamp(projects: ApiProject[], type: ApiProject['type']) {
  return projects
    .filter((x) => x.type === type)
    .map((x) => x.minTimestamp)
    .reduce((acc, curr) => {
      return UnixTime.min(acc, curr)
    })
    .toEndOf('day')
}
