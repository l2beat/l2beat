import { z } from 'zod'

import {
  ActivityResponse,
  AggregateDetailedTvlResponse,
  AggregateTvlResponse,
} from './types'
import { ChartViewController } from './view-controller/ChartViewController'
import { ChartData } from './view-controller/types'

export class ChartDataController {
  private chartType?: ChartType
  private includeCanonical = false

  constructor(private readonly chartViewController: ChartViewController) {}

  setChartType(chartType: ChartType) {
    this.chartType = chartType
    this.refetch()
  }

  // setToken(token: string | undefined) {

  // }

  setIncludeCanonical(includeCanonical: boolean) {
    this.includeCanonical = includeCanonical
    this.refetch()
  }

  private refetch() {
    if (!this.chartType) {
      return
    }
    const chartType = this.chartType

    const url = getChartUrl(chartType)
    // TODO: set loading
    // TODO: if in cache get cached

    // TODO: abortcontroller
    void fetch(url)
      .then((res) => res.json())
      .then((data: unknown) => this.parseData(chartType, data))
      .then((data) => this.chartViewController.configure({ data }))
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
      // TODO: token
      return `/api/${chartType.slug}-tvl.json`
    case 'project-detailed-tvl':
      // TODO: token
      return `/api/${chartType.slug}-detailed-tvl.json`
    case 'project-activity':
      return `/api/activity/${chartType.slug}.json`
    case 'storybook-fake-tvl':
      return '/fake-tvl.json'
    case 'storybook-fake-activity':
      return '/fake-activity.json'
  }
}

export type ChartType = z.infer<typeof ChartType>
export const ChartType = z.discriminatedUnion('type', [
  z.object({ type: z.literal('layer2-tvl') }),
  z.object({ type: z.literal('layer2-detailed-tvl') }),
  z.object({ type: z.literal('layer2-activity') }),
  z.object({ type: z.literal('bridges-tvl') }),
  z.object({ type: z.literal('project-tvl'), slug: z.string() }),
  z.object({ type: z.literal('project-detailed-tvl'), slug: z.string() }),
  z.object({ type: z.literal('project-activity'), slug: z.string() }),
  z.object({ type: z.literal('storybook-fake-tvl') }),
  z.object({ type: z.literal('storybook-fake-activity') }),
])
