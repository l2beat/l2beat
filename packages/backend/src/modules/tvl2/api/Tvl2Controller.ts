import {
  assert,
  AmountConfigEntry,
  AssetId,
  CanonicalAssetBreakdownData,
  EthereumAddress,
  ExternalAssetBreakdownData,
  NativeAssetBreakdownData,
  ProjectAssetsBreakdownApiResponse,
  ProjectId,
  TokenTvlApiChart,
  TokenTvlApiCharts,
  TvlApiChart,
  TvlApiCharts,
  TvlApiProject,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'
import { Dictionary, groupBy } from 'lodash'

import { Tvl2Config } from '../../../config/Config'
import { Project } from '../../../model/Project'
import { ChainConverter } from '../../../tools/ChainConverter'
import { asNumber } from '../../tvl/api/asNumber'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ValueRecord, ValueRepository } from '../repositories/ValueRepository'
import { ControllerService } from '../services/ControllerService'
import { calculateValue } from '../utils/calculateValue'
import { createAmountId } from '../utils/createAmountId'
import { createPriceId } from '../utils/createPriceId'
import {
  AmountConfigMap,
  ApiProject,
  AssociatedToken,
  CanonicalAssetBreakdown,
  PriceConfigIdMap,
  Values,
  ValuesMap,
} from './types'

export class Tvl2Controller {
  private readonly amountConfig: AmountConfigMap
  private readonly currAmountConfigs: Map<
    string,
    AmountConfigEntry & { configId: string }
  >
  private readonly priceConfigs: PriceConfigIdMap
  private readonly projects: ApiProject[]
  private readonly associatedTokens: AssociatedToken[]
  private minTimestamp: Record<Project['type'], UnixTime>

  constructor(
    private readonly amountRepository: AmountRepository,
    private readonly priceRepository: PriceRepository,
    private readonly valueRepository: ValueRepository,
    private readonly chainConverter: ChainConverter,
    private readonly controllerService: ControllerService,
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

    this.associatedTokens = projects.flatMap(({ projectId: id, type }) => {
      if (config.projectsExcludedFromApi.includes(id.toString())) {
        return []
      }

      const amounts = this.amountConfig.get(id)
      if (!amounts) {
        return []
      }

      const uniqueTokens = new Map<string, string>()

      const associatedAmounts = amounts
        .filter((x) => x.isAssociated === true)
        .filter((amount) => {
          const u = uniqueTokens.get(`${amount.address}-${amount.chain}`)
          if (u) {
            assert(amount.source === u, 'Type mismatch')
            return false
          }
          uniqueTokens.set(`${amount.address}-${amount.chain}`, amount.source)
          return true
        })

      return associatedAmounts.map((amount) => {
        return {
          address: amount.address,
          chain: amount.chain,
          type: amount.source,
          includeInTotal: amount.includeInTotal,
          project: id,
          projectType: getType(type),
        }
      })
    })

    this.minTimestamp = {
      layer2: this.getMinTimestamp('layer2'),
      bridge: this.getMinTimestamp('bridge'),
      layer3: this.getMinTimestamp('layer3'),
    }
  }

  async getTvl(lastHour: UnixTime): Promise<TvlApiResponse> {
    const ethPrices = await this.getEthPrices()

    const {
      valuesByProjectByTimestamp,
      hourlyStart,
      sixHourlyStart,
      dailyStart,
    } = await this.controllerService.getValuesForProjects(
      this.projects,
      lastHour,
    )

    const aggregates = {
      layer3: new Map<number, Values>(),
      layer2: new Map<number, Values>(),
      bridge: new Map<number, Values>(),
    }

    const chartsMap = new Map<string, TvlApiCharts>()
    for (const project of this.projects) {
      const valuesByTimestamp =
        valuesByProjectByTimestamp[project.id.toString()]

      const valueSums = new Map<number, Values>()
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
        end: lastHour,
        step: [1, 'days'],
        aggregatedValues: valueSums,
        ethPrices,
        chartId: project.id,
      })

      const sixHourlyData = getChartData({
        start: UnixTime.max(sixHourlyStart, project.minTimestamp).toEndOf(
          'six hours',
        ),
        end: lastHour,
        step: [6, 'hours'],
        aggregatedValues: valueSums,
        ethPrices,
        chartId: project.id,
      })

      const hourlyData = getChartData({
        start: UnixTime.max(hourlyStart, project.minTimestamp).toEndOf('hour'),
        end: lastHour,
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
        start: UnixTime.max(dailyStart, minTimestamp).toEndOf('day'),
        end: lastHour,
        step: [1, 'days'],
        aggregatedValues: value,
        ethPrices,
        chartId: type,
      })
      const sixHourlyData = getChartData({
        start: UnixTime.max(sixHourlyStart, minTimestamp).toEndOf('six hours'),
        end: lastHour,
        step: [6, 'hours'],
        aggregatedValues: value,
        ethPrices,
        chartId: type,
      })
      const hourlyData = getChartData({
        start: UnixTime.max(hourlyStart, minTimestamp).toEndOf('hour'),
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
    // to avoid sending 'bridge', 'layer2', 'layer3' as projects
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
    excludeAssociated: boolean,
  ): Promise<TvlApiCharts> {
    const ethPrices = await this.getEthPrices()

    const projects = this.projects.filter((p) => projectSlugs.includes(p.slug))
    const {
      valuesByProjectByTimestamp,
      sixHourlyStart,
      hourlyStart,
      dailyStart,
    } = await this.controllerService.getValuesForProjects(projects, lastHour)

    const aggregate = new Map<number, Values>()
    for (const project of projects) {
      const valuesByTimestamp =
        valuesByProjectByTimestamp[project.id.toString()]

      for (const [_timestamp, values] of Object.entries(valuesByTimestamp)) {
        const timestamp = new UnixTime(+_timestamp)
        const sum = sumValuesPerSource(values)
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

    const dailyData = getChartData({
      start: dailyStart,
      end: lastHour,
      step: [1, 'days'],
      aggregatedValues: aggregate,
      ethPrices,
      chartId: '/tvl/aggregate',
    })

    const sixHourlyData = getChartData({
      start: sixHourlyStart,
      end: lastHour,
      step: [6, 'hours'],
      aggregatedValues: aggregate,
      ethPrices,
      chartId: '/tvl/aggregate',
    })

    const hourlyData = getChartData({
      start: hourlyStart,
      end: lastHour,
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

    if (excludeAssociated) {
      const excluded = await Promise.all(
        this.associatedTokens
          .filter((e) => projectIds.includes(e.project))
          .map(async (x) => ({
            ...x,
            data: await this.getTokenChart(x, x.project, lastHour),
          })),
      )

      for (const e of excluded) {
        result.hourly = subtractTokenChart(
          result.hourly,
          e.data.hourly,
          e.type,
          ethPrices,
        )

        result.sixHourly = subtractTokenChart(
          result.sixHourly,
          e.data.sixHourly,
          e.type,
          ethPrices,
        )

        result.daily = subtractTokenChart(
          result.daily,
          e.data.daily,
          e.type,
          ethPrices,
        )
      }
    }

    return result
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
    const priceConfig = this.priceConfigs.get(assetId)
    assert(priceConfig, 'PriceId not found!')

    const { amountsAndPrices, dailyStart, hourlyStart, sixHourlyStart } =
      await this.controllerService.getPricesAndAmountsForToken(
        amountConfigs.map((x) => x.configId),
        priceConfig.priceId,
        projectConfig.minTimestamp,
        lastHour,
      )

    const dailyData = getTokenChartData({
      start: dailyStart,
      end: lastHour,
      step: [1, 'days'],
      amountsAndPrices,
      decimals,
    })

    const sixHourlyData = getTokenChartData({
      start: sixHourlyStart,
      end: lastHour,
      step: [6, 'hours'],
      amountsAndPrices,
      decimals,
    })

    const hourlyData = getTokenChartData({
      start: hourlyStart,
      end: lastHour,
      step: [1, 'hours'],
      amountsAndPrices,
      decimals,
    })

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

  // TODO: it is slow an can be optimized via querying for all tokens in a batch
  async getExcludedTvl(lastHour: UnixTime): Promise<TvlApiResponse> {
    const tvl = await this.getTvl(lastHour)

    const excluded = await Promise.all(
      this.associatedTokens.map(async (x) => ({
        ...x,
        data: await this.getTokenChart(x, x.project, lastHour),
      })),
    )

    const ethPrices = await this.getEthPrices()

    for (const e of excluded) {
      if (e.includeInTotal) {
        tvl.combined.hourly = subtractTokenChart(
          tvl.combined.hourly,
          e.data.hourly,
          e.type,
          ethPrices,
        )

        tvl.combined.sixHourly = subtractTokenChart(
          tvl.combined.sixHourly,
          e.data.sixHourly,
          e.type,
          ethPrices,
        )

        tvl.combined.daily = subtractTokenChart(
          tvl.combined.daily,
          e.data.daily,
          e.type,
          ethPrices,
        )
      }
      if (e.includeInTotal) {
        tvl[e.projectType].hourly = subtractTokenChart(
          tvl[e.projectType].hourly,
          e.data.hourly,
          e.type,
          ethPrices,
        )

        tvl[e.projectType].sixHourly = subtractTokenChart(
          tvl[e.projectType].sixHourly,
          e.data.sixHourly,
          e.type,
          ethPrices,
        )

        tvl[e.projectType].daily = subtractTokenChart(
          tvl[e.projectType].daily,
          e.data.daily,
          e.type,
          ethPrices,
        )
      }

      const project = tvl.projects[e.project.toString()]
      assert(project, 'Project not found')

      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      tvl.projects[e.project.toString()]!.charts.hourly = subtractTokenChart(
        project.charts.hourly,
        e.data.hourly,
        e.type,
        ethPrices,
      )

      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      tvl.projects[e.project.toString()]!.charts.sixHourly = subtractTokenChart(
        project.charts.sixHourly,
        e.data.sixHourly,
        e.type,
        ethPrices,
      )

      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      tvl.projects[e.project.toString()]!.charts.daily = subtractTokenChart(
        project.charts.daily,
        e.data.daily,
        e.type,
        ethPrices,
      )

      // Remove token from breakdown
      switch (e.type) {
        case 'canonical':
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          tvl.projects[e.project.toString()]!.tokens.CBV = tvl.projects[
            e.project.toString()
          ]!.tokens.CBV.filter(
            (c) => !(c.address === e.address && c.chain === e.chain),
          )
          break
        case 'external':
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          tvl.projects[e.project.toString()]!.tokens.EBV = tvl.projects[
            e.project.toString()
          ]!.tokens.EBV.filter(
            (c) => !(c.address === e.address && c.chain === e.chain),
          )
          break
        case 'native':
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          tvl.projects[e.project.toString()]!.tokens.NMV = tvl.projects[
            e.project.toString()
          ]!.tokens.NMV.filter(
            (c) => !(c.address === e.address && c.chain === e.chain),
          )
          break
      }
    }
    return tvl
  }
}

function sumValuesPerSource(values: ValueRecord[]) {
  return values.reduce(
    (acc, curr) => {
      acc.canonical += curr.canonical
      acc.external += curr.external
      acc.native += curr.native
      return acc
    },
    { canonical: 0n, external: 0n, native: 0n },
  )
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

function getTokenChartData({
  start,
  end,
  step,
  amountsAndPrices,
  decimals,
}: {
  start: UnixTime
  end: UnixTime
  step: [number, 'days' | 'hours']
  amountsAndPrices: Dictionary<{ amount: bigint; price: number }>
  decimals: number
}) {
  const data: [UnixTime, number, number][] = []
  for (let curr = start; curr <= end; curr = curr.add(...step)) {
    const amountAndPrice = amountsAndPrices[curr.toString()]
    assert(
      amountAndPrice !== undefined,
      'Value not found for timestamp ' + curr.toString(),
    )
    const valueUsd = calculateValue({
      amount: amountAndPrice.amount,
      priceUsd: amountAndPrice.price,
      decimals,
    })
    data.push([
      curr,
      asNumber(amountAndPrice.amount, decimals),
      asNumber(valueUsd, 2),
    ] as const)
  }
  return data
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

function subtractTokenChart(
  main: TvlApiChart,
  token: TokenTvlApiChart,
  tokenType: 'canonical' | 'external' | 'native',
  ethPrices: Map<number, number>,
): TvlApiChart {
  const data = main.data.map((x) => {
    const tokenAt = token.data.find((d) => d[0].equals(x[0]))

    if (!tokenAt) {
      return x
    }
    const tokenUsdValue = tokenAt[2]
    // TODO
    const ethPriceAt = ethPrices.get(x[0].toNumber())
    assert(ethPriceAt, `Eth price not found for timestamp ${x[0].toString()}`)
    const tokenEthValue = tokenUsdValue / ethPriceAt

    return [
      x[0],
      x[1] - tokenUsdValue,
      tokenType === 'canonical' ? x[2] - tokenUsdValue : x[2],
      tokenType === 'external' ? x[3] - tokenUsdValue : x[3],
      tokenType === 'native' ? x[4] - tokenUsdValue : x[4],
      +(x[5] - tokenEthValue).toFixed(2),
      tokenType === 'canonical' ? +(x[6] - tokenEthValue).toFixed(2) : x[6],
      tokenType === 'external' ? +(x[7] - tokenEthValue).toFixed(2) : x[7],
      tokenType === 'native' ? +(x[8] - tokenEthValue).toFixed(2) : x[8],
    ] as TvlApiChart['data'][0]
  })

  return {
    types: main.types,
    data,
  }
}
function getType(type: 'layer2' | 'bridge' | 'layer3'): 'layers2s' | 'bridges' {
  switch (type) {
    case 'layer2':
      return 'layers2s'
    case 'bridge':
      return 'bridges'
    case 'layer3':
      return 'layers2s'
  }
}
