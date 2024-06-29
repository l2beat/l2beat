import { assert } from '@l2beat/backend-tools'
import { TvlApiCharts, UnixTime } from '@l2beat/shared-pure'
import { SyncOptimizer } from '../../utils/SyncOptimizer'
import {
  ValuesForSource,
  getChartsData,
  subtractTokenCharts,
  sumValuesPerSource,
} from '../utils/chartsUtils'
import { ApiProject, AssociatedToken } from '../utils/types'
import { TokenService } from './TokenService'
import { PricesDataService } from './data/PricesDataService'
import { ValuesDataService } from './data/ValuesDataService'

interface Dependencies {
  valuesDataService: ValuesDataService
  pricesDataService: PricesDataService
  syncOptimizer: SyncOptimizer
  tokenService: TokenService
}

export class AggregatedService {
  constructor(private readonly $: Dependencies) {}

  async getAggregatedTvl(
    targetTimestamp: UnixTime,
    projects: ApiProject[],
    associatedTokens: AssociatedToken[],
  ): Promise<TvlApiCharts> {
    const ethPrices =
      await this.$.pricesDataService.getEthPrices(targetTimestamp)

    const valuesByProjectByTimestamp =
      await this.$.valuesDataService.getValuesForProjects(
        projects,
        targetTimestamp,
      )

    const aggregate = new Map<number, ValuesForSource>()
    for (const project of projects) {
      const valuesByTimestamp =
        valuesByProjectByTimestamp.valuesByTimestampForProject[
          project.id.toString()
        ]

      if (!valuesByTimestamp) {
        continue
      }

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

    let result = getChartsData({
      dailyStart,
      sixHourlyStart,
      hourlyStart,
      lastHour: targetTimestamp,
      aggregate,
      ethPrices: ethPrices.prices,
    })

    if (associatedTokens.length > 0) {
      await Promise.all(
        associatedTokens.map(async (token) => {
          const project = projects.find((p) => p.id === token.project)
          assert(project, 'Project not found!')

          const data = await this.$.tokenService.getTokenChart(
            targetTimestamp,
            project,
            token,
          )

          result = subtractTokenCharts(
            result,
            data,
            token.type,
            ethPrices.prices,
          )
        }),
      )
    }

    return result
  }
}
