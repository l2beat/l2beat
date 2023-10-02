import {
  ActivityResponse,
  AggregateDetailedTvlResponse,
  AggregateTvlResponse,
  ChartType,
  TokenTvlResponse,
} from './types'
import { ChartViewController } from './view-controller/ChartViewController'
import { ChartData } from './view-controller/types'

export class ChartDataController {
  private chartType?: ChartType
  private includeCanonical = false
  private abortController?: AbortController

  constructor(private readonly chartViewController: ChartViewController) {}

  setChartType(chartType: ChartType) {
    this.chartType = chartType
    this.refetch()
  }

  setIncludeCanonical(includeCanonical: boolean) {
    this.includeCanonical = includeCanonical
    this.refetch()
  }

  private refetch() {
    if (!this.chartType) {
      return
    }
    this.abortController?.abort()
    this.abortController = new AbortController()

    const chartType = this.chartType
    const url = getChartUrl(chartType, this.includeCanonical)
    // TODO: (chart) if in cache get cached

    this.chartViewController.showLoader()
    void fetch(url, { signal: this.abortController.signal })
      .then((res) => res.json())
      .then((data: unknown) => this.parseData(chartType, data))
      .then((data) => {
        this.chartViewController.configure({ data })
        this.chartViewController.hideLoader()
      })
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
          tokenType: chartType.info.type,
          values: TokenTvlResponse.parse(data),
        }
      case 'layer2-activity':
      case 'project-activity':
      case 'storybook-fake-activity':
        return {
          type: 'activity',
          values: ActivityResponse.parse(data),
        }
    }
  }
}

export function getChartUrl(chartType: ChartType, includeCanonical = false) {
  switch (chartType.type) {
    case 'layer2-tvl':
      return '/api/scaling-tvl.json'
    case 'layer2-detailed-tvl':
      return '/api/scaling-detailed-tvl.json'
    case 'layer2-activity':
      return '/api/activity/combined.json'
    case 'bridges-tvl':
      return includeCanonical
        ? '/api/combined-tvl.json'
        : '/api/bridges-tvl.json'
    case 'project-tvl':
      // TODO: (chart) token
      return `/api/${chartType.slug}-tvl.json`
    case 'project-detailed-tvl':
      // TODO: (chart) token
      return `/api/${chartType.slug}-detailed-tvl.json`
    case 'project-token-tvl':
      return chartType.info.type === 'CBV'
        ? `/api/projects/${chartType.info.projectId}/tvl/assets/${chartType.info.assetId}`
        : `/api/projects/${chartType.info.projectId}/tvl/chains/${chartType.info.chainId}/assets/${chartType.info.assetId}/types/${chartType.info.type}`

    case 'project-activity':
      return `/api/activity/${chartType.slug}.json`
    case 'storybook-fake-tvl':
      return '/fake-tvl.json'
    case 'storybook-fake-activity':
      return '/fake-activity.json'
  }
}
