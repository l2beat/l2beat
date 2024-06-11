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
  TokenTvlApiCharts,
  TvlApiCharts,
  TvlApiProject,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

import { Project } from '../../../model/Project'
import { ChainConverter } from '../../../tools/ChainConverter'
import { asNumber } from '../utils/asNumber'
import { calculateValue } from '../utils/calculateValue'
import { createAssetId } from '../utils/createAssetId'
import { ControllerService } from './ControllerService'
import {
  convertSourceName,
  getChart,
  getChartData,
  getTokenChartData,
  subtractTokenChart,
  sumCharts,
  sumValuesPerSource,
} from './utils/chartsUtils'
import {
  AmountConfigMap,
  ApiProject,
  AssociatedToken,
  CanonicalAssetBreakdown,
  PriceConfigIdMap,
  Values,
} from './utils/types'

export interface Tvl2ControllerDependencies {
  amountConfig: AmountConfigMap
  currAmountConfigs: Map<string, AmountConfigEntry & { configId: string }>
  priceConfigs: PriceConfigIdMap
  projects: ApiProject[]
  associatedTokens: AssociatedToken[]
  minTimestamp: Record<Project['type'], UnixTime>
  chainConverter: ChainConverter
  controllerService: ControllerService
}

export class Tvl2Controller {
  constructor(private readonly $: Tvl2ControllerDependencies) {}

  async getTvl(lastHour: UnixTime): Promise<TvlApiResponse> {
    const ethPrices = await this.getEthPrices(lastHour)

    const {
      valuesByProjectByTimestamp,
      hourlyStart,
      sixHourlyStart,
      dailyStart,
    } = await this.$.controllerService.getValuesForProjects(
      this.$.projects,
      lastHour,
    )

    const aggregates = {
      layer3: new Map<number, Values>(),
      layer2: new Map<number, Values>(),
      bridge: new Map<number, Values>(),
    }

    const chartsMap = new Map<string, TvlApiCharts>()
    for (const project of this.$.projects) {
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
      const minTimestamp = this.$.minTimestamp[type]
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

  // TODO: it is slow an can be optimized via querying for all tokens in a batch
  async getExcludedTvl(lastHour: UnixTime): Promise<TvlApiResponse> {
    const tvl = await this.getTvl(lastHour)

    const excluded = await Promise.all(
      this.$.associatedTokens.map(async (x) => ({
        ...x,
        data: await this.getTokenChart(x, x.project, lastHour),
      })),
    )

    const ethPrices = await this.getEthPrices(lastHour)

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

  async getAggregatedTvl(
    lastHour: UnixTime,
    projectSlugs: string[],
    excludeAssociated: boolean,
  ): Promise<TvlApiCharts> {
    const ethPrices = await this.getEthPrices(lastHour)

    const projects = this.$.projects.filter((p) =>
      projectSlugs.includes(p.slug),
    )
    const {
      valuesByProjectByTimestamp,
      sixHourlyStart,
      hourlyStart,
      dailyStart,
    } = await this.$.controllerService.getValuesForProjects(projects, lastHour)

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
      const projectIds = projects.map((p) => p.id.toString())

      const excluded = await Promise.all(
        this.$.associatedTokens
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
    const projectAmounts = this.$.amountConfig.get(project)
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

    const projectConfig = this.$.projects.find((x) => x.id === project)
    assert(projectConfig, 'Project not found!')
    const priceConfig = this.$.priceConfigs.get(assetId)
    assert(priceConfig, 'PriceId not found!')

    const { amountsAndPrices, dailyStart, hourlyStart, sixHourlyStart } =
      await this.$.controllerService.getPricesAndAmountsForToken(
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

  async getTvlBreakdown(
    timestamp: UnixTime,
  ): Promise<ProjectAssetsBreakdownApiResponse> {
    const breakdowns = await this.getNewBreakdown(timestamp)
    return { dataTimestamp: timestamp, breakdowns }
  }

  private async getNewBreakdown(timestamp: UnixTime) {
    const tokenAmounts =
      await this.$.controllerService.getAmountsByConfigIdsAndTimestamp(
        [...this.$.currAmountConfigs.keys()],
        timestamp,
      )
    const prices =
      await this.$.controllerService.getPricesByConfigIdsAndTimestamp(
        [...this.$.priceConfigs.values()].map((x) => x.priceId),
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
      const config = this.$.currAmountConfigs.get(amount.configId)
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

      const priceConfig = this.$.priceConfigs.get(createAssetId(config))
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
              chainId: this.$.chainConverter.toChainId(config.chain),
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
            chainId: this.$.chainConverter.toChainId(config.chain),
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
            chainId: this.$.chainConverter.toChainId(config.chain),
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

  // Maybe we should have "TokenValueIndexer" that would calculate the values for each token
  // and keep only the current values in the database.
  private async getBreakdownMap(timestamp: UnixTime) {
    const tokenAmounts =
      await this.$.controllerService.getAmountsByConfigIdsAndTimestamp(
        [...this.$.currAmountConfigs.keys()],
        timestamp,
      )
    const prices =
      await this.$.controllerService.getPricesByConfigIdsAndTimestamp(
        [...this.$.priceConfigs.values()].map((x) => x.priceId),
        timestamp,
      )

    const pricesMap = new Map(prices.map((x) => [x.configId, x.priceUsd]))
    const breakdownMap = new Map<string, TvlApiProject['tokens']>()
    for (const amount of tokenAmounts) {
      const config = this.$.currAmountConfigs.get(amount.configId)
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

      const priceConfig = this.$.priceConfigs.get(createAssetId(config))
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
        chainId: this.$.chainConverter.toChainId(config.chain),
        assetType: convertSourceName(config.source),
        usdValue: asNumber(value, 2),
      })
    }
    return breakdownMap
  }

  private async getEthPrices(lastHour: UnixTime) {
    const ethAssetId = createAssetId({ address: 'native', chain: 'ethereum' })
    const ethPriceId = this.$.priceConfigs.get(ethAssetId)?.priceId
    assert(ethPriceId, 'Eth priceId not found')
    return await this.$.controllerService.getPrices(ethPriceId, lastHour)
  }
}
