import {
  ActivityResponse,
  AggregateDetailedTvlResponse,
  AggregateTvlResponse,
  ChartType,
  TokenInfo,
  TokenTvlResponse,
} from './types'
import { ChartViewController } from './view-controller/ChartViewController'
import { ChartData } from './view-controller/types'

export class ChartDataController {
  private chartType?: ChartType
  private abortController?: AbortController
  private readonly cache = new Map<string, unknown>()

  constructor(private readonly chartViewController: ChartViewController) {}

  setChartType(chartType: ChartType) {
    this.chartType = chartType
    this.refetch()
  }

  private refetch() {
    if (!this.chartType) {
      return
    }
    this.abortController?.abort()
    this.abortController = new AbortController()

    const chartType = this.chartType
    const url = getChartUrl(chartType)
    if (this.cache.has(url)) {
      this.parseAndConfigure(chartType, this.cache.get(url))
      return
    }

    this.chartViewController.showLoader()
    void fetch(url, { signal: this.abortController.signal })
      .then((res) => res.json())
      .then((data: unknown) => {
        this.parseAndConfigure(chartType, data)
        this.cache.set(url, data)
      })
  }

  private parseAndConfigure(chartType: ChartType, data: unknown) {
    const parsedData = this.parseData(chartType, data)
    this.chartViewController.configure({ data: parsedData })
    this.chartViewController.hideLoader()
  }

  private parseData(chartType: ChartType, data: unknown): ChartData {
    switch (chartType.type) {
      case 'layer2-tvl':
      case 'bridges-tvl':
      case 'project-tvl':
      case 'storybook-fake-tvl':
        return {
          type: 'tvl',
          values: AggregateTvlResponse.parse(data),
        }
      case 'layer2-detailed-tvl':
      case 'project-detailed-tvl':
        return {
          type: 'detailed-tvl',
          values: AggregateDetailedTvlResponse.parse(data),
        }
      case 'project-token-tvl':
        return {
          type: 'token-tvl',
          tokenSymbol: chartType.info.symbol,
          tokenType: chartType.info.type,
          values: TokenTvlResponse.parse(data),
        }

      case 'layer2-activity':
      case 'project-activity':
      case 'storybook-fake-activity':
        return {
          type: 'activity',
          isAggregate: chartType.type !== 'project-activity',
          values: ActivityResponse.parse(data),
        }
    }
  }
}

export function getChartUrl(chartType: ChartType) {
  switch (chartType.type) {
    case 'layer2-tvl':
      return '/api/scaling-tvl.json'
    case 'layer2-detailed-tvl':
      return '/api/scaling-detailed-tvl.json'
    case 'layer2-activity':
      return '/api/activity/combined.json'
    case 'bridges-tvl':
      return chartType.includeCanonical
        ? '/api/combined-tvl.json'
        : '/api/bridges-tvl.json'
    case 'project-tvl':
      return `/api/${chartType.slug}-tvl.json`
    case 'project-detailed-tvl':
      return `/api/${chartType.slug}-detailed-tvl.json`
    case 'project-token-tvl':
      return getTokenTvlUrl(chartType.info)
    case 'project-activity':
      return `/api/activity/${chartType.slug}.json`
    case 'storybook-fake-tvl':
      return '/fake-tvl.json'
    case 'storybook-fake-activity':
      return '/fake-activity.json'
  }
}

export function getTokenTvlUrl(info: TokenInfo) {
  const chainId = 'chainId' in info ? info.chainId : 1
  const type = info.type === 'regular' ? 'CBV' : info.type
  return `/api/projects/${info.projectId}/tvl/chains/${chainId}/assets/${info.assetId}/types/${type}`
}
