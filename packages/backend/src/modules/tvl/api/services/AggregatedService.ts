import { assert, TvlApiCharts, UnixTime } from '@l2beat/shared-pure'
import { Clock } from '../../../../tools/Clock'
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
  clock: Clock
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
        valuesByProjectByTimestamp.valuesByTimestampForProjects[
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
      this.$.clock.getSixHourlyCutoff(targetTimestamp),
      minTimestamp,
    ).toEndOf('day')
    const hourlyStart = UnixTime.max(
      this.$.clock.getHourlyCutoff(targetTimestamp),
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

    const associatedTokensData = await Promise.all(
      associatedTokens.map(async (token) => {
        const project = projects.find((p) => p.id === token.project)
        assert(project, 'Project not found!')
        return {
          ...token,
          data: await this.$.tokenService.getTokenChart(
            targetTimestamp,
            project,
            token,
          ),
        }
      }),
    )

    for (const associatedToken of associatedTokensData) {
      result = subtractTokenCharts(
        result,
        associatedToken.data,
        associatedToken.type,
        ethPrices.prices,
      )
    }

    return result
  }
}
