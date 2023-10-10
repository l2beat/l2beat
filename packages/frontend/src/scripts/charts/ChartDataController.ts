import {
  ActivityResponse,
  AggregateDetailedTvlResponse,
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

  showEmptyChart() {
    this.abortController?.abort()
    this.abortController = new AbortController()
    this.chartViewController.setChartState('empty')
  }

  private refetch() {
    if (!this.chartType) {
      return
    }
    this.abortController?.abort()
    this.abortController = new AbortController()

    this.chartViewController.showLoader()
    const chartType = this.chartType
    const url = getChartUrl(chartType)

    if (Array.isArray(url)) {
      const responses = url.map((url) =>
        fetch(url, { signal: this.abortController!.signal }),
      )
      void Promise.all(responses)
        .then((responses) => Promise.all(responses.map((res) => res.json())))
        .then((data: unknown[]) =>
          data.map((data) => AggregateDetailedTvlResponse.parse(data)),
        )
        .then((data) => {
          this.parseAndConfigure(chartType, groupAndSumData(data))
        })
        .finally(() => this.chartViewController.hideLoader())
      return
    }

    if (this.cache.has(url)) {
      this.parseAndConfigure(chartType, this.cache.get(url))
      this.chartViewController.hideLoader()
      return
    }

    void fetch(url, { signal: this.abortController.signal })
      .then((res) => res.json())
      .then((data: unknown) => {
        this.parseAndConfigure(chartType, data)
        this.cache.set(url, data)
      })
      .finally(() => this.chartViewController.hideLoader())
  }

  private parseAndConfigure(chartType: ChartType, data: unknown) {
    const parsedData = this.parseData(chartType, data)
    this.chartViewController.configure({ data: parsedData })
  }

  private parseData(chartType: ChartType, data: unknown): ChartData {
    switch (chartType.type) {
      case 'layer2-tvl':
      case 'bridges-tvl':
      case 'project-tvl':
      case 'storybook-fake-tvl':
        return {
          type: 'tvl',
          values: AggregateDetailedTvlResponse.parse(data),
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
    case 'layer2-detailed-tvl':
      return chartType.filteredSlugs
        ? chartType.filteredSlugs.map((slug) => `/api/tvl/${slug}.json`)
        : '/api/tvl/scaling.json'
    case 'layer2-activity':
      return chartType.filteredSlugs
        ? `/api/activity/aggregate?projectSlugs=${chartType.filteredSlugs.join(
            ',',
          )}`
        : '/api/activity/combined.json'
    case 'bridges-tvl':
      return chartType.includeCanonical
        ? '/api/tvl/combined.json'
        : '/api/tvl/bridges.json'
    case 'project-tvl':
    case 'project-detailed-tvl':
      return `/api/tvl/${chartType.slug}.json`
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

function groupAndSumData(
  dataArray: AggregateDetailedTvlResponse[],
): AggregateDetailedTvlResponse {
  const groupedData: AggregateDetailedTvlResponse = {
    hourly: {
      data: [],
      types: dataArray[0].hourly.types,
    },
    sixHourly: {
      data: [],
      types: dataArray[0]?.sixHourly.types,
    },
    daily: {
      data: [],
      types: dataArray[0]?.daily.types,
    },
  }

  const timestampIndex = groupedData.hourly.types.indexOf('timestamp')

  // Create a map to group data by timestamp
  const dailyGroupedByTimestamp = new Map<
    number,
    [number, number, number, number, number, number, number, number, number]
  >()
  const hourlyGroupedByTimestamp = new Map<
    number,
    [number, number, number, number, number, number, number, number, number]
  >()
  const sixHourlyGroupedByTimestamp = new Map<
    number,
    [number, number, number, number, number, number, number, number, number]
  >()

  for (const data of dataArray) {
    for (const daily of data.daily.data) {
      const timestamp = daily[0]
      const valueIndices = [1, 2, 3, 4, 5, 6, 7, 8] // Indices of values to sum

      const groupedDataArray = dailyGroupedByTimestamp.get(timestamp)

      if (!groupedDataArray) {
        dailyGroupedByTimestamp.set(timestamp, [
          timestamp,
          daily[1],
          daily[2],
          daily[3],
          daily[4],
          daily[5],
          daily[6],
          daily[7],
          daily[8],
        ])
        continue
      }

      for (const index of valueIndices) {
        groupedDataArray[index] += daily[index]
      }

      dailyGroupedByTimestamp.set(timestamp, groupedDataArray)
    }
    for (const hourly of data.hourly.data) {
      const timestamp = hourly[0]
      const valueIndices = [1, 2, 3, 4, 5, 6, 7, 8] // Indices of values to sum

      const groupedDataArray = hourlyGroupedByTimestamp.get(timestamp)

      if (!groupedDataArray) {
        hourlyGroupedByTimestamp.set(timestamp, [
          timestamp,
          hourly[1],
          hourly[2],
          hourly[3],
          hourly[4],
          hourly[5],
          hourly[6],
          hourly[7],
          hourly[8],
        ])
        continue
      }

      for (const index of valueIndices) {
        groupedDataArray[index] += hourly[index]
      }

      hourlyGroupedByTimestamp.set(timestamp, groupedDataArray)
    }
    for (const sixHourly of data.sixHourly.data) {
      const timestamp = sixHourly[0]
      const valueIndices = [1, 2, 3, 4, 5, 6, 7, 8] // Indices of values to sum

      const groupedDataArray = sixHourlyGroupedByTimestamp.get(timestamp)

      if (!groupedDataArray) {
        sixHourlyGroupedByTimestamp.set(timestamp, [
          timestamp,
          sixHourly[1],
          sixHourly[2],
          sixHourly[3],
          sixHourly[4],
          sixHourly[5],
          sixHourly[6],
          sixHourly[7],
          sixHourly[8],
        ])
        continue
      }

      for (const index of valueIndices) {
        groupedDataArray[index] += sixHourly[index]
      }

      sixHourlyGroupedByTimestamp.set(timestamp, groupedDataArray)
    }
  }

  // Convert the map back to an array
  const hourlyData = Array.from(hourlyGroupedByTimestamp.values())

  // Sort the array by timestamp

  // Convert the map back to an array
  const dailyData = Array.from(dailyGroupedByTimestamp.values())

  // Sort the array by timestamp

  // Convert the map back to an array
  const sixHourlyData = Array.from(sixHourlyGroupedByTimestamp.values())

  // Sort the array by timestamp

  // Extract data back into the result object
  groupedData.hourly.data = hourlyData
  groupedData.sixHourly.data = sixHourlyData // You can modify this part as needed
  groupedData.daily.data = dailyData // You can modify this part as needed

  return groupedData
}
