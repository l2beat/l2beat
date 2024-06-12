import { TvlApiCharts, UnixTime } from '@l2beat/shared-pure'
import { SyncOptimizer } from '../../utils/SyncOptimizer'
import {
  ValuesForSource,
  getChartsData,
  sumValuesPerSource,
} from '../utils/chartsUtils'
import { ApiProject, AssociatedToken } from '../utils/types'
import { DataService } from './DataService'

interface Dependencies {
  dataService: DataService
  syncOptimizer: SyncOptimizer
}

export class AggregatedService {
  constructor(private readonly $: Dependencies) {}

  async getAggregatedTvl(
    timestamp: UnixTime,
    projects: ApiProject[],
    associatedTokens: AssociatedToken[],
  ): Promise<TvlApiCharts> {
    const ethPrices = await this.$.dataService.getEthPrices()

    const valuesByProjectByTimestamp =
      await this.$.dataService.getValuesForProjects(projects, timestamp)

    const aggregate = new Map<number, ValuesForSource>()
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

    const projectsMinTimestamp = projects
      .map((x) => x.minTimestamp)
      .reduce((acc, curr) => UnixTime.min(acc, curr), UnixTime.now())

    const minTimestamp = projectsMinTimestamp.toEndOf('day')

    const dailyStart = minTimestamp
    const sixHourlyStart = UnixTime.max(
      this.$.syncOptimizer.sixHourlyCutOff,
      minTimestamp,
    ).toEndOf('day')
    const hourlyStart = UnixTime.max(
      this.$.syncOptimizer.hourlyCutOff,
      minTimestamp,
    )

    const result = getChartsData({
      dailyStart,
      sixHourlyStart,
      hourlyStart,
      lastHour: timestamp,
      aggregate,
      ethPrices,
    })

    if (associatedTokens.length > 0) {
      throw new Error('associated removal not implemented')
      //   const excluded = await Promise.all(
      //     associatedTokens.map(async (token) => {
      //       const data = await this.getTokenChart(x, x.project, lastHour)

      //       result = subtractTokenCharts(result, data, token.type, ethPrices)
      //     }),
      //   )
    }

    return result
  }
}
