import {
  assert,
  AmountConfigEntry,
  AssetId,
  CanonicalAssetBreakdownData,
  ChainId,
  EthereumAddress,
  ExternalAssetBreakdownData,
  NativeAssetBreakdownData,
  ProjectAssetsBreakdownApiResponse,
  ProjectId,
  TokenTvlApiCharts,
  TvlApiChart,
  TvlApiCharts,
  TvlApiProject,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'

import { Tvl2Config } from '../../../config/Config'
import { Project } from '../../../model/Project'
import { ChainConverter } from '../../../tools/ChainConverter'
import { asNumber } from '../../tvl/api/asNumber'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ValueRecord, ValueRepository } from '../repositories/ValueRepository'
import { calculateValue } from '../utils/calculateValue'
import { createAmountId } from '../utils/createAmountId'
import { createPriceId } from '../utils/createPriceId'

interface CanonicalAssetBreakdown {
  assetId: AssetId
  chainId: ChainId
  amount: number
  usdValue: number
  usdPrice: string
  escrows: CanonicalAssetBreakdownData['escrows']
}

type AmountConfigMap = Map<
  ProjectId,
  (AmountConfigEntry & { configId: string })[]
>

type PriceConfigIdMap = Map<string, { assetId: AssetId; priceId: string }>

type Values = {
  external: bigint
  canonical: bigint
  native: bigint
}
type ValuesMap = Map<number, Values>

type ApiProject = {
  id: ProjectId
  minTimestamp: UnixTime
  type: Project['type']
  slug: string
  sources: Map<
    string,
    {
      name: string
      minTimestamp: UnixTime
    }
  >
}

export class Tvl2Controller {
  private readonly amountConfig: AmountConfigMap
  private readonly currAmountConfigs: Map<
    string,
    AmountConfigEntry & { configId: string }
  >
  private readonly priceConfigs: PriceConfigIdMap
  private readonly projects: ApiProject[]
  private minTimestamp: Record<Project['type'], UnixTime>

  constructor(
    private readonly amountRepository: AmountRepository,
    private readonly priceRepository: PriceRepository,
    private readonly valueRepository: ValueRepository,
    private readonly chainConverter: ChainConverter,
    projects: Project[],
    config: Tvl2Config,
  ) {
    // We're calculating the configIds on startup to avoid doing it on every request.
    this.amountConfig = getAmountConfigMap(config)
    this.currAmountConfigs = new Map(
      [...this.amountConfig.values()]
        .flat()
        // TODO: we should check it on runtime as well
        .filter((x) => !x.untilTimestamp)
        .map((x) => [x.configId, x]),
    )
    this.priceConfigs = getPriceConfigIds(config)
    this.projects = projects.flatMap(({ projectId: id, type, slug }) => {
      if (config.projectsExcludedFromApi.includes(id.toString())) {
        return []
      }

      const amounts = this.amountConfig.get(id)
      if (!amounts) {
        return []
      }
      assert(amounts, 'Config not found: ' + id.toString())
      const minTimestamp = amounts
        .map((x) => x.sinceTimestamp)
        .reduce((a, b) => UnixTime.min(a, b))

      const sources = new Map<
        string,
        { name: string; minTimestamp: UnixTime }
      >()
      for (const amount of amounts) {
        const name =
          amount.type === 'circulatingSupply' ? 'coingecko' : amount.chain

        const source = sources.get(name)
        if (!source || source.minTimestamp.gt(amount.sinceTimestamp)) {
          sources.set(name, { name, minTimestamp: amount.sinceTimestamp })
        }
      }
      return { id, minTimestamp, type, slug, sources }
    })

    this.minTimestamp = {
      layer2: this.getMinTimestamp('layer2'),
      bridge: this.getMinTimestamp('bridge'),
      layer3: this.getMinTimestamp('layer3'),
    }
  }

  async getTvl(lastHour: UnixTime): Promise<TvlApiResponse> {
    const ethPrices = await this.getEthPrices()

    const projectIds = this.projects.map((x) => x.id)
    const values = await this.valueRepository.getForProjects(projectIds)

    const sixHourlyCutOff = getSixHourlyCutoff(lastHour)
    const hourlyCutOff = getHourlyCutoff(lastHour)

    const valuesByProject = groupBy(values, 'projectId')

    const aggregates = {
      layer3: new Map<number, Values>(),
      layer2: new Map<number, Values>(),
      bridge: new Map<number, Values>(),
    }

    const chartsMap = new Map<string, TvlApiCharts>()
    for (const project of this.projects) {
      const values = valuesByProject[project.id.toString()]
      if (!values) {
        continue
      }

      const valuesByTimestamp = groupBy(values, 'timestamp')

      const valueSums = new Map<number, Values>()
      for (const [timestamp, value] of Object.entries(valuesByTimestamp)) {
        const sum = value.reduce(
          (acc, curr) => {
            acc.canonical += curr.canonical
            acc.external += curr.external
            acc.native += curr.native
            return acc
          },
          { canonical: 0n, external: 0n, native: 0n },
        )
        valueSums.set(Number(timestamp), sum)

        const resultForTotal = value.reduce(
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

      const minValueTimestamp = new UnixTime(Math.min(...valueSums.keys()))
      const maxValueTimestamp = new UnixTime(Math.max(...valueSums.keys()))

      const minTimestamp = UnixTime.max(
        minValueTimestamp,
        project.minTimestamp,
      ).toEndOf('day')
      const maxTimestamp = UnixTime.min(maxValueTimestamp, lastHour)

      const dailyData = getChartData({
        start: minTimestamp,
        end: maxTimestamp,
        step: [1, 'days'],
        aggregatedValues: valueSums,
        ethPrices,
        chartId: project.id,
      })

      const sixHourlyData = getChartData({
        start: UnixTime.max(sixHourlyCutOff, minTimestamp).toEndOf('day'),
        end: maxTimestamp,
        step: [6, 'hours'],
        aggregatedValues: valueSums,
        ethPrices,
        chartId: project.id,
      })

      const hourlyData = getChartData({
        start: UnixTime.max(hourlyCutOff, minTimestamp),
        end: maxTimestamp,
        step: [1, 'hours'],
        aggregatedValues: valueSums,
        ethPrices,
        chartId: project.id,
      })

      chartsMap.set(project.id.toString(), {
        daily: getChart(dailyData),
        sixHourly: getChart(sixHourlyData),
        hourly: getChart(hourlyData),
      })
    }

    for (const type of ['layer2', 'layer3', 'bridge'] as const) {
      const value = aggregates[type]
      const minTimestamp = this.minTimestamp[type]
      const dailyData = getChartData({
        start: minTimestamp,
        end: lastHour,
        step: [1, 'days'],
        aggregatedValues: value,
        ethPrices,
        chartId: type,
      })
      const sixHourlyData = getChartData({
        start: sixHourlyCutOff,
        end: lastHour,
        step: [6, 'hours'],
        aggregatedValues: value,
        ethPrices,
        chartId: type,
      })
      const hourlyData = getChartData({
        start: hourlyCutOff,
        end: lastHour,
        step: [1, 'hours'],
        aggregatedValues: value,
        ethPrices,
        chartId: type,
      })

      chartsMap.set(type, {
        daily: getChart(dailyData),
        sixHourly: getChart(sixHourlyData),
        hourly: getChart(hourlyData),
      })
    }

    const breakdownMap = await this.getBreakdownMap(lastHour)

    const projectData: Record<string, TvlApiProject> = {}
    // TODO: we should rethink how we use chartsMap here
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

  async getTvlBreakdown(
    timestamp: UnixTime,
  ): Promise<ProjectAssetsBreakdownApiResponse> {
    const breakdowns = await this.getNewBreakdown(timestamp)
    return { dataTimestamp: timestamp, breakdowns }
  }

  // Maybe we should have "TokenValueIndexer" that would calculate the values for each token
  // and keep only the current values in the database.
  private async getBreakdownMap(timestamp: UnixTime) {
    const tokenAmounts = await this.amountRepository.getByConfigIdsAndTimestamp(
      [...this.currAmountConfigs.keys()],
      timestamp,
    )
    const prices = await this.priceRepository.getByConfigIdsAndTimestamp(
      [...this.priceConfigs.values()].map((x) => x.priceId),
      timestamp,
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
        address: config.address.toString(),
        chain: config.chain,
        chainId: this.chainConverter.toChainId(config.chain),
        assetType: convertSourceName(config.source),
        usdValue: asNumber(value, 2),
      })
    }
    return breakdownMap
  }

  private async getNewBreakdown(timestamp: UnixTime) {
    const tokenAmounts = await this.amountRepository.getByConfigIdsAndTimestamp(
      [...this.currAmountConfigs.keys()],
      timestamp,
    )
    const prices = await this.priceRepository.getByConfigIdsAndTimestamp(
      [...this.priceConfigs.values()].map((x) => x.priceId),
      timestamp,
    )

    const pricesMap = new Map(prices.map((x) => [x.configId, x.priceUsd]))
    const breakdowns: Record<
      string,
      {
        canonical: Map<AssetId, CanonicalAssetBreakdown>
        external: ExternalAssetBreakdownData[]
        native: NativeAssetBreakdownData[]
      }
    > = {}
    for (const amount of tokenAmounts) {
      const config = this.currAmountConfigs.get(amount.configId)
      assert(config, 'Config not found for id ' + amount.configId)
      let breakdown = breakdowns[config.project]
      if (!breakdown) {
        breakdown = {
          canonical: new Map<AssetId, CanonicalAssetBreakdown>(),
          external: [],
          native: [],
        }
        breakdowns[config.project] = breakdown
      }

      const priceConfig = this.priceConfigs.get(createAssetId(config))
      assert(priceConfig, 'PriceId not found for id ' + amount.configId)
      const price = pricesMap.get(priceConfig.priceId)
      assert(price, 'Price not found for id ' + amount.configId)

      const amountAsNumber = asNumber(amount.amount, config.decimals)
      const valueAsNumber = amountAsNumber * price

      switch (config.source) {
        case 'canonical': {
          // The canonical logic is the most complex one
          assert(config.type === 'escrow', 'Only escrow can be canonical')
          const asset = breakdown.canonical.get(priceConfig.assetId)
          if (asset) {
            asset.usdValue += valueAsNumber
            asset.amount += amountAsNumber
            asset.escrows.push({
              amount: amountAsNumber.toString(),
              usdValue: valueAsNumber.toString(),
              escrowAddress: config.escrowAddress,
            })
          } else {
            breakdown.canonical.set(priceConfig.assetId, {
              assetId: priceConfig.assetId,
              chainId: this.chainConverter.toChainId(config.chain),
              amount: amountAsNumber,
              usdValue: valueAsNumber,
              usdPrice: price.toString(),
              escrows: [
                {
                  amount: amountAsNumber.toString(),
                  usdValue: valueAsNumber.toString(),
                  escrowAddress: config.escrowAddress,
                },
              ],
            })
          }
          break
        }
        case 'external':
          breakdown.external.push({
            assetId: priceConfig.assetId,
            chainId: this.chainConverter.toChainId(config.chain),
            amount: amountAsNumber.toString(),
            usdValue: valueAsNumber.toString(),
            usdPrice: price.toString(),
            tokenAddress:
              config.address === 'native' ? undefined : config.address,
          })
          break
        case 'native':
          breakdown.native.push({
            assetId: priceConfig.assetId,
            chainId: this.chainConverter.toChainId(config.chain),
            amount: amountAsNumber.toString(),
            usdValue: valueAsNumber.toString(),
            usdPrice: price.toString(),
            // TODO: force fe to accept "native"
            tokenAddress:
              config.address === 'native' ? undefined : config.address,
          })
      }
    }
    const result: Record<
      string,
      {
        canonical: CanonicalAssetBreakdownData[]
        external: ExternalAssetBreakdownData[]
        native: NativeAssetBreakdownData[]
      }
    > = {}
    for (const [project, breakdown] of Object.entries(breakdowns)) {
      const canonical = [...breakdown.canonical.values()].sort(
        (a, b) => +b.usdValue - +a.usdValue,
      )

      result[project] = {
        canonical: canonical.map((x) => ({
          ...x,
          escrows: x.escrows.sort((a, b) => +b.amount - +a.amount),
          amount: x.amount.toString(),
          usdValue: x.usdValue.toString(),
        })),
        external: breakdown.external.sort((a, b) => +b.usdValue - +a.usdValue),
        native: breakdown.native.sort((a, b) => +b.usdValue - +a.usdValue),
      }
    }

    return result
  }

  async getAggregatedTvl(
    lastHour: UnixTime,
    projectSlugs: string[],
  ): Promise<TvlApiCharts> {
    const ethPrices = await this.getEthPrices()

    const projects = this.projects.filter((p) => projectSlugs.includes(p.slug))
    const projectIds = projects.map((x) => x.id)

    const values = await this.valueRepository.getForProjects(projectIds)

    const sixHourlyCutOff = getSixHourlyCutoff(lastHour)
    const hourlyCutOff = getHourlyCutoff(lastHour)

    const valuesByProject = groupBy(values, 'projectId')

    const aggregate = new Map<number, Values>()
    for (const project of projects) {
      const projectValues = valuesByProject[project.id.toString()]
      const valuesByTimestamp = groupBy(projectValues, 'timestamp')

      const timestamps = this.getTimestampsForProject(
        project,
        sixHourlyCutOff,
        hourlyCutOff,
        lastHour,
      )

      for (const timestamp of timestamps) {
        const values = valuesByTimestamp[timestamp.toString()] ?? []
        const configuredSources = this.getConfiguredSources(
          values,
          project,
          timestamp,
        )

        const sum = values
          .filter((x) => configuredSources.includes(x.dataSource))
          .reduce(
            (acc, curr) => {
              acc.canonical += curr.canonical
              acc.external += curr.external
              acc.native += curr.native
              return acc
            },
            { canonical: 0n, external: 0n, native: 0n },
          )

        const aggregateSum = aggregate.get(Number(timestamp))
        if (!aggregateSum) {
          aggregate.set(Number(timestamp), sum)
        } else {
          aggregateSum.canonical += sum.canonical
          aggregateSum.external += sum.external
          aggregateSum.native += sum.native
        }
      }
    }

    const minValueTimestamp = new UnixTime(Math.min(...aggregate.keys()))
    const maxValueTimestamp = new UnixTime(Math.max(...aggregate.keys()))
    const projectsMinTimestamp = this.projects
      .map((x) => x.minTimestamp)
      .reduce((acc, curr) => UnixTime.min(acc, curr), UnixTime.now())

    const minTimestamp = UnixTime.max(
      minValueTimestamp,
      projectsMinTimestamp,
    ).toEndOf('day')
    const maxTimestamp = UnixTime.min(maxValueTimestamp, lastHour)

    const dailyData = getChartData({
      start: minTimestamp,
      end: maxTimestamp,
      step: [1, 'days'],
      aggregatedValues: aggregate,
      ethPrices,
      chartId: '/tvl/aggregate',
    })

    const sixHourlyData = getChartData({
      start: UnixTime.max(sixHourlyCutOff, minTimestamp).toEndOf('day'),
      end: maxTimestamp,
      step: [6, 'hours'],
      aggregatedValues: aggregate,
      ethPrices,
      chartId: '/tvl/aggregate',
    })

    const hourlyData = getChartData({
      start: UnixTime.max(hourlyCutOff, minTimestamp),
      end: maxTimestamp,
      step: [1, 'hours'],
      aggregatedValues: aggregate,
      ethPrices,
      chartId: '/tvl/aggregate',
    })

    const result: TvlApiCharts = {
      hourly: getChart(hourlyData),
      sixHourly: getChart(sixHourlyData),
      daily: getChart(dailyData),
    }

    return result
  }

  // TODO: instead of assert we should interpolate values so the page builds even with unsynced sources
  private getConfiguredSources(
    values: ValueRecord[],
    project: ApiProject,
    timestamp: UnixTime,
  ) {
    const valuesSources = values.map((x) => x.dataSource)
    const configuredSources = Array.from(project.sources.values())
      .filter((s) => s.minTimestamp.lte(timestamp))
      .map((s) => s.name)

    const missingSources = configuredSources.filter(
      (s) => !valuesSources.includes(s),
    )

    assert(
      missingSources.length === 0,
      `Missing data sources [${missingSources.join(
        ', ',
      )}] for ${project.id.toString()} at ${timestamp.toNumber()}`,
    )
    return configuredSources
  }

  private getTimestampsForProject(
    project: ApiProject,
    sixHourlyCutOff: UnixTime,
    hourlyCutOff: UnixTime,
    lastHour: UnixTime,
  ): UnixTime[] {
    const timestamps: UnixTime[] = []

    let t = project.minTimestamp.toEndOf('day')
    timestamps.push(t)

    while (t.add(1, 'days').lte(sixHourlyCutOff)) {
      t = t.add(1, 'days')
      timestamps.push(t)
    }

    while (t.add(6, 'hours').lte(hourlyCutOff)) {
      t = t.add(6, 'hours')
      timestamps.push(t)
    }

    while (t.add(1, 'hours').lte(lastHour)) {
      t = t.add(1, 'hours')
      timestamps.push(t)
    }
    return timestamps
  }

  async getTokenChart(
    token: { address: EthereumAddress | 'native'; chain: string },
    project: ProjectId,
    lastHour: UnixTime,
  ): Promise<TokenTvlApiCharts> {
    const projectAmounts = this.amountConfig.get(project)
    assert(projectAmounts)

    const assetId = createAssetId(token)
    const amountConfigs = projectAmounts.filter(
      (x) => createAssetId(x) === assetId,
    )
    assert(
      amountConfigs.every((x) => x.decimals === amountConfigs[0].decimals),
      'Decimals mismatch!',
    )
    const decimals = amountConfigs[0].decimals

    const projectConfig = this.projects.find((x) => x.id === project)
    assert(projectConfig, 'Project not found!')

    const amounts = await this.amountRepository.getByConfigIdsInRange(
      amountConfigs.map((x) => x.configId),
      projectConfig.minTimestamp,
      lastHour,
    )
    const priceConfig = this.priceConfigs.get(assetId)
    assert(priceConfig, 'PriceId not found!')
    const prices = await this.priceRepository.getByConfigIdsInRange(
      [priceConfig.priceId],
      projectConfig.minTimestamp,
      lastHour,
    )
    const pricesMap = new Map(
      prices.map((x) => [x.timestamp.toNumber(), x.priceUsd]),
    )
    const amountsByTimestamp = groupBy(amounts, 'timestamp')

    const hourlyCutOff = getHourlyCutoff(lastHour)
    const sixHourlyCutOff = getSixHourlyCutoff(lastHour)
    const timestamps = this.getTimestampsForProject(
      projectConfig,
      sixHourlyCutOff,
      hourlyCutOff,
      lastHour,
    )

    const values = new Map<number, { amount: number; value: number }>()
    for (const timestamp of timestamps) {
      const priceUsd = pricesMap.get(Number(timestamp))
      const amounts = amountsByTimestamp[timestamp.toNumber()]
      if (!priceUsd || !amounts) {
        values.set(Number(timestamp), { amount: 0, value: 0 })
        continue
      }
      const amount = amounts.reduce((acc, curr) => acc + curr.amount, 0n)
      const usdValue = calculateValue({ amount, priceUsd, decimals })
      values.set(Number(timestamp), {
        amount: asNumber(amount, decimals),
        value: asNumber(usdValue, 2),
      })
    }

    const start = new UnixTime(Math.min(...values.keys()))
    const end = new UnixTime(Math.max(...values.keys()))

    const dailyData: [UnixTime, number, number][] = []
    for (let curr = start; curr <= end; curr = curr.add(1, 'days')) {
      const value = values.get(curr.toNumber())
      assert(
        value !== undefined,
        'Value not found for timestamp ' + curr.toString(),
      )
      dailyData.push([curr, value.amount, value.value])
    }

    const sixHourlyData: [UnixTime, number, number][] = []
    for (
      let curr = UnixTime.max(sixHourlyCutOff, start);
      curr <= end;
      curr = curr.add(6, 'hours')
    ) {
      const value = values.get(curr.toNumber())
      assert(
        value !== undefined,
        'Value not found for timestamp ' + curr.toString(),
      )
      sixHourlyData.push([curr, value.amount, value.value])
    }

    const hourlyData: [UnixTime, number, number][] = []
    for (
      let curr = UnixTime.max(hourlyCutOff, start);
      curr <= end;
      curr = curr.add(1, 'hours')
    ) {
      const value = values.get(curr.toNumber())
      assert(
        value !== undefined,
        'Value not found for timestamp ' + curr.toString(),
      )
      hourlyData.push([curr, value.amount, value.value])
    }

    return {
      daily: {
        types: ['timestamp', 'amount', 'valueUsd'],
        data: dailyData,
      },
      sixHourly: {
        types: ['timestamp', 'amount', 'valueUsd'],
        data: sixHourlyData,
      },
      hourly: {
        types: ['timestamp', 'amount', 'valueUsd'],
        data: hourlyData,
      },
    }
  }

  private getMinTimestamp(type: Project['type']) {
    return this.projects
      .filter((x) => x.type === type)
      .map((x) => x.minTimestamp)
      .reduce((acc, curr) => {
        return UnixTime.min(acc, curr)
      })
      .toEndOf('day')
  }

  private async getEthPrices() {
    const ethAssetId = createAssetId({ address: 'native', chain: 'ethereum' })
    const ethPriceId = this.priceConfigs.get(ethAssetId)?.priceId
    assert(ethPriceId, 'Eth priceId not found')
    const records = await this.priceRepository.getDailyByConfigId(ethPriceId)
    const ethPrices = new Map(
      records.map((x) => [x.timestamp.toNumber(), x.priceUsd]),
    )
    return ethPrices
  }
}

function getChartData({
  start,
  end,
  step,
  aggregatedValues,
  chartId,
  ethPrices,
}: {
  start: UnixTime
  end: UnixTime
  step: [number, 'hours' | 'days']
  aggregatedValues: ValuesMap
  ethPrices: Map<number, number>
  chartId: string | ProjectId
}) {
  const values = []
  for (let curr = start; curr.lte(end); curr = curr.add(...step)) {
    const value = aggregatedValues.get(curr.toNumber())
    assert(
      value,
      'Value not found for chart ' +
        chartId.toString() +
        ' at timestamp ' +
        curr.toString(),
    )
    const ethPrice = ethPrices.get(curr.toNumber())
    assert(ethPrice, 'Eth price not found for timestamp ' + curr.toString())

    values.push(getChartPoint(curr, ethPrice, value))
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
  const result = new Map<string, { assetId: AssetId; priceId: string }>()
  for (const p of config.prices) {
    result.set(createAssetId(p), {
      priceId: createPriceId(p),
      assetId: p.assetId,
    })
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
  ethPrice: number,
  values: { canonical: bigint; external: bigint; native: bigint },
) {
  const valueUsd = asNumber(
    values.canonical + values.external + values.native,
    2,
  )
  const cbvUsd = asNumber(values.canonical, 2)
  const ebvUsd = asNumber(values.external, 2)
  const nmvUsd = asNumber(values.native, 2)
  const valueEth = valueUsd / ethPrice
  const cbvEth = cbvUsd / ethPrice
  const ebvEth = ebvUsd / ethPrice
  const nmvEth = nmvUsd / ethPrice

  return [
    timestamp,
    valueUsd,
    cbvUsd,
    ebvUsd,
    nmvUsd,
    valueEth,
    cbvEth,
    ebvEth,
    nmvEth,
  ] as TvlApiChart['data'][0]
}

function sumCharts(chart1: TvlApiChart, chart2: TvlApiChart): TvlApiChart {
  // adjust chart length to the longer chart
  const lastTimestamp1 = chart1.data.at(-1)?.[0]
  const lastTimestamp2 = chart2.data.at(-1)?.[0]

  assert(
    lastTimestamp1 && lastTimestamp2 && lastTimestamp1.equals(lastTimestamp2),
    'Last timestamp mismatch',
  )

  const longerChart = chart1.data.length > chart2.data.length ? chart1 : chart2
  const shorterChart = chart1.data.length > chart2.data.length ? chart2 : chart1
  const shorterPadded = Array(
    longerChart.data.length - shorterChart.data.length,
  )
    .fill([new UnixTime(0), 0, 0, 0, 0, 0, 0, 0, 0] as TvlApiChart['data'][0])
    .concat(shorterChart.data)

  return {
    types: longerChart.types,
    data: longerChart.data.map(
      (x, i) =>
        [
          x[0],
          x[1] + shorterPadded[i][1],
          x[2] + shorterPadded[i][2],
          x[3] + shorterPadded[i][3],
          x[4] + shorterPadded[i][4],
          x[5] + shorterPadded[i][5],
          x[6] + shorterPadded[i][6],
          x[7] + shorterPadded[i][7],
          x[8] + shorterPadded[i][8],
        ] as TvlApiChart['data'][0],
    ),
  }
}
